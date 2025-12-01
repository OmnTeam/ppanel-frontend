//
/* eslint-disable */
import request from "@workspace/ui/lib/request";

/** Query User Affiliate Count GET /v1/public/user/affiliate/count */
export async function queryUserAffiliate(options?: { [key: string]: any }) {
  return request<API.Response & { data?: API.QueryUserAffiliateCountResponse }>(
    "/api/v1/public/user/affiliate/count",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** Query User Affiliate List GET /v1/public/user/affiliate/list */
export async function queryUserAffiliateList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.QueryUserAffiliateListParams,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: API.QueryUserAffiliateListResponse }>(
    "/api/v1/public/user/affiliate/list",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Query User Balance Log GET /v1/public/user/balance_log */
export async function queryUserBalanceLog(options?: { [key: string]: any }) {
  return request<API.Response & { data?: API.QueryUserBalanceLogListResponse }>(
    "/api/v1/public/user/balance_log",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** Update Bind Email PUT /v1/public/user/bind_email */
export async function updateBindEmail(
  body: API.UpdateBindEmailRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>(
    "/api/v1/public/user/bind_email",
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

/** Update Bind Mobile PUT /v1/public/user/bind_mobile */
export async function updateBindMobile(
  body: API.UpdateBindMobileRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>(
    "/api/v1/public/user/bind_mobile",
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

/** Bind OAuth POST /v1/public/user/bind_oauth */
export async function bindOAuth(
  body: API.BindOAuthRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: API.BindOAuthResponse }>(
    "/api/v1/public/user/bind_oauth",
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

/** Bind OAuth Callback POST /v1/public/user/bind_oauth/callback */
export async function bindOAuthCallback(
  body: API.BindOAuthCallbackRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>(
    "/api/v1/public/user/bind_oauth/callback",
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

/** Bind Telegram GET /v1/public/user/bind_telegram */
export async function bindTelegram(options?: { [key: string]: any }) {
  return request<API.Response & { data?: API.BindTelegramResponse }>(
    "/api/v1/public/user/bind_telegram",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** Query User Commission Log GET /v1/public/user/commission_log */
export async function queryUserCommissionLog(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.QueryUserCommissionLogParams,
  options?: { [key: string]: any }
) {
  return request<
    API.Response & { data?: API.QueryUserCommissionLogListResponse }
  >("/api/v1/public/user/commission_log", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Commission Withdraw POST /v1/public/user/commission_withdraw */
export async function commissionWithdraw(
  body: API.CommissionWithdrawRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: API.WithdrawalLog }>(
    "/api/v1/public/user/commission_withdraw",
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

/** Get Device List GET /v1/public/user/devices */
export async function getDeviceList(options?: { [key: string]: any }) {
  return request<API.Response & { data?: API.GetDeviceListResponse }>(
    "/api/v1/public/user/devices",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** Query User Info GET /v1/public/user/info */
export async function queryUserInfo(options?: { [key: string]: any }) {
  return request<API.Response & { data?: API.User }>(
    "/api/v1/public/user/info",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** Get Login Log GET /v1/public/user/login_log */
export async function getLoginLog(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.GetLoginLogParams,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: API.GetLoginLogResponse }>(
    "/api/v1/public/user/login_log",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Update User Notify PUT /v1/public/user/notify */
export async function updateUserNotify(
  body: API.UpdateUserNotifyRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>("/api/v1/public/user/notify", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** Get OAuth Methods GET /v1/public/user/oauth_methods */
export async function getOAuthMethods(options?: { [key: string]: any }) {
  return request<API.Response & { data?: API.GetOAuthMethodsResponse }>(
    "/api/v1/public/user/oauth_methods",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** Update User Password PUT /v1/public/user/password */
export async function updateUserPassword(
  body: API.UpdateUserPasswordRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>(
    "/api/v1/public/user/password",
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

/** Update User Rules PUT /v1/public/user/rules */
export async function updateUserRules(
  body: API.UpdateUserRulesRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>("/api/v1/public/user/rules", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** Query User Subscribe GET /v1/public/user/subscribe */
export async function queryUserSubscribe(options?: { [key: string]: any }) {
  return request<API.Response & { data?: API.QueryUserSubscribeListResponse }>(
    "/api/v1/public/user/subscribe",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** Get Subscribe Log GET /v1/public/user/subscribe_log */
export async function getSubscribeLog(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.GetSubscribeLogParams,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: API.GetSubscribeLogResponse }>(
    "/api/v1/public/user/subscribe_log",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Update User Subscribe Note PUT /v1/public/user/subscribe_note */
export async function updateUserSubscribeNote(
  body: API.UpdateUserSubscribeNoteRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>(
    "/api/v1/public/user/subscribe_note",
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

/** Reset User Subscribe Token PUT /v1/public/user/subscribe_token */
export async function resetUserSubscribeToken(
  body: API.ResetUserSubscribeTokenRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>(
    "/api/v1/public/user/subscribe_token",
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

/** Unbind Device PUT /v1/public/user/unbind_device */
export async function unbindDevice(
  body: API.UnbindDeviceRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>(
    "/api/v1/public/user/unbind_device",
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

/** Unbind OAuth POST /v1/public/user/unbind_oauth */
export async function unbindOAuth(
  body: API.UnbindOAuthRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>(
    "/api/v1/public/user/unbind_oauth",
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

/** Unbind Telegram POST /v1/public/user/unbind_telegram */
export async function unbindTelegram(options?: { [key: string]: any }) {
  return request<API.Response & { data?: any }>(
    "/api/v1/public/user/unbind_telegram",
    {
      method: "POST",
      ...(options || {}),
    }
  );
}

/** 此处后端没有提供注释 POST /v1/public/user/unsubscribe */
export async function unsubscribe(
  body: API.UnsubscribeRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>(
    "/api/v1/public/user/unsubscribe",
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

/** Pre Unsubscribe POST /v1/public/user/unsubscribe/pre */
export async function preUnsubscribe(
  body: API.PreUnsubscribeRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: API.PreUnsubscribeResponse }>(
    "/api/v1/public/user/unsubscribe/pre",
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

/** Verify Email POST /v1/public/user/verify_email */
export async function verifyEmail(
  body: API.VerifyEmailRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>(
    "/api/v1/public/user/verify_email",
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

/** Query Withdrawal Log GET /v1/public/user/withdrawal_log */
export async function queryWithdrawalLog(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.QueryWithdrawalLogParams,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: API.QueryWithdrawalLogListResponse }>(
    "/api/v1/public/user/withdrawal_log",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}
