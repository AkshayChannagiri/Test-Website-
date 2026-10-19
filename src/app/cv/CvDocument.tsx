import Link from "next/link";
import type { PortfolioData } from "../types/portfolio-data.type";
import { plainText } from "../lib/siteUrl";
import Navbar from "../components/Navbar";
import PrintButton from "./PrintButton";

const HEADING =
  "mb-4 border-b border-gray-700 pb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#F9F600] print:border-gray-300 print:text-gray-900";

function CvSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className={HEADING}>{title}</h2>
      {children}
    </section>
  );
}

function EntryHeader({
  primary,
  secondary,
  period,
}: {
  primary: string;
  secondary?: string;
  period?: string;
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
      <h3 className="text-base font-semibold text-white print:text-gray-900">{primary}</h3>
      {period ? (
        <span className="text-xs text-gray-400 print:text-gray-600">{period}</span>
      ) : null}
      {secondary ? (
        <p className="w-full text-sm text-gray-300 print:text-gray-700">{secondary}</p>
      ) : null}
    </div>
  );
}

export default function CvDocument({ data }: { data: PortfolioData }) {
  const cv = data.cv;
  const heading = cv?.heading ?? "Curriculum Vitae";
  const name = cv?.name ?? data.meta.title.split(/\s*[-|]\s*/)[0];
  const headline = plainText(cv?.headline ?? data.intro.professional);
  const summary = (cv?.summary ?? data.intro.description ?? "").trim();

  const { experience, education, skills, projects, achievements, publications, contact } = data;

  // Page links only — the section anchors on the homepage do not exist here.
  const pageLinks = [
    { label: "Home", section: "home", href: "/", navEligibleForDesktop: true, navEligibleForMobile: true },
    ...data.header.navLinks.filter((link) => Boolean(link.href)),
  ];

  const contactLine = [contact.email, contact.location].filter((value) => Boolean(value?.trim()));
  const cvLinks = [
    ...contact.socialLinks.map((link) => ({ label: link.name, url: link.url })),
    ...(cv?.links ?? []).map((link) => ({ label: link.label, url: link.url })),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white print:bg-none print:bg-white print:text-gray-800">
      {cv?.placeholder ? (
        <div className="no-print border-b border-amber-500/40 bg-amber-500/10 px-4 py-2 text-center text-xs text-amber-200">
          Draft CV — the entries below are placeholder content. Replace them in{" "}
          <code className="font-mono">public/archived/data.json</code> and set{" "}
          <code className="font-mono">cv.placeholder</code> to <code className="font-mono">false</code>.
        </div>
      ) : null}

      {data.header.enabled && (
        <div className="no-print">
          <Navbar
            logo={data.header.logo}
            logoHref="/"
            navLinks={pageLinks}
            socialLinks={contact.socialLinks}
          />
        </div>
      )}

      <main className="mx-auto w-full max-w-3xl px-4 pb-16 pt-20 sm:px-6 md:pt-24 print:max-w-none print:px-0 print:pt-0">
        {/* Header */}
        <header className="break-inside-avoid">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white sm:text-4xl print:text-gray-900">
                {name}
              </h1>
              {headline ? (
                <p className="mt-1 text-lg text-[#F9F600] print:text-gray-800">{headline}</p>
              ) : null}
            </div>
            <PrintButton />
          </div>

          {contactLine.length > 0 || cvLinks.length > 0 ? (
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-300 print:text-gray-700">
              {contactLine.map((value) => (
                <span key={value}>{value}</span>
              ))}
              {cvLinks.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 underline decoration-gray-600 underline-offset-4 transition-colors hover:text-[#F9F600] print:text-gray-700"
                >
                  {link.label}
                </a>
              ))}
            </div>
          ) : null}
        </header>

        <CvSection title="Profile">
          <p className="text-sm leading-relaxed text-gray-300 print:text-gray-700">
            {summary || (
              <span className="text-gray-500 print:text-gray-500">
                Add cv.summary (or intro.description) to public/archived/data.json.
              </span>
            )}
          </p>
        </CvSection>

        {experience.enabled && experience.items.length > 0 ? (
          <CvSection title="Experience">
            <div className="space-y-6">
              {experience.items.map((item, index) => (
                <article key={item.id ?? index} className="break-inside-avoid">
                  <EntryHeader
                    primary={item.title}
                    secondary={[item.company, item.location].filter(Boolean).join(" · ")}
                    period={item.period}
                  />
                  {item.description.length > 0 ? (
                    <ul className="mt-2 space-y-1 text-sm leading-relaxed text-gray-300 print:text-gray-700">
                      {item.description.map((line, lineIndex) => (
                        <li key={lineIndex} className="flex gap-2">
                          <span className="text-[#F9F600] print:text-gray-500">•</span>
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {item.tags.length > 0 ? (
                    <p className="mt-2 text-xs text-gray-400 print:text-gray-600">
                      {item.tags.join(" · ")}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          </CvSection>
        ) : null}

        {education.enabled && education.items.length > 0 ? (
          <CvSection title="Education">
            <div className="space-y-5">
              {education.items.map((item, index) => (
                <article key={index} className="break-inside-avoid">
                  <EntryHeader
                    primary={[item.degree, item.stream].filter(Boolean).join(", ")}
                    secondary={[item.institute, item.location].filter(Boolean).join(" · ")}
                    period={item.duration}
                  />
                  {item.result ? (
                    <p className="mt-1 text-sm text-gray-400 print:text-gray-600">{item.result}</p>
                  ) : null}
                </article>
              ))}
            </div>
          </CvSection>
        ) : null}

        {skills.enabled && skills.categories.length > 0 ? (
          <CvSection title="Skills">
            <dl className="space-y-2">
              {skills.categories.map((category) => (
                <div key={category.name} className="break-inside-avoid text-sm sm:flex sm:gap-4">
                  <dt className="w-44 flex-shrink-0 font-medium text-gray-200 print:text-gray-900">
                    {category.name}
                  </dt>
                  <dd className="text-gray-300 print:text-gray-700">
                    {category.items.join(", ")}
                  </dd>
                </div>
              ))}
            </dl>
          </CvSection>
        ) : null}

        {projects.enabled && projects.items.length > 0 ? (
          <CvSection title="Projects">
            <div className="space-y-5">
              {projects.items.map((item, index) => (
                <article key={index} className="break-inside-avoid">
                  <EntryHeader
                    primary={item.title}
                    secondary={item.type || undefined}
                  />
                  {item.description ? (
                    <p className="mt-1 text-sm leading-relaxed text-gray-300 print:text-gray-700">
                      {item.description}
                    </p>
                  ) : null}
                  {item.technologies.length > 0 ? (
                    <p className="mt-1 text-xs text-gray-400 print:text-gray-600">
                      {item.technologies.join(" · ")}
                    </p>
                  ) : null}
                  {item.githubLink ? (
                    <a
                      href={item.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block text-xs text-[#F9F600] underline decoration-gray-600 underline-offset-4 hover:text-[#FDFB45] print:text-gray-700"
                    >
                      {item.githubLink.replace(/^https?:\/\//, "")}
                    </a>
                  ) : null}
                </article>
              ))}
            </div>
          </CvSection>
        ) : null}

        {achievements.enabled && achievements.certifications.length > 0 ? (
          <CvSection title="Certifications">
            <ul className="space-y-2">
              {achievements.certifications.map((cert, index) => (
                <li key={index} className="break-inside-avoid text-sm text-gray-300 print:text-gray-700">
                  <span className="font-medium text-gray-200 print:text-gray-900">{cert.name}</span>
                  {cert.issuer ? <span> — {cert.issuer}</span> : null}
                  {cert.url ? (
                    <>
                      {" "}
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#F9F600] underline decoration-gray-600 underline-offset-4 print:text-gray-700"
                      >
                        verify
                      </a>
                    </>
                  ) : null}
                </li>
              ))}
            </ul>
          </CvSection>
        ) : null}

        {publications.enabled && publications.items.length > 0 ? (
          <CvSection title="Publications">
            <ul className="space-y-4">
              {publications.items.map((item, index) => (
                <li key={index} className="break-inside-avoid">
                  <EntryHeader
                    primary={item.title}
                    secondary={[item.platform, item.date, item.authors].filter(Boolean).join(" · ")}
                  />
                  {item.description ? (
                    <p className="mt-1 text-sm leading-relaxed text-gray-300 print:text-gray-700">
                      {item.description}
                    </p>
                  ) : null}
                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block text-xs text-[#F9F600] underline decoration-gray-600 underline-offset-4 print:text-gray-700"
                    >
                      {item.url.replace(/^https?:\/\//, "")}
                    </a>
                  ) : null}
                </li>
              ))}
            </ul>
          </CvSection>
        ) : null}

        <footer className="no-print mt-12 border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
          <Link href="/" className="transition-colors hover:text-[#F9F600]">
            ← Back to portfolio
          </Link>
        </footer>
      </main>
    </div>
  );
}
