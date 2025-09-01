import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";

// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? "/angelsfitnessgymm/" : "/", // <-- THIS SHOULD MATCH YOUR REPO NAME!n
  server: {
    host: "::",
    port: 8082,
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
}));