import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import { Switch } from "@workspace/ui/components/switch";
import { Textarea } from "@workspace/ui/components/textarea";
import { EnhancedInput } from "@workspace/ui/composed/enhanced-input";
import { Icon } from "@workspace/ui/composed/icon";
import {
  getInviteConfig,
  updateInviteConfig,
} from "@workspace/ui/services/admin/system";
import { unitConversion } from "@workspace/ui/utils/unit-conversions";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";
import { useGlobalStore } from "@/stores/global";
import { mergeConfigPayload } from "@/utils/common";

/**
 * InviteConfig 的完整字段（对应 api/admin/system/v1/system.proto 的 InviteConfig）。
 * 后端 UpdateInviteConfig 按反射逐字段写库，缺失字段会被写成零值，
 * 所以提交体必须包含这里的每一个字段。
 */
const INVITE_CONFIG_DEFAULTS = {
  forced_invite: false,
  referral_percentage: 0,
  only_first_purchase: false,
  withdrawal_min_amount: 0,
  withdrawal_methods: "",
  merge_commission_to_balance: false,
  duration_reward_enabled: false,
  duration_reward_cycle_mode: "inherit",
  duration_reward_calc_mode: "purchase",
  duration_reward_ratio: 100,
  duration_reward_fixed_unit: "Day",
  duration_reward_fixed_value: 7,
  duration_reward_scope: '{"mode":"include","plans":[]}',
  duration_reward_no_subscribe_policy: "create",
  duration_reward_existing_mode: "new_subscription",
  duration_reward_extend_mode: "primary_first",
  duration_reward_traffic_mode: "full",
  duration_reward_min_amount: 0,
  duration_reward_notify: true,
  invite_code_length: 8,
  invite_code_charset: "mixed",
};

type InviteConfigPayload = typeof INVITE_CONFIG_DEFAULTS;

const DURATION_UNITS = ["Day", "Week", "Month"] as const;

/** 空字符串表示“未配置”，此时视为合法（后端按默认值处理）。 */
function isOptionalJson(value?: string) {
  const text = value?.trim();
  if (!text) return true;
  try {
    JSON.parse(text);
    return true;
  } catch {
    return false;
  }
}

const inviteSchema = z.object({
  forced_invite: z.boolean().optional(),
  referral_percentage: z.number().optional(),
  only_first_purchase: z.boolean().optional(),
  withdrawal_min_amount: z.number().optional(),
  withdrawal_methods: z
    .string()
    .optional()
    .refine(isOptionalJson, { message: "Invalid JSON" }),
  merge_commission_to_balance: z.boolean().optional(),
  duration_reward_enabled: z.boolean().optional(),
  duration_reward_cycle_mode: z.string().optional(),
  duration_reward_calc_mode: z.string().optional(),
  duration_reward_ratio: z.number().optional(),
  duration_reward_fixed_unit: z.string().optional(),
  duration_reward_fixed_value: z.number().optional(),
  duration_reward_scope: z
    .string()
    .optional()
    .refine(isOptionalJson, { message: "Invalid JSON" }),
  duration_reward_no_subscribe_policy: z.string().optional(),
  duration_reward_existing_mode: z.string().optional(),
  duration_reward_extend_mode: z.string().optional(),
  duration_reward_traffic_mode: z.string().optional(),
  duration_reward_min_amount: z.number().optional(),
  duration_reward_notify: z.boolean().optional(),
  invite_code_length: z.number().optional(),
  invite_code_charset: z.string().optional(),
});

type InviteFormData = z.infer<typeof inviteSchema>;

