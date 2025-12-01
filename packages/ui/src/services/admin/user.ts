//
/* eslint-disable */
import request from "@workspace/ui/lib/request";

/** Create user POST /v1/admin/user/ */
export async function createUser(
  body: API.CreateUserRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>("/api/v1/admin/user/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** Delete user DELETE /v1/admin/user/ */
export async function deleteUser(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.DeleteUserParams,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>("/api/v1/admin/user/", {
    method: "DELETE",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Get user auth method GET /v1/admin/user/auth_method */
export async function getUserAuthMethod(options?: { [key: string]: any }) {
  return request<API.Response & { data?: API.GetUserAuthMethodResponse }>(
    "/api/v1/admin/user/auth_method",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** Update user auth method PUT /v1/admin/user/auth_method */
export async function updateUserAuthMethod(
  body: API.UpdateUserAuthMethodRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>(
    "/api/v1/admin/user/auth_method",
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

/** Create user auth method POST /v1/admin/user/auth_method */
export async function createUserAuthMethod(
  body: API.CreateUserAuthMethodRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>(
    "/api/v1/admin/user/auth_method",
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

/** Delete user auth method DELETE /v1/admin/user/auth_method */
export async function deleteUserAuthMethod(
  body: API.DeleteUserAuthMethodRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>(
    "/api/v1/admin/user/auth_method",
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

/** Update user basic info PUT /v1/admin/user/basic */
export async function updateUserBasicInfo(
  body: API.UpdateUserBasiceInfoRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>("/api/v1/admin/user/basic", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** Batch delete user DELETE /v1/admin/user/batch */
export async function batchDeleteUser(
  body: API.BatchDeleteUserRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>("/api/v1/admin/user/batch", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** Current user GET /v1/admin/user/current */
export async function currentUser(options?: { [key: string]: any }) {
  return request<API.Response & { data?: API.User }>(
    "/api/v1/admin/user/current",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** Get user detail GET /v1/admin/user/detail */
export async function getUserDetail(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.GetUserDetailParams,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: API.User }>(
    "/api/v1/admin/user/detail",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** User device PUT /v1/admin/user/device */
export async function updateUserDevice(
  body: API.UserDevice,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>("/api/v1/admin/user/device", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** Delete user device DELETE /v1/admin/user/device */
export async function deleteUserDevice(
  body: API.DeleteUserDeivceRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>("/api/v1/admin/user/device", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** kick offline user device PUT /v1/admin/user/device/kick_offline */
export async function kickOfflineByUserDevice(
  body: API.KickOfflineRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>(
    "/api/v1/admin/user/device/kick_offline",
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

/** Get user list GET /v1/admin/user/list */
export async function getUserList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.GetUserListParams,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: API.GetUserListResponse }>(
    "/api/v1/admin/user/list",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Get user login logs GET /v1/admin/user/login/logs */
export async function getUserLoginLogs(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.GetUserLoginLogsParams,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: API.GetUserLoginLogsResponse }>(
    "/api/v1/admin/user/login/logs",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Update user notify setting PUT /v1/admin/user/notify */
export async function updateUserNotifySetting(
  body: API.UpdateUserNotifySettingRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>("/api/v1/admin/user/notify", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** Get user subcribe GET /v1/admin/user/subscribe */
export async function getUserSubscribe(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.GetUserSubscribeParams,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: API.GetUserSubscribeListResponse }>(
    "/api/v1/admin/user/subscribe",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Update user subcribe PUT /v1/admin/user/subscribe */
export async function updateUserSubscribe(
  body: API.UpdateUserSubscribeRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>(
    "/api/v1/admin/user/subscribe",
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

/** Create user subcribe POST /v1/admin/user/subscribe */
export async function createUserSubscribe(
  body: API.CreateUserSubscribeRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>(
    "/api/v1/admin/user/subscribe",
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

/** Delete user subcribe DELETE /v1/admin/user/subscribe */
export async function deleteUserSubscribe(
  body: API.DeleteUserSubscribeRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>(
    "/api/v1/admin/user/subscribe",
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

/** Get user subcribe by id GET /v1/admin/user/subscribe/detail */
export async function getUserSubscribeById(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.GetUserSubscribeByIdParams,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: API.UserSubscribeDetail }>(
    "/api/v1/admin/user/subscribe/detail",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Get user subcribe devices GET /v1/admin/user/subscribe/device */
export async function getUserSubscribeDevices(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.GetUserSubscribeDevicesParams,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: API.GetUserSubscribeDevicesResponse }>(
    "/api/v1/admin/user/subscribe/device",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Get user subcribe logs GET /v1/admin/user/subscribe/logs */
export async function getUserSubscribeLogs(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.GetUserSubscribeLogsParams,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: API.GetUserSubscribeLogsResponse }>(
    "/api/v1/admin/user/subscribe/logs",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Get user subcribe reset traffic logs GET /v1/admin/user/subscribe/reset/logs */
export async function getUserSubscribeResetTrafficLogs(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.GetUserSubscribeResetTrafficLogsParams,
  options?: { [key: string]: any }
) {
  return request<
    API.Response & { data?: API.GetUserSubscribeResetTrafficLogsResponse }
  >("/api/v1/admin/user/subscribe/reset/logs", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** Get user subcribe traffic logs GET /v1/admin/user/subscribe/traffic_logs */
export async function getUserSubscribeTrafficLogs(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.GetUserSubscribeTrafficLogsParams,
  options?: { [key: string]: any }
) {
  return request<
    API.Response & { data?: API.GetUserSubscribeTrafficLogsResponse }
  >("/api/v1/admin/user/subscribe/traffic_logs", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
