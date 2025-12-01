//
/* eslint-disable */
import request from "@workspace/ui/lib/request";

/** Update Payment Method PUT /v1/admin/payment/ */
export async function updatePaymentMethod(
  body: API.UpdatePaymentMethodRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: API.PaymentConfig }>(
    "/api/v1/admin/payment/",
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

/** Create Payment Method POST /v1/admin/payment/ */
export async function createPaymentMethod(
  body: API.CreatePaymentMethodRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: API.PaymentConfig }>(
    "/api/v1/admin/payment/",
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

/** Delete Payment Method DELETE /v1/admin/payment/ */
export async function deletePaymentMethod(
  body: API.DeletePaymentMethodRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>("/api/v1/admin/payment/", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** Get Payment Method List GET /v1/admin/payment/list */
export async function getPaymentMethodList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.GetPaymentMethodListParams,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: API.GetPaymentMethodListResponse }>(
    "/api/v1/admin/payment/list",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Get supported payment platform GET /v1/admin/payment/platform */
export async function getPaymentPlatform(options?: { [key: string]: any }) {
  return request<API.Response & { data?: API.PlatformResponse }>(
    "/api/v1/admin/payment/platform",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}
