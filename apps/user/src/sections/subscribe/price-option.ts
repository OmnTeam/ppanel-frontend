/**
 * Helpers for the new "price option" (价格档位) pricing model.
 *
 * A subscription may expose `price_options`; each option carries its own
 * duration and price (in cents). When `price_options` is empty (legacy data)
 * the UI falls back to `unit_price` + `discount`.
 */

/** Only duration tiers are purchasable tiers; traffic/reset packs are not. */
export function isDurationPriceOption(
  option?: API.SubscribePriceOption
): option is API.SubscribePriceOption {
  return (
    !!option &&
    option.type === "duration" &&
    option.show !== false &&
    option.sell !== false
  );
}

/** Purchasable tiers ordered by highest sort first, then lowest id first. */
export function getPriceOptions(
  options?: API.SubscribePriceOption[]
): API.SubscribePriceOption[] {
  return (options ?? []).filter(isDurationPriceOption).sort((a, b) => {
    const sortDiff = (b.sort ?? 0) - (a.sort ?? 0);
    if (sortDiff !== 0) return sortDiff;
    const aId = Number(a.id);
    const bId = Number(b.id);
    if (Number.isFinite(aId) && Number.isFinite(bId) && aId !== bId) {
      return aId - bId;
    }
    return String(a.id).localeCompare(String(b.id));
  });
}

/** `inventory === 0` means sold out; `-1` means unlimited. */
export function isPriceOptionSoldOut(
  option?: API.SubscribePriceOption
): boolean {
  return !!option && option.inventory === 0;
}

/** Default tier: `is_default` wins, otherwise highest sort / lowest id. */
export function getDefaultPriceOption(
  options?: API.SubscribePriceOption[]
): API.SubscribePriceOption | undefined {
  const list = getPriceOptions(options);
  const available = list.filter((option) => !isPriceOptionSoldOut(option));
  return (
    available.find((option) => option.is_default) ??
    available[0] ??
    list.find((option) => option.is_default) ??
    list[0]
  );
}

export function getDefaultPriceOptionId(
  options?: API.SubscribePriceOption[]
): string | undefined {
  return getDefaultPriceOption(options)?.id;
}

/** Human readable duration, e.g. "1 Month". */
export function formatPriceOptionDuration(
  option: API.SubscribePriceOption,
  translate: (key: string) => string
): string {
  if (option.duration_unit === "NoLimit") {
    return translate("NoLimit");
  }
  const unit = translate(option.duration_unit);
  return `${option.duration_value} ${unit}`;
}
