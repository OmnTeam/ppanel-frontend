import { QRCodeCanvas } from "qrcode.react";
import { useTranslation } from "react-i18next";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { supportedLngs } from "@/config";
import {
  formatCurrency,
  formatTimestamp,
  getOrderStatusLabel,
  getOrderTypeLabel,
} from "@/lib/format";
import type { ActiveOrder, PaymentMethod, RechargeRecord } from "@/types";

interface RechargeScreenProps {
  currentLanguage: string;
  currency: string;
  amounts: number[];
  minimumCustomAmount: number;
  methods: PaymentMethod[];
  records: RechargeRecord[];
  activeOrder: ActiveOrder | null;
  userBalance: number | null;
  userEmail: string;
  hasPendingOrder: boolean;
  selectedAmount: number;
  customAmountEnabled: boolean;
  customAmountInput: string;
  epayCustomAmountEnabled: boolean;
  selectedMethodId: number | null;
  loadingData: boolean;
  submitting: boolean;
  onAmountSelect: (value: string) => void;
  onCustomAmountChange: (value: string) => void;
  onMethodSelect: (value: number) => void;
  onLanguageChange: (value: string) => void;
  onRefresh: () => void;
  onLogout: () => void;
  onOpenConfirm: () => void;
  onRefreshOrder: () => void;
  onContinuePayment: () => void;
}

