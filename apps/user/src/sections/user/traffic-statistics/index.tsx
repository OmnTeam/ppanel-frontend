import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@workspace/ui/components/select";
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { Icon } from "@workspace/ui/composed/icon";
import { queryUserSubscribe } from "@workspace/ui/services/user/user";
import { getUserTrafficStats } from "@workspace/ui/services/user/traffic";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import TrafficTrendChart from "./traffic-trend-chart";
import TrafficRatioChart from "./traffic-ratio-chart";
import TrafficStatsCards from "./traffic-stats-cards";

export default function TrafficStatistics() {
  const { t } = useTranslation("traffic");
  const [days, setDays] = useState<7 | 30>(7);
  const [selectedSubscribeId, setSelectedSubscribeId] = useState<string | null>(null);

  // 查询用户订阅列表
  const { data: userSubscribe = [] } = useQuery({
    queryKey: ["queryUserSubscribe"],
    queryFn: async () => {
      const { data } = await queryUserSubscribe();
      return data.data?.list || [];
    },
  });

  // 使用 id_str 字段，避免 JavaScript 精度丢失
  const activeSubscribeId = selectedSubscribeId || (userSubscribe[0]?.id_str || null);

  // 查询流量统计数据
  const { data: trafficStats, isLoading } = useQuery({
    queryKey: ["getUserTrafficStats", activeSubscribeId, days],
    queryFn: async () => {
      if (!activeSubscribeId) return null;
      const { data } = await getUserTrafficStats({
        user_subscribe_id: activeSubscribeId,
        days,
      });
      return data.data;
    },
    enabled: !!activeSubscribeId,
  });

  return (
    <div className="flex min-h-[calc(100vh-64px-58px-32px-114px)] w-full flex-col gap-4">
      {/* 标题和控制栏 */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="flex items-center gap-1.5 font-semibold">
          <Icon className="size-5" icon="uil:chart-line" />
          {t("title", "Traffic Statistics")}
        </h2>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          {/* 订阅选择 */}
          {userSubscribe.length > 1 && (
            <Select
              value={activeSubscribeId || undefined}
              onValueChange={(value) => setSelectedSubscribeId(value)}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder={t("selectSubscription", "Select Subscription")} />
              </SelectTrigger>
              <SelectContent>
                {userSubscribe.map((sub) => (
                  <SelectItem key={sub.id} value={sub.id_str}>
                    {sub.subscribe.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {/* 时间范围切换 */}
          <Tabs value={String(days)} onValueChange={(value) => setDays(Number(value) as 7 | 30)}>
            <TabsList>
              <TabsTrigger value="7">{t("days7", "7 Days")}</TabsTrigger>
              <TabsTrigger value="30">{t("days30", "30 Days")}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* 统计卡片 */}
      {trafficStats && <TrafficStatsCards stats={trafficStats} />}

      {/* 图表区域 */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* 流量趋势图 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("trafficTrend", "Traffic Trend")}</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex h-[300px] items-center justify-center">
                <Icon className="size-8 animate-spin" icon="uil:spinner" />
              </div>
            ) : trafficStats && trafficStats.list.length > 0 ? (
              <TrafficTrendChart data={trafficStats.list} />
            ) : (
              <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                {t("noData", "No traffic data available")}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 流量占比图 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("trafficRatio", "Upload/Download Ratio")}</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex h-[300px] items-center justify-center">
                <Icon className="size-8 animate-spin" icon="uil:spinner" />
              </div>
            ) : trafficStats && (trafficStats.total_upload > 0 || trafficStats.total_download > 0) ? (
              <TrafficRatioChart
                upload={trafficStats.total_upload}
                download={trafficStats.total_download}
              />
            ) : (
              <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                {t("noData", "No traffic data available")}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}