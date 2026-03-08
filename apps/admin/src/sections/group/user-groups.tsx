"use client";

import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { ConfirmButton } from "@workspace/ui/composed/confirm-button";
import {
  ProTable,
  type ProTableActions,
} from "@workspace/ui/composed/pro-table/pro-table";
import {
  createUserGroup,
  deleteUserGroup,
  getUserGroupList,
  getNodeGroupList,
  updateUserGroup,
} from "@workspace/ui/services/admin/group";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import UserGroupForm from "./user-group-form";

export default function UserGroups() {
  const { t } = useTranslation("group");
  const [loading, setLoading] = useState(false);
  const ref = useRef<ProTableActions>(null);

  const { data: nodeGroupsData } = useQuery({
    queryKey: ["nodeGroups"],
    queryFn: async () => {
      const { data } = await getNodeGroupList({ page: 1, size: 1000 });
      return data.data?.list || [];
    },
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("userGroups", "User Groups")}</CardTitle>
          <CardDescription>
            {t("userGroupsDescription", "Manage user groups for node access control")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProTable<API.UserGroup, API.GetUserGroupListRequest>
            action={ref}
            request={async (params) => {
              const { data } = await getUserGroupList({
                page: params.page || 1,
                size: params.size || 10,
              });
              return {
                list: data.data?.list || [],
                total: data.data?.total || 0,
              };
            }}
            columns={[
              {
                id: "id",
                accessorKey: "id",
                header: t("id", "ID"),
                cell: ({ row }: { row: any }) => <span className="text-muted-foreground">#{row.getValue("id")}</span>,
              },
              {
                id: "name",
                accessorKey: "name",
                header: t("name", "Name"),
              },
              {
                id: "for_calculation",
                accessorKey: "for_calculation",
                header: t("forCalculation", "For Calculation"),
                cell: ({ row }: { row: any }) => {
                  const forCalculation = row.getValue("for_calculation");
                  return forCalculation ? (
                    <Badge variant="default">{t("yes", "Yes")}</Badge>
                  ) : (
                    <Badge variant="secondary">{t("no", "No")}</Badge>
                  );
                },
              },
              {
                id: "description",
                accessorKey: "description",
                header: t("description", "Description"),
                cell: ({ row }: { row: any }) => row.getValue("description") || "--",
              },
              {
                id: "node_group_id",
                accessorKey: "node_group_id",
                header: t("nodeGroup", "Node Group"),
                cell: ({ row }: { row: any }) => {
                  const nodeGroupId = row.getValue("node_group_id");
                  const group = nodeGroupsData?.find((g) => g.id === nodeGroupId);
                  return group?.name || "--";
                },
              },
              {
                id: "sort",
                accessorKey: "sort",
                header: t("sort", "Sort"),
              },
            ]}
            actions={{
              render: (row: any) => [
                <UserGroupForm
                  key={`edit-${row.id}`}
                  initialValues={row}
                  loading={loading}
                  nodeGroups={nodeGroupsData || []}
                  onSubmit={async (values) => {
                    setLoading(true);
                    try {
                      await updateUserGroup({
                        id: row.id,
                        ...values,
                      } as unknown as API.UpdateUserGroupRequest);
                      toast.success(t("updated", "Updated successfully"));
                      ref.current?.refresh();
                      setLoading(false);
                      return true;
                    } catch {
                      setLoading(false);
                      return false;
                    }
                  }}
                  title={t("editUserGroup", "Edit User Group")}
                  trigger={
                    <Button variant="outline" size="sm">
                      {t("edit", "Edit")}
                    </Button>
                  }
                />,
                <ConfirmButton
                  key="delete"
                  cancelText={t("cancel", "Cancel")}
                  confirmText={t("confirm", "Confirm")}
                  description={t(
                    "deleteUserGroupConfirm",
                    "This will delete the user group. Users in this group will be reassigned to the default group."
                  )}
                  onConfirm={async () => {
                    await deleteUserGroup({ id: row.id });
                    toast.success(t("deleted", "Deleted successfully"));
                    ref.current?.refresh();
                    setLoading(false);
                  }}
                  title={t("confirmDelete", "Confirm Delete")}
                  trigger={
                    <Button variant="destructive" size="sm">
                      {t("delete", "Delete")}
                    </Button>
                  }
                />,
              ],
            }}
            header={{
              title: t("userGroups", "User Groups"),
              toolbar: (
                <UserGroupForm
                  key="create"
                  initialValues={undefined}
                  loading={loading}
                  nodeGroups={nodeGroupsData || []}
                  onSubmit={async (values) => {
                    setLoading(true);
                    try {
                      await createUserGroup(values as API.CreateUserGroupRequest);
                      toast.success(t("created", "Created successfully"));
                      ref.current?.refresh();
                      setLoading(false);
                      return true;
                    } catch {
                      setLoading(false);
                      return false;
                    }
                  }}
                  title={t("createUserGroup", "Create User Group")}
                  trigger={
                    <Button>
                      {t("create", "Create")}
                    </Button>
                  }
                />
              ),
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
