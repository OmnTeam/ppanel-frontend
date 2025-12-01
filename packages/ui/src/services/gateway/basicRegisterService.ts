//
/* eslint-disable */
import request from "@workspace/ui/lib/request";

/** Register a new service to the gateway POST /basic/register */
export async function basicRegisterService(
  body: API.RegisterServiceRequest,
  options?: { [key: string]: any }
) {
  return request<{
    code?: number;
    data?: API.RegisterServiceResponse;
    msg?: string;
  }>("/basic/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
