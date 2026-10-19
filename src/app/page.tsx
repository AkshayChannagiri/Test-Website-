import type { Metadata } from "next";
import Script from "next/script";
import React from "react";
import { getPortfolioData } from "./lib/getPortfolioData";
import { assetPath } from "./lib/assetPath";
import type { PortfolioData } from "./types/portfolio-data.type";
import Navbar from "./components/Navbar";
import ScrollBackground from "./components/ScrollBackground";
import VisitTracker from "./components/VisitTracker";
import { AboutSection } from "./components/sections";
import SkillsSection from "./components/sections/SkillsSection";
import PublicationsSection from "./components/sections/PublicationsSection";
import ExperienceSection from "./components/sections/ExperienceSection";
import EducationSection from "./components/sections/EducationSection";
import ProjectsSection from "./components/sections/ProjectsSection";
import AchievementsSection from "./components/sections/AchievementsSection";
import TestimonialsSection from "./components/sections/TestimonialsSection";
import ContactSection from "./components/sections/ContactSection";
import QuoteSection from "./components/sections/QuoteSection";
import FooterSection from "./components/sections/FooterSection";
import CustomSections from "./components/sections/CustomSections";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPortfolioData();

  return {
    title: data.meta.title,
    description: data.meta.description,
    icons: data.meta.favicon ? { icon: assetPath(data.meta.favicon) } : undefined,
    openGraph: {
      title: data.meta.title,
      description: data.meta.description,
      type: "website",
    },
  };
}

export default async function HomePage() {
  const data = await getPortfolioData();

  const sectionsToRender: Array<{ id: string; index: number; element: React.ReactNode }> = [];
  const resolveIndex = (value?: number) =>
    typeof value === "number" ? value : Number.MAX_SAFE_INTEGER;

  const addSection = ({
    enabled,
    id,
    index,
    element,
  }: {
    enabled: boolean;
    id: string;
    index?: number;
    element: React.ReactNode;
  }) => {
    if (!enabled) return;
    sectionsToRender.push({
      id,
      index: resolveIndex(index),
      element,
    });
  };

  addSection({
    enabled: data.intro.enabled,
    id: "about",
    index: data.intro.index,
    element: (
      <AboutSection
        intro={data.intro}
        stats={data.stats}
        socialLinks={data.contact.socialLinks}
        tracking={data.tracking}
      />
    ),
  });

  addSection({
    enabled: data.skills.enabled,
    id: "skills",
    index: data.skills.index,
    element: <SkillsSection skills={data.skills} />,
  });

  addSection({
    enabled: data.publications.enabled,
    id: "publications",
    index: data.publications.index,
    element: <PublicationsSection publications={data.publications} />,
  });

  addSection({
    enabled: data.experience.enabled,
    id: "experience",
    index: data.experience.index,
    element: <ExperienceSection experience={data.experience} />,
  });

  addSection({
    enabled: data.education.enabled,
    id: "education",
    index: data.education.index,
    element: <EducationSection education={data.education} />,
  });

  addSection({
    enabled: data.projects.enabled,
    id: "portfolio",
    index: data.projects.index,
    element: <ProjectsSection projects={data.projects} />,
  });

  addSection({
    enabled: data.achievements.enabled,
    id: "achievements",
    index: data.achievements.index,
    element: <AchievementsSection achievements={data.achievements} />,
  });

  addSection({
    enabled: data.testimonials.enabled,
    id: "testimonials",
    index: data.testimonials.index,
    element: <TestimonialsSection testimonials={data.testimonials} />,
  });

  addSection({
    enabled: data.contact.enabled,
    id: "contact",
    index: data.contact.index,
    element: <ContactSection contact={data.contact} contactForm={data.contactForm} />,
  });

  addSection({
    enabled: data.quote.enabled,
    id: "quote",
    index: data.quote.index,
    element: <QuoteSection quote={data.quote} />,
  });

  data.customSections
    ?.filter((section) => section.enabled)
    .forEach((section) => {
      addSection({
        enabled: section.enabled,
        id: section.id,
        index: section.index,
        element: <CustomSections section={section} />,
      });
    });

  const orderedSections = sectionsToRender.sort((a, b) => a.index - b.index);
  const googleTag = data.tracking?.googleAnalytics;

  return (
    <>
      {/* Google Analytics */}
      {googleTag?.enabled && googleTag.googleTag && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${googleTag.googleTag}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${googleTag.googleTag}');
            `}
          </Script>
        </>
      )}

      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white overflow-x-hidden relative">
        <ScrollBackground codeElements={data.codeElements} />

        {data.header.enabled && (
          <Navbar
            logo={data.header.logo}
            navLinks={data.header.navLinks}
            socialLinks={data.contact.socialLinks}
          />
        )}

        <main className="relative z-10 pt-20 md:pt-24 pb-12 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 max-w-[95%] 2xl:max-w-[1600px] mx-auto w-full">
          <div className="space-y-10 md:space-y-8">
            {orderedSections.map((section) => (
              <React.Fragment key={section.id}>{section.element}</React.Fragment>
            ))}
          </div>
        </main>

        <FooterSection footer={data.footer} />
      </div>

      <VisitTracker tracking={data.tracking} />
    </>
  );
}
