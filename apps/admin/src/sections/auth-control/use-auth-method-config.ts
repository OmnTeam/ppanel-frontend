import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAuthMethodConfig,
  updateAuthMethodConfig,
} from "@workspace/ui/services/admin/authMethod";
import { useCallback } from "react";

/** Auth method config normalized from the backend reply wrapper. */
export type AuthMethodConfigData = {
  id: string;
  method: string;
  config: Record<string, any>;
  enabled: boolean;
  raw?: API.AuthMethodConfig;
};

/** Fields a form is allowed to change. `id` and `method` are owned by the hook. */
export type AuthMethodConfigPatch = {
  enabled?: boolean;
  config?: Record<string, any>;
};

function isRecord(value: unknown): value is Record<string, any> {
  return typeof value === "object" && value !== null;
}

/**
 * Backend reply: `data: { config: { id, method, config, enabled } }`.
 * Some older gateways returned the `AuthMethodConfig` node at `data` directly,
 * so both shapes are accepted.
 */
function normalize(
  payload: unknown,
  fallbackMethod: string
): AuthMethodConfigData {
  const record = isRecord(payload) ? payload : {};
  const nested = isRecord(record.config) ? record.config : undefined;
  // New contract nests the auth method node under `config`; the node always
  // carries `method`, so that key (or id/enabled) is what distinguishes it from
  // a legacy flat payload whose `config` is the method settings themselves.
  const node =
    nested &&
    (nested.method !== undefined ||
      nested.id !== undefined ||
      nested.enabled !== undefined)
      ? nested
      : record;

  return {
    id: node.id === undefined || node.id === null ? "" : String(node.id),
    method:
      typeof node.method === "string" && node.method
        ? node.method
        : fallbackMethod,
    config: isRecord(node.config) ? node.config : {},
    enabled: Boolean(node.enabled),
    raw: isRecord(payload) ? (payload as API.AuthMethodConfig) : undefined,
  };
}

/** Merge config objects, including nested plain objects like `platform_config`. */
export function mergeAuthMethodConfig(
  current?: Record<string, any>,
  patch?: Record<string, any>
): Record<string, any> {
  const result: Record<string, any> = { ...(current || {}) };
  for (const [key, value] of Object.entries(patch || {})) {
    if (value === undefined) continue;
    const previous = result[key];
    result[key] =
      isRecord(previous) && isRecord(value) ? { ...previous, ...value } : value;
  }
  return result;
}

/**
 * Read/write an auth method config through the admin API.
 *
 * The GET reply nests the config one level deeper than the forms used to
 * assume, and the PUT body must always carry `id` and `method`; both details
 * are handled here so the forms only deal with a flat normalized object.
 */
export function useAuthMethodConfig(
  method: string,
  options?: { enabled?: boolean }
) {
  const queryClient = useQueryClient();
  const queryKey = ["getAuthMethodConfig", method] as const;

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const { data } = await getAuthMethodConfig({ method });
      return normalize(data?.data, method);
    },
    enabled: options?.enabled ?? true,
  });

  const save = useCallback(
    async (patch: AuthMethodConfigPatch = {}) => {
      const current = query.data;
      if (!current) {
        throw new Error("auth method config is not loaded yet");
      }
      const body = {
        id: current.id,
        method: current.method || method,
        enabled: patch.enabled ?? current.enabled,
        config: mergeAuthMethodConfig(current.config, patch.config),
      };
      const { data } = await updateAuthMethodConfig(body);
      const saved: AuthMethodConfigData = data?.data
        ? normalize(data.data, body.method)
        : { ...body, raw: undefined };
      queryClient.setQueryData(["getAuthMethodConfig", method], saved);
      return saved;
    },
    [method, query.data, queryClient]
  );

  return { ...query, save };
}
