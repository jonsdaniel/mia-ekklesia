import { sites } from "@openai/sites-vite-plugin";
import { defineConfig } from "vite";

const isCodexSeatbeltSandbox = process.env.CODEX_SANDBOX === "seatbelt";

export default defineConfig(async () => {
  process.env.WRANGLER_WRITE_LOGS ??= "false";
  process.env.WRANGLER_LOG_PATH ??= ".wrangler/logs";
  process.env.MINIFLARE_REGISTRY_PATH ??= ".wrangler/registry";

  const { cloudflare } = await import("@cloudflare/vite-plugin");

  return {
    root: "site",
    publicDir: false,
    build: {
      outDir: "../dist",
      emptyOutDir: true,
    },
    server: isCodexSeatbeltSandbox
      ? { watch: { useFsEvents: false, usePolling: true } }
      : undefined,
    plugins: [
      sites(),
      cloudflare({
        viteEnvironment: { name: "server" },
        config: {
          main: "../worker/index.ts",
          compatibility_date: "2026-10-01",
          assets: {
            directory: ".",
            binding: "ASSETS",
            html_handling: "auto-trailing-slash",
            not_found_handling: "404-page",
          },
        },
      }),
    ],
  };
});
