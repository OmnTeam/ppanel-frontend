//
/* eslint-disable */
import request from "@workspace/ui/lib/request";

/** Query IP Location GET /v1/admin/tool/ip/location */
export async function queryIpLocation(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.QueryIPLocationParams,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: API.QueryIPLocationResponse }>(
    "/api/v1/admin/tool/ip/location",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Get System Log GET /v1/admin/tool/log */
export async function getSystemLog(options?: { [key: string]: any }) {
  return request<API.Response & { data?: API.LogResponse }>(
    "/api/v1/admin/tool/log",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** Restart System GET /v1/admin/tool/restart */
export async function restartSystem(options?: { [key: string]: any }) {
  return request<API.Response & { data?: any }>("/api/v1/admin/tool/restart", {
    method: "GET",
    ...(options || {}),
  });
}

/** Get Version GET /v1/admin/tool/version */
export async function getVersion(options?: { [key: string]: any }) {
  return request<API.Response & { data?: API.VersionResponse }>(
    "/api/v1/admin/tool/version",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}
