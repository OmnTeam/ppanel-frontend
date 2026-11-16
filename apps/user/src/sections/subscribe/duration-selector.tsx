"use client";

import { Badge } from "@workspace/ui/components/badge";
import { Label } from "@workspace/ui/components/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group";
import { cn } from "@workspace/ui/lib/utils";
import type React from "react";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Display } from "@/components/display";
import {
  formatPriceOptionDuration,
  getPriceOptions,
  isPriceOptionSoldOut,
} from "./price-option";

interface DurationSelectorProps {
  quantity: number;
  unitTime?: string;
  discounts?: Array<{ quantity: number; discount: number }>;
  /** New pricing model. When present, tiers replace the legacy discount list. */
  priceOptions?: API.SubscribePriceOption[];
  /** Selected price option id (controlled). */
  value?: string;
  onChange: (value: number) => void;
  /** Called when the user selects a price tier. */
  onPriceOptionChange?: (option: API.SubscribePriceOption) => void;
  showOriginalPrice?: boolean;
}

const DurationSelector: React.FC<DurationSelectorProps> = ({
  quantity,
  unitTime = "Month",
  discounts = [],
  priceOptions,
  value,
  onChange,
  onPriceOptionChange,
  showOriginalPrice = true,
}) => {
  const { t } = useTranslation("subscribe");
  const handleChange = useCallback(
    (value: string) => {
      onChange(Number(value));
    },
    [onChange]
  );

  const options = useMemo(() => getPriceOptions(priceOptions), [priceOptions]);

  const handlePriceOptionChange = useCallback(
    (optionId: string) => {
      const option = options.find((item) => String(item.id) === optionId);
      if (!option || isPriceOptionSoldOut(option)) return;
      onPriceOptionChange?.(option);
    },
    [onPriceOptionChange, options]
  );

  const DurationOption: React.FC<{ value: string; label: string }> = ({
    value,
    label,
  }) => (
    <div className="relative">
      <RadioGroupItem className="peer sr-only" id={value} value={value} />
      <Label
        className="relative flex h-full flex-col items-center justify-center gap-2 rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary"
        htmlFor={value}
      >
        {label}
      </Label>
    </div>
  );

  const PriceOption: React.FC<{ option: API.SubscribePriceOption }> = ({
    option,
  }) => {
    const id = `price-option-${option.id}`;
    const soldOut = isPriceOptionSoldOut(option);
    return (
      <div className="relative">
        <RadioGroupItem
          className="peer sr-only"
          disabled={soldOut}
          id={id}
          value={String(option.id)}
        />
        <Label
          className={cn(
            "relative flex h-full flex-col items-center justify-center gap-1 rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary",
            soldOut && "cursor-not-allowed opacity-50 hover:bg-popover"
          )}
          htmlFor={id}
        >
          <span>{formatPriceOptionDuration(option, t)}</span>
          <span className="font-medium">
            <Display type="currency" value={option.price} />
          </span>
          {showOriginalPrice && option.original_price > option.price && (
            <span className="text-muted-foreground text-xs line-through">
              <Display type="currency" value={option.original_price} />
            </span>
          )}
          {soldOut && (
            <Badge className="h-5 text-xs" variant="secondary">
              {t("soldOut", "Sold out")}
            </Badge>
          )}
        </Label>
      </div>
    );
  };

  const selectedOption = options.find(
    (option) => String(option.id) === String(value ?? "")
  );
  const currentDiscount = discounts?.find(
    (item) => item.quantity === quantity
  )?.discount;
  const discountPercentage =
    options.length > 0
      ? selectedOption && selectedOption.original_price > selectedOption.price
        ? (1 - selectedOption.price / selectedOption.original_price) * 100
        : 0
      : currentDiscount
        ? 100 - currentDiscount
        : 0;

  return (
    <>
      <div className="font-semibold">
        {t("purchaseDuration", "Purchase Duration")}
      </div>
      {options.length > 0 ? (
        <RadioGroup
          className="flex flex-wrap gap-3"
          onValueChange={handlePriceOptionChange}
          value={String(value ?? "")}
        >
          {options.map((option) => (
            <PriceOption key={option.id} option={option} />
          ))}
        </RadioGroup>
      ) : (
        <RadioGroup
          className="flex flex-wrap gap-3"
          onValueChange={handleChange}
          value={String(quantity)}
        >
          {showOriginalPrice && unitTime !== "Minute" && (
            <DurationOption label={`1 / ${t(unitTime)}`} value="1" />
          )}
          {discounts?.map((item) => (
            <DurationOption
              key={item.quantity}
              label={`${item.quantity} / ${t(unitTime)}`}
              value={String(item.quantity)}
            />
          ))}
        </RadioGroup>
      )}
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-sm">
          {t("discountInfo", "Discount Info")}:
        </span>
        {discountPercentage > 0 ? (
          <Badge className="h-6 text-sm" variant="destructive">
            -{discountPercentage.toFixed(2)}% {t("discount", "Discount")}
          </Badge>
        ) : (
          <span className="h-6 text-muted-foreground text-sm">--</span>
        )}
      </div>
    </>
  );
};

export default DurationSelector;
