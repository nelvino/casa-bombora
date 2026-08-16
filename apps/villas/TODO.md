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
- **Auth:** Temporary `iron-session` admin login (`ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`); planned migration to Supabase Auth (Google provider) with roles
- **Payments:** Stripe + demo fallback provider (set `STRIPE_SECRET_KEY` for real Stripe, leave it empty for demo)
- **Tests:** Vitest
- **Hosting:** Netlify (separate site from the main `casabombora.com` site)

## 3. What is already done

- Scaffolding, tooling, and port setup (`dev` on `3001`, root shortcuts `dev:villas` / `build:villas`)
- Prisma schema: `Villa`, `Booking`, `Hold`, `BlockedDate`, `PromoCode`
- Database migrated in Supabase
- Core booking logic (availability, holds, price calculation, discounts) with unit tests
- Payment provider abstraction: Stripe test integration + demo fallback
- Webhook handler for Stripe / demo payment success
- Booking calendar UI and two-column booking page
- Villa detail pages with hero image, gallery, amenities, house rules, FAQ, JSON-LD structured data
- SEO: metadata, Open Graph, sitemap, robots.txt
- Admin dashboard with summary cards, bookings/holds tables, and actions: confirm, cancel, mark paid, release hold
- Live deploy on Netlify at `https://stay.casabombora.com` with `[[plugins]]` Next.js runtime
- Admin login form backed by encrypted `iron-session` cookie
- Header and footer with mobile hamburger menu
- Responsive design aligned with the Casa Bombora brand
- Images: Mezzanine renders are used as a temporary swappable photo set for both villas
- `npm run test:ci` runs type check, tests, and production build in one command

## 4. How the app works today

### Guest booking flow

1. Guest browses the home page and clicks a villa.
2. Villa detail page shows photos, description, and a sticky “Book now” card.
3. Booking page shows a calendar, date pickers, guest info, and promo code.
4. Guest clicks **Hold dates**. A 15-minute hold is created in the database and the calendar updates.
5. Guest clicks **Pay now**:
   - If `STRIPE_SECRET_KEY` is a real key, they go to Stripe Checkout.
   - Otherwise, they use the demo payment page.
6. On successful payment, the hold is converted into a booking with status `PENDING`.

### Admin flow

1. Visit `/admin`.
2. Log in with username/password from `ADMIN_USERNAME` / `ADMIN_PASSWORD`.
3. An encrypted `iron-session` cookie is set and an **Admin** link appears in the nav/footer.
4. Dashboard shows bookings and holds; buttons let you confirm, cancel, mark paid, or release a hold.
5. **Sign out** destroys the cookie.

### Environment variables (required)

```env
DATABASE_URL=
DIRECT_URL=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_BASE_URL=https://stay.casabombora.com
ADMIN_USERNAME=
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
SITE_LIVE=true
# set to false in production to show a coming-soon page
```

### Coming-soon mode

- Controlled by the `SITE_LIVE` environment variable.
- Set `SITE_LIVE=false` in Netlify to show the branded coming-soon page to public visitors.
- Leave it `true` or unset during development and build.

## 5. What is missing / roadmap

### Phase 1 — Production hardening (do first)

- [x] Deploy `stay.casabombora.com` on Netlify and configure DNS / CNAME.
- [~] Set all production environment variables in Netlify (missing: `ADMIN_SESSION_SECRET` and live Stripe keys if needed).
- [ ] Switch Stripe from test mode to live mode and test a real payment.
- [ ] Verify webhook endpoint and payment success flow in production.
- [ ] Replace the temporary `iron-session` admin login with **Supabase Auth + Google** and role-based access.
- [ ] Replace temporary Mezzanine photos with real Villa Teduh and Villa Langit photos.
- [ ] Add email confirmations after booking/payment (Resend / SendGrid / Supabase).
- [ ] Add error monitoring and simple logging (Sentry or similar).

### Phase 2 — Guest auth and dashboard

- [ ] Integrate Supabase Auth with Google provider.
- [ ] Create a `profiles` or `roles` table to distinguish `guest` and `admin` users.
- [ ] Map Google-authenticated users to their bookings by `guestEmail`.
- [ ] Build a guest dashboard (`/my-bookings` or `/account`) showing:
  - Upcoming and past bookings
  - Booking status and payment status
  - Villa details and check-in/out dates
  - “Contact host” button that opens WhatsApp with a pre-filled message
- [ ] Allow guests to request changes or cancel from their dashboard (with admin approval).
- [ ] Add role check so a user whose email is marked `admin` sees the Admin link and can access `/admin`.

### Phase 3 — Admin power tools

- [ ] Manual blocked-date management in the admin panel.
- [ ] iCal two-way sync with Airbnb / Booking.com to prevent double bookings.
- [ ] Promo code creation and management in the admin panel.
- [ ] Admin notifications for new bookings (email / WhatsApp).
- [ ] Export bookings to CSV.
- [ ] Simple occupancy / revenue dashboard charts.

### Phase 4 — Growth and polish

- [ ] Add multi-currency support and Xendit for local Indonesian payments.
- [ ] Collect guest reviews after checkout.
- [ ] Add analytics (Google Analytics / Plausible / Fathom).
- [ ] A/B test copy and pricing presentation.
- [ ] Add “instant book” vs “request to book” modes.

## 6. Known limitations right now

- The admin login is a single username/password with `iron-session`. It works, but it will be replaced by Google auth + roles.
- Photos are the Mezzanine renders, not the actual villas yet.
- No email or WhatsApp automation is wired up yet.
- No iCal sync; double-booking protection relies on the database hold + manual blocked dates.
- No multi-currency; everything is priced and charged in USD.
- Guest cannot yet view or manage their own booking without an admin link.

## 7. Notes for future developers

- Keep all changes inside `apps/villas`. The main `casabombora.com` site is separate.
- Run `npm run test:ci` before committing or deploying.
- Do not commit `.env.local` or `.env`.
- When adding new environment variables, update this file and the Netlify dashboard.