export function RechargeScreen({
  currentLanguage,
  currency,
  amounts,
  minimumCustomAmount,
  methods,
  records,
  activeOrder,
  userBalance,
  userEmail,
  hasPendingOrder,
  selectedAmount,
  customAmountEnabled,
  customAmountInput,
  epayCustomAmountEnabled,
  selectedMethodId,
  loadingData,
  submitting,
  onAmountSelect,
  onCustomAmountChange,
  onMethodSelect,
  onLanguageChange,
  onRefresh,
  onLogout,
  onOpenConfirm,
  onRefreshOrder,
  onContinuePayment,
}: Readonly<RechargeScreenProps>) {
  const { t } = useTranslation("app");
  const selectedMethod =
    methods.find((method) => method.id === selectedMethodId) || null;
  const amountSelectValue = customAmountEnabled
    ? "custom"
    : String(selectedAmount);

  return (
    <div className="portal-dashboard min-h-screen">
      <section className="portal-banner px-4 py-7 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <div className="space-y-3">
            <h1 className="text-3xl font-medium tracking-[-0.03em] text-white sm:text-4xl">
              {t("dashboard.title", "支付充值中心")}
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-white/82 sm:text-base">
              {t(
                "dashboard.description",
                "选择启用中的支付方式和预设充值金额，先确认手续费，再创建充值订单。"
              )}
            </p>
            <div className="space-y-1 text-sm text-white/86">
              <p>
                {t("dashboard.balance", "当前余额")}:{" "}
                {userBalance == null
                  ? "-"
                  : formatCurrency(userBalance, currentLanguage, currency)}
              </p>
              {userEmail ? (
                <p>
                  {t("dashboard.email", "用户邮箱")}: {userEmail}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <div className="-mt-5 px-4 pb-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
          <section className="portal-card">
            <div className="mb-4">
              <h2 className="text-xl font-medium tracking-[-0.02em] text-slate-950 sm:text-2xl">
                {selectedMethod
                  ? t("dashboard.rechargeWith", "使用当前方式充值")
                  : t("dashboard.selectMethodTitle", "请选择一种方式进行充值")}
              </h2>
            </div>

            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="grid flex-1 gap-3">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-600">
                    {t("dashboard.methods", "支付方式")}
                  </span>
                  <Select
                    onValueChange={(value) => onMethodSelect(Number(value))}
                    value={
                      selectedMethodId == null ? undefined : String(selectedMethodId)
                    }
                  >
                    <SelectTrigger className="h-12 w-full rounded-xl border-slate-200 bg-white px-4 text-left text-slate-700 shadow-none transition-colors focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
                      <SelectValue
                        placeholder={t(
                          "dashboard.selectMethodPlaceholder",
                          "请选择支付方式"
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {methods.map((method) => (
                        <SelectItem key={method.id} value={String(method.id)}>
                          {method.name}
                          {method.description ? ` · ${method.description}` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-600">
                    {t("dashboard.amounts", "充值金额")}
                  </span>
                  <Select
                    onValueChange={onAmountSelect}
                    value={amountSelectValue}
                  >
                    <SelectTrigger className="h-12 w-full rounded-xl border-slate-200 bg-white px-4 text-left text-slate-700 shadow-none transition-colors focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
                      <SelectValue
                        placeholder={t(
                          "dashboard.selectAmountPlaceholder",
                          "请选择充值金额"
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {amounts.map((amount) => (
                        <SelectItem key={amount} value={String(amount)}>
                          {formatCurrency(amount, currentLanguage, currency)}
                        </SelectItem>
                      ))}
                      {epayCustomAmountEnabled ? (
                        <SelectItem value="custom">
                          {t("dashboard.customAmountOption", "自定义金额")}
                        </SelectItem>
                      ) : null}
                    </SelectContent>
                  </Select>
                  {epayCustomAmountEnabled ? (
                    <p className="text-xs leading-5 text-slate-500">
                      {t("dashboard.customAmountHint", {
                        amount: formatCurrency(
                          minimumCustomAmount,
                          currentLanguage,
                          currency
                        ),
                        defaultValue:
                          "epay 支付方式支持输入自定义充值金额，最低金额为 {{amount}}。",
                      })}
                    </p>
                  ) : null}
                  {epayCustomAmountEnabled && customAmountEnabled ? (
                    <Input
                      className="h-12 rounded-xl border-slate-200 bg-white px-4 text-slate-700 shadow-none focus-visible:border-blue-500 focus-visible:ring-4 focus-visible:ring-blue-100"
                      inputMode="decimal"
                      min={String(minimumCustomAmount)}
                      onChange={(event) => onCustomAmountChange(event.target.value)}
                      placeholder={t(
                        "dashboard.customAmountPlaceholder",
                        "请输入自定义金额"
                      )}
                      step="0.01"
                      type="number"
                      value={customAmountInput}
                    />
                  ) : null}
                </label>
              </div>

              <div className="flex flex-col items-stretch gap-3 xl:min-w-[360px] xl:max-w-[360px]">
              <div className="flex flex-wrap items-center justify-end gap-2.5">
                  <div className="flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 p-1">
                    {supportedLngs.map((language) => (
                      <button
                        className={`portal-lang-btn ${
                          currentLanguage === language ? "is-active" : ""
                        }`}
                        key={language}
                        onClick={() => onLanguageChange(language)}
                        type="button"
                      >
                        {language === "zh-CN" ? "中文" : "EN"}
                      </button>
                    ))}
                  </div>
                  <button
                    className="portal-secondary-btn"
                    onClick={onRefresh}
                    type="button"
                  >
                    {t("dashboard.refresh", "刷新")}
                  </button>
                  <button
                    className="portal-secondary-btn"
                    onClick={onLogout}
                    type="button"
                  >
                    {t("dashboard.logout", "退出登录")}
                  </button>
                  <button
                    className="portal-primary-btn"
                    disabled={
                      hasPendingOrder ||
                      loadingData ||
                      submitting ||
                      methods.length === 0 ||
                      selectedMethodId == null
                    }
                    onClick={onOpenConfirm}
                    type="button"
                  >
                    {hasPendingOrder
                      ? t("dashboard.pendingOrder", "订单支付中")
                      : submitting
                      ? t("dashboard.creating", "创建订单中...")
                      : t("dashboard.submit", "确认充值")}
                  </button>
                </div>

                <p className="text-right text-sm text-slate-500">
                  {loadingData
                    ? t("dashboard.loading", "正在加载支付数据...")
                    : hasPendingOrder
                    ? t(
                        "dashboard.pendingHint",
                        "当前已有待支付订单，系统会持续监听支付状态，请勿重复下单。"
                      )
                    : t(
                        "dashboard.selectionReady",
                        "选择完成后点击确认，先查看手续费与合计金额。"
                      )}
                </p>
              </div>
            </div>

            {activeOrder ? (
              <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
                <div className="mb-3 flex flex-col gap-2.5 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-1">
                    <h2 className="text-lg font-medium tracking-[-0.02em] text-slate-950">
                      {t("dashboard.currentOrderTitle", "支付状态")}
                    </h2>
                    <p className="text-sm text-slate-500">
                      {t("order.number", "订单号")}: {activeOrder.orderNo}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      className="portal-secondary-btn"
                      onClick={onRefreshOrder}
                      type="button"
                    >
                      {t("dashboard.reloadOrder", "刷新订单")}
                    </button>
                  </div>
                </div>

                {[2, 5].includes(Number(activeOrder.status)) ? (
                  <div className="mb-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    <p className="font-medium text-emerald-800">
                      {t("dashboard.paymentSuccessTitle", "支付已完成")}
                    </p>
                    <p className="mt-1">
                      {t(
                        "dashboard.paymentSuccessHint",
                        "当前订单已支付成功，系统会同步刷新余额和充值记录。"
                      )}
                    </p>
                  </div>
                ) : null}

                <div className="grid gap-2.5 md:grid-cols-4">
                  <div className="rounded-xl border border-blue-100 bg-white px-4 py-2.5">
                    <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400">
                      {t("order.status", "状态")}
                    </p>
                    <p className="mt-2 text-base font-medium text-slate-950">
                      {getOrderStatusLabel(activeOrder.status, t)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-blue-100 bg-white px-4 py-2.5">
                    <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400">
                      {t("order.amount", "充值金额")}
                    </p>
                    <p className="mt-2 text-base font-medium text-slate-950">
                      {formatCurrency(
                        activeOrder.rechargeAmount,
                        currentLanguage,
                        currency
                      )}
                    </p>
                  </div>
                  <div className="rounded-xl border border-blue-100 bg-white px-4 py-2.5">
                    <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400">
                      {t("order.method", "支付方式")}
                    </p>
                    <p className="mt-2 text-base font-medium text-slate-950">
                      {activeOrder.paymentName || "-"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-blue-100 bg-white px-4 py-2.5">
                    <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400">
                      {t("order.time", "充值时间")}
                    </p>
                    <p className="mt-2 text-base font-medium text-slate-950">
                      {formatTimestamp(activeOrder.createdAt, currentLanguage)}
                    </p>
                  </div>
                </div>

                {activeOrder.checkout?.type === "qr" &&
                activeOrder.checkout.checkoutUrl ? (
                  <div className="mt-4 flex justify-center rounded-2xl border border-blue-100 bg-white p-5">
                    <div className="space-y-3 text-center">
                      <p className="text-sm text-slate-500">
                        {t("dashboard.scanToPay", "请扫码继续支付")}
                      </p>
                      <QRCodeCanvas
                        size={220}
                        value={activeOrder.checkout.checkoutUrl}
                      />
                    </div>
                  </div>
                ) : null}

              </div>
            ) : null}
          </section>

          <section className="portal-card">
            <div className="mb-4 flex flex-col gap-2.5 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-1.5">
                <span className="portal-section-label">
                  {t("dashboard.records", "充值记录")}
                </span>
                <h2 className="text-xl font-medium tracking-[-0.02em] text-slate-950 sm:text-2xl">
                  {t("dashboard.recordsTitle", "最近充值订单")}
                </h2>
              </div>
              <p className="text-sm text-slate-500">
                {t(
                  "dashboard.recordsHint",
                  "记录来自现有订单列表接口，当前前端会过滤出充值类型订单。"
                )}
              </p>
            </div>

            {records.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="portal-table min-w-full">
                  <thead>
                    <tr>
                      <th>{t("order.id", "ID")}</th>
                      <th>{t("order.tradeNo", "交易订单号")}</th>
                      <th>{t("order.type", "交易类型")}</th>
                      <th>{t("order.amount", "充值金额")}</th>
                      <th>{t("order.status", "状态")}</th>
                      <th>{t("order.time", "充值时间")}</th>
                      <th>{t("order.action", "操作")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record) => (
                      <tr key={`${record.id}-${record.orderNo}`}>
                        <td>{record.id}</td>
                        <td>{record.tradeNo || record.orderNo}</td>
                        <td>{getOrderTypeLabel(record.type, t)}</td>
                        <td>
                          {formatCurrency(record.amount, currentLanguage, currency)}
                        </td>
                        <td>{getOrderStatusLabel(record.status, t)}</td>
                        <td>{formatTimestamp(record.createdAt, currentLanguage)}</td>
                        <td>
                          {record.orderNo === activeOrder?.orderNo &&
                          (activeOrder.checkout?.checkoutUrl ||
                            (activeOrder.checkout?.type === "stripe" &&
                              activeOrder.checkout.stripe)) ? (
                            <button
                              className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
                              onClick={onContinuePayment}
                              type="button"
                            >
                              {t("dashboard.paymentNow", "前往支付")}
                            </button>
                          ) : (
                            "-"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50/70 px-6 py-10 text-center text-sm text-slate-500">
                {t("dashboard.empty", "暂无充值记录")}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
