"use client";

import { Button } from "@workspace/ui/components/button";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Label } from "@workspace/ui/components/label";
import { Switch } from "@workspace/ui/components/switch";
import { Combobox } from "@workspace/ui/composed/combobox";
import { EnhancedInput } from "@workspace/ui/composed/enhanced-input";
import { unitConversion } from "@workspace/ui/utils/unit-conversions";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useTranslation } from "react-i18next";

export const DURATION_UNITS = [
  "Minute",
  "Hour",
  "Day",
  "Week",
  "Month",
  "Year",
  "NoLimit",
] as const;

export type DurationUnit = (typeof DURATION_UNITS)[number];

let priceOptionUid = 0;

function nextUid() {
  priceOptionUid += 1;
  return `price-option-${priceOptionUid}`;
}

export interface PriceOptionDraft {
  /** Client-only React key, never submitted. */
  uid?: string;
  id?: string;
  version?: number;
  code?: string;
  name?: string;
  duration_unit: string;
  duration_value: number;
  price: number;
  original_price: number;
  inventory: number;
  show: boolean;
  sell: boolean;
  is_default: boolean;
  sort: number;
  type?: string;
}

export interface ValidationMessage {
  key: string;
  fallback: string;
}

function isDurationUnit(value: unknown): value is DurationUnit {
  return DURATION_UNITS.includes(value as DurationUnit);
}

const PRICE_OPTION_TYPES = ["duration", "traffic_pack", "reset_pack"];

function resolveOptionType(option: PriceOptionDraft): string {
  const type = String(option.type ?? "").trim();
  if (option.id && PRICE_OPTION_TYPES.includes(type)) return type;
  return "duration";
}

export function createPriceOption(
  sort: number,
  overrides: Partial<PriceOptionDraft> = {}
): PriceOptionDraft {
  return {
    uid: nextUid(),
    name: "",
    duration_unit: "Month",
    duration_value: 1,
    price: 0,
    original_price: 0,
    inventory: -1,
    show: true,
    sell: true,
    is_default: false,
    sort,
    type: "duration",
    ...overrides,
  };
}

/**
 * Convert options from the API into editable drafts. Existing rows keep their
 * id/version/code so the backend updates them instead of creating new ones
 * (a missing version would trip the optimistic lock).
 */
export function normalizePriceOptions(
  options?: API.SubscribePriceOption[]
): PriceOptionDraft[] {
  if (!Array.isArray(options) || options.length === 0) return [];
  return options.map((option, index) => {
    // Without a version the backend rejects the row (id > 0 needs version > 0),
    // so treat such a record as a brand new option instead of fabricating one.
    const version =
      Number(option.version) > 0 ? Number(option.version) : undefined;
    const hasVersion = version !== undefined;
    return {
      uid: nextUid(),
      id: hasVersion && option.id ? String(option.id) : undefined,
      version,
      code: hasVersion ? option.code || undefined : undefined,
      name: option.name ?? "",
      duration_unit: isDurationUnit(option.duration_unit)
        ? option.duration_unit
        : "Month",
      duration_value: Number(option.duration_value) || 0,
      price: Number(option.price) || 0,
      original_price: Number(option.original_price) || 0,
      inventory: Number.isFinite(Number(option.inventory))
        ? Number(option.inventory)
        : -1,
      show: option.show ?? true,
      sell: option.sell ?? true,
      is_default: option.is_default ?? false,
      sort: Number(option.sort) || index + 1,
      type: option.type || "duration",
    };
  });
}

/**
 * Resolve the drafts for a subscribe record. Legacy records (created before
 * the price option model existed) have no price_options, so derive one from
 * unit_price/unit_time to keep edit and duplicate usable.
 */
