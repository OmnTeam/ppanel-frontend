"use client";

import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Label } from "@workspace/ui/components/label";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Badge } from "@workspace/ui/components/badge";
import { AlertTriangle } from "lucide-react";
import {
  getSubscribeMapping,
  getUserGroupList,
  migrateUsersToGroup,
} from "@workspace/ui/services/admin/group";

interface MigrateUsersDialogProps {
  subscribeId: number;
  subscribeName: string;
}

export default function MigrateUsersDialog({
  subscribeId,
  subscribeName,
}: MigrateUsersDialogProps) {
  const { t } = useTranslation("product");
  const [open, setOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number>(0);
  const [migrating, setMigrating] = useState(false);

  // Fetch subscribe mapping to get current user group
  const { data: mappingsData, isLoading: mappingsLoading } = useQuery({
    enabled: open,
    queryKey: ["subscribeMapping"],
    queryFn: async () => {
      const { data } = await getSubscribeMapping({ page: 1, size: 1000 });
      return data.data;
    },
  });

  // Fetch user groups for the dropdown
  const { data: userGroupsData } = useQuery({
    enabled: open,
    queryKey: ["userGroups"],
    queryFn: async () => {
      const { data } = await getUserGroupList({ page: 1, size: 1000 });
      return data.data?.list || [];
    },
  });

  // Find the current mapping for this subscribe
  const currentMapping = mappingsData?.list?.find(
    (m) => m.subscribe_id === subscribeId
  );

  const currentGroupId = currentMapping?.user_group_id;
  const currentUserGroup = currentGroupId
    ? userGroupsData?.find((g) => g.id === currentGroupId)
    : undefined;

  const handleMigrate = async () => {
    if (!selectedGroupId) {
      toast.error(t("selectTargetGroupFirst", "Please select a target group first"));
      return;
    }

    if (selectedGroupId === currentGroupId) {
      toast.error(t("cannotMigrateToSameGroup", "Cannot migrate to the same group"));
      return;
    }

    setMigrating(true);

    try {
      await migrateUsersToGroup({
        from_user_group_id: currentGroupId!,
        to_user_group_id: selectedGroupId,
        include_locked: false,
      });

      toast.success(t("migrateUsersSuccess", "Successfully migrated users to the target group"));

      setOpen(false);
    } catch (error) {
      console.error("Failed to migrate users:", error);
      toast.error(t("migrateUsersFailed", "Failed to migrate users"));
    } finally {
      setMigrating(false);
    }
  };

  const availableGroups = userGroupsData?.filter(
    (g) => !currentGroupId || g.id !== currentGroupId
  );

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button variant="outline">{t("migrateUsers", "Migrate Users")}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("migrateUsersTitle", "Migrate Users")} - {subscribeName}</DialogTitle>
          <DialogDescription>
            {t(
              "migrateUsersDescription",
              "Migrate all users from the current user group to another group"
            )}
          </DialogDescription>
        </DialogHeader>

        {mappingsLoading ? (
          <div className="py-8 text-center text-muted-foreground">
            {t("loading", "Loading...")}
          </div>
        ) : (
          <div className="space-y-4 py-4">
            {/* Current User Group Info */}
            <div className="rounded-lg border p-4 space-y-2">
              <Label>{t("currentUserGroup", "Current User Group")}:</Label>
              <div className="flex items-center gap-2">
                {currentUserGroup ? (
                  <>
                    <Badge variant="outline">{currentUserGroup.name}</Badge>
                  </>
                ) : (
                  <span className="text-muted-foreground">
                    {t("noMapping", "No mapping set")}
                  </span>
                )}
              </div>
            </div>

            {/* Warning Message */}
            {currentUserGroup && (
              <div className="flex items-start gap-2 rounded-md bg-yellow-50 p-3 text-sm text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>
                  {t("migrateUsersWarning", "This will migrate users from \"{group}\" to the target group. This action cannot be undone.")
                    .replace("{group}", currentUserGroup.name || "")
                  }
                </p>
              </div>
            )}

            {/* Target User Group Selection */}
            <div className="space-y-2">
              <Label htmlFor="target-group">{t("targetUserGroup", "Target User Group")}:</Label>
              <Select
                value={selectedGroupId?.toString() || ""}
                onValueChange={(val) => setSelectedGroupId(Number(val))}
                disabled={!currentGroupId}
              >
                <SelectTrigger id="target-group">
                  <SelectValue
                    placeholder={
                      currentGroupId
                        ? t("selectTargetGroup", "Select a target group...")
                        : t("noSourceGroup", "No source group available")
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {availableGroups?.map((group) => (
                    <SelectItem key={group.id} value={String(group.id)}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Selected Target Group Info */}
            {selectedGroupId && (
              <div className="rounded-md bg-muted p-3">
                <span className="text-sm font-medium">{t("selectedGroup", "Selected Group")}: </span>
                <Badge variant="secondary">
                  {availableGroups?.find((g) => g.id === selectedGroupId)?.name}
                </Badge>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t("cancel", "Cancel")}
          </Button>
          <Button
            onClick={handleMigrate}
            disabled={!selectedGroupId || !currentGroupId || migrating}
          >
            {migrating ? t("migrating", "Migrating...") : t("confirm", "Confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
