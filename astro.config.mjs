import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import mdx from "@astrojs/mdx";

export default defineConfig({
  site: "https://devisola.github.io",
  base: "/mtg-history",

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [mdx()],
});