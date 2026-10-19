"use client";

import { motion } from "framer-motion";
import type { PortfolioData } from "../../types/portfolio-data.type";
import { ProjectCarousel } from "../ProjectCarousel";

interface ProjectsSectionProps {
  projects: PortfolioData["projects"];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  if (!projects.enabled) return null;

  return (
    <section id="portfolio" className="py-12">
      <motion.h2
        className="text-2xl sm:text-3xl font-bold mb-6 md:mb-10 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        {projects.title.split(projects.highlight)[0]}
        <span className="text-[#F9F600]"> {projects.highlight}</span>
      </motion.h2>

      <div className="relative">
        <ProjectCarousel projects={projects.items} />
      </div>
    </section>
  );
} 