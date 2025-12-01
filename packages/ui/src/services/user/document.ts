//
/* eslint-disable */
import request from "@workspace/ui/lib/request";

/** Get document detail GET /v1/public/document/detail */
export async function queryDocumentDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.QueryDocumentDetailParams,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: API.Document }>(
    "/api/v1/public/document/detail",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Get document list GET /v1/public/document/list */
export async function queryDocumentList(options?: { [key: string]: any }) {
  return request<API.Response & { data?: API.QueryDocumentListResponse }>(
    "/api/v1/public/document/list",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}
