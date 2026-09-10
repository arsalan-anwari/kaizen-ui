import { readFileSync } from "node:fs";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwind from "@tailwindcss/vite";
import { defineConfig } from "vite";

const splash = {
  name: "inline-splash-css",
  transformIndexHtml: (html) =>
    html.replace(
      "</head>",
      `<style>${readFileSync(new URL("../src/splash.css", import.meta.url), "utf8")}</style></head>`
    )
};

export default defineConfig({
  base: "/kaizen-ui/",
  plugins: [tailwind(), svelte(), splash],
  resolve: { alias: { "kaizen-ui": new URL("../src/index.ts", import.meta.url).pathname } }
});
