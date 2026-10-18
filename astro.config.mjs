import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import mdx from "@astrojs/mdx";

export default defineConfig({
  site: "https://devisola.github.io",
  base: "/mtg-history",

  vite: {
    plugins: [tailwindcss()],
    build: {
      // Keep the optional graph renderer modular and cacheable; unlike the
      // old standalone bundle these packages can be split at ESM boundaries.
      rolldownOptions: {
        output: {
          codeSplitting: {
            groups: [
              { name: 'graph-renderer', test: /[/\\]node_modules[/\\]vis-network[/\\]/, maxSize: 320_000, priority: 20 },
              { name: 'graph-data', test: /[/\\]node_modules[/\\]vis-(?:data|util)[/\\]/, maxSize: 260_000, priority: 30 },
              { name: 'graph-interaction', test: /[/\\]node_modules[/\\](?:@egjs[/\\]hammerjs|keycharm)[/\\]/, priority: 25 },
            ],
          },
        },
      },
    },
  },

  integrations: [mdx()],
});