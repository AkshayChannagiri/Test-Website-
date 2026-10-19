import type { Metadata } from "next";
import { assetPath } from "./assetPath";

/**
 * Builds the Open Graph and Twitter blocks for a route.
 *
 * Next.js merges metadata **shallowly** (see "Merging" in the generate-metadata
 * docs): a route that returns an `openGraph` object replaces the layout's
 * `openGraph` outright rather than merging into it. So every route that wants a
 * social preview must state the whole block, including the image -- declaring it
 * once in the layout is not enough. This helper is that single place.
 */
export function socialMeta({
  title,
  description,
  type = "website",
}: {
  title: string;
  description: string;
  type?: "website" | "profile" | "article";
}): Pick<Metadata, "openGraph" | "twitter"> {
  const image = assetPath("/og-image.png");

  return {
    openGraph: {
      title,
      description,
      type,
      siteName: "Portfolio",
      images: [{ url: image, width: 1200, height: 630, alt: "Portfolio preview" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
