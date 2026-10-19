import type { MetadataRoute } from "next";
import { SITE_URL } from "./lib/siteUrl";

// Required so `output: "export"` can prerender this route at build time.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
