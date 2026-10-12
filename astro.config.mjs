import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://devisola.github.io",
  base: "/mtg-history",

  vite: {
    plugins: [tailwindcss()],
  },
});
