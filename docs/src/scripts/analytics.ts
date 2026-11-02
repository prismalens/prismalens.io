// Kept byte-identical between site/src/scripts/analytics.ts and docs/src/scripts/analytics.ts
import type { CaptureResult } from "posthog-js";

const POSTHOG_TOKEN = "phc_pCgmw347sL5wFdtsf5eTG4NEki5DyyFwHNXiyUjT5UcW";
const POSTHOG_API_HOST = "https://eu.i.posthog.com";

export function analyticsHost(hostname: string): "site" | "docs" | null {
  const host = hostname.toLowerCase();
  if (host === "prismalens.io" || host === "www.prismalens.io") {
    return "site";
  }
  if (host === "docs.prismalens.io") {
    return "docs";
  }
  return null;
}

const AI_ASSISTANTS: Record<string, string> = {
  "chatgpt.com": "chatgpt",
  "chat.openai.com": "chatgpt",
  "perplexity.ai": "perplexity",
  "claude.ai": "claude",
  "gemini.google.com": "gemini",
  "copilot.microsoft.com": "copilot",
  "grok.com": "grok",
  "chat.deepseek.com": "deepseek",
  "chat.mistral.ai": "mistral",
  "meta.ai": "meta_ai",
  "you.com": "you",
  "phind.com": "phind",
};
const SEARCH_ENGINES: Array<[RegExp, string]> = [
  [/(^|.)google.[a-z.]+$/, "google"],
  [/(^|.)bing.com$/, "bing"],
  [/(^|.)duckduckgo.com$/, "duckduckgo"],
  [/(^|.)search.yahoo.com$/, "yahoo"],
  [/(^|.)yandex.[a-z.]+$/, "yandex"],
  [/(^|.)ecosia.org$/, "ecosia"],
  [/(^|.)search.brave.com$/, "brave"],
  [/(^|.)kagi.com$/, "kagi"],
  [/(^|.)baidu.com$/, "baidu"],
];
const SOCIAL = ["news.ycombinator.com", "reddit.com", "x.com", "t.co", "twitter.com", "linkedin.com", "lnkd.in", "bsky.app"];

const hostOf = (value: string): string | null => {
  try {
    return new URL(value).hostname.toLowerCase().replace(/^www./, "");
  } catch {
    return null;
  }
};
const within = (host: string, domain: string) => host === domain || host.endsWith(`.${domain}`);

export type TrafficSource = {
  traffic_source: "ai_assistant" | "search" | "social" | "campaign" | "referral" | "internal" | "direct";
  traffic_from: string | null;
};

/** Where a visit came from, so AI-assistant and organic-search arrivals can be told apart. */
export function trafficSource(referrer: string, search: string): TrafficSource {
  const utm = new URLSearchParams(search).get("utm_source")?.toLowerCase().trim() || null;
  const host = hostOf(referrer);

  for (const candidate of [host, utm && (hostOf(`https://${utm}`) ?? utm)]) {
    if (!candidate) continue;
    const domain = Object.keys(AI_ASSISTANTS).find((d) => within(candidate, d));
    if (domain) return { traffic_source: "ai_assistant", traffic_from: AI_ASSISTANTS[domain] };
  }
  if (utm) return { traffic_source: "campaign", traffic_from: utm };
  if (!host) return { traffic_source: "direct", traffic_from: null };
  if (analyticsHost(host) || analyticsHost(`www.${host}`)) return { traffic_source: "internal", traffic_from: host };
  const engine = SEARCH_ENGINES.find(([pattern]) => pattern.test(host));
  if (engine) return { traffic_source: "search", traffic_from: engine[1] };
  if (SOCIAL.some((d) => within(host, d))) return { traffic_source: "social", traffic_from: host };
  return { traffic_source: "referral", traffic_from: host };
}

