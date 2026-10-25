## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Implementation and release

Follow `docs/implementation-workflow.md`: one branch per complete phase/feature, incremental commits and pushes, and merge only when complete and accepted. Phase 16.4 prepares Cloudflare Workers Builds as the only automated build/deploy system, for main only. Run full strict browser and performance checks locally before merge. Keep current Actions and Pages unchanged until Cloudflare candidate proof and explicit retirement acceptance; do not merge or change live deployment settings without approval. See the implementation workflow for the transition gates.
