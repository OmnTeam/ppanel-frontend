"use client";

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
  getGroupConfig,
  updateGroupConfig,
  resetGroups,
} from "@workspace/ui/services/admin/group";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog";

export default function GroupConfig() {
  const { t } = useTranslation("group");
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [config, setConfig] = useState<{
    enabled: boolean;
    mode: "average" | "subscribe" | "traffic";
  }>({
    enabled: false,
    mode: "average",
  });

  const loadConfig = async () => {
    try {
      const { data } = await getGroupConfig();
      if (data.data) {
        setConfig({
          enabled: data.data.enabled || false,
          mode: (data.data.mode || "average") as "average" | "subscribe" | "traffic",
        });
      }
    } catch (error) {
      console.error("Failed to load group config:", error);
      toast.error(t("loadFailed", "Failed to load configuration"));
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const handleUpdateEnabled = async (enabled: boolean) => {
    setSaving(true);
    try {
      const payload: any = {
        enabled,
        mode: config.mode,
      };
      await updateGroupConfig(payload);
      setConfig({ ...config, enabled });
      toast.success(t("saved", "Configuration saved successfully"));
    } catch (error) {
      console.error("Failed to update group config:", error);
      toast.error(t("saveFailed", "Failed to save configuration"));
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateMode = async (mode: "average" | "subscribe" | "traffic") => {
    setSaving(true);
    try {
      const payload: any = {
        enabled: config.enabled,
        mode,
      };
      await updateGroupConfig(payload);
      setConfig({ ...config, mode });
      toast.success(t("saved", "Configuration saved successfully"));
    } catch (error) {
      console.error("Failed to update group config:", error);
      toast.error(t("saveFailed", "Failed to save configuration"));
    } finally {
      setSaving(false);
    }
  };

  const handleResetGroups = async () => {
    setResetting(true);
    try {
      await resetGroups({ confirm: true });
      toast.success(t("resetSuccess", "All groups have been reset successfully"));
      setShowResetDialog(false);
      // Reload config after reset
      await loadConfig();
    } catch (error) {
      console.error("Failed to reset groups:", error);
      toast.error(t("resetFailed", "Failed to reset groups"));
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("groupConfig", "Group Configuration")}</CardTitle>
          <CardDescription>
            {t(
              "groupConfigDescription",
              "Configure user group and node group settings"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Enable/Disable */}
          <div className="flex items-center justify-between">
            <div>
              <label htmlFor="enabled" className="font-medium">
                {t("enableGrouping", "Enable Grouping")}
              </label>
              <p className="text-sm text-muted-foreground">
                {t(
                  "enableGroupingDescription",
                  "When enabled, users will only see nodes from their assigned group"
                )}
              </p>
            </div>
            <input
              id="enabled"
              type="checkbox"
              checked={config.enabled}
              onChange={(e) => handleUpdateEnabled(e.target.checked)}
              disabled={saving}
              className="h-4 w-4"
            />
          </div>

          {/* Mode Selection */}
          {config.enabled && (
            <div className="space-y-2">
              <label className="font-medium">
                {t("groupingMode", "Grouping Mode")}
              </label>
              <div className="grid grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => handleUpdateMode("average")}
                  disabled={saving}
                  className={`rounded-lg border p-4 text-left transition-colors ${
                    config.mode === "average"
                      ? "border-primary bg-primary/10"
                      : "border-border hover:bg-muted"
                  } ${saving ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="font-medium">
                    {t("averageMode", "Average Mode")}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t(
                      "averageModeDescription",
                      "Distribute users evenly across groups"
                    )}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdateMode("subscribe")}
                  disabled={saving}
                  className={`rounded-lg border p-4 text-left transition-colors ${
                    config.mode === "subscribe"
                      ? "border-primary bg-primary/10"
                      : "border-border hover:bg-muted"
                  } ${saving ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="font-medium">
                    {t("subscribeMode", "Subscribe Mode")}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t(
                      "subscribeModeDescription",
                      "Group users by their subscription plan"
                    )}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdateMode("traffic")}
                  disabled={saving}
                  className={`rounded-lg border p-4 text-left transition-colors ${
                    config.mode === "traffic"
                      ? "border-primary bg-primary/10"
                      : "border-border hover:bg-muted"
                  } ${saving ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="font-medium">
                    {t("trafficMode", "Traffic Mode")}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t(
                      "trafficModeDescription",
                      "Group users by their traffic usage"
                    )}
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Reset Button */}
          <div className="flex justify-end pt-4 border-t">
            <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  {t("resetGroups", "Reset All Groups")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {t("resetGroupsTitle", "Reset All Groups")}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {t(
                      "resetGroupsDescription",
                      "This action will delete all node groups and user groups, reset all users' group ID to 0, clear all products' node group IDs, and clear all nodes' node group IDs. This action cannot be undone."
                    )}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>
                    {t("cancel", "Cancel")}
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleResetGroups}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {resetting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t("confirm", "Confirm")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
