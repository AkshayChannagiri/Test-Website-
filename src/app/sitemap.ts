import type { MetadataRoute } from "next";
import { getPortfolioData } from "./lib/getPortfolioData";
import { SITE_URL } from "./lib/siteUrl";

// Required so `output: "export"` can prerender this route at build time.
export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await getPortfolioData();
  const lastModified = new Date();

  const routes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];

  if (data.cv?.enabled) {
    routes.push({
      url: `${SITE_URL}/cv/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  // Only advertise the publications route when there is content behind it;
  // otherwise it renders the "failed to load" fallback.
  if (data.publications.enabled && data.publications.items.length > 0) {
    routes.push({
      url: `${SITE_URL}/publications/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return routes;
}
