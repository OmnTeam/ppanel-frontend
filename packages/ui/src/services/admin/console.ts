//
/* eslint-disable */
import request from "@workspace/ui/lib/request";

/** Query revenue statistics GET /v1/admin/console/revenue */
export async function queryRevenueStatistics(options?: { [key: string]: any }) {
  return request<API.Response & { data?: API.RevenueStatisticsResponse }>(
    "/api/v1/admin/console/revenue",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** Query server total data GET /v1/admin/console/server */
export async function queryServerTotalData(options?: { [key: string]: any }) {
  return request<API.Response & { data?: API.ServerTotalDataResponse }>(
    "/api/v1/admin/console/server",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** Query ticket wait reply GET /v1/admin/console/ticket */
export async function queryTicketWaitReply(options?: { [key: string]: any }) {
  return request<API.Response & { data?: API.TicketWaitRelpyResponse }>(
    "/api/v1/admin/console/ticket",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** Query user statistics GET /v1/admin/console/user */
export async function queryUserStatistics(options?: { [key: string]: any }) {
  return request<API.Response & { data?: API.UserStatisticsResponse }>(
    "/api/v1/admin/console/user",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}
