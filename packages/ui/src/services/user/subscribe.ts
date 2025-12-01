//
/* eslint-disable */
import request from "@workspace/ui/lib/request";

/** Get subscribe list GET /v1/public/subscribe/list */
export async function querySubscribeList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.QuerySubscribeListParams,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: API.QuerySubscribeListResponse }>(
    "/api/v1/public/subscribe/list",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Get user subscribe node info GET /v1/public/subscribe/node/list */
export async function queryUserSubscribeNodeList(options?: {
  [key: string]: any;
}) {
  return request<
    API.Response & { data?: API.QueryUserSubscribeNodeListResponse }
  >("/api/v1/public/subscribe/node/list", {
    method: "GET",
    ...(options || {}),
  });
}
