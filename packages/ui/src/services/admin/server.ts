//
/* eslint-disable */
import request from "@workspace/ui/lib/request";

/** Create Server POST /v1/admin/server/create */
export async function createServer(
  body: API.CreateServerRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>("/api/v1/admin/server/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** Delete Server POST /v1/admin/server/delete */
export async function deleteServer(
  body: API.DeleteServerRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>("/api/v1/admin/server/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** Filter Server List GET /v1/admin/server/list */
export async function filterServerList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.FilterServerListParams,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: API.FilterServerListResponse }>(
    "/api/v1/admin/server/list",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Check if there is any server or node to migrate GET /v1/admin/server/migrate/has */
export async function hasMigrateSeverNode(options?: { [key: string]: any }) {
  return request<API.Response & { data?: API.HasMigrateSeverNodeResponse }>(
    "/api/v1/admin/server/migrate/has",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** Migrate server and node data to new database POST /v1/admin/server/migrate/run */
export async function migrateServerNode(options?: { [key: string]: any }) {
  return request<API.Response & { data?: API.MigrateServerNodeResponse }>(
    "/api/v1/admin/server/migrate/run",
    {
      method: "POST",
      ...(options || {}),
    }
  );
}

/** Create Node POST /v1/admin/server/node/create */
export async function createNode(
  body: API.CreateNodeRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>(
    "/api/v1/admin/server/node/create",
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

/** Delete Node POST /v1/admin/server/node/delete */
export async function deleteNode(
  body: API.DeleteNodeRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>(
    "/api/v1/admin/server/node/delete",
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

/** Filter Node List GET /v1/admin/server/node/list */
export async function filterNodeList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.FilterNodeListParams,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: API.FilterNodeListResponse }>(
    "/api/v1/admin/server/node/list",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Reset node sort POST /v1/admin/server/node/sort */
export async function resetSortWithNode(
  body: API.ResetSortRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>(
    "/api/v1/admin/server/node/sort",
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

/** Toggle Node Status POST /v1/admin/server/node/status/toggle */
export async function toggleNodeStatus(
  body: API.ToggleNodeStatusRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>(
    "/api/v1/admin/server/node/status/toggle",
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

/** Query all node tags GET /v1/admin/server/node/tags */
export async function queryNodeTag(options?: { [key: string]: any }) {
  return request<API.Response & { data?: API.QueryNodeTagResponse }>(
    "/api/v1/admin/server/node/tags",
    {
      method: "GET",
      ...(options || {}),
    }
  );
}

/** Update Node POST /v1/admin/server/node/update */
export async function updateNode(
  body: API.UpdateNodeRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>(
    "/api/v1/admin/server/node/update",
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

/** Get Server Protocols GET /v1/admin/server/protocols */
export async function getServerProtocols(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.GetServerProtocolsParams,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: API.GetServerProtocolsResponse }>(
    "/api/v1/admin/server/protocols",
    {
      method: "GET",
      params: {
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** Reset server sort POST /v1/admin/server/server/sort */
export async function resetSortWithServer(
  body: API.ResetSortRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>(
    "/api/v1/admin/server/server/sort",
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

/** Update Server POST /v1/admin/server/update */
export async function updateServer(
  body: API.UpdateServerRequest,
  options?: { [key: string]: any }
) {
  return request<API.Response & { data?: any }>("/api/v1/admin/server/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
