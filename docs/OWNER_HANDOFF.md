# JAJD Construction — Overhaul Handoff (June 2026)

Everything below was built, tested, and verified. The site builds clean, has zero console
errors, works on mobile (375px verified), and the Supabase backend was **not** changed.

---

## What changed

### Brand & design
- Complete visual overhaul: "neighborhood contractor" identity — siding, roofing, painting
  front and center, Omaha + all-of-Nebraska local emphasis.
- Hero now shows a residential home (not a commercial high-rise) with BBB A+ / 5-star /
  Thumbtack trust chips and a "family-owned, based in Omaha" badge.
- Every section redesigned but **kept**: portfolio, services, calendar, process, about,
  service areas, testimonials, FAQ, trust section, footer.
- Fake/unverifiable claims removed (made-up policy number, "third-party auditing") and
  replaced with your real story: BBB A+ since 2014, Thumbtack, licensed & insured.
- Testimonials keep the real Google/BBB reviews; fake "2 weeks ago" timestamps removed,
  real platform labels (Google Review / BBB Review) added.

### Scheduling calendar (now functional)
- No more random fake "booked" days. Weekdays show as open, weekends as limited.
- Clicking a date opens the quote form with that **preferred start date attached** —
  it's shown to the visitor and included in the lead email you receive from Formspree
  as `preferred_date`.
- Month navigation is clamped to (current month → December next year) and the old
  state-mutation bug is fixed.

### Bugs fixed
- React hooks-order violation in App.tsx (admin route early-return).
- The site previously depended on the Tailwind CDN script — Tailwind is now properly
  installed and compiled into the build (faster, CSP-safe).
- Removed leftover esm.sh importmap, scroll-snap jank, `#about us` (space) anchor.
- Footer year is now dynamic (was hardcoded © 2024).
- Quote form now actually enforces "max 5 photos" and a 10 MB per-image cap.
- Service cards fall back to a stock image if a DB image URL is broken.
- Missing Supabase env vars no longer white-screen production.

### SEO + AI search
- Full head rewrite: Omaha/Nebraska keyword targeting, Open Graph, Twitter cards,
  geo meta tags, canonical.
- JSON-LD structured data: `HomeAndConstructionBusiness` (NAP, geo, hours, areaServed,
  aggregate rating, full service catalog), `WebSite`, and `FAQPage` (6 questions).
- `public/llms.txt` — structured business summary for AI assistants (ChatGPT, Claude,
  Perplexity); robots.txt explicitly welcomes GPTBot/ClaudeBot/PerplexityBot.
- Updated sitemap.xml; admin stays disallowed in robots.txt.

### Google Analytics (GA4) — ready, needs your ID
- GA4 only loads when `VITE_GA_MEASUREMENT_ID` is set (see "Your to-do list" below).
- Events tracked automatically: `quote_modal_open`, `generate_lead` (with project +
  property type), `phone_click` (header/footer/mobile menu), `calendar_date_selected`,
  `service_card_click`.

### Security hardening
- Security headers added to `vercel.json`: Content-Security-Policy, HSTS,
  X-Frame-Options DENY, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.
- Removed ~11 unused server dependencies (express, helmet, cors, resend, etc.) —
  smaller attack surface; `npm audit` now reports **0 vulnerabilities** (was 7).
- Admin panel code-split: admin JS is no longer shipped to public visitors.
- Reviewed: Supabase RLS policies (public read-only on published content; writes require
  auth) ✔, Zod input validation + HTML stripping on the lead form ✔, anon key only ✔.

---

## NEW: Admin Command Center (`/admin`)

The admin panel is now a full command center with a sidebar:

- **Analytics** — first-party visit tracking with **human vs bot detection**, charted visits
  per day, where visitors come from (referrers), device breakdown (desktop/mobile/tablet),
  bot-detection reasons, and a live feed of interactions: quote forms opened, **leads
  submitted**, phone clicks, and calendar dates picked. Date ranges: 7 / 30 / 90 days.
  This is independent of Google Analytics (works even without a GA ID) and the data lives
  in **your** Supabase — nobody else's.
- **Projects** — same drag-and-drop portfolio manager as before.
- **Services** — same services manager as before.
- **Appearance** — pick any photo from your project gallery and use it as the homepage
  hero background, the About section photo, or the "Ready to start" banner background.
  Changes go live instantly, no redeploy. ("Use default" reverts to stock.)
- **SEO** — edit the page title, meta description, and keywords with live character
  counters and a Google search preview. Saved values override the built-in tags instantly.

**Privacy/security design:** visitors can only *write* their own visit row (RLS
insert-only); only your logged-in admin account can read analytics. Site settings are
public-read (the site needs them) but only you can change them.

### Required: run one SQL file

Open **Supabase → SQL Editor**, paste the contents of **`admin_upgrade_setup.sql`**
(project root), and click Run. That creates the three new tables (`site_visits`,
`site_events`, `site_settings`) with the right security policies. Until you run it, the
new admin tabs show a friendly "not set up yet" notice and the public site just uses
defaults — nothing breaks.

---

## Your to-do list (5–10 minutes)

1. **Google Analytics:** create a GA4 property at analytics.google.com, copy the
   `G-XXXXXXXXXX` measurement ID, then in **Vercel → Project → Settings → Environment
   Variables** add:
   - `VITE_GA_MEASUREMENT_ID` = `G-XXXXXXXXXX`
2. **Confirm these are already set in Vercel** (production env): `VITE_SUPABASE_URL`,
   `VITE_SUPABASE_ANON_KEY`. (They're in your local `.env.development` but Vercel needs
   them too or the portfolio/services sections will be empty in production.)
3. **One Supabase fix** — the "Exterior Painting & Siding" service points at an image
   file that doesn't exist. Run this in **Supabase → SQL Editor**:
   ```sql
   UPDATE services
   SET image_url = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800'
   WHERE image_url IN (
     '/exterior-siding.jpg',
     'https://images.unsplash.com/photo-1605146769289-44011d143da7?auto=format&fit=crop&q=80&w=800'
   );
   ```
   (Or upload your own siding photo in the admin panel instead — even better.)
4. **Social links:** edit `config.ts` → `SOCIALS` with your real Facebook/Instagram URLs
   (they're hidden in the footer until they're real links, so no rush).
5. **Optional but high-value for local SEO:** claim/confirm your Google Business Profile
   and make sure the phone number `(380) 239-5307` and "Omaha, NE" match the site exactly.
6. **Deploy:** push to your Git remote / redeploy on Vercel. After deploy, paste your
   homepage URL into https://search.google.com/test/rich-results to confirm the
   structured data is picked up.

## Heads-up: env files removed from git
`.env.development` and `.env.production` were tracked in version control — they've been
removed from git (still on your disk, nothing breaks locally) and added to `.gitignore`.
This is why step 2 above matters: production reads these values from Vercel's
environment variables, not from files in the repo.

## Notes
- Real photos beat stock photos — replace the Unsplash hero/about images with photos of
  your actual crews and finished jobs whenever you can (admin panel handles portfolio
  images already).
- Local dev: `npm run dev` → http://localhost:3000 (or double-click START_DEV.bat).
- A headless test harness lives at `scripts/verify-site.mjs` (run `node scripts/verify-site.mjs`
  with the dev server running) — it checks the quote modal, calendar flow, mobile layout,
  and console errors, and saves screenshots to `scripts/verify-output/`.
