"use client";

import { FiPrinter } from "react-icons/fi";

/**
 * Opens the browser print dialog. Paired with the print styles in globals.css,
 * this is how visitors turn the CV into a PDF.
 */
export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#F9F600] to-[#D9F549] px-4 py-2 text-sm font-medium text-gray-900 shadow-lg transition-all hover:opacity-90 hover:shadow-[#E0DC00]/50"
    >
      <FiPrinter className="h-4 w-4" />
      Save as PDF
    </button>
  );
}
