# Project Architecture & Structure

This document explains the architecture and structure of the Portfolio website, built with Next.js, TypeScript, and Tailwind CSS. It is designed for easy onboarding, maintainability, and future releases.

---

## 1. High-Level Overview

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State/Effects:** React hooks
- **Deployment:** GitHub Pages (static export)
- **Rendering:** Server Components, prerendered at build time

---

## 2. Directory Structure

```
json-folio/
├── public/                  # Static assets (images, resume, etc.)
│   ├── archived/data.json   # All portfolio content
│   └── og-image.png         # Social preview image (see scripts/make-og-image.py)
├── src/
│   └── app/
│       ├── components/
│       │   ├── sections/    # Homepage sections (About, Skills, Projects, ...)
│       │   ├── Navbar.tsx   # Top navigation bar
│       │   ├── Loading.tsx  # Loader used by PublicationsSection
│       │   ├── ScrollBackground.tsx  # Client boundary for scroll animation
│       │   ├── VisitTracker.tsx      # Client boundary for analytics
│       │   ├── JsonLd.tsx            # Person structured data
│       │   ├── ContactForm.tsx
│       │   ├── ProjectCarousel.tsx
│       │   ├── ExperienceTimeline.tsx
│       ├── config/          # Theme and configuration files
│       ├── cv/              # The /cv route (see section 5)
│       ├── functions/       # Utility functions (analytics, effects, etc.)
│       ├── hooks/           # Custom React hooks
│       ├── lib/             # Server-side data loading and URL helpers
│       ├── publications/    # The /publications route
│       ├── types/           # TypeScript type definitions
│       ├── utils/           # Utility helpers (icons, text parsing)
│       ├── globals.css      # Global + print styles
│       ├── layout.tsx       # App layout
│       ├── page.tsx         # Home page
│       ├── sitemap.ts       # Generated sitemap.xml
│       └── robots.ts        # Generated robots.txt
├── scripts/
│   └── make-og-image.py     # Regenerates public/og-image.png (Pillow, run manually)
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── projectArchitecture.md   # (This file)
```

---

## 3. Key Architectural Concepts

### a. Data loading

All content lives in `public/archived/data.json`. It is read **on the server** by
`src/app/lib/getPortfolioData.ts` using `fs`, not fetched from the browser.

`getPortfolioData` is wrapped in React's `cache()`, so `generateMetadata` and the page
component share a single read per render. Set `NEXT_PUBLIC_PORTFOLIO_DATA_URL` to load
from a remote endpoint instead.

### b. Server vs Client Components

The pages (`page.tsx`, `cv/page.tsx`, `publications/page.tsx`) are **Server Components**.
They load data and render the structure, so the page content is present in the
prerendered HTML and is visible to crawlers and to visitors without JavaScript.

The sections are **Client Components** (`"use client"`) because they animate with
Framer Motion. They still render to HTML on the server — being a Client Component only
means the code also runs in the browser.

**Why the sections are not Server Components:** Framer Motion's `motion.*` elements
cannot be invoked from a Server Component. Doing so throws
`Attempted to call createMotionComponent() from the server`. Converting a section to a
Server Component therefore means removing its animations. Keep the animated markup in
Client Components and pass data down from the server.

Do **not** reintroduce `next/dynamic` with `{ ssr: false }`. It opts a component out of
server rendering, which is what previously made the site's content invisible to crawlers.

### c. Client boundaries

Interactivity is isolated in small Client Components so the rest of the tree stays on
the server:

| Component | Why it needs the client |
| --- | --- |
| `Navbar` | Menu state, scroll state, active-section tracking |
| `ScrollBackground` | Owns `useScroll`/`useTransform` motion values |
| `VisitTracker` | Reads `sessionStorage`, fires the tracking ping |
| `PrintButton` (cv) | Calls `window.print()` |

### d. Type Safety

All data structures and props are typed in `src/app/types/portfolio-data.type.ts`.
Update that file when the shape of `data.json` changes.

### e. Styling

Tailwind CSS. Global styles and the print rules are in `globals.css`.

### f. Static Assets

Images and static files live in `public/`. Because the site is a statically exported
GitHub Pages project site, `next/image` runs with `unoptimized: true`.

