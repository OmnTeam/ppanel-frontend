"use client";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import {
  getNodeGroupList,
  updateNodeGroup,
  getRecalculationStatus,
  recalculateGroup,
} from "@workspace/ui/services/admin/group";
import TrafficRangeConfig from "./traffic-ranges-config";

export default function TrafficModeTab() {
  const { t } = useTranslation("group");
  const [recalculating, setRecalculating] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);

  const [status, setStatus] = useState<{
    state: string;
    progress: number;
    total: number;
  } | null>(null);

  // Fetch node groups
  const { data: nodeGroupsData, isLoading: isLoadingNodeGroups, refetch: refetchNodeGroups } = useQuery({
    queryKey: ["nodeGroups"],
    queryFn: async () => {
      const { data } = await getNodeGroupList({ page: 1, size: 1000 });
      return data.data?.list || [];
    },
  });

  const loadStatus = async () => {
    setLoadingStatus(true);
    try {
      const { data } = await getRecalculationStatus();
      if (data.data) {
        setStatus(data.data);
      }
    } catch (error) {
      console.error("Failed to load recalculation status:", error);
    } finally {
      setLoadingStatus(false);
    }
  };

  const handleTrafficUpdate = async (nodeGroupId: number, fields: { min_traffic_gb?: number; max_traffic_gb?: number }) => {
    try {
      await updateNodeGroup({
        id: nodeGroupId,
        ...fields,
      });
      toast.success(t("configSaved", "Configuration saved successfully"));
      // Refetch node groups to get updated data
      refetchNodeGroups();
    } catch (error) {
      console.error("Failed to update node group:", error);
      toast.error(t("saveFailed", "Failed to save configuration"));
    }
  };

  const handleRecalculate = async () => {
    setRecalculating(true);
    try {
      await recalculateGroup({ mode: "traffic" });
      toast.success(t("recalculationStarted", "Recalculation started"));
      loadStatus();
    } catch (error) {
      console.error("Failed to start recalculation:", error);
      toast.error(t("recalculationFailed", "Failed to start recalculation"));
    } finally {
      setRecalculating(false);
    }
  };

  const getStateLabel = (state: string) => {
    switch (state) {
      case "running":
        return t("running", "Running");
      case "completed":
        return t("completed", "Completed");
      case "failed":
        return t("failed", "Failed");
      default:
        return t("idle", "Idle");
    }
  };

  const getStateVariant = (state: string) => {
    switch (state) {
      case "running":
        return "default";
      case "completed":
        return "secondary";
      case "failed":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-4">
      {/* Node Groups Traffic Configuration Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t("trafficModeConfig", "Traffic Mode Configuration")}</CardTitle>
          <CardDescription>
            {t(
              "trafficModeDescription",
              "Configure traffic ranges for node groups. Users will be assigned to node groups based on their traffic usage."
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoadingNodeGroups ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">
                {t("loading", "Loading...")}
              </span>
            </div>
          ) : (
            <TrafficRangeConfig
              nodeGroups={nodeGroupsData || []}
              onTrafficUpdate={handleTrafficUpdate}
            />
          )}
        </CardContent>
      </Card>

      {/* Recalculation Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t("groupRecalculation", "Group Recalculation")}</CardTitle>
          <CardDescription>
            {t(
              "groupRecalculationDescription",
              "Manually trigger a full recalculation of all user groups based on current configuration"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Status */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {t("currentStatus", "Current Status")}
              </span>
              {loadingStatus ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : status ? (
                <Badge variant={getStateVariant(status.state) as any}>
                  {getStateLabel(status.state)}
                </Badge>
              ) : null}
            </div>

            {status?.state === "running" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{t("progress", "Progress")}</span>
                  <span>
                    {status.progress} / {status.total || 0}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{
                      width: `${status.total > 0 ? (status.progress / status.total) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            )}

            {status?.state === "completed" && (
              <div className="text-sm text-muted-foreground">
                {t("recalculationCompleted", "Recalculation completed successfully")}
              </div>
            )}

            {status?.state === "failed" && (
              <div className="text-sm text-destructive">
                {t("recalculationFailed", "Recalculation failed. Please try again.")}
              </div>
            )}
          </div>

          {/* Recalculate Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleRecalculate}
              disabled={recalculating || status?.state === "running"}
            >
              {recalculating && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t("recalculateAll", "Recalculate All Users")}
            </Button>
          </div>

          {/* Warning */}
          <div className="rounded-md bg-yellow-50 p-4 text-sm text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
            <strong>{t("warning", "Warning")}:</strong>{" "}
            {t(
              "recalculationWarning",
              "Recalculation will reassign all users to new groups based on current configuration. This operation cannot be undone."
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
