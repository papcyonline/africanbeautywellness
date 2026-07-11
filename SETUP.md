# Africa Beauty & Wellness — going live

The whole app is built. It runs today with sample/placeholder data. To make
the registration form actually save, protect the admin, and take payments, do
the steps below. Nothing in the code changes — you only add accounts + keys.

---

## 1. Run the app locally

```
cd C:\Users\papcy\Desktop\continental
npm install
npm run dev          # http://localhost:3100
```

Pages: `/` (landing) · `/register` (form) · `/admin` (dashboard).

Until you finish the steps below, the form confirms but does not save, and the
admin shows sample data. That is expected.

---

## 2. Supabase (database, file uploads, admin data)

1. Create a project at https://supabase.com (free tier is fine).
2. **Schema:** Dashboard → SQL Editor → New query → paste all of
   `supabase/schema.sql` → Run.
3. **Storage:** Dashboard → Storage → New bucket → name `company-docs`,
   Public = OFF. (Uploaded profiles/catalogues stay private; the admin reads
   them with the service-role key.)
4. **Keys:** Dashboard → Project Settings → API. Copy into `.env.local`:
   ```
   SUPABASE_URL=https://<your-project>.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=<service_role secret>
   ```
   The service-role key is secret and server-only — never expose it to the
   browser.
5. Restart `npm run dev`. Submit a test registration — it now appears in
   `/admin`, and approve/reject/edit persist to the database.

---

## 3. Flutterwave (the $29.99 featured listing)

1. Create an account at https://flutterwave.com and complete business
   verification (this has lead time — start early).
2. Dashboard → Settings → API Keys. Add to `.env.local`:
   ```
   FLW_SECRET_KEY=<your secret key>
   NEXT_PUBLIC_FLW_PUBLIC_KEY=<your public key>
   ```
3. The payment endpoint is already scaffolded at `POST /api/checkout` (returns
   503 until the key is set). Final step to wire is a small one: after a
   featured submission, call `/api/checkout` and redirect the user to the
   returned `link`, then verify payment on the redirect back. Ask me to finish
   this once your account is verified.

---

## 4. Admin login (protecting /admin)

`/admin` is gated by a password login (`/admin/login`) using a signed,
HTTP-only session cookie. Set these in `.env.local` (and in Vercel):

```
ADMIN_PASSWORD=<a strong password>
ADMIN_SESSION_SECRET=<long random string, e.g. openssl rand -hex 32>
```

If `ADMIN_PASSWORD` is unset the gate is disabled, so it MUST be set in
production. (Locally, `scripts/gen-admin.mjs` generated a dev password.)

---

## 5. Deploy

1. Push to a GitHub repo.
2. Import into https://vercel.com.
3. Add every variable from `.env.example` in Vercel → Project → Settings →
   Environment Variables.
4. Set `NEXT_PUBLIC_SITE_URL` to your real domain.
5. Deploy.

---

## Environment variables

See `.env.example` for the full list. Summary:

| Variable | Needed for |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | metadata, social card, payment redirect |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | saving registrations, uploads, admin data |
| `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` | protecting the `/admin` portal (required) |
| `FLW_SECRET_KEY`, `NEXT_PUBLIC_FLW_PUBLIC_KEY` | featured-listing payments |
| `PEXELS_API_KEY` | only `scripts/fetch-images.mjs` (build-time images) |
