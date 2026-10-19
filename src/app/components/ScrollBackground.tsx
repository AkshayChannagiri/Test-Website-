"use client";

import { useScroll, useTransform } from "framer-motion";
import BackgroundAnimation from "./sections/BackgroundAnimation";
import type { PortfolioData } from "../types/portfolio-data.type";

/**
 * Owns the scroll-linked motion values so the scroll progress itself stays
 * inside a client boundary while `page.tsx` remains a Server Component.
 */
export default function ScrollBackground({
  codeElements,
}: {
  codeElements: PortfolioData["codeElements"];
}) {
  const { scrollYProgress } = useScroll();

  const backgroundX = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 50]);

  return (
    <BackgroundAnimation
      backgroundX={backgroundX}
      backgroundY={backgroundY}
      codeElements={codeElements}
    />
  );
}
