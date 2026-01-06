/* eslint-disable */
import request from "@workspace/ui/lib/request";

/** Toggle redemption code status PUT /v1/admin/redemption/code/status */
export async function toggleRedemptionCodeStatus(
  body: API.ToggleRedemptionCodeStatusRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/redemption/code/status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** Update redemption code PUT /v1/admin/redemption/code */
export async function updateRedemptionCode(
  body: API.UpdateRedemptionCodeRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/redemption/code`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** Create redemption code POST /v1/admin/redemption/code */
export async function createRedemptionCode(
  body: API.CreateRedemptionCodeRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/redemption/code`,
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

/** Delete redemption code DELETE /v1/admin/redemption/code */
export async function deleteRedemptionCode(
  body: API.DeleteRedemptionCodeRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/redemption/code`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** Batch delete redemption code DELETE /v1/admin/redemption/code/batch */
export async function batchDeleteRedemptionCode(
  body: API.BatchDeleteRedemptionCodeRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/redemption/code/batch`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** Get redemption code list GET /v1/admin/redemption/code/list */
export async function getRedemptionCodeList(
  params: API.GetRedemptionCodeListRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: API.GetRedemptionCodeListResponse }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/redemption/code/list`,
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Get redemption record list GET /v1/admin/redemption/record/list */
export async function getRedemptionRecordList(
  params: API.GetRedemptionRecordListRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: API.GetRedemptionRecordListResponse }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/redemption/record/list`,
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}
