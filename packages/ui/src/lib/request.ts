/// <reference path="../typings.d.ts" />
import { getCookie } from "@workspace/ui/lib/cookies";
import { isBrowser } from "@workspace/ui/utils/index";
import axios, { type InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";

function handleError(response: {
  data?: { code?: number; message?: string };
  config?: { skipErrorHandler?: boolean };
  message?: string;
  status?: number;
  url?: string;
}) {
  const code = response.data?.code;
  if (code && [40_002, 40_003, 40_004, 40_005].includes(code))
    return window.logout();
  if (response?.config?.skipErrorHandler) return;
  if (!isBrowser()) return;

  const t = window.i18n.t;

  const ERROR_MESSAGES: Record<number, string> = {
    10001: t(
      "components:error.10001",
      "Query was not successful, please try again later or check your conditions."
    ),
    10002: t(
      "components:error.10002",
      "Update operation was not successful, please try again later."
    ),
    10003: t(
      "components:error.10003",
      "Insert operation cannot be completed at the moment, please try again later."
    ),
    10004: t(
      "components:error.10004",
      "Deletion operation could not be completed, please try again later."
    ),
    20001: t(
      "components:error.20001",
      "The user information already exists, please retry with different information."
    ),
    20002: t(
      "components:error.20002",
      "User not found, please check the information and try again."
    ),
    20003: t("components:error.20003", "Incorrect password, please re-enter."),
    20004: t(
      "components:error.20004",
      "The user is disabled, please contact customer service if you have questions."
    ),
    20005: t(
      "components:error.20005",
      "Insufficient balance, please recharge and try again."
    ),
    20006: t(
      "components:error.20006",
      "The registration function is temporarily unavailable, please try again later."
    ),
    20008: t(
      "components:error.20008",
      "User information is incorrect, please check and try again."
    ),
    20011: t(
      "components:error.20011",
      "Registration is too frequent, please try again later."
    ),
    30001: t(
      "components:error.30001",
      "The node already exists, please do not add it again."
    ),
    30002: t(
      "components:error.30002",
      "Related node not found, please check and try again."
    ),
    30003: t(
      "components:error.30003",
      "Group already exists, please try using a different name."
    ),
    30004: t(
      "components:error.30004",
      "Group not found, please verify the information and try again."
    ),
    30005: t(
      "components:error.30005",
      "There is still content in the group, please clear it and try again."
    ),
    400: t(
      "components:error.400",
      "The request parameters are incorrect, please check and resubmit."
    ),
    40002: t(
      "components:error.40002",
      "Valid Token not found, please log in before retrying."
    ),
    40003: t(
      "components:error.40003",
      "Current Token is invalid, please reacquire before trying again."
    ),
    40004: t(
      "components:error.40004",
      "Token has expired, please log in again."
    ),
    40005: t(
      "components:error.40005",
      "You do not have access permission, please contact the administrator if you have any questions."
    ),
    401: t(
      "components:error.401",
      "Request is too frequent, please try again later."
    ),
    500: t(
      "components:error.500",
      "The server is having some issues, please try again later."
    ),
    50001: t(
      "components:error.50001",
      "Corresponding coupon information not found, please check and try again."
    ),
    50002: t(
      "components:error.50002",
      "The coupon has been used, cannot be used again."
    ),
    50003: t(
      "components:error.50003",
      "This coupon code is not supported by the current purchase plan."
    ),
    50004: t(
      "components:error.50004",
      "Coupon has insufficient remaining uses."
    ),
    60001: t(
      "components:error.60001",
      "Subscription has expired, please renew before using."
    ),
    60002: t(
      "components:error.60002",
      "Unable to use the subscription at the moment, please try again later."
    ),
    60003: t(
      "components:error.60003",
      "An existing subscription is detected. Please cancel it before proceeding."
    ),
    60004: t(
      "components:error.60004",
      "Unable to delete at the moment as the subscription has active users."
    ),
    60005: t(
      "components:error.60005",
      "Single subscription mode has exceeded user limit"
    ),
    60006: t(
      "components:error.60006",
      "User quota limit has been reached, unable to continue."
    ),
    60007: t(
      "components:error.60007",
      "Insufficient inventory, please try again later or contact the administrator."
    ),
    60009: t(
      "components:error.60009",
      "You already have an active subscription. Please cancel or wait for it to expire before purchasing a new plan, or contact support."
    ),
    60010: t(
      "components:error.60010",
      "This plan cannot be renewed. Please choose another plan."
    ),
    61001: t(
      "components:error.61001",
      "The order does not exist or has been removed."
    ),
    61002: t(
      "components:error.61002",
      "The selected payment method is unavailable, please choose another one."
    ),
    61003: t(
      "components:error.61003",
      "The order status has changed, please refresh and try again."
    ),
    70001: t(
      "components:error.70001",
      "Incorrect verification code, please re-enter."
    ),
    80001: t(
      "components:error.80001",
      "Task was not successfully queued, please try again later."
    ),
    90001: t(
      "components:error.90001",
      "Please disable DEBUG mode and try again."
    ),
    90015: t(
      "components:error.90015",
      "This account has reached the limit of sending times today, please try again tomorrow."
    ),
    90016: t(
      "components:error.90016",
      "The account format is invalid, please check it and try again."
    ),
  };

  const hasBusinessCode = typeof code === "number";

  // Known business codes use the localized copy so the UI stays in one language.
  // Unknown codes keep the backend message, which is always non-empty.
  const message =
    (hasBusinessCode ? ERROR_MESSAGES[code as number] : undefined) ||
    response.data?.message ||
    t(
      "components:error.unknown",
      "An error occurred in the system, please try again later."
    );

  if (!hasBusinessCode) {
    // No business payload at all: the request never reached the API (network error,
    // HTML error page, wrong base URL, CORS...). Surface the transport details,
    // otherwise every one of those failures looks like a generic server error.
    const detail = [
      response.status ? `HTTP ${response.status}` : null,
      response.url || null,
      response.message || null,
    ]
      .filter(Boolean)
      .join(" · ");

    console.error("[request] non-JSON or failed response", {
      url: response.url,
      status: response.status,
      message: response.message,
    });

    toast.error(detail ? `${message} (${detail})` : message);
    return;
  }

  toast.error(message);
}

declare global {
  interface Window {
    __NPANEL_ENV__?: {
      VITE_API_BASE_URL?: string;
    };
  }
}

/**
 * 后端地址解析优先级：
 * 1. dist/env.js（部署后可直接修改，无需重新构建）
 * 2. 构建时内联的 VITE_API_BASE_URL
 * 空字符串表示"使用当前站点同源地址"，因此必须用 undefined 判断，不能用 || 兜底。
 */
function resolveApiBaseUrl(): string {
  const runtimeValue =
    typeof window === "undefined"
      ? undefined
      : window.__NPANEL_ENV__?.VITE_API_BASE_URL;

  if (runtimeValue !== undefined) return runtimeValue.trim();

  return import.meta.env.VITE_API_BASE_URL ?? "";
}

const request = axios.create({
  baseURL: resolveApiBaseUrl(),
});

request.interceptors.request.use(
  (
    config: InternalAxiosRequestConfig & {
      Authorization?: string;
      skipErrorHandler?: boolean;
    }
  ) => {
    const Authorization = getCookie("Authorization");
    if (Authorization) config.headers.Authorization = Authorization;
    return config;
  },
  (error: Error) => Promise.reject(error)
);

request.interceptors.response.use(
  (response) => {
    const { code } = response.data;
    if (code !== 200 && code !== 0) {
      handleError({
        data: response.data,
        config: {
          skipErrorHandler: (response.config as { skipErrorHandler?: boolean })
            .skipErrorHandler,
        },
        message: response.statusText,
        status: response.status,
        url: response.config?.url,
      });
      throw response;
    }
    return response;
  },
  (error: {
    response?: { data?: unknown; config?: unknown; statusText?: string; status?: number };
    config?: { url?: string };
    message?: string;
  }) => {
    handleError({
      data: error.response?.data as { code?: number; message?: string },
      config: {
        skipErrorHandler: (
          error.response?.config as { skipErrorHandler?: boolean }
        )?.skipErrorHandler,
      },
      message: error.message,
      status: error.response?.status,
      url:
        (error.config as { url?: string } | undefined)?.url ??
        (error.response?.config as { url?: string } | undefined)?.url,
    });
    return Promise.reject(error);
  }
);

export default request;
