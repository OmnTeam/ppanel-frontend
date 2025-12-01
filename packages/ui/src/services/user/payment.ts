//
/* eslint-disable */
import request from "@workspace/ui/lib/request";

/** Get available payment methods GET /v1/public/payment/methods */
export async function getAvailablePaymentMethods(options?: {
  [key: string]: any;
}) {
  return request<
    API.Response & { data?: API.GetAvailablePaymentMethodsResponse }
  >("/api/v1/public/payment/methods", {
    method: "GET",
    ...(options || {}),
  });
}
