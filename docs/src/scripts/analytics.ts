// Kept byte-identical between site/src/scripts/analytics.ts and docs/src/scripts/analytics.ts
import posthog from "posthog-js";

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

export function initAnalytics(): void {
  if (typeof location === "undefined") return;
  const site = analyticsHost(location.hostname);
  if (!site) return;

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
  });

  posthog.register({ site });

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
