import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";

const PROJECT_ROOT = import.meta.dirname;

// Plugin para copiar arquivos de redirecionamento após o build
function copyRedirectsPlugin(): Plugin {
  return {
    name: "copy-redirects",
    apply: "build",
    writeBundle() {
      const redirectsSource = path.resolve(PROJECT_ROOT, "public/_redirects");
      const redirectsDest = path.resolve(PROJECT_ROOT, "dist/public/_redirects");
      
      if (fs.existsSync(redirectsSource)) {
        fs.copyFileSync(redirectsSource, redirectsDest);
        console.log("✓ Arquivo _redirects copiado para dist/public");
      }
    },
  };
}

const plugins = [react(), tailwindcss(), jsxLocPlugin(), vitePluginManusRuntime(), copyRedirectsPlugin()];

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(PROJECT_ROOT, "src"),
      "@shared": path.resolve(PROJECT_ROOT, "shared"),
      "@assets": path.resolve(PROJECT_ROOT, "attached_assets"),
    },
  },
  envDir: PROJECT_ROOT,
  root: PROJECT_ROOT,
  build: {
    outDir: path.resolve(PROJECT_ROOT, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(PROJECT_ROOT, "index.html"),
    }
  },
  server: {
    port: 3000,
    host: true,
    allowedHosts: ['3000-ih4pftjcrsmrier31b2cm-dab700b6.us2.manus.computer', 'localhost', '127.0.0.1'],
  },
});
