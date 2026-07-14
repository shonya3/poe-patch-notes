import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import typedCssModulesPlugin from "vite-plugin-typed-css-modules";
import { devtools } from "@tanstack/devtools-vite";

export default defineConfig({
  server: { port: 3000 },
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tanstackStart({
      server: { entry: "main.ts" },
      router: { routeFileIgnorePattern: "\\.(css|d\\.ts)$" },
    }),
    viteReact(),
    typedCssModulesPlugin(),
  ],
});
