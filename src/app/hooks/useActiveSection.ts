"use client";

import { useState, useEffect } from "react";

interface NavLink {
  label: string;
  section: string;
  navEligibleForDesktop?: boolean;
  navEligibleForMobile?: boolean;
}

/**
 * Tracks which section is currently in view and highlights it in the navbar.
 * Runs in the browser, so it lives behind the client boundary.
 */
export function useActiveSection(navLinks: NavLink[]) {
  const [activeSection, setActiveSection] = useState("about");

  useEffect(() => {
    const sections = navLinks
      .filter((link) => link.navEligibleForDesktop || link.navEligibleForMobile)
      .map((link) => link.section);

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (!element) continue;

        const offsetTop = element.offsetTop;
        const offsetHeight = element.offsetHeight;

        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          setActiveSection(section);
          break;
        }
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navLinks]);

  return activeSection;
}
