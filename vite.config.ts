import path from "path";
import { defineConfig } from "vitest/config";
import { playwright } from "@vitest/browser-playwright";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    tailwindcss(),
  ],
  test: {
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      // https://vitest.dev/guide/browser/playwright
      instances: [{ browser: "chromium" }],
    },
    coverage: {
      exclude: ["**/components/ui"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://api.neds.com.au",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/rest/v1/racing/"),
      },
    },
  },
});
