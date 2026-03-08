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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  ProTable,
  type ProTableActions,
} from "@workspace/ui/composed/pro-table/pro-table";
import {
  getGroupHistory,
  getGroupHistoryDetail,
  getNodeGroupList,
} from "@workspace/ui/services/admin/group";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { formatDate } from "@/utils/common";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function GroupHistory() {
  const { t } = useTranslation("group");
  const ref = useRef<ProTableActions>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState<API.GroupHistory | null>(null);
  const [details, setDetails] = useState<any[]>([]);
  const [nodeGroupMap, setNodeGroupMap] = useState<Map<number, string>>(new Map());

  // User list dialog state
  const [userListOpen, setUserListOpen] = useState(false);
  const [selectedNodeGroupName, setSelectedNodeGroupName] = useState<string>("");
  const [userList, setUserList] = useState<any[]>([]);
  const [userListTotal, setUserListTotal] = useState(0);

  // Fetch all node groups
  const { data: nodeGroups } = useQuery({
    queryKey: ["getNodeGroupListForDetail"],
    queryFn: async () => {
      const { data } = await getNodeGroupList({
        page: 1,
        size: 100,
      });
      return data.data?.list || [];
    },
  });

  // Build ID to name maps when groups are loaded
  if (nodeGroups) {
    const newNodeGroupMap = new Map<number, string>();
    nodeGroups.forEach((ng: API.NodeGroup) => {
      newNodeGroupMap.set(ng.id, ng.name);
    });
    if (newNodeGroupMap.size !== nodeGroupMap.size) {
      setNodeGroupMap(newNodeGroupMap);
    }
  }

  const getModeLabel = (mode: string) => {
    switch (mode) {
      case "average":
        return t("averageMode", "Average");
      case "subscribe":
        return t("subscribeMode", "Subscribe");
      case "traffic":
        return t("trafficMode", "Traffic");
      default:
        return mode;
    }
  };

  const getTriggerTypeLabel = (type: string) => {
    switch (type) {
      case "manual":
        return t("manualTrigger", "Manual");
      case "auto":
        return t("autoTrigger", "Auto");
      case "schedule":
        return t("scheduleTrigger", "Schedule");
      default:
        return type;
    }
  };

  const handleViewDetail = async (record: API.GroupHistory) => {
    setSelectedHistory(record);
    setDetailOpen(true);
    setDetailLoading(true);
    try {
      const { data } = await getGroupHistoryDetail({
        id: record.id,
      });

      console.log("Group history detail response:", data);

      // 从返回的数据中获取详情列表
      // data.data.config_snapshot.group_details 包含分组详情
      if (data.data?.config_snapshot?.group_details) {
        setDetails(data.data.config_snapshot.group_details);
      } else {
        console.warn("No group_details found in response:", data);
        setDetails([]);
      }
    } catch (error) {
      console.error("Failed to fetch history details:", error);
      setDetails([]);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleShowUserList = async (nodeGroupId: number, nodeGroupName: string) => {
    setSelectedNodeGroupName(nodeGroupName);
    setUserListOpen(true);

    // 从历史详情记录中获取用户数据
    const detail = details.find((d: any) => {
      const detailNodeGroupId = d.NodeGroupId || d.node_group_id;
      return detailNodeGroupId === nodeGroupId;
    });

    if (detail) {
      const userDataJSON = detail.UserData || detail.user_data;
      if (userDataJSON) {
        try {
          const userData = JSON.parse(userDataJSON);
          setUserList(userData);
          setUserListTotal(userData.length);
        } catch (error) {
          console.error("Failed to parse user data:", error);
          setUserList([]);
          setUserListTotal(0);
        }
      } else {
        setUserList([]);
        setUserListTotal(0);
      }
    } else {
      setUserList([]);
      setUserListTotal(0);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("groupHistory", "Group Calculation History")}</CardTitle>
          <CardDescription>
            {t("groupHistoryDescription", "View group recalculation history and results")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProTable<API.GroupHistory, API.GetGroupHistoryRequest>
            action={ref}
            request={async (params) => {
              const { data } = await getGroupHistory({
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
                cell: ({ row }: { row: any }) => (
                  <span className="text-muted-foreground">
                    {t("idPrefix", "#")}{row.getValue("id")}
                  </span>
                ),
              },
              {
                id: "group_mode",
                accessorKey: "group_mode",
                header: t("groupMode", "Group Mode"),
                cell: ({ row }: { row: any }) => (
                  <Badge variant="outline">
                    {getModeLabel(row.getValue("group_mode"))}
                  </Badge>
                ),
              },
              {
                id: "trigger_type",
                accessorKey: "trigger_type",
                header: t("triggerType", "Trigger Type"),
                cell: ({ row }: { row: any }) => (
                  <Badge variant="secondary">
                    {getTriggerTypeLabel(row.getValue("trigger_type"))}
                  </Badge>
                ),
              },
              {
                id: "total_users",
                accessorKey: "total_users",
                header: t("totalUsers", "Total Users"),
                cell: ({ row }: { row: any }) => (
                  <span className="font-semibold">{row.getValue("total_users")}</span>
                ),
              },
              {
                id: "result",
                accessorKey: "error_log",
                header: t("result", "Result"),
                cell: ({ row }: { row: any }) => {
                  const record = row.original;
                  return (
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">
                        {t("successCount", "Success")}: {record.success_count}
                        {" "}{t("separator", "/")}{" "}
                        {t("failedCount", "Failed")}: {record.failed_count}
                      </div>
                      {record.error_log && (
                        <Badge variant="destructive">
                          {t("failed", "Failed")}
                        </Badge>
                      )}
                      {!record.error_log && record.failed_count === 0 && (
                        <Badge variant="default">
                          {t("completed", "Completed")}
                        </Badge>
                      )}
                    </div>
                  );
                },
              },
              {
                id: "created_at",
                accessorKey: "created_at",
                header: t("createdAt", "Created At"),
                cell: ({ row }: { row: any }) => formatDate(row.getValue("created_at")),
              },
            ]}
            actions={{
              render: (row: any) => [
                <Button
                  key="detail"
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDetail(row)}
                >
                  {t("viewDetail", "View Detail")}
                </Button>,
              ],
            }}
            header={{
              title: t("groupHistory", "Group Calculation History"),
            }}
          />
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {t("groupHistoryDetail", "Group Calculation Detail")}
            </DialogTitle>
            <DialogDescription>
              {t("historyId", "History ID")}: {selectedHistory?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedHistory && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      {t("groupMode", "Group Mode")}
                    </div>
                    <div className="font-medium">
                      {getModeLabel(selectedHistory.group_mode)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      {t("triggerType", "Trigger Type")}
                    </div>
                    <div className="font-medium">
                      {getTriggerTypeLabel(selectedHistory.trigger_type)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      {t("totalUsers", "Total Users")}
                    </div>
                    <div className="font-medium">{selectedHistory.total_users}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      {t("result", "Result")}
                    </div>
                    <div className="font-medium">
                      {t("successCount", "Success")}: {selectedHistory.success_count}
                      {" "}{t("separator", "/")}{" "}
                      {t("failedCount", "Failed")}: {selectedHistory.failed_count}
                    </div>
                  </div>
                  {selectedHistory.start_time && (
                    <div>
                      <div className="text-sm text-muted-foreground">
                        {t("startTime", "Start Time")}
                      </div>
                      <div className="font-medium">
                        {formatDate(selectedHistory.start_time)}
                      </div>
                    </div>
                  )}
                  {selectedHistory.end_time && (
                    <div>
                      <div className="text-sm text-muted-foreground">
                        {t("endTime", "End Time")}
                      </div>
                      <div className="font-medium">
                        {formatDate(selectedHistory.end_time)}
                      </div>
                    </div>
                  )}
                </div>

                {selectedHistory.error_log && (
                  <div>
                    <div className="text-sm text-muted-foreground">
                      {t("errorMessage", "Error Message")}
                    </div>
                    <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                      {selectedHistory.error_log}
                    </div>
                  </div>
                )}
              </>
            )}

            <div>
              <div className="mb-2 text-sm font-medium">
                {t("groupDetails", "Group Details")}
              </div>
              {detailLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-sm text-muted-foreground">
                    {t("loading", "Loading...")}
                  </span>
                </div>
              ) : details.length > 0 ? (
                <>
                  {/* 统计信息 */}
                  <div className="mb-4 grid grid-cols-3 gap-4 rounded-lg bg-muted/50 p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {details.reduce((sum: number, d: any) => sum + (d.UserCount || d.user_count || 0), 0)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {t("totalUsers", "Total Users")}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {details.reduce((sum: number, d: any) => sum + (d.NodeCount || d.node_count || 0), 0)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {t("totalNodes", "Total Nodes")}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{details.length}</div>
                      <div className="text-xs text-muted-foreground">
                        {t("totalNodeGroups", "Total Node Groups")}
                      </div>
                    </div>
                  </div>

                  {/* 详情表格 */}
                  <div className="rounded-md border">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="border-b px-4 py-2 text-left">
                            {t("nodeGroup", "Node Group")}
                          </th>
                          <th className="border-b px-4 py-2 text-right">
                            {t("userCount", "User Count")}
                          </th>
                          <th className="border-b px-4 py-2 text-right">
                            {t("nodeCount", "Node Count")}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {details.map((detail: any, index: number) => {
                          const nodeGroupId = detail.NodeGroupId || detail.node_group_id;
                          const nodeGroupName = nodeGroupMap.get(nodeGroupId) || `${t("idPrefix", "#")}${nodeGroupId}`;

                          return (
                            <tr key={index}>
                              <td className="border-b px-4 py-2">
                                <div>
                                  <div className="font-medium">{nodeGroupName}</div>
                                  <div className="text-xs text-muted-foreground">{t("id", "ID")}: {nodeGroupId}</div>
                                </div>
                              </td>
                              <td className="border-b px-4 py-2 text-right">
                                <button
                                  className="font-semibold hover:underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                  onClick={() => handleShowUserList(nodeGroupId, nodeGroupName)}
                                  disabled={(detail.UserCount || detail.user_count || 0) === 0}
                                >
                                  {detail.UserCount || detail.user_count || 0}
                                </button>
                              </td>
                              <td className="border-b px-4 py-2 text-right">
                                {detail.NodeCount || detail.node_count || 0}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  {t("noDetails", "No details available")}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* User List Dialog */}
      <Dialog open={userListOpen} onOpenChange={setUserListOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedNodeGroupName} - {t("userList", "User List")}
            </DialogTitle>
            <DialogDescription>
              {t("totalUsers", "Total Users")}: {userListTotal}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {userList.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("id", "ID")}</TableHead>
                    <TableHead>{t("email", "Email")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userList.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.id}</TableCell>
                      <TableCell>
                        {user.email || "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-sm text-muted-foreground">
                {t("noUsers", "No users found")}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
