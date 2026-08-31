# Swiss Homecare

A React + Vite + Tailwind site for Swiss Homecare, with a small serverless
backend for the contact form (saves to a database, emails a notification).

## Running the frontend locally in VS Code

1. Unzip this folder and open it in VS Code (`File > Open Folder…`).
2. Open a terminal (`` Ctrl+` `` or `Terminal > New Terminal`).
3. Install dependencies:
   ```
   npm install
   ```
4. Start the local dev server:
   ```
   npm run dev
   ```
5. Open the URL it prints (usually `http://localhost:5173`). The page hot-reloads as you edit files.

Note: plain `npm run dev` only serves the frontend. The contact form's
`/api/contact` endpoint won't respond until you set up the backend below —
see "Testing the backend locally" for how to run both together.

## Project structure

```
swiss-homecare-app/
├── index.html          entry HTML, loads the fonts
├── src/
│   ├── main.jsx         React entry point
│   ├── App.jsx          the whole site (nav, hero, services, etc.)
│   └── index.css        Tailwind setup
├── api/
│   └── contact.js       serverless function behind the contact form
├── supabase/
│   └── schema.sql        run once to create the database table
├── .env.example          copy to .env.local and fill in for local testing
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

Everything on the page lives in `src/App.jsx` — it's one file with all
sections and small helper components (`Button`, `NavLink`, `ServiceCard`,
etc.) defined at the top. As the site grows it's a good idea to split these
into their own files under `src/components/`.

## Backend setup (contact form → database + email)

The contact form posts to `/api/contact`, which saves the submission to a
Supabase (Postgres) table and emails a notification via Resend. Both have
free tiers that are plenty for a site like this.

### 1. Create the database (Supabase)

1. Sign up at [supabase.com](https://supabase.com) and create a new project.
2. Open **SQL Editor → New query**, paste in the contents of
   `supabase/schema.sql`, and run it. This creates a `care_requests` table.
3. Go to **Project Settings → API** and copy:
   - **Project URL** → this is `SUPABASE_URL`
   - **service_role key** (not the `anon` key — this one's secret, keep it
     server-side only) → this is `SUPABASE_SERVICE_ROLE_KEY`

### 2. Set up email notifications (Resend)

1. Sign up at [resend.com](https://resend.com).
2. Under **API Keys**, create a key → this is `RESEND_API_KEY`.
3. Under **Domains**, add and verify the domain you'll be sending from
   (e.g. `swisshome.care`) by adding the DNS records it gives you — same
   place you added DNS records for hosting and email earlier.
   Until a domain is verified, Resend only lets you send to your own
   signup email, which is fine for testing.
4. Set `RESEND_FROM_EMAIL` to something like
   `"Swiss Homecare <hello@swisshome.care>"` and `NOTIFY_EMAIL` to the
   inbox that should receive new submissions.

### 3. Add the environment variables

Copy `.env.example` to `.env.local` and fill in the four values above, for
local testing. **Never commit `.env.local`** — it's already in
`.gitignore`.

For the live site, add the same four variables in
**Vercel → Project → Settings → Environment Variables** instead.

### Testing the backend locally

Vite's dev server (`npm run dev`) doesn't run the `/api` function. To test
the whole thing together, use the Vercel CLI instead:

```
npm install -g vercel
vercel dev
```

This serves the frontend *and* `/api/contact` together, reading from
`.env.local`. Submit the form and check the Supabase table (**Table Editor
→ care_requests**) for the new row, and your notification inbox for the
email.

## Deploying

Push this project to a GitHub repo, then connect it in
[Vercel](https://vercel.com) — it auto-detects the Vite frontend and the
`/api` folder, no config needed. Add the four environment variables from
above in the Vercel dashboard before your first deploy (or redeploy after
adding them). Then follow the earlier steps to point your domain at it.

## Still placeholder

- Contact details (phone, email, address) in the Contact and Footer sections
- Photography — currently a mix of licensed stock photos and one custom
  "sample care plan" mockup; swap in real photos of your brother's
  caregivers/clients when available
