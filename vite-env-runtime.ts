import { fileURLToPath, URL } from "node:url";
import type { Plugin } from "vite";

/** Monorepo root: every app reads its env from here (see `envDir`). */
export const repoRoot = fileURLToPath(new URL(".", import.meta.url));

/**
 * Deployment time settings that may be changed on the server without
 * rebuilding: they are written into `dist/env.js`, which is loaded by
 * `index.html` before the application bundle.
 */
export const RUNTIME_ENV_KEYS = ["VITE_API_BASE_URL"] as const;

function renderRuntimeEnv(env: Record<string, string>): string {
  const values: Record<string, string> = {};
  for (const key of RUNTIME_ENV_KEYS) {
    values[key] = (env[key] ?? "").trim();
  }

  return `/* ------------------------------------------------------------------
 * 部署配置（可直接修改本文件，保存后刷新浏览器即可生效，无需重新构建）
 *
 * VITE_API_BASE_URL  后端 API 地址，必须带协议，不要以 / 结尾
 *                    例如 https://api.your-domain.com
 *                    留空则请求当前站点自身（同源，需要服务器把 /v1 反代到后端）
 *
 * 注意：修改本文件只会影响"请求发往哪个地址"。
 * 其他变量（CDN、充值预设金额等）在构建时就已写死，需要重新构建。
 * ------------------------------------------------------------------ */
window.__NPANEL_ENV__ = ${JSON.stringify(values, null, 2)};
`;
}

/**
 * Emits `dist/env.js` and injects it into `index.html` as the first script,
 * so it runs before the (deferred) application module.
 */
export function runtimeEnvPlugin(env: Record<string, string>): Plugin {
  return {
    name: "npanel-runtime-env",
    apply: "build",
    generateBundle() {
      this.emitFile({
        fileName: "env.js",
        source: renderRuntimeEnv(env),
        type: "asset",
      });
    },
    transformIndexHtml() {
      return [
        {
          attrs: { src: "./env.js" },
          injectTo: "head-prepend",
          tag: "script",
        },
      ];
    },
  };
}
