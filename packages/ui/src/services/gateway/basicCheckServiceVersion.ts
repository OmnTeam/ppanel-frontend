//
/* eslint-disable */
import request from "@workspace/ui/lib/request";

/** Check if there is a new version of the service GET /basic/check/version */
export async function basicCheckServiceVersion(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.basicCheckServiceVersionParams,
  options?: { [key: string]: any }
) {
  return request<{
    code?: number;
    data?: API.ServiceVersionResponse;
    msg?: string;
  }>("/basic/check/version", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
