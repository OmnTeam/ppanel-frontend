// @ts-nocheck
/* eslint-disable */
import request from "@workspace/ui/lib/request";

/** Generate captcha POST /v1/auth/admin/captcha/generate */
export async function adminGenerateCaptcha(options?: { [key: string]: any }) {
  return request<API.Response & { data?: API.GenerateCaptchaResponse }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/auth/admin/captcha/generate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      ...(options || {}),
    }
  );
}
