// @ts-nocheck
/* eslint-disable */
import request from "@workspace/ui/lib/request";

/** Get user group list GET /v1/admin/group/user/list */
export async function getUserGroupList(
  params: API.GetUserGroupListRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: API.GetUserGroupListResponse }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/group/user/list`,
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Create user group POST /v1/admin/group/user */
export async function createUserGroup(
  body: API.CreateUserGroupRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/group/user`,
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

/** Update user group PUT /v1/admin/group/user */
export async function updateUserGroup(
  body: API.UpdateUserGroupRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/group/user`,
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

/** Delete user group DELETE /v1/admin/group/user */
export async function deleteUserGroup(
  body: API.DeleteUserGroupRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/group/user`,
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

/** Get node group list GET /v1/admin/group/node/list */
export async function getNodeGroupList(
  params: API.GetNodeGroupListRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: API.GetNodeGroupListResponse }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/group/node/list`,
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Create node group POST /v1/admin/group/node */
export async function createNodeGroup(
  body: API.CreateNodeGroupRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/group/node`,
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

/** Update node group PUT /v1/admin/group/node */
export async function updateNodeGroup(
  body: API.UpdateNodeGroupRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/group/node`,
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

/** Delete node group DELETE /v1/admin/group/node */
export async function deleteNodeGroup(
  body: API.DeleteNodeGroupRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/group/node`,
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

/** Get subscribe mapping list GET /v1/admin/group/subscribe/mapping */
export async function getSubscribeMapping(
  params: API.GetSubscribeMappingRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: API.GetSubscribeMappingResponse }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/group/subscribe/mapping`,
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Update subscribe mapping PUT /v1/admin/group/subscribe/mapping */
export async function updateSubscribeMapping(
  body: API.UpdateSubscribeMappingRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/group/subscribe/mapping`,
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

/** Get subscribe group mapping GET /v1/admin/group/subscribe/mapping */
export async function getSubscribeGroupMapping(
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: API.GetSubscribeGroupMappingResponse }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/group/subscribe/mapping`,
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** Get group config GET /v1/admin/group/config */
export async function getGroupConfig(
  params?: API.GetGroupConfigRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: API.GetGroupConfigResponse }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/group/config`,
    {
      method: "GET",
      params: params || {},
      ...(options || {}),
    }
  );
}

/** Update group config PUT /v1/admin/group/config */
export async function updateGroupConfig(
  body: API.UpdateGroupConfigRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/group/config`,
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

/** Get recalculation status GET /v1/admin/group/recalculation/status */
export async function getRecalculationStatus(options?: { [key: string]: any }) {
  return request<API.Response & { data?: API.RecalculationState }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/group/recalculation/status`,
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** Recalculate groups POST /v1/admin/group/recalculate */
export async function recalculateGroup(
  body: API.RecalculateGroupRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/group/recalculate`,
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

/** Get group history GET /v1/admin/group/history */
export async function getGroupHistory(
  params: API.GetGroupHistoryRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: API.GetGroupHistoryResponse }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/group/history`,
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Get group history detail GET /v1/admin/group/history/detail */
export async function getGroupHistoryDetail(
  params: { id: number },
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: API.GetGroupHistoryDetailResponse }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/group/history/detail`,
    {
      method: "GET",
      params: {
        id: params.id,
      },
      ...(options || {}),
    }
  );
}

/** Export group result GET /v1/admin/group/export */
export async function exportGroupResult(
  params?: API.ExportGroupResultRequest,
  options?: { [key: string]: any }
) {
  return request<Blob>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/group/export`,
    {
      method: "GET",
      params: params || {},
      responseType: 'blob',
      ...(options || {}),
    }
  );
}

/** Preview user nodes GET /v1/admin/group/preview */
export async function previewUserNodes(
  params: API.PreviewUserNodesRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: API.PreviewUserNodesResponse }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/group/preview`,
    {
      method: "GET",
      params: {
        user_id: params.user_id,
      },
      ...(options || {}),
    }
  );
}

/** Migrate users to another group POST /v1/admin/group/migrate */
export async function migrateUsersToGroup(
  body: API.MigrateUsersRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: API.MigrateUsersResponse }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/group/migrate`,
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

/** Update user user group PUT /v1/admin/user/user_group */
export async function updateUserUserGroup(
  body: API.UpdateUserUserGroupRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/user/user_group`,
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

/** Reset all groups POST /v1/admin/group/reset */
export async function resetGroups(
  body: API.ResetGroupsRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/group/reset`,
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

/** Bind node group to user groups POST /v1/admin/group/user/bind-node-groups */
export async function bindNodeGroups(
  body: API.BindNodeGroupsRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>(
    `${import.meta.env.VITE_API_PREFIX || ""}/v1/admin/group/user/bind-node-groups`,
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
