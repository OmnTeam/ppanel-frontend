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
import { Label } from "@workspace/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getNodeGroupList, bindNodeGroups } from "@workspace/ui/services/admin/group";

interface BindNodeGroupsDialogProps {
  userGroupIds: number[];
  userGroupNames: string[];
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function BindNodeGroupsDialog({
  userGroupIds,
  userGroupNames,
  onOpenChange,
  onSuccess,
}: BindNodeGroupsDialogProps) {
  const { t } = useTranslation("group");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedNodeGroupId, setSelectedNodeGroupId] = useState<number | undefined>();

  const { data: nodeGroupsData, isLoading } = useQuery({
    queryKey: ["nodeGroups"],
    queryFn: async () => {
      const { data } = await getNodeGroupList({ page: 1, size: 1000 });
      return data.data?.list || [];
    },
  });

  useEffect(() => {
    if (open && nodeGroupsData) {
      // Load current binding when dialog opens
      loadCurrentBinding();
    }
  }, [open]);

  const loadCurrentBinding = () => {
    // Get first user group's current node group binding
    // For batch binding, we'll default to unbound
    setSelectedNodeGroupId(undefined);
  };

  const handleBind = async () => {
    if (selectedNodeGroupId === undefined) {
      toast.error(t("selectNodeGroupRequired", "Please select a node group"));
      return;
    }

    setSaving(true);
    try {
      await bindNodeGroups({
        user_group_ids: userGroupIds,
        node_group_id: selectedNodeGroupId === 0 ? null : selectedNodeGroupId,
      } as API.BindNodeGroupsRequest);

      toast.success(
        t("bindSuccess", "Successfully bound {{userGroupCount}} user groups to node group").replace(
          /{{userGroupCount}}/g,
          String(userGroupIds.length)
        )
      );

      setOpen(false);
      onOpenChange?.(false);
      onSuccess?.();
    } catch (error) {
      console.error("Failed to bind node group:", error);
      toast.error(t("bindFailed", "Failed to bind node group"));
    } finally {
      setSaving(false);
    }
  };

  const displayNames =
    userGroupNames.length > 2
      ? `${userGroupNames.slice(0, 2).join(", ")}... (${userGroupIds.length})`
      : userGroupNames.join(", ");

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      onOpenChange?.(newOpen);
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {t("bindNodeGroup", "Bind Node Group")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("bindNodeGroup", "Bind Node Group")}</DialogTitle>
          <DialogDescription>
            {t(
              "bindNodeGroupDescription",
              "Select a node group to bind to user groups: {{userGroups}}",
              { userGroups: displayNames }
            ).replace(/{{userGroups}}/g, displayNames)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="node-group">{t("selectNodeGroup", "Select Node Group")}</Label>
              <Select
                value={selectedNodeGroupId?.toString() || ""}
                onValueChange={(val) => setSelectedNodeGroupId(parseInt(val) || undefined)}
              >
                <SelectTrigger id="node-group" className="w-full">
                  <SelectValue placeholder={t("selectNodeGroupPlaceholder", "Select a node group...")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">
                    {t("unbound", "Unbound")}
                  </SelectItem>
                  {nodeGroupsData?.map((nodeGroup) => (
                    <SelectItem key={nodeGroup.id} value={String(nodeGroup.id)}>
                      {nodeGroup.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setOpen(false);
              onOpenChange?.(false);
            }}
            disabled={saving}
          >
            {t("cancel", "Cancel")}
          </Button>
          <Button onClick={handleBind} disabled={saving || selectedNodeGroupId === undefined}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("confirm", "Confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
