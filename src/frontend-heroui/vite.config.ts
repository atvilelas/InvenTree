import { platform, release } from "node:os";

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

import { ExtractSVGWatcher } from "./vite.plugins.extractSvg";
import { __INVENTREE_VERSION_INFO__ } from "./version-info";

// Detect if the current environment is WSL
// Required for enabling file system polling
const IS_IN_WSL = platform().includes("WSL") || release().includes("WSL");

if (IS_IN_WSL) {
  console.log("WSL detected: using polling for file system events");
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    ExtractSVGWatcher(),
    react({
      babel: {
        plugins: ["macros"], // 👈 THIS enables support for `@lingui/macro`
      },
    }),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      "@lib": "/lib",
    },
  },
  server: {
    proxy: {
      "/media": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: true,
      },
      "/static": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: true,
      },
    },
    watch: {
      // Use polling only for WSL as the file system doesn't trigger notifications for Linux apps
      // Ref: https://github.com/vitejs/vite/issues/1153#issuecomment-785467271
      usePolling: IS_IN_WSL,
    },
  },
  define: {
    ...__INVENTREE_VERSION_INFO__,
  },
});
