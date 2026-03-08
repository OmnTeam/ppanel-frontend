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
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  getRecalculationStatus,
  recalculateGroup,
} from "@workspace/ui/services/admin/group";

export default function GroupRecalculate() {
  const { t } = useTranslation("group");
  const [recalculating, setRecalculating] = useState<string | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [status, setStatus] = useState<{
    state: string;
    progress: number;
    total: number;
  } | null>(null);

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

    // Poll status every 2 seconds when recalculating
    const interval = setInterval(() => {
      if (status?.state === "running") {
        loadStatus();
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [status?.state]);

  const handleRecalculate = async (mode: "average" | "subscribe" | "traffic") => {
    setRecalculating(mode);
    try {
      await recalculateGroup({ mode });
      toast.success(t("recalculationStarted", "Recalculation started"));
      loadStatus();
    } catch (error) {
      console.error("Failed to start recalculation:", error);
      toast.error(t("recalculationFailed", "Failed to start recalculation"));
    } finally {
      setRecalculating(null);
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

          {/* Recalculate Buttons */}
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {/* Average Mode Recalculate */}
              <div className="space-y-2">
                <div className="font-medium">
                  {t("averageMode", "Average Mode")}
                </div>
                <Button
                  onClick={() => handleRecalculate("average")}
                  disabled={recalculating === "average" || status?.state === "running"}
                  className="w-full"
                  variant="outline"
                >
                  {recalculating === "average" && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {t("recalculate", "Recalculate")}
                </Button>
              </div>

              {/* Subscribe Mode Recalculate */}
              <div className="space-y-2">
                <div className="font-medium">
                  {t("subscribeMode", "Subscribe Mode")}
                </div>
                <Button
                  onClick={() => handleRecalculate("subscribe")}
                  disabled={recalculating === "subscribe" || status?.state === "running"}
                  className="w-full"
                  variant="outline"
                >
                  {recalculating === "subscribe" && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {t("recalculate", "Recalculate")}
                </Button>
              </div>

              {/* Traffic Mode Recalculate */}
              <div className="space-y-2">
                <div className="font-medium">
                  {t("trafficMode", "Traffic Mode")}
                </div>
                <Button
                  onClick={() => handleRecalculate("traffic")}
                  disabled={recalculating === "traffic" || status?.state === "running"}
                  className="w-full"
                  variant="outline"
                >
                  {recalculating === "traffic" && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {t("recalculate", "Recalculate")}
                </Button>
              </div>
            </div>
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
