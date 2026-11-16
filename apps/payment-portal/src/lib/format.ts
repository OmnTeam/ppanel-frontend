import type { TFunction } from "i18next";
import { formatDate as formatPortalDate } from "@workspace/ui/utils/formatting";

export function formatCurrency(
  amount: number,
  language: string,
  currency: string
): string {
  try {
    return new Intl.NumberFormat(language, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (_error) {
    return new Intl.NumberFormat(language, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }
}

export function formatTimestamp(timestamp: number, _language: string): string {
  if (!timestamp) return "-";

  return formatPortalDate(timestamp) || "-";
}

export function getOrderTypeLabel(type: number, t: TFunction): string {
  // Backend order types: 1 new purchase, 2 renewal, 4 recharge,
  // 6 plan change, 7 trial upgrade.
  switch (Number(type)) {
    case 1:
      return t("type.1", "New Purchase");
    case 2:
      return t("type.2", "Renewal");
    case 4:
      return t("type.recharge", "Recharge");
    case 6:
      return t("type.6", "Plan Change");
    case 7:
      return t("type.7", "Trial Upgrade");
    default:
      return t("type.unknown", "Unknown Type");
  }
}

export function getOrderStatusLabel(status: number, t: TFunction): string {
  // Backend order status: 1 pending, 2 paid/activating, 3 closed,
  // 4 activation failed, 5 completed.
  switch (Number(status)) {
    case 1:
      return t("status.1", "Pending Payment");
    case 2:
      return t("status.2", "Activating");
    case 3:
      return t("status.3", "Closed");
    case 4:
      return t("status.4", "Activation Failed");
    case 5:
      return t("status.5", "Completed");
    default:
      return t("status.unknown", "Unknown Status");
  }
}
