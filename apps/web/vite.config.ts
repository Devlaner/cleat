import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import type { ViteDevServer } from "vite";
import path from "node:path";

import { getDataset } from "./src/data/index";

function mockApiPlugin() {
  return {
    name: "mock-api",
    apply: "serve",
    configureServer(server: ViteDevServer) {
      server.middlewares.use("/api/dataset", (req, res) => {
        const url = new URL(req.originalUrl || req.url || "", "http://localhost");
        const accountId = url.searchParams.get("accountId") ?? "demo";

        const dataset = getDataset(accountId);

        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(dataset));
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), mockApiPlugin()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    port: 5173,
    host: true,
  },
});
