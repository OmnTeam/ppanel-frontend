"use client";

import { Input } from "@workspace/ui/components/input";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { toast } from "sonner";

interface NodeGroup {
  id: number;
  name: string;
  min_traffic_gb?: number;
  max_traffic_gb?: number;
}

interface TrafficRangeConfigProps {
  nodeGroups: NodeGroup[];
  onTrafficUpdate: (nodeGroupId: number, fields: { min_traffic_gb?: number; max_traffic_gb?: number }) => Promise<void>;
}

interface UpdatingNode {
  nodeGroupId: number;
  field: 'min_traffic_gb' | 'max_traffic_gb';
}

interface NodeGroupTempValues {
  min_traffic_gb?: number;
  max_traffic_gb?: number;
}

export default function TrafficRangeConfig({ nodeGroups, onTrafficUpdate }: TrafficRangeConfigProps) {
  const { t } = useTranslation("group");
  const [updatingNodes, setUpdatingNodes] = useState<UpdatingNode[]>([]);
  // 使用对象存储每个节点组的临时值
  const [temporaryValues, setTemporaryValues] = useState<Record<number, NodeGroupTempValues>>({});

  // Get the display value (temporary or actual)
  const getDisplayValue = (nodeGroupId: number, field: 'min_traffic_gb' | 'max_traffic_gb'): number => {
    const temp = temporaryValues[nodeGroupId];
    if (temp && temp[field] !== undefined) {
      return temp[field]!;
    }
    const nodeGroup = nodeGroups.find(ng => ng.id === nodeGroupId);
    return field === 'min_traffic_gb' ? (nodeGroup?.min_traffic_gb ?? 0) : (nodeGroup?.max_traffic_gb ?? 0);
  };

  // Validate traffic ranges: no overlaps
  const validateTrafficRange = (
    nodeGroupId: number,
    minTraffic: number,
    maxTraffic: number
  ): { valid: boolean; error?: string } => {
    // 如果 min=0 且 max=0，表示不参与流量分组，跳过验证
    if (minTraffic === 0 && maxTraffic === 0) {
      return { valid: true };
    }

    // Check if min >= max (both > 0)
    if (minTraffic > 0 && maxTraffic > 0 && minTraffic >= maxTraffic) {
      return { valid: false, error: t("minCannotExceedMax", "Minimum traffic cannot exceed maximum traffic") };
    }

    // Check for overlaps with other node groups
    const otherGroups = nodeGroups
      .filter(ng => ng.id !== nodeGroupId)
      .map(ng => {
        const temp = temporaryValues[ng.id];
        return {
          id: ng.id,
          name: ng.name,
          min: temp?.min_traffic_gb !== undefined ? temp.min_traffic_gb : (ng.min_traffic_gb ?? 0),
          max: temp?.max_traffic_gb !== undefined ? temp.max_traffic_gb : (ng.max_traffic_gb ?? 0),
        };
      })
      .filter(ng => !(ng.min === 0 && ng.max === 0))  // 跳过未配置流量区间的组
      .sort((a, b) => a.min - b.min);

    for (const other of otherGroups) {
      // Handle max=0 as no limit (infinity)
      const otherMax = other.max === 0 ? Number.MAX_VALUE : other.max;
      const currentMax = maxTraffic === 0 ? Number.MAX_VALUE : maxTraffic;

      // Check for overlap: two ranges [min1, max1] and [min2, max2] overlap if:
      // max1 > min2 && max2 > min1
      if (currentMax > other.min && otherMax > minTraffic) {
        return {
          valid: false,
          error: t("rangeOverlap", "Range overlaps with node group \"{{name}}\"", { name: other.name })
        };
      }
    }

    return { valid: true };
  };

  const handleTrafficBlur = async (nodeGroupId: number) => {
    const nodeGroup = nodeGroups.find(ng => ng.id === nodeGroupId);
    if (!nodeGroup) return;

    const tempValues = temporaryValues[nodeGroupId];
    if (!tempValues) return;

    // 获取当前的临时值或实际值
    const currentMin = tempValues.min_traffic_gb !== undefined
      ? tempValues.min_traffic_gb
      : (nodeGroup.min_traffic_gb ?? 0);
    const currentMax = tempValues.max_traffic_gb !== undefined
      ? tempValues.max_traffic_gb
      : (nodeGroup.max_traffic_gb ?? 0);

    // 只要有一个字段被修改了就保存
    const hasMinChange = tempValues.min_traffic_gb !== undefined;
    const hasMaxChange = tempValues.max_traffic_gb !== undefined;
    if (!hasMinChange && !hasMaxChange) {
      return;
    }

    // 验证
    const validation = validateTrafficRange(nodeGroupId, currentMin, currentMax);
    if (!validation.valid) {
      toast.error(validation.error || t("validationFailed", "Validation failed"));
      return;
    }

    // 检查值是否真的改变了
    const originalMin = nodeGroup.min_traffic_gb ?? 0;
    const originalMax = nodeGroup.max_traffic_gb ?? 0;
    if (currentMin === originalMin && currentMax === originalMax) {
      return;
    }

    // 标记为更新中（只标记被修改的字段）
    if (hasMinChange) {
      setUpdatingNodes(prev => [...prev, { nodeGroupId, field: 'min_traffic_gb' }]);
    }
    if (hasMaxChange) {
      setUpdatingNodes(prev => [...prev, { nodeGroupId, field: 'max_traffic_gb' }]);
    }

    try {
      // 一次性传递两个字段
      const fieldsToUpdate: { min_traffic_gb?: number; max_traffic_gb?: number } = {};
      if (currentMin !== originalMin) {
        fieldsToUpdate.min_traffic_gb = currentMin;
      }
      if (currentMax !== originalMax) {
        fieldsToUpdate.max_traffic_gb = currentMax;
      }

      if (Object.keys(fieldsToUpdate).length > 0) {
        await onTrafficUpdate(nodeGroupId, fieldsToUpdate);
      }
    } finally {
      // 移除更新状态
      setUpdatingNodes(prev => prev.filter(u => !(u.nodeGroupId === nodeGroupId)));
    }
  };

  const isUpdating = (nodeGroupId: number) => {
    return updatingNodes.some(u => u.nodeGroupId === nodeGroupId);
  };

  return (
    <>
      <div className="space-y-2">
        <div className="grid grid-cols-12 gap-2 text-sm font-medium text-muted-foreground">
          <div className="col-span-6">{t("nodeGroup", "Node Group")}</div>
          <div className="col-span-3">{t("minTrafficGB", "Min (GB)")}</div>
          <div className="col-span-3">{t("maxTrafficGB", "Max (GB)")}</div>
        </div>

        {nodeGroups.map((nodeGroup) => (
          <div key={nodeGroup.id} className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-6">
              <div className="font-medium">{nodeGroup.name}</div>
              <div className="text-xs text-muted-foreground">{t("id", "ID")}: {nodeGroup.id}</div>
            </div>
            <div className="col-span-3 relative">
              <Input
                type="number"
                min={0}
                step={1}
                placeholder="0"
                value={getDisplayValue(nodeGroup.id, "min_traffic_gb")}
                onChange={(e) => {
                  const newValue = parseFloat(e.target.value) || 0;
                  // 更新临时状态
                  setTemporaryValues(prev => ({
                    ...prev,
                    [nodeGroup.id]: {
                      ...prev[nodeGroup.id],
                      min_traffic_gb: newValue,
                      max_traffic_gb: prev[nodeGroup.id]?.max_traffic_gb,
                    },
                  }));
                }}
                onBlur={() => handleTrafficBlur(nodeGroup.id)}
                disabled={isUpdating(nodeGroup.id)}
              />
              {isUpdating(nodeGroup.id) && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="col-span-3 relative">
              <Input
                type="number"
                min={0}
                step={1}
                placeholder="0"
                value={getDisplayValue(nodeGroup.id, "max_traffic_gb")}
                onChange={(e) => {
                  const newValue = parseFloat(e.target.value) || 0;
                  // 更新临时状态
                  setTemporaryValues(prev => ({
                    ...prev,
                    [nodeGroup.id]: {
                      ...prev[nodeGroup.id],
                      min_traffic_gb: prev[nodeGroup.id]?.min_traffic_gb,
                      max_traffic_gb: newValue,
                    },
                  }));
                }}
                onBlur={() => handleTrafficBlur(nodeGroup.id)}
                disabled={isUpdating(nodeGroup.id)}
              />
              {isUpdating(nodeGroup.id) && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-md bg-muted p-4 text-sm text-muted-foreground">
        <strong>{t("note", "Note")}:</strong>{" "}
        {t(
          "trafficRangesNote",
          "Set traffic ranges for each node group. Users will be assigned to node groups based on their traffic usage. Leave both values as 0 to not use this node group for traffic-based assignment."
        )}
      </div>
    </>
  );
}
