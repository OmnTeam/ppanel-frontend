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
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@workspace/ui/components/table";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import {
  getRecalculationStatus,
  recalculateGroup,
  getSubscribeGroupMapping,
} from "@workspace/ui/services/admin/group";

interface SubscribeGroupMapping {
  subscribe_name: string;
  node_group_name: string;
}

export default function SubscribeModeTab() {
  const { t } = useTranslation("group");
  const [recalculating, setRecalculating] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);

  const [status, setStatus] = useState<{
    state: string;
    progress: number;
    total: number;
  } | null>(null);

  // Fetch subscribe group mapping
  const { data: mappingData, isLoading: mappingLoading } = useQuery({
    queryKey: ["subscribeGroupMapping"],
    queryFn: async () => {
      const { data } = await getSubscribeGroupMapping();
      return (data.data?.list || []) as SubscribeGroupMapping[];
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

  useEffect(() => {
    loadStatus();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (status?.state === "running") {
        loadStatus();
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [status?.state]);

  const handleRecalculate = async () => {
    setRecalculating(true);
    try {
      await recalculateGroup({ mode: "subscribe" });
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
      {/* Configuration Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t("subscribeModeConfig", "Subscribe Mode Configuration")}</CardTitle>
          <CardDescription>
            {t("subscribeModeDescription", "Group users by their purchased subscription plan")}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Subscribe Group Mapping Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t("subscribeGroupMappingTitle", "套餐-节点组对应关系")}</CardTitle>
        </CardHeader>
        <CardContent>
          {mappingLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableBody>
                {mappingData && mappingData.length > 0 ? (
                  mappingData
                    .filter(
                      (item: SubscribeGroupMapping) => item.subscribe_name && item.node_group_name
                    )
                    .map((item: SubscribeGroupMapping, index: number) => (
                      <TableRow key={index}>
                        <TableCell>
                          <span className="font-medium">{item.subscribe_name}</span>
                          <span className="mx-2 text-muted-foreground">
                            {t("arrow", "→")}
                          </span>
                          <Badge variant="outline">{item.node_group_name}</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell className="text-center text-muted-foreground">
                      {t("noMappingData", "No mapping data available")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
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
