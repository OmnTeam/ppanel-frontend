import request from "@workspace/ui/lib/request";

export interface GetUserTrafficStatsRequest {
  user_subscribe_id: string;  // 保持字符串，避免精度问题
  days: 7 | 30;
}

export interface DailyTrafficStats {
  date: string;
  upload: number;
  download: number;
  total: number;
}

export interface GetUserTrafficStatsResponse {
  list: DailyTrafficStats[];
  total_upload: number;
  total_download: number;
  total_traffic: number;
}

/** Get User Traffic Statistics GET /v1/public/user/traffic_stats */
export async function getUserTrafficStats(
  params: GetUserTrafficStatsRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: GetUserTrafficStatsResponse }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/public/user/traffic_stats`,
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}
