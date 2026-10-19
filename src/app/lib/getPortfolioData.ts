import { readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import type { PortfolioData } from "../types/portfolio-data.type";

const DATA_FILE = path.join(process.cwd(), "public", "archived", "data.json");

async function readFromDisk(): Promise<PortfolioData> {
  const raw = await readFile(DATA_FILE, "utf-8");
  return JSON.parse(raw) as PortfolioData;
}

async function readFromUrl(url: string): Promise<PortfolioData> {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to fetch portfolio data from ${url}: ${response.status}`);
  }
  return (await response.json()) as PortfolioData;
}

/**
 * Loads the portfolio JSON on the server so the markup is prerendered with its
 * content instead of being fetched from the browser after mount.
 *
 * `cache` dedupes the read between `generateMetadata` and the page component,
 * which both need the same data during a single render.
 *
 * Set NEXT_PUBLIC_PORTFOLIO_DATA_URL to load from a remote endpoint instead of
 * the local public/archived/data.json.
 */
export const getPortfolioData = cache(async (): Promise<PortfolioData> => {
  const url = process.env.NEXT_PUBLIC_PORTFOLIO_DATA_URL;

  try {
    return url ? await readFromUrl(url) : await readFromDisk();
  } catch (error) {
    console.error("Error loading portfolio data:", error);
    throw error;
  }
});