export function installTarget(href: string): "npm" | "desktop" | "github" | null {
  try {
    const url = new URL(href, "https://prismalens.io");
    const host = url.hostname.toLowerCase();
    const path = url.pathname.toLowerCase();

    if (host === "npmjs.com" || host === "www.npmjs.com") {
      if (path === "/package/prismalens" || path.startsWith("/package/prismalens/")) {
        return "npm";
      }
    }

    if (host === "github.com" || host === "www.github.com") {
      if (
        path === "/prismalens/prismalens/releases" ||
        path.startsWith("/prismalens/prismalens/releases/")
      ) {
        return "desktop";
      }
      if (path === "/prismalens/prismalens" || path.startsWith("/prismalens/prismalens/")) {
        return "github";
      }
    }

    return null;
  } catch {
    return null;
  }
}

export function copiedCommand(
  text: string,
): "npm_global" | "npx" | "install_script_sh" | "install_script_ps1" | "other" | null {
  const lower = text.toLowerCase();
  if (!lower.includes("prismalens")) {
    return null;
  }

  // The Node-free installers (prismalens#717) are served from prismalens.io.
  if (lower.includes("install.ps1")) return "install_script_ps1";
  if (lower.includes("install.sh")) return "install_script_sh";

  const isNpm = /\bnpm\b/.test(text);
  const isGlobal = /(?:^|\s)(?:-g|--global)(?:\s|$)/m.test(text);
  const isInstall = /(?:^|\s)(?:i|install)(?:\s|$)/m.test(text);

  if (isNpm && isGlobal && isInstall) {
    return "npm_global";
  }

  if (/\bnpx\b/.test(text)) {
    return "npx";
  }

  return "other";
}

/** A URL without its query string or fragment; anything that is not a URL is returned unchanged. */
export function stripQuery(value: string): string {
  try {
    const url = new URL(value);
    url.search = "";
    url.hash = "";
    return url.toString();
  } catch {
    return value;
  }
}

/** Strips query strings from every URL-bearing property, including the `$set`/`$set_once` maps. */
export function sanitizeEvent(event: CaptureResult | null): CaptureResult | null {
  if (!event) return event;
  const clean = (props: Record<string, unknown> | undefined) => {
    if (!props) return;
    for (const [key, value] of Object.entries(props)) {
      if (typeof value === "string" && /(url|referrer)$/i.test(key)) props[key] = stripQuery(value);
    }
  };
  clean(event.properties);
  clean(event.$set);
  clean(event.$set_once);
  return event;
}

export async function initAnalytics(): Promise<void> {
  if (typeof location === "undefined") return;
  const site = analyticsHost(location.hostname);
  if (!site) return;

  // Loaded only on a production host, so previews and localhost never fetch the SDK.
  const { default: posthog } = await import("posthog-js");
  posthog.init(POSTHOG_TOKEN, {
    api_host: POSTHOG_API_HOST,
    cookieless_mode: "always",
    disable_session_recording: true,
    disable_surveys: true,
    capture_exceptions: false,
    capture_performance: false,
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: site === "site",
    enable_heatmaps: site === "site",
    advanced_disable_feature_flags: true,
    advanced_disable_feature_flags_on_first_load: true,
    before_send: sanitizeEvent,
  });

  // Recomputed on every page load: nothing is stored, so it stays cookieless.
  const referrer = typeof document === "undefined" ? "" : document.referrer;
  posthog.register({ site, ...trafficSource(referrer, location.search) });

  if (typeof document === "undefined") return;

  document.addEventListener(
    "click",
    (event) => {
      const el = event.target as Element | null;
      if (!el || typeof el.closest !== "function") return;

      const anchor = el.closest("a");
      if (anchor) {
        const href = anchor.getAttribute("href");
        if (href) {
          const target = installTarget(href);
          if (target) {
            posthog.capture("install_link_clicked", { target });
          }
        }
      }

      const copyButton = el.closest(".expressive-code .copy button");
      if (copyButton) {
        const codeText =
          copyButton.closest(".expressive-code")?.querySelector("pre")?.textContent ?? "";
        const command = copiedCommand(codeText);
        if (command) {
          posthog.capture("install_command_copied", { command });
        }
      }
    },
    true
  );
}
