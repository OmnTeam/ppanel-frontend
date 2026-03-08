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
import { ConfirmButton } from "@workspace/ui/composed/confirm-button";
import {
  ProTable,
  type ProTableActions,
} from "@workspace/ui/composed/pro-table/pro-table";
import {
  createNodeGroup,
  deleteNodeGroup,
  getNodeGroupList,
  updateNodeGroup,
} from "@workspace/ui/services/admin/group";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import NodeGroupForm from "./node-group-form";

export default function NodeGroups() {
  const { t } = useTranslation("group");
  const [loading, setLoading] = useState(false);
  const [allNodeGroups, setAllNodeGroups] = useState<API.NodeGroup[]>([]);
  const ref = useRef<ProTableActions>(null);

  // 获取所有节点组数据（用于冲突检测）
  useEffect(() => {
    const fetchAllNodeGroups = async () => {
      try {
        const { data } = await getNodeGroupList({ page: 1, size: 1000 });
        setAllNodeGroups(data.data?.list || []);
      } catch (error) {
        console.error("Failed to fetch node groups:", error);
      }
    };
    fetchAllNodeGroups();
  }, []);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("nodeGroups", "Node Groups")}</CardTitle>
          <CardDescription>
            {t("nodeGroupsDescription", "Manage node groups for user access control")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProTable<API.NodeGroup, API.GetNodeGroupListRequest>
            action={ref}
            request={async (params) => {
              const { data } = await getNodeGroupList({
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
                id: "description",
                accessorKey: "description",
                header: t("description", "Description"),
                cell: ({ row }: { row: any }) => row.getValue("description") || "--",
              },
              {
                id: "for_calculation",
                accessorKey: "for_calculation",
                header: t("forCalculation", "For Calculation"),
                cell: ({ row }: { row: any }) => {
                  const value = row.getValue("for_calculation");
                  return value ? (
                    <Badge variant="default">{t("yes", "Yes")}</Badge>
                  ) : (
                    <Badge variant="secondary">{t("no", "No")}</Badge>
                  );
                },
              },
              {
                id: "traffic_range",
                accessorKey: "traffic_range",
                header: t("trafficRange", "Traffic Range (GB)"),
                cell: ({ row }: { row: any }) => {
                  const min = row.original.min_traffic_gb;
                  const max = row.original.max_traffic_gb;
                  if (min !== undefined && max !== undefined) {
                    return `${min} - ${max}`;
                  }
                  if (min !== undefined) {
                    return `≥ ${min}`;
                  }
                  if (max !== undefined) {
                    return `≤ ${max}`;
                  }
                  return "--";
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
                <NodeGroupForm
                  key={`edit-${row.id}`}
                  initialValues={row}
                  allNodeGroups={allNodeGroups}
                  currentGroupId={row.id}
                  loading={loading}
                  onSubmit={async (values) => {
                    setLoading(true);
                    try {
                      await updateNodeGroup({
                        id: row.id,
                        ...values,
                      } as API.UpdateNodeGroupRequest);
                      toast.success(t("updated", "Updated successfully"));
                      // 刷新节点组列表
                      const { data } = await getNodeGroupList({ page: 1, size: 1000 });
                      setAllNodeGroups(data.data?.list || []);
                      ref.current?.refresh();
                      setLoading(false);
                      return true;
                    } catch {
                      setLoading(false);
                      return false;
                    }
                  }}
                  title={t("editNodeGroup", "Edit Node Group")}
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
                    "deleteNodeGroupConfirm",
                    "This will delete the node group. Nodes in this group will be reassigned."
                  )}
                  onConfirm={async () => {
                    await deleteNodeGroup({ id: row.id });
                    toast.success(t("deleted", "Deleted successfully"));
                    // 刷新节点组列表
                    const { data } = await getNodeGroupList({ page: 1, size: 1000 });
                    setAllNodeGroups(data.data?.list || []);
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
              title: t("nodeGroups", "Node Groups"),
              toolbar: (
                <NodeGroupForm
                  key="create"
                  initialValues={undefined}
                  allNodeGroups={allNodeGroups}
                  currentGroupId={undefined}
                  loading={loading}
                  onSubmit={async (values) => {
                    setLoading(true);
                    try {
                      await createNodeGroup(values as API.CreateNodeGroupRequest);
                      toast.success(t("created", "Created successfully"));
                      // 刷新节点组列表
                      const { data } = await getNodeGroupList({ page: 1, size: 1000 });
                      setAllNodeGroups(data.data?.list || []);
                      ref.current?.refresh();
                      setLoading(false);
                      return true;
                    } catch {
                      setLoading(false);
                      return false;
                    }
                  }}
                  title={t("createNodeGroup", "Create Node Group")}
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
