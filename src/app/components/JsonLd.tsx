import type { PortfolioData } from "../types/portfolio-data.type";
import { plainText, SITE_URL } from "../lib/siteUrl";

/**
 * Person structured data. Helps search engines associate the name, role and
 * profile links with one entity instead of inferring it from page copy.
 */
export default function JsonLd({ data }: { data: PortfolioData }) {
  const name = data.cv?.name ?? data.meta.title.split(/\s*[-|]\s*/)[0];
  const jobTitle = plainText(data.cv?.headline ?? data.intro.professional);
  const sameAs = [
    ...data.contact.socialLinks.map((link) => link.url),
    ...(data.cv?.links ?? []).map((link) => link.url),
  ].filter(Boolean);

  const knowsAbout = data.skills.enabled
    ? Array.from(new Set(data.skills.categories.flatMap((category) => category.items)))
    : [];

  const person: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    url: SITE_URL,
  };

  if (jobTitle) person.jobTitle = jobTitle;
  if (data.meta.description) person.description = data.meta.description;
  if (sameAs.length > 0) person.sameAs = sameAs;
  if (knowsAbout.length > 0) person.knowsAbout = knowsAbout;
  if (data.contact.email) person.email = data.contact.email;

  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is escaped for the closing-tag case below.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(person).replace(/</g, "\\u003c"),
      }}
    />
  );
}
