import type { GetUserTrafficStatsResponse } from "@workspace/ui/services/user/traffic";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface TrafficTrendChartProps {
  data: GetUserTrafficStatsResponse["list"];
}

export default function TrafficTrendChart({ data }: TrafficTrendChartProps) {
  const { t } = useTranslation("traffic");

  // 转换数据格式，将字节转换为 MB（保持为数字）
  const chartData = data.map((item) => ({
    date: format(new Date(item.date), "MM-dd"),
    upload: Number((item.upload / (1024 * 1024)).toFixed(2)),
    download: Number((item.download / (1024 * 1024)).toFixed(2)),
  }));

  // 格式化流量显示
  const formatTraffic = (value: number | string) => {
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    if (numValue >= 1024) {
      return `${(numValue / 1024).toFixed(2)} GB`;
    }
    return `${numValue.toFixed(2)} MB`;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          label={{ value: t("date", "Date"), position: "insideBottom", offset: -5 }}
        />
        <YAxis
          label={{ value: t("traffic", "Traffic (MB)"), angle: -90, position: "insideLeft" }}
        />
        <Tooltip
          formatter={(value: number | string) => formatTraffic(value)}
          labelStyle={{ color: "#000" }}
        />
        <Legend
          verticalAlign="bottom"
          height={36}
          wrapperStyle={{
            position: "absolute",
            width: "444px",
            height: "36px",
            left: "5px",
            bottom: "-5px"
          }}
        />
        <Line
          type="monotone"
          dataKey="upload"
          stroke="#10b981"
          name={t("upload", "Upload")}
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="download"
          stroke="#3b82f6"
          name={t("download", "Download")}
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
