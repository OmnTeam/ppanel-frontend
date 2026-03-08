import { removeCookie, setCookie } from "@workspace/ui/lib/cookies";
import { isBrowser } from "@workspace/ui/utils/index";
import { intlFormat } from "date-fns";

export function getPlatform(): string {
  if (typeof window === "undefined") return "unknown";

  const userAgent = navigator.userAgent.toLowerCase();

  if (userAgent.includes("win")) return "windows";
  if (userAgent.includes("mac")) return "macos";
  if (userAgent.includes("linux")) return "linux";
  if (userAgent.includes("android")) return "android";
  if (userAgent.includes("iphone") || userAgent.includes("ipad")) return "ios";

  return "unknown";
}

export function differenceInDays(date1: Date, date2: Date): number {
  const diffTime = Math.abs(date1.getTime() - date2.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function formatDate(date?: Date | number, showTime = true) {
  if (!date) return;

  // 如果是数字（Unix时间戳），需要判断是秒级还是毫秒级
  // Unix时间戳（秒级）：10位数字，如 1771936457
  // JavaScript时间戳（毫秒级）：13位数字
  let dateValue = date;
  if (typeof date === "number") {
    // 如果小于 10000000000（100亿），认为是秒级时间戳，需要乘以1000
    if (date < 10000000000) {
      dateValue = date * 1000;
    }
  }

  const timeZone = localStorage.getItem("timezone") || "UTC";
  return intlFormat(dateValue, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    ...(showTime && {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    }),
    hour12: false,
    timeZone,
  });
}

export function setAuthorization(token: string): void {
  setCookie("Authorization", token);
}

export function getRedirectUrl(): string {
  if (typeof window === "undefined") return "/dashboard";
  const params = new URLSearchParams(window.location.search);
  const redirect = params.get("redirect");
  return redirect?.startsWith("/") ? redirect : "/dashboard";
}

export function setRedirectUrl(value?: string) {
  if (value) {
    sessionStorage.setItem("redirect-url", value);
  }
}

export function Logout() {
  if (!isBrowser()) return;
  removeCookie("Authorization");

  const pathname = location.pathname;
  const hash = location.hash.slice(1);

  if (!["", "/"].includes(pathname)) {
    setRedirectUrl(pathname);
    location.href = "/";
    return;
  }

  if (hash && !["", "/"].includes(hash)) {
    setRedirectUrl(hash);
    location.href = "/";
  }
}
