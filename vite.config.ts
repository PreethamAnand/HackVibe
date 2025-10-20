import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  base: "/HackVibe/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/components": path.resolve(__dirname, "./components"),
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/get-counts.php": {
        target: "http://127.0.0.1:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/get-counts\.php$/, "/public/get-counts.php"),
      },
      "/register.php": {
        target: "http://127.0.0.1:8080",
        changeOrigin: true,
      },
      "/public": {
        target: "http://127.0.0.1:8080",
        changeOrigin: true,
      },
    },
    headers: {
      'Cache-Control': 'no-store'
    }
  },
});