export default function InviteConfig() {
  const { t } = useTranslation("system");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { common } = useGlobalStore();
  const { currency } = common;

  const { data, refetch } = useQuery({
    queryKey: ["getInviteConfig"],
    queryFn: async () => {
      const { data } = await getInviteConfig();
      return data.data;
    },
    enabled: open,
  });

  const form = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: INVITE_CONFIG_DEFAULTS,
  });

  useEffect(() => {
    if (data) {
      form.reset(
        mergeConfigPayload(
          INVITE_CONFIG_DEFAULTS,
          data as Partial<InviteConfigPayload>
        )
      );
    }
  }, [data, form]);

  async function onSubmit(values: InviteFormData) {
    setLoading(true);
    try {
      // 合并完整配置对象，避免后端反射写库把表单外的字段清零
      const payload = mergeConfigPayload(
        INVITE_CONFIG_DEFAULTS,
        data as Partial<InviteConfigPayload> | undefined,
        values as Partial<InviteConfigPayload>
      );
      await updateInviteConfig(payload as unknown as API.InviteConfig);
      toast.success(t("invite.saveSuccess", "Save Successful"));
      refetch();
      setOpen(false);
    } catch (_error) {
      toast.error(t("invite.saveFailed", "Save Failed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <div className="flex cursor-pointer items-center justify-between transition-colors">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Icon
                className="h-5 w-5 text-primary"
                icon="mdi:account-multiple-plus-outline"
              />
            </div>
            <div className="flex-1">
              <p className="font-medium">
                {t("invite.title", "Invitation Settings")}
              </p>
              <p className="text-muted-foreground text-sm">
                {t(
                  "invite.description",
                  "Configure user invitation and referral reward settings"
                )}
              </p>
            </div>
          </div>
          <Icon className="size-6" icon="mdi:chevron-right" />
        </div>
      </SheetTrigger>
      <SheetContent className="w-[600px] max-w-full md:max-w-screen-md">
        <SheetHeader>
          <SheetTitle>{t("invite.title", "Invitation Settings")}</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100dvh-48px-36px-36px-24px-env(safe-area-inset-top))] px-6">
          <Form {...form}>
            <form
              className="space-y-2 pt-4"
              id="invite-form"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="forced_invite"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t(
                        "invite.forcedInvite",
                        "Require Invitation to Register"
                      )}
                    </FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        className="!mt-0 float-end"
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      {t(
                        "invite.forcedInviteDescription",
                        "When enabled, users must register through an invitation link"
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="referral_percentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t(
                        "invite.referralPercentage",
                        "Referral Reward Percentage"
                      )}
                    </FormLabel>
                    <FormControl>
                      <EnhancedInput
                        max={100}
                        min={0}
                        onValueBlur={(value) => field.onChange(Number(value))}
                        placeholder={t(
                          "invite.inputPlaceholder",
                          "Please enter"
                        )}
                        suffix="%"
                        type="number"
                        value={field.value}
                      />
                    </FormControl>
                    <FormDescription>
                      {t(
                        "invite.referralPercentageDescription",
                        "Percentage of reward given to referrers"
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="only_first_purchase"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t(
                        "invite.onlyFirstPurchase",
                        "First Purchase Reward Only"
                      )}
                    </FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        className="!mt-0 float-end"
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      {t(
                        "invite.onlyFirstPurchaseDescription",
                        "When enabled, referrers only receive rewards for the first purchase by referred users"
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-4 font-medium text-sm">
                {t("invite.sections.withdrawal", "Withdrawal")}
              </div>

              <FormField
                control={form.control}
                name="withdrawal_min_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t(
                        "invite.withdrawalMinAmount",
                        "Minimum Withdrawal Amount"
                      )}
                    </FormLabel>
                    <FormControl>
                      <EnhancedInput
                        formatInput={(value) =>
                          unitConversion("centsToDollars", value)
                        }
                        formatOutput={(value) =>
                          unitConversion("dollarsToCents", value)
                        }
                        min={0}
                        onValueChange={(value) => {
                          form.setValue(field.name, value as number);
                        }}
                        prefix={currency?.currency_symbol ?? "$"}
                        type="number"
                        value={field.value}
                      />
                    </FormControl>
                    <FormDescription>
                      {t(
                        "invite.withdrawalMinAmountDescription",
                        "0 means no minimum. Commission below this amount cannot be withdrawn"
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="withdrawal_methods"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("invite.withdrawalMethods", "Withdrawal Methods")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className="h-24 font-mono text-xs"
                        placeholder={`[{"method":"alipay","name":"Alipay","label":"支付宝","enabled":true}]`}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {t(
                        "invite.withdrawalMethodsDescription",
                        'JSON array of {"method","name","label","enabled"}. Leave empty to enable alipay, wechat and usdt'
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="merge_commission_to_balance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t(
                        "invite.mergeCommissionToBalance",
                        "Merge Commission Into Balance"
                      )}
                    </FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        className="!mt-0 float-end"
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      {t(
                        "invite.mergeCommissionToBalanceDescription",
                        "When enabled, commission is credited to balance directly instead of the commission wallet"
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-4 font-medium text-sm">
                {t("invite.sections.inviteCode", "Invitation Code")}
              </div>

              <FormField
                control={form.control}
                name="invite_code_length"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("invite.inviteCodeLength", "Invitation Code Length")}
                    </FormLabel>
                    <FormControl>
                      <EnhancedInput
                        max={20}
                        min={0}
                        onValueBlur={(value) => field.onChange(Number(value))}
                        placeholder="8"
                        type="number"
                        value={field.value}
                      />
                    </FormControl>
                    <FormDescription>
                      {t(
                        "invite.inviteCodeLengthDescription",
                        "Length of newly generated invitation codes, 4-20. 0 uses the default of 8"
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="invite_code_charset"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("invite.inviteCodeCharset", "Invitation Code Charset")}
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t(
                              "invite.inviteCodeCharsetPlaceholder",
                              "Select charset"
                            )}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="numeric">
                          {t("invite.charset.numeric", "Numeric")}
                        </SelectItem>
                        <SelectItem value="alpha">
                          {t("invite.charset.alpha", "Letters")}
                        </SelectItem>
                        <SelectItem value="mixed">
                          {t("invite.charset.mixed", "Letters and Numbers")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {t(
                        "invite.inviteCodeCharsetDescription",
                        "Characters used by newly generated invitation codes"
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-4 font-medium text-sm">
                {t("invite.sections.durationReward", "Duration Reward")}
              </div>

              <FormField
                control={form.control}
                name="duration_reward_enabled"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t(
                        "invite.durationRewardEnabled",
                        "Enable Duration Reward"
                      )}
                    </FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        className="!mt-0 float-end"
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      {t(
                        "invite.durationRewardEnabledDescription",
                        "Reward referrers with subscription duration instead of commission. Cash commission is replaced once enabled"
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration_reward_cycle_mode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("invite.durationRewardCycleMode", "Reward Cycle")}
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t(
                              "invite.inputPlaceholder",
                              "Please enter"
                            )}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="inherit">
                          {t(
                            "invite.cycleMode.inherit",
                            "Follow the inviter's plan"
                          )}
                        </SelectItem>
                        <SelectItem value="first_only">
                          {t(
                            "invite.cycleMode.first_only",
                            "First purchase only"
                          )}
                        </SelectItem>
                        <SelectItem value="every_purchase">
                          {t(
                            "invite.cycleMode.every_purchase",
                            "Every purchase"
                          )}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {t(
                        "invite.durationRewardCycleModeDescription",
                        "Which purchases of the invited user trigger a reward"
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration_reward_calc_mode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("invite.durationRewardCalcMode", "Reward Calculation")}
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t(
                              "invite.inputPlaceholder",
                              "Please enter"
                            )}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="purchase">
                          {t(
                            "invite.calcMode.purchase",
                            "Equal to the purchased duration"
                          )}
                        </SelectItem>
                        <SelectItem value="ratio">
                          {t("invite.calcMode.ratio", "Percentage of it")}
                        </SelectItem>
                        <SelectItem value="fixed">
                          {t("invite.calcMode.fixed", "Fixed duration")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {t(
                        "invite.durationRewardCalcModeDescription",
                        "How the rewarded duration is calculated"
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration_reward_ratio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("invite.durationRewardRatio", "Reward Ratio")}
                    </FormLabel>
                    <FormControl>
                      <EnhancedInput
                        min={0}
                        onValueBlur={(value) => field.onChange(Number(value))}
                        placeholder="100"
                        suffix="%"
                        type="number"
                        value={field.value}
                      />
                    </FormControl>
                    <FormDescription>
                      {t(
                        "invite.durationRewardRatioDescription",
                        "Used when calculation is percentage, 100 means equal duration"
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration_reward_fixed_unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t(
                        "invite.durationRewardFixedUnit",
                        "Fixed Duration Unit"
                      )}
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t(
                              "invite.inputPlaceholder",
                              "Please enter"
                            )}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DURATION_UNITS.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {t(`invite.durationUnit.${unit}`, unit)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {t(
                        "invite.durationRewardFixedUnitDescription",
                        "Used when calculation is fixed duration"
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration_reward_fixed_value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("invite.durationRewardFixedValue", "Fixed Duration")}
                    </FormLabel>
                    <FormControl>
                      <EnhancedInput
                        min={0}
                        onValueBlur={(value) => field.onChange(Number(value))}
                        placeholder="7"
                        type="number"
                        value={field.value}
                      />
                    </FormControl>
                    <FormDescription>
                      {t(
                        "invite.durationRewardFixedValueDescription",
                        "Used when calculation is fixed duration"
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration_reward_min_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t(
                        "invite.durationRewardMinAmount",
                        "Minimum Purchase Amount"
                      )}
                    </FormLabel>
                    <FormControl>
                      <EnhancedInput
                        formatInput={(value) =>
                          unitConversion("centsToDollars", value)
                        }
                        formatOutput={(value) =>
                          unitConversion("dollarsToCents", value)
                        }
                        min={0}
                        onValueChange={(value) => {
                          form.setValue(field.name, value as number);
                        }}
                        prefix={currency?.currency_symbol ?? "$"}
                        type="number"
                        value={field.value}
                      />
                    </FormControl>
                    <FormDescription>
                      {t(
                        "invite.durationRewardMinAmountDescription",
                        "Orders paid below this amount do not grant duration rewards. 0 means no limit"
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration_reward_scope"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("invite.durationRewardScope", "Applicable Plans")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className="h-24 font-mono text-xs"
                        placeholder='{"mode":"include","plans":[]}'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {t(
                        "invite.durationRewardScopeDescription",
                        'JSON scope, e.g. {"mode":"include","plans":[]}. Empty means all plans'
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration_reward_no_subscribe_policy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t(
                        "invite.durationRewardNoSubscribePolicy",
                        "No Active Subscription Policy"
                      )}
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t(
                              "invite.inputPlaceholder",
                              "Please enter"
                            )}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="create">
                          {t(
                            "invite.noSubscribePolicy.create",
                            "Create a new subscription"
                          )}
                        </SelectItem>
                        <SelectItem value="skip">
                          {t(
                            "invite.noSubscribePolicy.skip",
                            "Skip the reward"
                          )}
                        </SelectItem>
                        <SelectItem value="require_order">
                          {t(
                            "invite.noSubscribePolicy.require_order",
                            "Require an order first"
                          )}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {t(
                        "invite.durationRewardNoSubscribePolicyDescription",
                        "What to do when the inviter has no active subscription"
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration_reward_existing_mode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t(
                        "invite.durationRewardExistingMode",
                        "Existing Subscription Handling"
                      )}
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t(
                              "invite.inputPlaceholder",
                              "Please enter"
                            )}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="new_subscription">
                          {t(
                            "invite.existingMode.new_subscription",
                            "Create a new subscription"
                          )}
                        </SelectItem>
                        <SelectItem value="prorate">
                          {t(
                            "invite.existingMode.prorate",
                            "Extend the current one"
                          )}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {t(
                        "invite.durationRewardExistingModeDescription",
                        "How to grant the duration when the inviter already has an active subscription"
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration_reward_extend_mode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t(
                        "invite.durationRewardExtendMode",
                        "Multiple Subscription Priority"
                      )}
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t(
                              "invite.inputPlaceholder",
                              "Please enter"
                            )}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="primary_first">
                          {t(
                            "invite.extendMode.primary_first",
                            "Primary subscription first"
                          )}
                        </SelectItem>
                        <SelectItem value="latest_expire">
                          {t(
                            "invite.extendMode.latest_expire",
                            "Subscription expiring last first"
                          )}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {t(
                        "invite.durationRewardExtendModeDescription",
                        "Which subscription is extended first when several are active"
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration_reward_traffic_mode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t(
                        "invite.durationRewardTrafficMode",
                        "Traffic Handling"
                      )}
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t(
                              "invite.inputPlaceholder",
                              "Please enter"
                            )}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="full">
                          {t("invite.trafficMode.full", "Full plan traffic")}
                        </SelectItem>
                        <SelectItem value="prorate">
                          {t(
                            "invite.trafficMode.prorate",
                            "Traffic proportional to the duration"
                          )}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {t(
                        "invite.durationRewardTrafficModeDescription",
                        "How traffic is granted together with the duration"
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration_reward_notify"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("invite.durationRewardNotify", "Notify After Reward")}
                    </FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        className="!mt-0 float-end"
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      {t(
                        "invite.durationRewardNotifyDescription",
                        "Send a notification to the inviter after the duration reward is granted"
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </ScrollArea>
        <SheetFooter className="flex-row justify-end gap-2 pt-3">
          <Button
            disabled={loading}
            onClick={() => setOpen(false)}
            variant="outline"
          >
            {t("common.cancel", "Cancel")}
          </Button>
          <Button disabled={loading} form="invite-form" type="submit">
            {loading && (
              <Icon className="mr-2 animate-spin" icon="mdi:loading" />
            )}
            {t("common.save", "Save Settings")}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
