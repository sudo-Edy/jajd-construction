# JAJD Construction — Security Audit

**Date:** June 11, 2026
**Scope:** Front end (React/Vite SPA), back end (Supabase: Postgres + Storage + Auth), hosting (Vercel), lead pipeline (Formspree).

## Summary

The application is in good security shape. The architecture is a static SPA with no custom server, so the attack surface is small. All sensitive operations are gated by Supabase Row Level Security (RLS), and the only key shipped to the browser is the Supabase **publishable/anon** key, which is designed to be public. No real secrets are exposed in the codebase or git history. The items below were fixed during this pass; the remaining owner actions are dashboard settings only.

## What is already solid

- **HTTP security headers** (`vercel.json`): HSTS (2y, preload), `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`, and a tight **Content-Security-Policy** with `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'`, and `form-action` limited to self + Formspree.
- **Row Level Security** is enabled on every table:
  - `projects` / `project_images`: public can only read **published** rows; all writes require `authenticated`.
  - `site_visits` / `site_events`: public is **insert-only** (cannot read other people's analytics); only admins read/delete.
  - `site_settings`: public read (needed for SEO/appearance), admin-only writes.
- **Storage buckets:** `project-images` writes require `authenticated`; `lead-attachments` allows public insert but restricts by file extension and (now) MIME + size.
- **Input validation/sanitization** (`utils/schema.ts`, Zod): ZIP/phone digit-stripping, email normalization, HTML-tag stripping on the free-text description, length caps, and URL validation on attachments.
- **Client upload limits** (`QuoteModal.tsx`): max 5 files, 10 MB each, image types only.
- **Admin auth:** Supabase Auth (`signInWithPassword`); no credentials in code. The `/admin` bundle is reachable (it's a SPA) but performs nothing without a valid session, and RLS enforces this server-side.
- **GA4** loads only when `VITE_GA_MEASUREMENT_ID` is set, with `anonymize_ip`, and does not violate the CSP (no inline script).
- **Secrets:** git history scanned — only placeholder keys (`re_xxxx`, `sk_live_xxx`) in archived docs. The committed `.env.development` contained the Supabase URL + **publishable** key (safe by design). No `service_role` key was ever committed.

## Fixed in this pass

| # | Finding | Severity | Fix |
|---|---------|----------|-----|
| 1 | `lead-attachments` bucket had no server-side size/MIME cap (client checks are bypassable via direct API calls) | Medium | `leads_bucket_setup.sql` now sets `file_size_limit = 5 MB` and `allowed_mime_types = jpeg/png/webp` on the bucket. **Owner must re-run this SQL.** |
| 2 | FAQ JSON-LD injected via `dangerouslySetInnerHTML` (content is static, but a stray `</script>` would break out) | Low | Escape `<` → `<` in the serialized schema. |
| 3 | Debug `console.log`s printed lead file names, sizes, generated public URLs, and the Formspree response to the browser console | Low (info disclosure) | Removed across `api.ts`, `QuoteModal.tsx`, `compression.ts`; kept generic error logs without payloads. |
| 4 | Fabricated testimonial ("Sarah J. • Verified BBB Review") shown inside the quote modal | Low (trust/authenticity) | Replaced with a real BBB review (Richard L.). |

## Remaining owner actions (dashboard only — cannot be done from code)

1. **Re-run `leads_bucket_setup.sql`** in the Supabase SQL Editor so the new 5 MB / image-only bucket limits take effect.
2. **Set environment variables in Vercel** (Project → Settings → Environment Variables): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and optionally `VITE_GA_MEASUREMENT_ID`. Do not rely on committed `.env` files (now untracked).
3. **Confirm Supabase Auth** has only the intended admin user(s) and that email signups are disabled if not needed.
4. *(Optional, hygiene)* The exposed key in git history is the publishable/anon key (safe), so rotation is not required. Rotate only if you want a clean history. If you ever add a `service_role` key, keep it strictly server-side (never in `VITE_*` vars, which ship to the browser).
5. *(Optional)* Delete `docs/archive/` — it contains old Resend/Railway setup notes (placeholder keys only) that no longer apply.
