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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Switch } from "@workspace/ui/components/switch";
import { Loader2 } from "lucide-react";
import { forwardRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface UserGroupFormProps {
  initialValues?: Partial<API.UserGroup>;
  loading?: boolean;
  nodeGroups?: API.NodeGroup[];
  onSubmit: (values: Record<string, unknown>) => Promise<boolean>;
  title: string;
  trigger: React.ReactNode;
}

const UserGroupForm = forwardRef<
  HTMLButtonElement,
  UserGroupFormProps
>(({ initialValues, loading, nodeGroups = [], onSubmit, title, trigger }, ref) => {
  const { t } = useTranslation("group");
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [values, setValues] = useState({
    name: "",
    description: "",
    sort: 0,
    node_group_id: null as number | null,
    for_calculation: true,
  });

  useEffect(() => {
    if (open) {
      if (initialValues) {
        setValues({
          name: initialValues.name || "",
          description: initialValues.description || "",
          sort: initialValues.sort ?? 0,
          node_group_id: initialValues.node_group_id || null,
          for_calculation: initialValues.for_calculation ?? true,
        });
      } else {
        setValues({
          name: "",
          description: "",
          sort: 0,
          node_group_id: null,
          for_calculation: true,
        });
      }
    }
  }, [initialValues, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const success = await onSubmit(values);
    setSubmitting(false);
    if (success) {
      setOpen(false);
      setValues({
        name: "",
        description: "",
        sort: 0,
        node_group_id: null,
        for_calculation: true,
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
            {t("userGroupFormDescription", "Configure user group settings")}
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

          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="for_calculation">{t("forCalculation", "For Calculation")}</Label>
            <Switch
              id="for_calculation"
              checked={values.for_calculation}
              onCheckedChange={(checked) =>
                setValues({ ...values, for_calculation: checked })
              }
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
            <Label htmlFor="node_group_id">{t("nodeGroup", "Node Group")}</Label>
            <Select
              value={values.node_group_id ? String(values.node_group_id) : "0"}
              onValueChange={(val) =>
                setValues({
                  ...values,
                  node_group_id: val === "0" ? null : parseInt(val),
                })
              }
            >
              <SelectTrigger id="node_group_id" className="w-full">
                <SelectValue placeholder={t("selectNodeGroupPlaceholder", "Select a node group...")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">
                  {t("unbound", "Unbound")}
                </SelectItem>
                {nodeGroups.map((nodeGroup) => (
                  <SelectItem key={nodeGroup.id} value={String(nodeGroup.id)}>
                    {nodeGroup.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              disabled={submitting || loading}
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

UserGroupForm.displayName = "UserGroupForm";

export default UserGroupForm;