### g. Metadata and SEO

- `generateMetadata` on each route supplies title, description and favicon.
- `sitemap.ts` and `robots.ts` generate the SEO files at build time.
- `socialMeta()` in `lib/socialMeta.ts` builds the Open Graph and Twitter tags.
- `JsonLd.tsx` emits `Person` structured data on the home page.
- `NEXT_PUBLIC_SITE_URL` (see `lib/siteUrl.ts`) provides the absolute origin these need.

> **Note:** metadata is merged **shallowly** across segments, so a route that returns
> its own `openGraph` object *replaces* the layout's rather than merging into it. Build
> social tags with `socialMeta()` on every route that sets its own title, or the image
> and site name silently disappear.

> **Note:** `NEXT_PUBLIC_SITE_URL` includes the basePath (`SITE_URL`), because sitemap
> URLs need the full path. `metadataBase` must use `SITE_ORIGIN` instead — Next combines
> metadataBase with the supplied path, so including the basePath in both places yields
> `/repo/repo/...`.

> **Note:** Next.js applies `basePath` to assets it generates, but **not** to values
> returned from `generateMetadata`. Use `assetPath()` from `lib/assetPath.ts` for any
> root-relative path you pass into metadata.

> **Note:** `og-image.png` is a committed file, not a generated `opengraph-image` route.
> A static export writes that route with no file extension, and GitHub Pages then serves
> it as `application/octet-stream`, which social crawlers reject. Regenerate the PNG by
> hand with `python scripts/make-og-image.py` after editing the name or headline.

---

## 4. Adding or Modifying Sections

1. Add a new file in `src/app/components/sections/` and export it as default.
2. Start it with `"use client"` if it uses hooks or Framer Motion.
3. Add an export to `src/app/components/sections/index.ts` if needed.
4. Import it normally in `page.tsx` and register it with `addSection({ enabled, id, index, element })`.
5. Extend `portfolio-data.type.ts` and `data.json` for any new data.

---

## 5. The CV Route

`/cv` produces a print-ready CV from the same `data.json`.

- `cv/page.tsx` — Server Component; loads data and builds metadata.
- `cv/CvDocument.tsx` — Server Component rendering the CV; no Framer Motion, so it needs
  no client JavaScript and prints reliably.
- `cv/PrintButton.tsx` — the only Client Component; opens the browser print dialog.

Print behaviour is defined in `globals.css`: `@page` sets A4 with 14 mm margins, the
dark theme is forced to black-on-white, and anything marked `.no-print` (navbar, buttons,
banners, footer) is hidden.

Content comes from `experience`, `education`, `skills`, `projects`,
`achievements.certifications` and `publications`. Blocks with `enabled: false` or an empty
array render nothing.

Set `cv.placeholder` to `true` while the content is still draft: a banner is then shown in
the browser (never in print) so placeholder copy cannot ship unnoticed. Set it to `false`
once the real content is in.

Branding for the CV comes from `cv.name`, `cv.headline` and `cv.summary`, each of which
falls back to `meta.title`, `intro.professional` and `intro.description`.

---

## 6. Best Practices for Future Releases

- Keep pages as Server Components; push `"use client"` down to the smallest component that
  needs it.
- Never use `next/dynamic` with `{ ssr: false }`.
- Keep all types in `types/` and all server-side data access in `lib/`.
- Use `assetPath()` for root-relative paths in metadata.
- Run `npm run build` with `NEXT_PUBLIC_STATIC_EXPORT=true` before pushing; that is what
  CI does.
- Test print output for `/cv` after changing its layout.

---

## 7. Release Checklist

- [ ] New pages are Server Components with `generateMetadata`
- [ ] New interactivity is isolated in a small Client Component
- [ ] No `next/dynamic` with `{ ssr: false }` anywhere
- [ ] Types updated for any new `data.json` fields
- [ ] `npm run build` passes with `NEXT_PUBLIC_STATIC_EXPORT=true`
- [ ] Exported HTML in `out/` contains the expected page text
- [ ] `/cv` prints cleanly to A4
- [ ] `README.md` and `projectArchitecture.md` updated as needed

---

**This architecture ensures the project is scalable, maintainable, and high-performing for future releases.**
