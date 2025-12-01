//
/* eslint-disable */
import request from "@workspace/ui/lib/request";

/** Update the service to the latest version POST /basic/update */
export async function basicUpdateService(
  body: API.UpdateServiceRequest,
  options?: { [key: string]: any }
) {
  return request<{
    code?: number;
    data?: API.UpdateServiceResponse;
    msg?: string;
  }>("/basic/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
