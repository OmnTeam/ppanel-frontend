import { useTranslation } from "react-i18next";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface TrafficRatioChartProps {
  upload: number;
  download: number;
}

export default function TrafficRatioChart({ upload, download }: TrafficRatioChartProps) {
  const { t } = useTranslation("traffic");

  const data = [
    { name: t("upload", "Upload"), value: upload },
    { name: t("download", "Download"), value: download },
  ];

  const COLORS = ["#10b981", "#3b82f6"];

  // 格式化流量显示
  const formatTraffic = (value: number) => {
    if (value >= 1024 * 1024 * 1024) {
      return `${(value / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
    if (value >= 1024 * 1024) {
      return `${(value / (1024 * 1024)).toFixed(2)} MB`;
    }
    if (value >= 1024) {
      return `${(value / 1024).toFixed(2)} KB`;
    }
    return `${value} B`;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => formatTraffic(value)} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
