"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FiExternalLink, FiFileText, FiArrowLeft } from "react-icons/fi";
import type { PortfolioData } from "../types/portfolio-data.type";
import Navbar from "../components/Navbar";
import ScrollBackground from "../components/ScrollBackground";
import FooterSection from "../components/sections/FooterSection";
import { parseText } from "../utils/textParser";

interface PublicationImageProps {
  image?: string;
  title: string;
}

function PublicationImage({ image, title }: PublicationImageProps) {
  const [imageError, setImageError] = useState(false);

  const showFallback = !image || imageError;

  return (
    <div className="relative w-full md:w-40 h-24 bg-gray-700 rounded-lg overflow-hidden hidden md:block">
      {image && !imageError && (
        <Image
          src={image}
          alt={title}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 192px"
          onError={() => setImageError(true)}
        />
      )}
      {/* Default Article SVG Fallback */}
      {showFallback && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <FiFileText className="w-12 h-12 mx-auto mb-2" />
            <span className="text-xs font-medium"></span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PublicationsView({ data }: { data: PortfolioData }) {
  const publications = data.publications;

  const highlightIndex = publications.title.indexOf(publications.highlight);
  const titleBefore =
    highlightIndex >= 0
      ? publications.title.substring(0, highlightIndex)
      : publications.title;
  const titleAfter =
    highlightIndex >= 0
      ? publications.title.substring(highlightIndex + publications.highlight.length)
      : "";

  return (
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
        {/* Back Button */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#F9F600] hover:text-[#FDFB45] transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-4xl font-bold mb-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {titleBefore}
          {highlightIndex >= 0 && (
            <span className="text-[#F9F600]">{publications.highlight}</span>
          )}
          {titleAfter}
        </motion.h1>

        {/* All Publications */}
        <div className="space-y-5 md:space-y-6">
          {publications.items.map((publication, index) => (
            <motion.div
              key={index}
              className="bg-gray-800/50 rounded-xl p-4 md:p-5 border border-gray-700 hover:border-[#E0DC00] transition-all duration-300 hover:shadow-lg hover:shadow-[#E0DC00]/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex flex-col md:flex-row gap-4 md:gap-5 items-start">
                {/* Image Section - Hidden on mobile */}
                <div className="flex-shrink-0">
                  <PublicationImage
                    image={publication.image}
                    title={publication.title}
                  />
                </div>

                {/* Content Section */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                    <h3 className="text-base md:text-lg font-semibold text-white hover:text-[#F9F600] transition-colors">
                      <a
                        href={publication.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 group"
                      >
                        {publication.title}
                        <FiExternalLink
                          className="w-4 h-4 text-[#FDFB45]"
                          aria-hidden="true"
                        />
                      </a>
                    </h3>
                    <span className="text-xs tracking-wide uppercase text-gray-400 bg-gray-800/80 px-3 py-1 rounded-full hidden md:inline-block border border-gray-700">
                      {publication.type}
                    </span>
                  </div>

                  {/* Description - Hidden on mobile */}
                  <div className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed max-h-24 overflow-hidden mb-2 hidden md:block">
                    {parseText(publication.description)}
                  </div>

                  <div className="flex flex-col gap-1.5 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-wrap gap-2 flex-1 min-w-0">
                      {publication.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="text-xs bg-[#F9F600]/30 text-[#FDFB45] px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-end gap-3 text-xs md:text-sm text-gray-400 flex-shrink-0 whitespace-nowrap">
                      <span>{publication.platform}</span>
                      <span>•</span>
                      <span>{publication.date}</span>
                      {publication.authors && (
                        <>
                          <span>•</span>
                          <span>{publication.authors}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <FooterSection footer={data.footer} />
    </div>
  );
}
