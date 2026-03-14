import { Card, CardContent } from "@workspace/ui/components/card";
import { Icon } from "@workspace/ui/composed/icon";
import type { GetUserTrafficStatsResponse } from "@workspace/ui/services/user/traffic";
import { useTranslation } from "react-i18next";
import { Display } from "@/components/display";

interface TrafficStatsCardsProps {
  stats: GetUserTrafficStatsResponse;
}

export default function TrafficStatsCards({ stats }: TrafficStatsCardsProps) {
  const { t } = useTranslation("traffic");

  const cards = [
    {
      title: t("totalTraffic", "Total Traffic"),
      value: stats.total_traffic,
      icon: "uil:chart-line",
      color: "text-blue-500",
    },
    {
      title: t("uploadTraffic", "Upload Traffic"),
      value: stats.total_upload,
      icon: "uil:upload",
      color: "text-green-500",
    },
    {
      title: t("downloadTraffic", "Download Traffic"),
      value: stats.total_download,
      icon: "uil:download",
      color: "text-purple-500",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-sm">{card.title}</span>
              <span className="font-bold text-2xl">
                <Display type="traffic" value={card.value} />
              </span>
            </div>
            <Icon className={`size-10 ${card.color}`} icon={card.icon} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
