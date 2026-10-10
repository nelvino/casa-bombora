# Casa Bombora Villas — Booking App TODO / Roadmap

A living document for the `apps/villas` booking microsite. Update it after each new feature is shipped.

## 1. Project overview

- **Live URL:** `https://stay.casabombora.com`
- **Repo:** `apps/villas` inside the Casa Bombora monorepo
- **Goal:** A direct-booking site for two private villas in Uluwatu, Bali (Villa Teduh and Villa Langit), with availability, holds, payments, and an admin dashboard.
- **Why:** Avoid third-party platform fees, own the guest relationship, and keep the booking flow simple and on-brand.

## 2. Tech stack

- **Framework:** Next.js 14 App Router
- **Styling:** Tailwind CSS + custom color tokens (`gunmetal`, `blue-green`, `lion`, `alabaster`, etc.)
- **Database:** Supabase PostgreSQL + Prisma ORM
- **Auth:** `iron-session` admin login (`ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`), brute-force throttled. Long-term plan: Supabase Auth + Google provider with roles.
- **Payments:** Pluggable providers — Xendit (IDR invoices, preferred for the PT PMA), Stripe, and a demo fallback. `PAYMENT_PROVIDER` env picks one explicitly; otherwise auto-detects from which keys are set (Xendit > Stripe > demo). `PAYMENTS_ENABLED=true` turns the online "Pay now" step on; when off, guests get an email/WhatsApp enquiry flow with a 72-hour hold.
- **Email:** Resend (branded templates) — enquiry alerts to admin, guest confirmations, cancellations, hold-release notices, and operational alerts.
- **Currency:** All prices are stored and charged in **IDR** (Indonesian law requires local-currency pricing). The UI shows IDR as the primary price with an approximate USD/AUD conversion via a header switcher (live rates from frankfurter.app with static fallbacks).
- **Tests:** Vitest — 102 tests across 12 files (`npm test`)
- **Hosting:** Netlify (separate site from the main `casabombora.com` site)

## 3. What is already done

### Core product

- Scaffolding, tooling, and port setup (`dev` on `3001`, root shortcuts `dev:villas` / `build:villas`)
- Prisma schema: `Villa`, `Booking`, `Hold`, `BlockedDate`, `PromoCode`
- Database migrated in Supabase
- Core booking logic (availability, holds, price calculation, discounts) with unit tests
- Payment provider abstraction: Xendit + Stripe + demo fallback, auto-detection
- Unified webhook handler (Xendit `x-callback-token`, Stripe `stripe-signature`, demo ack)
- Booking calendar UI and two-column booking page
- Villa detail pages with hero image, gallery, amenities, house rules, FAQ
- Request-to-book mode via `PAYMENTS_ENABLED` (enquiry flow + 72h holds when off)
- Booking availability checks confirmed/pending `Booking` records, unexpired `Hold` records, and `BlockedDate` rows
- IDR canonical pricing + USD/AUD display switcher (live rates via frankfurter.app, static fallbacks)
- Header/footer with mobile hamburger menu (scroll-aware transparent → pill nav)
- Responsive design aligned with the Casa Bombora brand; self-hosted variable fonts (`next/font/local` — no build-time Google Fonts fetch)
- Image optimization: Next.js image optimization (Netlify Image CDN), WebP, blur placeholders
- Scroll-triggered reveal animations, testimonials + Uluwatu location sections, availability hint on villa cards
- Currency switcher component; WhatsApp contact links with prefilled messages

### Email (Resend)

- Branded templates — real palette (gunmetal header `#1D2632`, blue-green links `#009CBC`, alabaster `#EEEAE0`), serif "CASA BOMBORA" wordmark
- Guest: booking-request received, booking confirmed, booking cancelled, hold declined
- Admin: new-enquiry alert with all guest/dates/total details
- `sendEmail` never throws; one automatic retry on transient/5xx failures
- `alertAdmin()` — operational alert emails on critical failures: enquiry submission failed (includes guest details for manual recovery), payment hold lookup failed, payment session failed, **payment received but conversion failed**
- Error text is DB-URL-redacted and HTML-escaped before mailing
- Admin "Send test email" button → green/red banner result

### Admin portal

- `iron-session` login with brute-force throttle (1-week cookie)
- Dashboard stats: upcoming stays, active enquiries, upcoming revenue, villas live
- Bookings table: confirm, mark paid, cancel — all behind `ConfirmButton` dialogs
- Holds table: convert to booking, release (emails guest a polite decline when guest details exist)
- Expired holds display as EXPIRED; active unexpired holds sort first
- Manual booking entry ("Already paid" checkbox; availability re-checked; guest confirmation email)
- Blocked-date range management with confirm dialogs
- Error/success banners via `?error=`/`?notice=` (no error-boundary dumps)
- Empty states on all tables
- `noindex, nofollow` on `/admin`

