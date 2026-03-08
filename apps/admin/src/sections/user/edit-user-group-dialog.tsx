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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  getUserGroupList,
} from "@workspace/ui/services/admin/group";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";

const editUserGroupSchema = z.object({
  user_group_id: z.number().min(0),
  group_locked: z.boolean(),
});

type EditUserGroupFormValues = z.infer<typeof editUserGroupSchema>;

interface EditUserGroupDialogProps {
  userId: number;
  userSubscribeId?: number;
  currentGroupId?: number | undefined;
  currentLocked?: boolean | undefined;
  currentGroupIds?: number[] | null | undefined;
  trigger: React.ReactNode;
  onSubmit?: (values: EditUserGroupFormValues) => Promise<boolean>;
}

export default function EditUserGroupDialog({
  userId: _userId,
  userSubscribeId: _userSubscribeId,
  currentGroupId,
  currentLocked,
  currentGroupIds,
  trigger,
  onSubmit,
}: EditUserGroupDialogProps) {
  const { t } = useTranslation("user");
  const [open, setOpen] = React.useState(false);

  // Fetch user groups list
  const { data: groupsData } = useQuery({
    enabled: open,
    queryKey: ["getUserGroupList"],
    queryFn: async () => {
      const { data } = await getUserGroupList({
        page: 1,
        size: 100,
      });
      return data.data?.list || [];
    },
  });

  const form = useForm<EditUserGroupFormValues>({
    resolver: zodResolver(editUserGroupSchema),
    defaultValues: {
      user_group_id: 0,
      group_locked: false,
    },
  });

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  // Set form values when dialog opens
  useEffect(() => {
    if (open) {
      // Support both usage scenarios:
      // 1. User list page: currentGroupId (single number)
      // 2. Subscribe detail page: currentGroupIds (array)
      const groupId = currentGroupId || (currentGroupIds?.[0]) || 0;

      form.reset({
        user_group_id: groupId,
        group_locked: currentLocked || false,
      });
    }
  }, [open, currentGroupId, currentGroupIds, currentLocked, form]);

  const handleSubmit = async (values: EditUserGroupFormValues) => {
    if (onSubmit) {
      const success = await onSubmit(values);
      if (success) {
        setOpen(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("editUserGroup", "Edit User Group")}</DialogTitle>
          <DialogDescription>
            {t(
              "editUserGroupDescription",
              "Edit user group assignment and lock status"
            )}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="user_group_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("userGroup", "User Group")}</FormLabel>
                  <Select
                    value={field.value > 0 ? String(field.value) : undefined}
                    onValueChange={(value) => field.onChange(parseInt(value))}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectGroup", "Select a group")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {groupsData?.map((group: API.UserGroup) => (
                        <SelectItem key={group.id} value={String(group.id)}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="group_locked"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>{t("lockGroup", "Lock Group")}</FormLabel>
                    <div className="text-[0.8rem] text-muted-foreground">
                      {t(
                        "lockGroupDescription",
                        "Prevent automatic grouping from changing this user's group"
                      )}
                    </div>
                  </div>
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="h-4 w-4"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">
                {t("save", "Save")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
