/**
 * Prefixes a root-relative path with the configured basePath.
 *
 * Next.js applies basePath and assetPrefix to the assets it generates itself,
 * but NOT to values you pass through `generateMetadata`. On a GitHub Pages
 * project site the app is served from /<repo>/, so a raw "/favicon.ico" would
 * resolve to the domain root and 404.
 */
export function assetPath(pathname?: string): string | undefined {
  if (!pathname) return undefined;
  // Leave absolute URLs and protocol-relative paths untouched.
  if (!pathname.startsWith("/") || pathname.startsWith("//")) return pathname;

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${basePath}${pathname}`;
}
