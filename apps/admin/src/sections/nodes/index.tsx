"use client";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Switch } from "@workspace/ui/components/switch";
import { ConfirmButton } from "@workspace/ui/composed/confirm-button";
import {
  ProTable,
  type ProTableActions,
} from "@workspace/ui/composed/pro-table/pro-table";
import {
  createNode,
  deleteNode,
  filterNodeList,
  resetSortWithNode,
  toggleNodeStatus,
  updateNode,
} from "@workspace/ui/services/admin/server";
import { getGroupConfig, getNodeGroupList } from "@workspace/ui/services/admin/group";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useNode } from "@/stores/node";
import { useServer } from "@/stores/server";
import NodeForm from "./node-form";

export default function Nodes() {
  const { t } = useTranslation("nodes");
  const ref = useRef<ProTableActions>(null);
  const [loading, setLoading] = useState(false);

  // Use our zustand store for server data
  const { getServerName, getServerAddress, getProtocolPort } = useServer();
  const { fetchNodes, fetchTags } = useNode();

  // Fetch node groups for display
  const { data: nodeGroupsData } = useQuery({
    queryKey: ["nodeGroups"],
    queryFn: async () => {
      const { data } = await getNodeGroupList({ page: 1, size: 1000 });
      return data.data?.list || [];
    },
  });

  // Fetch group config to check if group feature is enabled
  const { data: groupConfigData } = useQuery({
    queryKey: ["groupConfig"],
    queryFn: async () => {
      const { data } = await getGroupConfig();
      return data.data;
    },
  });

  const isGroupEnabled = groupConfigData?.enabled || false;

  // Dynamic columns based on group feature status
  const columns = useMemo(() => {
    const baseColumns = [
      {
        id: "enabled",
        header: t("enabled", "Enabled"),
        cell: ({ row }: { row: any }) => (
          <Switch
            checked={row.original.enabled}
            onCheckedChange={async (v) => {
              await toggleNodeStatus({ id: row.original.id, enable: v });
              toast.success(
                v ? t("enabled_on", "Enabled") : t("enabled_off", "Disabled")
              );
              ref.current?.refresh();
              fetchNodes();
              fetchTags();
            }}
          />
        ),
      },
      {
        id: "name",
        accessorKey: "name",
        header: t("name", "Name"),
      },
      {
        id: "address_port",
        header: `${t("address", "Address")}:${t("port", "Port")}`,
        cell: ({ row }: { row: any }) =>
          `${row.original.address || "—"}:${row.original.port || "—"}`,
      },
      {
        id: "server_id",
        header: t("server", "Server"),
        cell: ({ row }: { row: any }) =>
          `${getServerName(row.original.server_id)}:${getServerAddress(row.original.server_id)}`,
      },
      {
        id: "protocol",
        header: ` ${t("protocol", "Protocol")}:${t("port", "Port")}`,
        cell: ({ row }: { row: any }) =>
          `${row.original.protocol}:${getProtocolPort(row.original.server_id, row.original.protocol)}`,
      },
      {
        id: "tags",
        header: t("tags", "Tags"),
        cell: ({ row }: { row: any }) => (
          <div className="flex flex-wrap gap-1">
            {(row.original.tags || []).length === 0
              ? "—"
              : row.original.tags.map((tg: string) => (
                  <Badge key={tg} variant="outline">
                    {tg}
                  </Badge>
                ))}
          </div>
        ),
      },
    ];

    // Add Node Groups column when group feature is enabled
    if (isGroupEnabled) {
      baseColumns.push({
        id: "node_group_ids",
        header: t("nodeGroups", "Node Groups"),
        cell: ({ row }: { row: any }) => {
          const groupIds = row.original.node_group_ids as number[] || [];

          // Public node indicator (when node_group_ids is empty)
          if (groupIds.length === 0) {
            return (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {t("public", "Public")}
                </Badge>
              </div>
            );
          }

          return (
            <div className="flex flex-wrap gap-1">
              {groupIds.map((groupId) => {
                const group = nodeGroupsData?.find((g) => g.id === groupId);
                return (
                  <Badge key={groupId} variant="outline">
                    {group?.name || String(groupId)}
                  </Badge>
                );
              })}
            </div>
          );
        },
      });
    }

    return baseColumns;
  }, [isGroupEnabled, nodeGroupsData, t, getServerName, getServerAddress, getProtocolPort]);

  return (
    <ProTable<API.Node, { search: string; node_group_id?: number }>
      action={ref}
      actions={{
        render: (row) => [
          <NodeForm
            initialValues={row as any}
            key="edit"
            loading={loading}
            onSubmit={async (values) => {
              setLoading(true);
              try {
                const body: API.UpdateNodeRequest = {
                  ...row,
                  ...values,
                  node_group_ids: values.node_group_ids?.map((id: string | number) => Number(id)) || [],
                } as any;
                await updateNode(body);
                toast.success(t("updated", "Updated"));
                ref.current?.refresh();
                fetchNodes();
                fetchTags();
                setLoading(false);
                return true;
              } catch {
                setLoading(false);
                return false;
              }
            }}
            title={t("drawerEditTitle", "Edit Node")}
            trigger={t("edit", "Edit")}
          />,
          <ConfirmButton
            cancelText={t("cancel", "Cancel")}
            confirmText={t("confirm", "Confirm")}
            description={t(
              "confirmDeleteDesc",
              "This action cannot be undone."
            )}
            key="delete"
            onConfirm={async () => {
              await deleteNode({ id: row.id } as any);
              toast.success(t("deleted", "Deleted"));
              ref.current?.refresh();
              fetchNodes();
              fetchTags();
            }}
            title={t("confirmDeleteTitle", "Delete this node?")}
            trigger={
              <Button variant="destructive">{t("delete", "Delete")}</Button>
            }
          />,
          <Button
            key="copy"
            onClick={async () => {
              const {
                id: _id,
                sort: _sort,
                enabled: _enabled,
                updated_at: _updated_at,
                created_at: _created_at,
                ...rest
              } = row as any;
              await createNode({
                ...rest,
                enabled: false,
              });
              toast.success(t("copied", "Copied"));
              ref.current?.refresh();
              fetchNodes();
              fetchTags();
            }}
            variant="outline"
          >
            {t("copy", "Copy")}
          </Button>,
        ],
        batchRender(rows) {
          return [
            <ConfirmButton
              cancelText={t("cancel", "Cancel")}
              confirmText={t("confirm", "Confirm")}
              description={t(
                "confirmDeleteDesc",
                "This action cannot be undone."
              )}
              key="delete"
              onConfirm={async () => {
                await Promise.all(
                  rows.map((r) => deleteNode({ id: r.id } as any))
                );
                toast.success(t("deleted", "Deleted"));
                ref.current?.refresh();
                fetchNodes();
                fetchTags();
              }}
              title={t("confirmDeleteTitle", "Delete this node?")}
              trigger={
                <Button variant="destructive">{t("delete", "Delete")}</Button>
              }
            />,
          ];
        },
      }}
      columns={columns}
      header={{
        title: t("pageTitle", "Nodes"),
        toolbar: (
          <NodeForm
            loading={loading}
            onSubmit={async (values) => {
              setLoading(true);
              try {
                const body: any = {
                  name: values.name,
                  server_id: Number(values.server_id!),
                  protocol: values.protocol,
                  address: values.address,
                  port: Number(values.port!),
                  tags: values.tags || [],
                };
                if (values.node_group_ids) {
                  body.node_group_ids = values.node_group_ids.map((id: string | number) => Number(id));
                }
                await createNode(body);
                toast.success(t("created", "Created"));
                ref.current?.refresh();
                fetchNodes();
                fetchTags();
                setLoading(false);
                return true;
              } catch {
                setLoading(false);
                return false;
              }
            }}
            title={t("drawerCreateTitle", "Create Landing Node")}
            trigger={t("create", "Create Landing Node")}
          />
        ),
      }}
      onSort={async (source, target, items) => {
        const sourceIndex = items.findIndex(
          (item) => String(item.id) === source
        );
        const targetIndex = items.findIndex(
          (item) => String(item.id) === target
        );

        const originalSorts = items.map((item) => item.sort);

        const [movedItem] = items.splice(sourceIndex, 1);
        items.splice(targetIndex, 0, movedItem!);

        const updatedItems = items.map((item, index) => {
          const originalSort = originalSorts[index];
          const newSort = originalSort !== undefined ? originalSort : item.sort;
          return { ...item, sort: newSort };
        });

        const changedItems = updatedItems.filter(
          (item, index) => item.sort !== items[index]?.sort
        );

        if (changedItems.length > 0) {
          resetSortWithNode({
            sort: changedItems.map((item) => ({
              id: item.id,
              sort: item.sort,
            })) as API.SortItem[],
          });
          toast.success(t("sorted_success", "Sorted successfully"));
        }
        return updatedItems;
      }}
      params={[
        {
          key: "search",
        },
        ...(isGroupEnabled
          ? [
              {
                key: "node_group_id",
                placeholder: t("nodeGroups", "Node Groups"),
                options: [
                  { label: t("all", "All"), value: "" },
                  ...(nodeGroupsData?.map((item) => ({
                    label: item.name,
                    value: String(item.id),
                  })) || []),
                ],
              },
            ]
          : []),
      ]}
      request={async (pagination, filter) => {
        const filters = {
          page: pagination.page,
          size: pagination.size,
          search: filter?.search || undefined,
          node_group_id: filter?.node_group_id ? Number(filter.node_group_id) : undefined,
        };

        const { data } = await filterNodeList(filters);
        const list = (data?.data?.list || []) as API.Node[];
        const total = Number(data?.data?.total || list.length);
        return { list, total };
      }}
    />
  );
}
