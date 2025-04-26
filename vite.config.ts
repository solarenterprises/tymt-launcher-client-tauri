import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import legacy from "@vitejs/plugin-legacy";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [
    react(),
    wasm(),
    topLevelAwait(),
    legacy({
      modernTargets: ["chrome >= 87", "edge >= 88", "firefox >= 78", "safari >= 14"],
    }),
    nodePolyfills({
      include: ["crypto", "vm", "process", "os", "stream"], // Include the required polyfills
    }),
  ],
  resolve: {
    alias: {
      buffer: "buffer/",
    },
  },
  server: {
    port: 1420,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
  build: {
    chunkSizeWarningLimit: 8192,
    rollupOptions: {
      plugins: [],
    },
    target: "es2020", // Explicitly set to ES2020+ environment
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
      plugins: [],
    },
  },
});
