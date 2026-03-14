"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import { Switch } from "@workspace/ui/components/switch";
import { AlertCircle, Loader2 } from "lucide-react";
import { forwardRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface NodeGroupFormProps {
  initialValues?: Partial<API.NodeGroup>;
  allNodeGroups?: API.NodeGroup[];
  currentGroupId?: number;
  loading?: boolean;
  onSubmit: (values: Record<string, unknown>) => Promise<boolean>;
  title: string;
  trigger: React.ReactNode;
}

const NodeGroupForm = forwardRef<
  HTMLButtonElement,
  NodeGroupFormProps
>(({ initialValues, allNodeGroups = [], currentGroupId, loading, onSubmit, title, trigger }, ref) => {
  const { t } = useTranslation("group");
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [conflictError, setConflictError] = useState<string>("");

  const [values, setValues] = useState({
    name: "",
    description: "",
    sort: 0,
    for_calculation: true,
    is_expired_group: false,
    expired_days_limit: 7,
    max_traffic_gb_expired: 0,
    speed_limit: 0,
    min_traffic_gb: 0,
    max_traffic_gb: 0,
  });

  useEffect(() => {
    if (open) {
      setConflictError(""); // 重置冲突错误
      if (initialValues) {
        setValues({
          name: initialValues.name || "",
          description: initialValues.description || "",
          sort: initialValues.sort ?? 0,
          for_calculation: initialValues.for_calculation ?? true,
          is_expired_group: initialValues.is_expired_group ?? false,
          expired_days_limit: initialValues.expired_days_limit ?? 7,
          max_traffic_gb_expired: initialValues.max_traffic_gb_expired ?? 0,
          speed_limit: initialValues.speed_limit ?? 0,
          min_traffic_gb: initialValues.min_traffic_gb ?? 0,
          max_traffic_gb: initialValues.max_traffic_gb ?? 0,
        });
      } else {
        setValues({
          name: "",
          description: "",
          sort: 0,
          for_calculation: true,
          is_expired_group: false,
          expired_days_limit: 7,
          max_traffic_gb_expired: 0,
          speed_limit: 0,
          min_traffic_gb: 0,
          max_traffic_gb: 0,
        });
      }
    }
  }, [initialValues, open]);

  // 检测流量区间冲突
  const checkTrafficRangeConflict = (minTraffic: number, maxTraffic: number): string => {
    // 如果 min=0 且 max=0，表示不参与流量分组，跳过所有验证
    if (minTraffic === 0 && maxTraffic === 0) {
      return "";
    }

    // 验证区间有效性：min 必须 < max（除非 max=0 表示无上限）
    if (minTraffic > 0 && maxTraffic > 0 && minTraffic >= maxTraffic) {
      return t("invalidRange", "Min traffic must be less than max traffic");
    }

    // 处理 max=0 的情况，表示无上限，使用一个很大的数代替
    const actualMax = maxTraffic === 0 ? Number.MAX_VALUE : maxTraffic;

    // 检查与其他节点组的冲突
    for (const group of allNodeGroups) {
      // 跳过当前编辑的节点组
      if (currentGroupId && group.id === currentGroupId) {
        continue;
      }

      // 跳过没有设置流量区间的节点组（min=0 且 max=0 表示未配置）
      const existingMin = group.min_traffic_gb ?? 0;
      const existingMax = group.max_traffic_gb ?? 0;
      if (existingMin === 0 && existingMax === 0) {
        continue;
      }

      // 处理现有节点组 max=0 的情况
      const actualExistingMax = existingMax === 0 ? Number.MAX_VALUE : existingMax;

      // 检测区间重叠
      // 两个区间 [min1, max1] 和 [min2, max2] 重叠的条件：
      // max1 > min2 && max2 > min1
      const hasOverlap = actualMax > existingMin && actualExistingMax > minTraffic;

      if (hasOverlap) {
        return t("rangeConflict", {
          name: group.name,
          min: existingMin.toString(),
          max: existingMax === 0 ? "∞" : existingMax.toString(),
        });
      }
    }

    return "";
  };

  // 检测过期节点组冲突
  const checkExpiredGroupConflict = async (isExpiredGroup: boolean): Promise<string> => {
    if (!isExpiredGroup) {
      return "";
    }

    // 检查是否已存在其他过期节点组
    const existingExpiredGroup = allNodeGroups.find(
      (group) => group.is_expired_group && group.id !== currentGroupId
    );

    if (existingExpiredGroup) {
      return t("expiredGroupExists", `System already has an expired node group: ${existingExpiredGroup.name}`);
    }

    // 检查当前节点组是否被订阅商品使用
    if (currentGroupId) {
      try {
        const { getSubscribeList } = await import("@workspace/ui/services/admin/subscribe");
        const { data } = await getSubscribeList({
          page: 1,
          size: 1,
          node_group_id: currentGroupId
        });

        if (data.data && data.data.total > 0) {
          return t("nodeGroupUsedBySubscribe", "This node group is used as default node group in subscription products, cannot set as expired group");
        }
      } catch (error) {
        console.error("Failed to check subscribe usage:", error);
      }
    }

    return "";
  };

  // 检查是否存在其他过期节点组（用于隐藏开关）
  const hasOtherExpiredGroup = allNodeGroups.some(
    (group) => group.is_expired_group && group.id !== currentGroupId
  );

  // 当前是否是过期节点组（编辑模式下）
  const isCurrentExpiredGroup = initialValues?.is_expired_group ?? false;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 检测过期节点组冲突
    const expiredGroupConflict = await checkExpiredGroupConflict(values.is_expired_group);
    if (expiredGroupConflict) {
      setConflictError(expiredGroupConflict);
      return;
    }

    // 仅在非过期节点组时检测流量区间冲突
    if (!values.is_expired_group) {
      const conflict = checkTrafficRangeConflict(values.min_traffic_gb, values.max_traffic_gb);
      if (conflict) {
        setConflictError(conflict);
        return;
      }
    }

    setSubmitting(true);
    const success = await onSubmit(values);
    setSubmitting(false);
    if (success) {
      setOpen(false);
      setConflictError("");
      setValues({
        name: "",
        description: "",
        sort: 0,
        for_calculation: true,
        is_expired_group: false,
        expired_days_limit: 7,
        max_traffic_gb_expired: 0,
        speed_limit: 0,
        min_traffic_gb: 0,
        max_traffic_gb: 0,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild ref={ref}>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {t("nodeGroupFormDescription", "Configure node group settings")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              {t("name", "Name")} *
            </Label>
            <Input
              id="name"
              value={values.name}
              onChange={(e) =>
                setValues({ ...values, name: e.target.value })
              }
              placeholder={t("namePlaceholder", "Enter name")}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              {t("description", "Description")}
            </Label>
            <Textarea
              id="description"
              value={values.description}
              onChange={(e) =>
                setValues({ ...values, description: e.target.value })
              }
              placeholder={t("descriptionPlaceholder", "Enter description")}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sort">{t("sort", "Sort Order")}</Label>
            <Input
              id="sort"
              type="number"
              value={values.sort}
              onChange={(e) =>
                setValues({ ...values, sort: parseInt(e.target.value) || 0 })
              }
              min={0}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="for_calculation">
                {t("forCalculation", "For Calculation")}
              </Label>
              <p className="text-sm text-muted-foreground">
                {values.is_expired_group
                  ? t("expiredGroupForCalculationDescription", "Expired-only node groups cannot participate in group calculation")
                  : t("forCalculationDescription", "Whether this node group participates in grouping calculation")}
              </p>
            </div>
            <Switch
              id="for_calculation"
              checked={values.for_calculation}
              disabled={values.is_expired_group}
              onCheckedChange={(checked) =>
                setValues({ ...values, for_calculation: checked })
              }
            />
          </div>

          {/* 仅在没有其他过期节点组或当前就是过期节点组时显示 */}
          {(!hasOtherExpiredGroup || isCurrentExpiredGroup) && (
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="is_expired_group">
                  {t("isExpiredGroup", "Expired Node Group")}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t("isExpiredGroupDescription", "Allow expired users to use limited nodes")}
                </p>
              </div>
              <Switch
                id="is_expired_group"
                checked={values.is_expired_group}
                onCheckedChange={async (checked) => {
                  setValues({
                    ...values,
                    is_expired_group: checked,
                    for_calculation: checked ? false : values.for_calculation,
                    min_traffic_gb: checked ? 0 : values.min_traffic_gb,
                    max_traffic_gb: checked ? 0 : values.max_traffic_gb,
                  });
                  // 实时检测过期节点组冲突
                  const conflict = await checkExpiredGroupConflict(checked);
                  setConflictError(conflict);
                }}
              />
            </div>
          )}

          {values.is_expired_group && (
            <>
              <div className="space-y-2">
                <Label htmlFor="expired_days_limit">
                  {t("expiredDaysLimit", "Expired Days Limit")}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t("expiredDaysLimitDescription", "Number of days after expiration that users can still access nodes")}
                </p>
                <Input
                  id="expired_days_limit"
                  type="number"
                  min={1}
                  value={values.expired_days_limit}
                  onChange={(e) =>
                    setValues({ ...values, expired_days_limit: parseInt(e.target.value) || 7 })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max_traffic_gb_expired">
                  {t("maxTrafficGBExpired", "Max Traffic for Expired Users (GB)")}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {t("maxTrafficGBExpiredDescription", "Maximum traffic allowed for expired users (0 = unlimited)")}
                </p>
                <Input
                  id="max_traffic_gb_expired"
                  type="number"
                  min={0}
                  value={values.max_traffic_gb_expired}
                  onChange={(e) =>
                    setValues({ ...values, max_traffic_gb_expired: parseInt(e.target.value) || 0 })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="speed_limit">
                  {t("speedLimit", "Speed Limit (KB/s)")}
                </Label>
                <Input
                  id="speed_limit"
                  type="number"
                  min={0}
                  value={values.speed_limit}
                  onChange={(e) =>
                    setValues({ ...values, speed_limit: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
            </>
          )}

          {!values.is_expired_group && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>{t("trafficRangeGB", "Traffic Range (GB)")}</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                {t("trafficRangeDescription", "Users with traffic >= Min and < Max will be assigned to this node group")}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min_traffic_gb">{t("minTrafficGB", "Min Traffic (GB)")}</Label>
                  <Input
                    id="min_traffic_gb"
                    type="number"
                    min={0}
                    step={1}
                    value={values.min_traffic_gb}
                    onChange={(e) => {
                      const newValue = parseFloat(e.target.value) || 0;
                      setValues({ ...values, min_traffic_gb: newValue });
                      // 实时检测冲突
                      const conflict = checkTrafficRangeConflict(newValue, values.max_traffic_gb);
                      setConflictError(conflict);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_traffic_gb">{t("maxTrafficGB", "Max Traffic (GB)")}</Label>
                  <Input
                    id="max_traffic_gb"
                    type="number"
                    min={0}
                    step={1}
                    value={values.max_traffic_gb}
                    onChange={(e) => {
                      const newValue = parseFloat(e.target.value) || 0;
                      setValues({ ...values, max_traffic_gb: newValue });
                      // 实时检测冲突
                      const conflict = checkTrafficRangeConflict(values.min_traffic_gb, newValue);
                      setConflictError(conflict);
                    }}
                  />
                </div>
              </div>
              {/* 显示冲突错误 */}
              {conflictError && (
                <div className="flex items-center gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{conflictError}</span>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md border px-4 py-2 text-sm"
              disabled={submitting || loading}
            >
              {t("cancel", "Cancel")}
            </button>
            <button
              type="submit"
              disabled={submitting || loading || !!conflictError}
              className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {t("save", "Save")}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
});

NodeGroupForm.displayName = "NodeGroupForm";

export default NodeGroupForm;
