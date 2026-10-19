import type { Metadata } from "next";
import "./globals.css";
import { primaryFont } from './config/theme';

export const metadata: Metadata = {
  // Per-route titles and descriptions come from `generateMetadata`, which reads
  // public/archived/data.json. These are the fallbacks for any route without one.
  title: "Portfolio",
  description: "Personal portfolio website.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${primaryFont.variable}`}>
      <body className={`${primaryFont.className} bg-gray-900 text-white`}>
        {children}
      </body>
    </html>
  );
}