/**
 * Absolute URL the site is published under, without a trailing slash.
 *
 * Needed for sitemap.xml, robots.txt and Open Graph tags, which all require
 * absolute URLs. The default matches the GitHub Pages project site; override it
 * with NEXT_PUBLIC_SITE_URL when that changes.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://akshaychannagiri.github.io/Test-Website-"
).replace(/\/+$/, "");

/**
 * The same URL without the basePath, for use as `metadataBase`.
 *
 * `metadataBase` must not include the basePath: Next combines it with the URL you
 * supply, so an og:image already prefixed by `assetPath()` would otherwise come out
 * as /<repo>/<repo>/og-image.png. Use this for metadataBase and keep letting
 * `assetPath()` add the basePath to individual paths.
 */
const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/+$/, "");

export const SITE_ORIGIN =
  BASE_PATH && SITE_URL.endsWith(BASE_PATH)
    ? SITE_URL.slice(0, -BASE_PATH.length)
    : SITE_URL;

/** Strips the decorative braces and angle brackets used in the intro copy. */
export function plainText(value?: string): string {
  return (value ?? "").replace(/[{}<>]/g, "").trim();
}
