// @ts-nocheck
/* eslint-disable */
import request from "@workspace/ui/lib/request";

/** Admin login POST /v1/auth/admin/login */
export async function adminLogin(
  body: API.UserLoginRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: API.LoginResponse }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/auth/admin/login`,
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

/** Admin reset password POST /v1/auth/admin/reset */
export async function adminResetPassword(
  body: API.ResetPasswordRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/auth/admin/reset`,
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

/** Verify slider captcha POST /v1/auth/admin/captcha/slider/verify */
export async function adminVerifyCaptchaSlider(
  body: { id: string; x: number; y: number; trail: string },
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: API.SliderVerifyCaptchaResponse }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/auth/admin/captcha/slider/verify`,
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
