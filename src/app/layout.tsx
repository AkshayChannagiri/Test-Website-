import type { Metadata } from "next";
import "./globals.css";
import { primaryFont } from './config/theme';
import { socialMeta } from './lib/socialMeta';
import { SITE_ORIGIN } from './lib/siteUrl';

const SITE_TITLE = "Portfolio";
const SITE_DESCRIPTION = "Personal portfolio website.";

export const metadata: Metadata = {
  // Makes relative metadata URLs (notably og:image) absolute.
  metadataBase: new URL(SITE_ORIGIN),
  // Per-route titles and descriptions come from `generateMetadata`, which reads
  // public/archived/data.json. These are the fallbacks for any route without one.
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  // Routes that set their own `title`/`description` should call socialMeta() too:
  // metadata merges shallowly, so an `openGraph` object from a page replaces this
  // one wholesale rather than merging into it.
  ...socialMeta({ title: SITE_TITLE, description: SITE_DESCRIPTION }),
};

/**
 * Framer Motion renders `initial` state (opacity: 0, translated) into the
 * prerendered HTML and clears it on hydration. Without JavaScript those styles
 * stay applied and the content is invisible, so restore it when scripting is off.
 */
const NO_SCRIPT_STYLES = `<style>[style*="opacity:0"]{opacity:1!important}[style*="translate"]{transform:none!important}</style>`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${primaryFont.variable}`}>
      <body className={`${primaryFont.className} bg-gray-900 text-white`}>
        <noscript dangerouslySetInnerHTML={{ __html: NO_SCRIPT_STYLES }} />
        {children}
      </body>
    </html>
  );
}
