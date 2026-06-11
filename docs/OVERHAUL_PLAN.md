# JAJD Construction — Website Overhaul Implementation Plan

**Date:** June 11, 2026
**Goal:** Transform the site from a generic "big construction" template into a modern, trustworthy
neighborhood-contractor website (siding, roofing, painting) for Omaha + all of Nebraska, while
preserving the existing structure and the entire Supabase backend.

---

## What stays (untouched core)

- **Supabase backend:** `projects`, `project_images`, `services` tables; `project-images` and
  `lead-attachments` storage buckets; Supabase Auth for `/admin`. No schema changes required.
- **Admin panel** (`/admin`) and all admin components.
- **Lead pipeline:** QuoteModal → Zod validation → Formspree + Supabase attachment uploads.
- **Page structure:** every existing section remains (Hero, Portfolio, Services, Calendar,
  Process, About, Service Areas, Testimonials, FAQ, Trust/Sources, Footer) — redesigned, not removed.
- Dark mode toggle, exit-intent popup, floating quote CTA (all retained, polished).

## Phase 1 — Foundation
- Remove Tailwind CDN + leftover esm.sh importmap from `index.html` (the Vite/PostCSSbuild already
  provides Tailwind — the CDN double-load hurts performance and CSP).
- Remove janky full-page scroll-snap; replace with normal smooth scrolling.
- Fix App.tsx hooks-order bug (admin early-return before useEffect).
- Brand tokens in Tailwind config (`brand` amber + `navy` slate), Inter font kept, weight 900 added.

## Phase 2 — Section overhauls (neighborhood contractor identity)
- **Hero:** residential home imagery, "Omaha's neighborhood contractor" headline, siding/roofing/
  painting front and center, BBB A+ / Google 5★ / Thumbtack trust chips, zip→quote card kept.
- **Header:** fixed nav with proper anchors (`#portfolio`, `#services`, `#schedule`, `#about`,
  `#reviews`, `#faq`, `#contact`), phone CTA, mobile menu.
- **Services:** still Supabase-driven; modern card grid.
- **Portfolio (RecentWork):** still Supabase-driven; refreshed cards + gallery modal.
- **Process / About / Sources:** honest local trust signals (BBB since 2014, Thumbtack, licensed &
  insured, EPA Lead-Safe); fabricated claims (fake policy #, "third-party auditing") removed.
- **Testimonials:** same reviews & marquee structure, redesigned cards, real platform labels
  (Google/BBB) instead of fake "2 weeks ago" timestamps.
- **Footer:** real contact info, service links, NAP consistency for local SEO, dynamic year.

## Phase 3 — Booking calendar (make it real)
- Deterministic availability (no random fake "booked" days, no state mutation bugs).
- Selecting a day passes the **preferred start date** into the quote form and into the lead
  payload (Formspree receives `preferred_date`). Month navigation clamped: current month → Dec 2026.

## Phase 4 — SEO + AI search (GEO)
- Full `<head>` rewrite: title/meta targeting "siding roofing painting contractor Omaha NE",
  Open Graph, Twitter, geo.* meta, canonical.
- JSON-LD: `HomeAndConstructionBusiness`/LocalBusiness with NAP, geo, areaServed (NE cities),
  aggregateRating from real reviews, OfferCatalog of services + `FAQPage` (kept in FAQ component).
- `public/llms.txt` for AI crawlers (ChatGPT/Claude/Perplexity), updated `sitemap.xml`, `robots.txt`.
- Semantic HTML + descriptive alt text throughout.

## Phase 5 — Google Analytics (GA4)
- `utils/analytics.ts` — GA4 loaded only when `VITE_GA_MEASUREMENT_ID` is set.
- Events: `quote_modal_open`, `lead_submitted`, `phone_click`, `calendar_date_selected`,
  `service_card_click`. Owner just adds the measurement ID to env.

## Phase 6 — Mobile pass
- Verify all sections at 375px; fix touch targets, font scaling, calendar grid, modal scrolling.

## Phase 7 — Security audit + hardening
- `vercel.json` security headers (CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy).
- Supabase: graceful env handling, RLS policy review (documented), keep anon key client-side only.
- Input validation review (Zod schema), file-upload limits enforced (count + size + type).
- Document remaining owner actions (Supabase dashboard settings, Formspree, env vars).

## Phase 8 — Verification + handoff
- `npm run build` passes; browser check desktop + mobile.
- `docs/OWNER_HANDOFF.md`: everything the owner must do (env vars, GA ID, Supabase SQL for the
  broken `/exterior-siding.jpg` service image, Vercel env settings).