export function resolvePriceOptions(source?: {
  price_options?: API.SubscribePriceOption[];
  unit_price?: number;
  unit_time?: string;
}): PriceOptionDraft[] {
  const normalized = normalizePriceOptions(source?.price_options);
  if (normalized.length > 0) return normalized;

  const unitTime = source?.unit_time;
  const durationUnit = isDurationUnit(unitTime) ? unitTime : "Month";
  const price = Math.max(0, Math.round(Number(source?.unit_price) || 0));
  return [
    createPriceOption(1, {
      duration_unit: durationUnit,
      duration_value: durationUnit === "NoLimit" ? 0 : 1,
      price,
      original_price: price,
      show: true,
      sell: true,
      is_default: true,
    }),
  ];
}

/**
 * Map drafts to the submit body. Existing rows resend id + version; timestamps
 * and subscribe_id are never echoed back (the backend derives them).
 */
export function toSubmitPriceOptions(
  options: PriceOptionDraft[]
): API.SubscribePriceOption[] {
  return (options ?? []).map((option) => {
    const isNoLimit = option.duration_unit === "NoLimit";
    const result: API.SubscribePriceOption = {
      // Existing rows keep their original type so editing never mutates a
      // traffic_pack/reset_pack option into a duration one; new rows are
      // always duration options.
      type: resolveOptionType(option),
      name: (option.name ?? "").trim(),
      duration_unit: option.duration_unit,
      duration_value: isNoLimit
        ? 0
        : Math.trunc(Number(option.duration_value) || 0),
      price: Math.max(0, Math.round(Number(option.price) || 0)),
      original_price: Math.max(
        0,
        Math.round(Number(option.original_price) || 0)
      ),
      inventory: Number.isFinite(Number(option.inventory))
        ? Math.trunc(Number(option.inventory))
        : -1,
      show: !!option.show,
      sell: !!option.sell,
      is_default: !!option.is_default,
      sort: Math.trunc(Number(option.sort) || 0),
    };

    if (option.code) result.code = option.code;
    if (option.id && Number(option.version) > 0) {
      result.id = String(option.id);
      result.version = Math.trunc(Number(option.version));
    }
    return result;
  });
}

export function validatePriceOptions(
  options: PriceOptionDraft[]
): ValidationMessage | null {
  const list = options ?? [];
  if (list.length === 0) {
    return {
      key: "form.priceOptionsRequired",
      fallback: "Add at least one price option",
    };
  }

  for (const option of list) {
    if (!isDurationUnit(option.duration_unit)) {
      return {
        key: "form.priceOptionInvalidDurationUnit",
        fallback: "Please choose a valid duration unit",
      };
    }
    if (option.id && !(Number(option.version) > 0)) {
      return {
        key: "form.priceOptionVersionMissing",
        fallback: "Price option version is missing, please reload the page",
      };
    }
    const durationValue = Math.trunc(Number(option.duration_value) || 0);
    if (option.duration_unit !== "NoLimit" && durationValue <= 0) {
      return {
        key: "form.priceOptionDurationInvalid",
        fallback: "Duration value must be greater than 0",
      };
    }
    if ((Number(option.price) || 0) < 0) {
      return {
        key: "form.priceOptionPriceInvalid",
        fallback: "Price must be greater than or equal to 0",
      };
    }
    if ((Number(option.original_price) || 0) < 0) {
      return {
        key: "form.priceOptionOriginalPriceInvalid",
        fallback: "Original price must be greater than or equal to 0",
      };
    }
    if ((Number(option.inventory) || 0) < -1) {
      return {
        key: "form.priceOptionInventoryInvalid",
        fallback: "Inventory must be greater than or equal to -1",
      };
    }
  }

  const sellableDurations = list.filter(
    (option) => option.sell && resolveOptionType(option) === "duration"
  );
  if (sellableDurations.length === 0) {
    return {
      key: "form.priceOptionNeedSellableDuration",
      fallback: "At least one sellable duration option is required",
    };
  }

  const seen = new Set<string>();
  for (const option of list) {
    if (
      !(option.show && option.sell && resolveOptionType(option) === "duration")
    ) {
      continue;
    }
    const key = `${option.duration_unit}:${Math.trunc(
      Number(option.duration_value) || 0
    )}`;
    if (seen.has(key)) {
      return {
        key: "form.priceOptionDuplicateDuration",
        fallback:
          "Visible and sellable price options cannot share the same duration",
      };
    }
    seen.add(key);
  }

  return null;
}

