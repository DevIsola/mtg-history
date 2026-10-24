/** Shared by Astro and post-build checks; defaults preserve the published Pages site. */
export function hostingConfig(env = process.env) {
  const url = new URL(env.MTG_SITE_ORIGIN ?? 'https://devisola.github.io');
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password ||
      url.pathname !== '/' || url.search || url.hash) throw new Error('MTG_SITE_ORIGIN must be an HTTP(S) origin without a path');
  const base = env.MTG_SITE_BASE ?? '/mtg-history/';
  if (!/^\/(?:[a-zA-Z0-9_-]+\/)*$/.test(base)) throw new Error('MTG_SITE_BASE must be / or a slash-delimited path ending in /');
  return { site: url.origin, base };
}
