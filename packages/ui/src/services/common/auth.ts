//
/* eslint-disable */
import request from "@workspace/ui/lib/request";

/** Check user is exist GET /v1/auth/check */
export async function checkUser(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.CheckUserParams,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: API.CheckUserResponse }>(
    "/api/v1/auth/check",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Check user telephone is exist GET /v1/auth/check/telephone */
export async function checkUserTelephone(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.CheckUserTelephoneParams,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: API.TelephoneCheckUserResponse }>(
    "/api/v1/auth/check/telephone",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** User login POST /v1/auth/login */
export async function userLogin(
  body: API.UserLoginRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: API.LoginResponse }>(
    "/api/v1/auth/login",
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

/** Device Login POST /v1/auth/login/device */
export async function deviceLogin(
  body: API.DeviceLoginRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: API.LoginResponse }>(
    "/api/v1/auth/login/device",
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

/** User Telephone login POST /v1/auth/login/telephone */
export async function telephoneLogin(
  body: API.TelephoneLoginRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: API.LoginResponse }>(
    "/api/v1/auth/login/telephone",
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

/** User register POST /v1/auth/register */
export async function userRegister(
  body: API.UserRegisterRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: API.LoginResponse }>(
    "/api/v1/auth/register",
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

/** User Telephone register POST /v1/auth/register/telephone */
export async function telephoneUserRegister(
  body: API.TelephoneRegisterRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: API.LoginResponse }>(
    "/api/v1/auth/register/telephone",
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

/** Reset password POST /v1/auth/reset */
export async function resetPassword(
  body: API.ResetPasswordRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: API.LoginResponse }>(
    "/api/v1/auth/reset",
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

/** Reset password POST /v1/auth/reset/telephone */
export async function telephoneResetPassword(
  body: API.TelephoneResetPasswordRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: API.LoginResponse }>(
    "/api/v1/auth/reset/telephone",
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
