"use client";

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
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { getGroupHistory, getGroupHistoryDetail, getNodeGroupList } from "@workspace/ui/services/admin/group";

export default function CurrentGroupResults() {
  const { t } = useTranslation("group");
  const [loading, setLoading] = useState(true);
  const [latestResult, setLatestResult] = useState<any>(null);
  const [latestDetails, setLatestDetails] = useState<any[]>([]);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // User list dialog state
  const [userListOpen, setUserListOpen] = useState(false);
  const [selectedNodeGroupName, setSelectedNodeGroupName] = useState<string>("");
  const [userList, setUserList] = useState<any[]>([]);
  const [userListLoading, setUserListLoading] = useState(false);
  const [userListTotal, setUserListTotal] = useState(0);

  // Fetch node groups
  const { data: nodeGroups } = useQuery({
    queryKey: ["nodeGroups"],
    queryFn: async () => {
      const { data } = await getNodeGroupList({ page: 1, size: 1000 });
      return data.data?.list || [];
    },
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load latest result
        const { data: historyData } = await getGroupHistory({
          page: 1,
          size: 1,
        });

        if (historyData.data?.list && historyData.data.list.length > 0) {
          const latest = historyData.data.list[0];
          if (!latest) return;
          setLatestResult(latest);

          // Fetch details
          setDetailsLoading(true);
          try {
            const { data: detailData } = await getGroupHistoryDetail({
              id: latest.id,
            });

            if (detailData.data?.config_snapshot?.group_details) {
              setLatestDetails(detailData.data.config_snapshot.group_details);
            } else {
              setLatestDetails([]);
            }
          } catch (error) {
            console.error("Failed to fetch latest result details:", error);
            setLatestDetails([]);
          } finally {
            setDetailsLoading(false);
          }
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleShowUserList = async (nodeGroupId: number, nodeGroupName: string) => {
    setSelectedNodeGroupName(nodeGroupName);
    setUserListOpen(true);
    setUserListLoading(true);

    // 从历史详情记录中获取用户数据
    const detail = latestDetails.find((d: any) => {
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
    setUserListLoading(false);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("currentGroupingResult", "Current Grouping Result")}</CardTitle>
          <CardDescription>
            {t("loading", "Loading...")}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Latest Result Card */}
      {!latestResult ? (
        <Card>
          <CardHeader>
            <CardTitle>{t("currentGroupingResult", "Current Grouping Result")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-sm text-muted-foreground">
              {t("noDetails", "No details available")}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{t("currentGroupingResult", "Current Grouping Result")}</CardTitle>
            <CardDescription>
              {t("latestGroupingCalculation", "Latest grouping calculation details")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Calculation Info */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">{t("calculationInfo", "Calculation Information")}</h3>
              <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted/50 p-4">
              <div>
                <div className="text-xs text-muted-foreground">{t("groupMode", "Group Mode")}</div>
                <div className="font-medium">
                  {(latestResult.GroupMode || latestResult.group_mode) === "average"
                    ? t("averageMode", "Average Mode")
                    : (latestResult.GroupMode || latestResult.group_mode) === "subscribe"
                    ? t("subscribeMode", "Subscribe Mode")
                    : t("trafficMode", "Traffic Mode")}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">{t("state", "State")}</div>
                <div className="font-medium">
                  {(latestResult.State || latestResult.state) === "completed"
                    ? t("completed", "Completed")
                    : (latestResult.State || latestResult.state) === "running"
                    ? t("running", "Running")
                    : (latestResult.State || latestResult.state) === "failed"
                    ? t("failed", "Failed")
                    : t("idle", "Idle")}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">{t("triggerType", "Trigger Type")}</div>
                <div className="font-medium">
                  {(latestResult.TriggerType || latestResult.trigger_type) === "manual"
                    ? t("manualTrigger", "Manual")
                    : (latestResult.TriggerType || latestResult.trigger_type) === "auto"
                    ? t("autoTrigger", "Auto")
                    : t("scheduleTrigger", "Schedule")}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">{t("successFailedCount", "Success/Failed")}</div>
                <div className="font-medium">
                  {latestResult.SuccessCount || latestResult.success_count || 0} / {latestResult.FailedCount || latestResult.failed_count || 0}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">{t("startTime", "Start Time")}</div>
                <div className="font-medium">
                  {latestResult.StartTime || latestResult.start_time
                    ? new Date((latestResult.StartTime || latestResult.start_time) * 1000).toLocaleString()
                    : "-"}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">{t("endTime", "End Time")}</div>
                <div className="font-medium">
                  {latestResult.EndTime || latestResult.end_time
                    ? new Date((latestResult.EndTime || latestResult.end_time) * 1000).toLocaleString()
                    : "-"}
                </div>
              </div>
            </div>
            </div>

            {/* Grouping Details */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">{t("groupingDetailsStatistics", "Grouping Details Statistics")}</h3>
              <div className="grid grid-cols-3 gap-4 rounded-lg bg-muted/50 p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {latestDetails.reduce((sum: number, d: any) => sum + (d.UserCount || d.user_count || 0), 0)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t("totalUsers", "Total Users")}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {latestDetails.reduce((sum: number, d: any) => sum + (d.NodeCount || d.node_count || 0), 0)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t("totalNodes", "Total Nodes")}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{latestDetails.length}</div>
                  <div className="text-xs text-muted-foreground">
                    {t("totalNodeGroups", "Total Node Groups")}
                  </div>
                </div>
              </div>
            </div>

            {detailsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-sm text-muted-foreground">
                  {t("loading", "Loading...")}
                </span>
              </div>
            ) : latestDetails.length > 0 ? (
              <>
                {/* Details Table */}
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
                      {latestDetails.map((detail: any, index: number) => {
                        const nodeGroupId = detail.NodeGroupId || detail.node_group_id;
                        const nodeGroup = nodeGroups?.find((ng) => ng.id === nodeGroupId);
                        const nodeGroupName = nodeGroup?.name || `${t("idPrefix", "#")}${nodeGroupId}`;
                        const userCount = detail.UserCount || detail.user_count || 0;

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
                                className={`font-semibold hover:underline ${
                                  userCount === 0 ? 'text-muted-foreground cursor-not-allowed' : 'cursor-pointer'
                                }`}
                                onClick={() => handleShowUserList(nodeGroupId, nodeGroupName)}
                                disabled={userCount === 0}
                              >
                                {userCount}
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
          </CardContent>
        </Card>
      )}

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
            {userListLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-sm text-muted-foreground">
                  {t("loading", "Loading...")}
                </span>
              </div>
            ) : userList.length > 0 ? (
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
