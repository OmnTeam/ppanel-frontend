//
/* eslint-disable */
import request from "@workspace/ui/lib/request";

/** Get batch send email task list GET /v1/admin/marketing/email/batch/list */
export async function getBatchSendEmailTaskList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.GetBatchSendEmailTaskListParams,
  options?: { [key: string]: any }
) {
  return request<
    API.Response & { data?: API.GetBatchSendEmailTaskListResponse }
  >("/api/v1/admin/marketing/email/batch/list", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Get pre-send email count POST /v1/admin/marketing/email/batch/pre-send-count */
export async function getPreSendEmailCount(
  body: API.GetPreSendEmailCountRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: API.GetPreSendEmailCountResponse }>(
    "/api/v1/admin/marketing/email/batch/pre-send-count",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** Create a batch send email task POST /v1/admin/marketing/email/batch/send */
export async function createBatchSendEmailTask(
  body: API.CreateBatchSendEmailTaskRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>(
    "/api/v1/admin/marketing/email/batch/send",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** Get batch send email task status POST /v1/admin/marketing/email/batch/status */
export async function getBatchSendEmailTaskStatus(
  body: API.GetBatchSendEmailTaskStatusRequest,
  options?: { [key: string]: any }
) {
  return request<
    API.Response & { data?: API.GetBatchSendEmailTaskStatusResponse }
  >("/api/v1/admin/marketing/email/batch/status", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** Stop a batch send email task POST /v1/admin/marketing/email/batch/stop */
export async function stopBatchSendEmailTask(
  body: API.StopBatchSendEmailTaskRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>(
    "/api/v1/admin/marketing/email/batch/stop",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** Create a quota task POST /v1/admin/marketing/quota/create */
export async function createQuotaTask(
  body: API.CreateQuotaTaskRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>(
    "/api/v1/admin/marketing/quota/create",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** Query quota task list GET /v1/admin/marketing/quota/list */
export async function queryQuotaTaskList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.QueryQuotaTaskListParams,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: API.QueryQuotaTaskListResponse }>(
    "/api/v1/admin/marketing/quota/list",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Query quota task pre-count POST /v1/admin/marketing/quota/pre-count */
export async function queryQuotaTaskPreCount(
  body: API.QueryQuotaTaskPreCountRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: API.QueryQuotaTaskPreCountResponse }>(
    "/api/v1/admin/marketing/quota/pre-count",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}
