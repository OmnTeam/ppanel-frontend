//
/* eslint-disable */
import request from "@workspace/ui/lib/request";

/** Send heartbeat to the service GET /basic/heartbeat */
export async function basicHeartbeat(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.basicHeartbeatParams,
  options?: { [key: string]: any }
) {
  return request<{ code?: number; data?: API.HeartbeatResponse; msg?: string }>(
    "/basic/heartbeat",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}