### SEO / marketing

- Metadata, Open Graph + Twitter cards with generated 1200×630 JPG images (`og-cover`, `og-teduh`, `og-langit`)
- JSON-LD: `VacationRental` + `FAQPage` + `BreadcrumbList` per villa; `LodgingBusiness` on home (with `telephone`); `Article` + `BreadcrumbList` per guide
- `sitemap.xml` — 10 URLs (home, 2 villas, guide index, 6 articles)
- `robots.txt` — `Disallow: /` while `SITE_LIVE != 'true'`; when live allows all except `/admin`, `/api/`, booking pages, coming-soon
- Canonical URLs, web manifest, `icon.svg` + `apple-icon.png`
- Descriptive filename-derived image alt text
- Internal linking: header nav, footer villa/guide links, location-section guide CTA
- `/guide` section — 6 researched Uluwatu articles (temple, surf, cafés, gyms, nightlife, getting around), each ending with a villas CTA

### Infrastructure / ops

- Live deploy on Netlify at `https://stay.casabombora.com` (`@netlify/plugin-nextjs`)
- Coming-soon gate via `SITE_LIVE` (middleware rewrite; `/api/*` excluded)
- Daily keep-alive: Netlify scheduled function → `GET /api/keep-alive` → `prisma.villa.count()` keeps Supabase free tier from pausing; optional `CRON_SECRET` header
- Security headers via `netlify.toml` (X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy, HSTS)
- Netlify secrets scanning: `SECRETS_SCAN_OMIT_KEYS` for public-by-design vars; omit paths for generated dirs (also set `SECRETS_SCAN_OMIT_PATHS` as a UI env var — netlify.toml env block doesn't reach the scanner)
- `npm run test:ci` runs type check, tests, and production build

## 4. How the app works today

### Guest booking flow

1. Guest browses the home page and clicks a villa.
2. Villa detail page shows photos, description, and a sticky “Book now” card (plus a sticky mobile book bar and a WhatsApp contact link).
3. Booking page shows a calendar, date pickers, guest info, and promo code.
4. Guest clicks **Hold dates** (labelled “Request these dates” when payments are off). A hold is created in the database and the calendar updates.
5. Next step depends on `PAYMENTS_ENABLED`:
   - `PAYMENTS_ENABLED=true`: guest clicks **Pay now** → Xendit/Stripe checkout depending on configured keys, otherwise the demo payment page. Hold lasts 15 minutes.
   - `PAYMENTS_ENABLED` unset/false (current live mode): guest is shown a **contact enquiry** panel with prefilled email (`info@casabombora.com`) and WhatsApp buttons containing villa, dates, total, guest details, and hold reference. Hold lasts **72 hours** so the team can confirm and arrange payment manually. The hold still appears in the admin dashboard.
6. On successful payment webhook, the hold is converted into a booking with status `PENDING`.

### Admin flow

1. Visit `/admin`.
2. Log in with username/password from `ADMIN_USERNAME` / `ADMIN_PASSWORD`.
3. An encrypted `iron-session` cookie is set and an **Admin** link appears in the nav/footer.
4. Dashboard shows stats, bookings, holds, blocked dates, and the manual-booking form; action buttons ask for confirmation.
5. **Sign out** destroys the cookie.

### Environment variables

**Secrets (mark 🔒 in Netlify):**

```env
DATABASE_URL=
DIRECT_URL=
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
RESEND_API_KEY=
CRON_SECRET=              # optional — protects /api/keep-alive
SUPABASE_SERVICE_ROLE_KEY= # only needed if Supabase REST/Storage is used; app uses Prisma
XENDIT_SECRET_KEY=         # only when payments go live
XENDIT_CALLBACK_TOKEN=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

**Non-secret (plain config):**

```env
ADMIN_USERNAME=
ADMIN_EMAIL=
EMAIL_FROM=Casa Bombora <bookings@casabombora.com>
NEXT_PUBLIC_BASE_URL=https://stay.casabombora.com
NEXT_PUBLIC_SUPABASE_URL=
SITE_LIVE=true           # set false to gate the site behind coming-soon
PAYMENTS_ENABLED=        # unset/false = enquiry mode; true = online payment step
PAYMENT_PROVIDER=        # optional override: xendit | stripe | demo
SECRETS_SCAN_OMIT_PATHS=.netlify/**,**/node_modules/**,**/.next/**
```

### Coming-soon mode

- Controlled by the `SITE_LIVE` environment variable.
- Set `SITE_LIVE=false` in Netlify to show the branded coming-soon page to public visitors. API routes, static assets, and `/coming-soon` itself are excluded.
- Changing `SITE_LIVE` requires a redeploy — it is baked into middleware and robots at build time.

## 5. What is missing / roadmap

### Phase 1 — Launch blockers (do first)

- [x] Deploy `stay.casabombora.com` on Netlify and configure DNS / CNAME.
- [x] Set all production environment variables in Netlify.
- [ ] **Replace shared render photos with real Villa Teduh and Villa Langit photos** — current sets are byte-identical renders duplicated across both villas.
- [ ] **Replace placeholder testimonials with real guest quotes** — current ones are softened placeholders; do not launch with invented reviews.
- [ ] **Fact-check the 6 guides before going live** — venues/hours change; verify names, locations, and opening details are still accurate.
- [ ] Flip `SITE_LIVE=true` in Netlify + trigger a deploy.
- [ ] Create a Xendit account for PT PMA Casa Bombora (docs needed: NIB, corporate NPWP, Akta Pendirian + SK Kemenkumham, director ID, Permata bank account in the company name). Verification ~14 working days.
- [ ] Set `XENDIT_SECRET_KEY`, `XENDIT_CALLBACK_TOKEN`, and `PAYMENTS_ENABLED=true` in Netlify; register the webhook URL `https://stay.casabombora.com/api/webhooks/payment` in the Xendit dashboard.
- [ ] Verify webhook endpoint and payment success flow in production.
- [ ] (Optional later) Stripe Indonesia is invite-only ("Preview") — keep `stripe.ts` for when/if that opens up.

### Phase 2 — Post-launch visibility

- [ ] Google Search Console + Bing Webmaster Tools: submit sitemap.
- [ ] Google Business Profile for Casa Bombora Villas (map-pack visibility).
- [ ] Validate JSON-LD in Google's Rich Results Test.
- [ ] External uptime monitor (e.g. UptimeRobot free) on `/api/keep-alive` — covers "site or DB down" independent of our stack; Resend itself being down can't email us, so this is the real outage alert.
- [ ] Add analytics (Plausible / Fathom / GA4).
- [ ] Error monitoring (Sentry) — partially covered by `alertAdmin` emails already.

### Phase 3 — Admin power tools

- [ ] Booking detail view (full guest info, history, notes field — needs schema column).
- [ ] Search/filter on bookings and holds tables.
- [ ] Calendar view — month grid of booked/blocked/held nights per villa.
- [ ] Audit log of admin actions (confirm/cancel/release).
- [ ] Email log (sent/failed per booking).
- [ ] Promo code creation/management UI (validation logic already exists).
- [ ] Export bookings to CSV.
- [ ] iCal two-way sync with Airbnb / Booking.com — **needed before listing on other platforms** to prevent double bookings.
- [ ] Occupancy / revenue charts.

### Phase 4 — Guest auth and accounts

- [ ] Supabase Auth + Google provider; `profiles`/`roles` table for guest/admin.
- [ ] Guest dashboard (`/my-bookings`): upcoming/past stays, status, payment, "contact host" WhatsApp button.
- [ ] Guest change/cancel requests with admin approval.

### Phase 5 — Growth and polish

- [ ] Collect guest reviews after checkout (feeds real testimonials + `AggregateRating` schema — only with genuine reviews).
- [ ] A/B test copy and pricing presentation.
- [ ] "Instant book" vs "request to book" modes per villa.

## 6. Known limitations right now

- Photos are still the shared renders (byte-identical across both villas).
- Testimonials are softened placeholders, not real guest quotes.
- The admin login is a single username/password with `iron-session`. It works and is throttled, but it will be replaced by Google auth + roles.
- No iCal sync; double-booking protection relies on DB holds/bookings/blocked dates — fine while we only take direct enquiries.
- **Race condition:** two guests holding identical dates in the same second both succeed (app-level check, not DB-enforced). Near-zero at 2-villa volume; `convertHold` re-checks availability anyway.
- Guest cannot yet view or manage their own booking without an admin link.
- If Resend itself is down, alert emails can't arrive — external uptime monitor covers site/DB outages (see Phase 2).

## 7. Notes for future developers

- Keep all changes inside `apps/villas`. The main `casabombora.com` site is separate.
- Run `npm run test:ci` before committing or deploying.
- Do not commit `.env.local` or `.env`.
- When adding new environment variables, update this file and the Netlify dashboard.
- Env var changes are baked at build/deploy time — trigger a new deploy after changing them.
- Never put a real credential in a `NEXT_PUBLIC_*` var — those values are inlined into the client bundle.
