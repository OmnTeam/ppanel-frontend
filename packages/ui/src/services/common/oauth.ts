// @ts-nocheck
/* eslint-disable */
import request from "@workspace/ui/lib/request";

/** Apple Login Callback POST /v1/auth/oauth/callback/apple */
export async function appleLoginCallback(
  body: {
    code: string;
    id_token: string;
    state: string;
  },
  options?: { [key: string]: any }
) {
  const formData = new FormData();

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele];

    if (item !== undefined && item !== null) {
      if (typeof item === "object" && !(item instanceof File)) {
        if (Array.isArray(item)) {
          item.forEach((f) => {
            formData.append(ele, f || "");
          });
        } else {
          formData.append(
            ele,
            new Blob([JSON.stringify(item)], { type: "application/json" })
          );
        }
      } else {
        formData.append(ele, item);
      }
    }
  });

  return request<API.Response & { data?: any }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/auth/oauth/callback/apple`,
    {
      method: "POST",
      data: formData,
      requestType: "form",
      ...(options || {}),
    }
  );
}

/** OAuth login POST /v1/auth/oauth/login */
export async function oAuthLogin(
  body: API.OAthLoginRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: API.OAuthLoginResponse }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/auth/oauth/login`,
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

/** OAuth login get token POST /v1/auth/oauth/login/token */
export async function oAuthLoginGetToken(
  body: API.OAuthLoginGetTokenRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: API.LoginResponse }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/auth/oauth/login/token`,
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
