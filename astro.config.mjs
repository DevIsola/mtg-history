import { defineConfig } from "astro/config";

import mdx from "@astrojs/mdx";
import { hostingConfig } from "./config/hosting.mjs";
const hosting = hostingConfig();

export default defineConfig({
  site: hosting.site,
  base: hosting.base,

  vite: {
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

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pt-br'],
    routing: { prefixDefaultLocale: false },
  },

  integrations: [mdx()],
});