//
/* eslint-disable */
import request from "@workspace/ui/lib/request";

/** Update ticket status PUT /v1/public/ticket/ */
export async function updateUserTicketStatus(
  body: API.UpdateUserTicketStatusRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>("/api/v1/public/ticket/", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** Create ticket POST /v1/public/ticket/ */
export async function createUserTicket(
  body: API.CreateUserTicketRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>("/api/v1/public/ticket/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** Get ticket detail GET /v1/public/ticket/detail */
export async function getUserTicketDetails(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.GetUserTicketDetailsParams,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: API.Ticket }>(
    "/api/v1/public/ticket/detail",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Create ticket follow POST /v1/public/ticket/follow */
export async function createUserTicketFollow(
  body: API.CreateUserTicketFollowRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>(
    "/api/v1/public/ticket/follow",
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

/** Get ticket list GET /v1/public/ticket/list */
export async function getUserTicketList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.GetUserTicketListParams,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: API.GetUserTicketListResponse }>(
    "/api/v1/public/ticket/list",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}
