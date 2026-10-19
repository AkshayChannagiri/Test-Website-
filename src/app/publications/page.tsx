import type { Metadata } from "next";
import { getPortfolioData } from "../lib/getPortfolioData";
import { assetPath } from "../lib/assetPath";
import PublicationsView from "./PublicationsView";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPortfolioData();

  return {
    title: `${data.publications.title} | ${data.meta.title}`,
    description: `All ${data.publications.title.toLowerCase()}`,
    icons: data.meta.favicon ? { icon: assetPath(data.meta.favicon) } : undefined,
  };
}

export default async function PublicationsPage() {
  const data = await getPortfolioData();

  if (!data.publications.enabled) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">
          Failed to load publications. Please try again later.
        </div>
      </div>
    );
  }

  return <PublicationsView data={data} />;
}
