import type { Metadata } from "next";
import { getPortfolioData } from "../lib/getPortfolioData";
import { assetPath } from "../lib/assetPath";
import { socialMeta } from "../lib/socialMeta";
import CvDocument from "./CvDocument";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPortfolioData();
  const heading = data.cv?.heading ?? "Curriculum Vitae";
  const name = data.cv?.name ?? data.meta.title.split(/\s*[-|]\s*/)[0];
  const title = `${name} — ${heading}`;
  const description = data.cv?.summary?.trim() || data.meta.description;

  return {
    title,
    description,
    icons: data.meta.favicon ? { icon: assetPath(data.meta.favicon) } : undefined,
    ...socialMeta({ title, description, type: "profile" }),
  };
}

export default async function CvPage() {
  const data = await getPortfolioData();

  return <CvDocument data={data} />;
}