interface PriceOptionsFieldProps {
  value?: PriceOptionDraft[];
  onChange: (value: PriceOptionDraft[]) => void;
  error?: string;
  defaultPrice?: number;
  defaultUnit?: string;
}

export function PriceOptionsField({
  value,
  onChange,
  error,
  defaultPrice = 0,
  defaultUnit,
}: PriceOptionsFieldProps) {
  const { t } = useTranslation("product");
  const options = value ?? [];

  const updateOptions = (next: PriceOptionDraft[]) => {
    onChange(next);
  };

  const updateOption = (index: number, patch: Partial<PriceOptionDraft>) => {
    updateOptions(
      options.map((option, i) =>
        i === index ? { ...option, ...patch } : option
      )
    );
  };

  const removeOption = (index: number) => {
    updateOptions(options.filter((_, i) => i !== index));
  };

  const addOption = () => {
    const maxSort = options.reduce(
      (max, option) => Math.max(max, Number(option.sort) || 0),
      0
    );
    const hasDefault = options.some((option) => option.is_default);
    const durationUnit = isDurationUnit(defaultUnit) ? defaultUnit : "Month";
    const price = Math.max(0, Math.round(Number(defaultPrice) || 0));
    updateOptions([
      ...options,
      createPriceOption(maxSort + 1, {
        duration_unit: durationUnit,
        duration_value: durationUnit === "NoLimit" ? 0 : 1,
        price,
        original_price: price,
        is_default: !hasDefault,
      }),
    ]);
  };

  const setDefault = (index: number) => {
    updateOptions(
      options.map((option, i) => ({
        ...option,
        is_default: i === index ? !option.is_default : false,
      }))
    );
  };

  const unitOptions = DURATION_UNITS.map((unit) => ({
    label: t(`form.${unit}`, unit),
    value: unit as string,
  }));

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-4">
          <Label className="font-medium text-base">
            {t("form.priceOptions", "Price Options")}
          </Label>
          <Button onClick={addOption} size="sm" type="button" variant="outline">
            <PlusIcon className="size-4" />
            {t("form.addPriceOption", "Add Price Option")}
          </Button>
        </div>
        <p className="text-muted-foreground text-sm">
          {t(
            "form.priceOptionsDescription",
            "Each option is a purchasable duration. At least one sellable duration option is required."
          )}
        </p>
      </div>

      {options.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed p-6 text-center">
          <p className="text-muted-foreground text-sm">
            {t("form.priceOptionsEmpty", "No price options yet")}
          </p>
          <Button onClick={addOption} size="sm" type="button" variant="outline">
            <PlusIcon className="size-4" />
            {t("form.addPriceOption", "Add Price Option")}
          </Button>
        </div>
      ) : (
        options.map((option, index) => {
          const isNoLimit = option.duration_unit === "NoLimit";
          return (
            <div
              className="space-y-3 rounded-lg border p-4"
              key={option.uid ?? option.id ?? `new-${index}`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-4">
                  <span className="font-medium text-sm">
                    {t("form.priceOptionIndex", "Option {{index}}", {
                      index: index + 1,
                    })}
                  </span>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={!!option.is_default}
                      disabled={!option.sell}
                      id={`price-option-default-${index}`}
                      onCheckedChange={() => setDefault(index)}
                    />
                    <Label
                      className="cursor-pointer text-sm"
                      htmlFor={`price-option-default-${index}`}
                    >
                      {t("form.priceOptionDefault", "Default")}
                    </Label>
                  </div>
                </div>
                <Button
                  onClick={() => removeOption(index)}
                  size="icon"
                  type="button"
                  variant="ghost"
                >
                  <Trash2Icon className="size-4 text-destructive" />
                </Button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-1.5 lg:col-span-2">
                  <Label>{t("form.priceOptionName", "Option Name")}</Label>
                  <EnhancedInput
                    onValueChange={(next) =>
                      updateOption(index, { name: String(next ?? "") })
                    }
                    placeholder={t(
                      "form.priceOptionNamePlaceholder",
                      "Leave empty to auto-generate"
                    )}
                    value={option.name ?? ""}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>{t("form.priceOptionUnit", "Duration Unit")}</Label>
                  <Combobox
                    onChange={(next) => {
                      if (!next) return;
                      const unit = String(next);
                      updateOption(index, {
                        duration_unit: unit,
                        duration_value:
                          unit === "NoLimit"
                            ? 0
                            : Math.max(1, Number(option.duration_value) || 1),
                      });
                    }}
                    options={unitOptions}
                    placeholder={t("form.selectUnitTime", "Select unit")}
                    value={option.duration_unit}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>
                    {t("form.priceOptionDuration", "Duration Value")}
                  </Label>
                  <EnhancedInput
                    disabled={isNoLimit}
                    min={0}
                    onValueChange={(next) =>
                      updateOption(index, {
                        duration_value: isNoLimit ? 0 : Number(next) || 0,
                      })
                    }
                    type="number"
                    value={isNoLimit ? 0 : option.duration_value}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>{t("form.priceOptionPrice", "Price")}</Label>
                  <EnhancedInput
                    formatInput={(next) =>
                      unitConversion("centsToDollars", next)
                    }
                    formatOutput={(next) =>
                      unitConversion("dollarsToCents", next)
                    }
                    min={0}
                    onValueChange={(next) =>
                      updateOption(index, { price: Number(next) || 0 })
                    }
                    step="0.01"
                    type="number"
                    value={option.price}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>
                    {t("form.priceOptionOriginalPrice", "Original Price")}
                  </Label>
                  <EnhancedInput
                    formatInput={(next) =>
                      unitConversion("centsToDollars", next)
                    }
                    formatOutput={(next) =>
                      unitConversion("dollarsToCents", next)
                    }
                    min={0}
                    onValueChange={(next) =>
                      updateOption(index, { original_price: Number(next) || 0 })
                    }
                    step="0.01"
                    type="number"
                    value={option.original_price}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>{t("form.priceOptionInventory", "Inventory")}</Label>
                  <EnhancedInput
                    min={-1}
                    onValueChange={(next) =>
                      updateOption(index, {
                        inventory: Math.trunc(Number(next) || 0),
                      })
                    }
                    type="number"
                    value={option.inventory}
                  />
                  <p className="text-muted-foreground text-xs">
                    {t("form.unlimitedInventory", "Unlimited (enter -1)")}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label>{t("form.priceOptionSort", "Sort")}</Label>
                  <EnhancedInput
                    min={0}
                    onValueChange={(next) =>
                      updateOption(index, {
                        sort: Math.trunc(Number(next) || 0),
                      })
                    }
                    type="number"
                    value={option.sort}
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={!!option.show}
                    id={`price-option-show-${index}`}
                    onCheckedChange={(checked) =>
                      updateOption(index, { show: checked })
                    }
                  />
                  <Label
                    className="cursor-pointer text-sm"
                    htmlFor={`price-option-show-${index}`}
                  >
                    {t("form.priceOptionShow", "Show")}
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={!!option.sell}
                    id={`price-option-sell-${index}`}
                    onCheckedChange={(checked) =>
                      updateOption(index, {
                        sell: checked,
                        // The backend only honours the default flag on
                        // sellable options, so keep the UI in sync.
                        is_default: checked ? option.is_default : false,
                      })
                    }
                  />
                  <Label
                    className="cursor-pointer text-sm"
                    htmlFor={`price-option-sell-${index}`}
                  >
                    {t("form.priceOptionSell", "Sell")}
                  </Label>
                </div>
                {option.id ? (
                  <span className="text-muted-foreground text-xs">
                    {t("form.priceOptionExisting", "Existing option")}
                  </span>
                ) : (
                  <span className="text-muted-foreground text-xs">
                    {t("form.priceOptionNew", "New option")}
                  </span>
                )}
              </div>
            </div>
          );
        })
      )}

      {error ? <p className="text-destructive text-sm">{error}</p> : null}
    </div>
  );
}
