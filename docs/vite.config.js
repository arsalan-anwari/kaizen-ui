import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwind from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/kaizen-ui/",
  plugins: [tailwind(), svelte()],
  resolve: { alias: { "kaizen-ui": new URL("../src/index.ts", import.meta.url).pathname } }
});
