# LeadDesk Mini

A small lead-capture product with a public intake form and an authenticated
admin dashboard, built for the Digital Heroes Full Stack Development
internship task.

**Live URL:** `https://leaddesk-mini-black.vercel.app`
**Admin login:** `https://leaddesk-mini-black.vercel.app/admin/login`

**Admin test credentials:**
- Email: `rishabh.pschauhan@gmail.com`
- Password: `8febYash!`

---

## What it does

- `/` — a public lead form (Name, Email, Budget Range, Message) with client
  and server-side validation.
- `/admin` — an authenticated dashboard listing all leads, with search and a
  New / Contacted / Closed status toggle.
- `/admin/login` — sign-in for the single seeded admin account.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS · Zod · React Hook Form ·
Supabase (Postgres + Auth + Row Level Security) · Lucide React · deployed on
Vercel.

---

## Data model

A single `leads` table in Postgres:

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid`, PK | `gen_random_uuid()` |
| `name` | `text` | 2–100 chars, enforced by both Zod and a DB check constraint |
| `email` | `text` | validated by Zod; loose regex check at the DB level as a backstop |
| `budget_range` | enum (`under_1k`, `1k_5k`, `5k_15k`, `15k_plus`) | closed set, not free text |
| `message` | `text` | 10–2000 chars |
| `status` | enum (`new`, `contacted`, `closed`) | defaults to `new` |
| `created_at` / `updated_at` | `timestamptz` | `updated_at` bumped by a trigger on every update |

**Why validation lives in three places, not one:** client-side Zod (via
React Hook Form) gives instant feedback but can be bypassed by disabling JS
or POSTing directly. The Server Action re-runs the identical Zod schema
server-side — that's the real gate. Postgres `check` constraints are a
final backstop in case application code is ever wrong. See
`supabase/migrations/0001_initial.sql` for the exact constraints.

**Row Level Security:** the `anon` role can only `INSERT` into `leads` (the
public form), never read or update it. Only the `authenticated` role
(the logged-in admin) can `SELECT` or `UPDATE`. There is no `DELETE` policy —
leads aren't deletable in this MVP, a deliberate scope call rather than an
oversight.

## Authentication approach

Auth is handled by **Supabase Auth** (email/password), not a custom or
hardcoded check. On sign-in, Supabase's SSR helper writes the session into
**httpOnly, secure cookies** — inaccessible to client-side JavaScript, which
closes off token theft via XSS even if malicious input somehow made it into
the DOM (it can't here, since React escapes rendered text by default).

`middleware.ts` intercepts every request to `/admin/*`, verifies the session
server-side, and redirects to `/admin/login` before the page ever renders if
there's no valid session — so no lead data is fetched or streamed to an
unauthenticated visitor, even momentarily. Server Actions that mutate data
(`updateLeadStatus`) independently re-check the session too, rather than
trusting that middleware already caught it. Row Level Security is the final
backstop underneath all of that, enforced by Postgres itself regardless of
what the application code does.

This is session-based, cookie-backed auth — no tokens are stored in
`localStorage` or `sessionStorage` anywhere, which is also why the app works
correctly from a completely fresh incognito window with zero prior state.

## Setup

1. Create a Supabase project, run `supabase/migrations/0001_initial.sql`
   against it.
2. Create one admin user via the Supabase Auth dashboard (not in code).
3. Set environment variables: `NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. `npm install && npm run dev`.

## Design decisions worth knowing about

1. **Server Actions over a REST route handler** for the lead submission and
   status update flows — keeps the mutation logic colocated with the
   components that call it and avoids hand-rolling `fetch` + loading state.
2. **Client-side search on `/admin`** rather than server-side filtering —
   the dataset for this project is small enough that fetching once and
   filtering in-memory is simpler and faster to use than a debounced
   server round-trip. Would revisit for a larger dataset.
3. **Optimistic status updates** with rollback on failure, so the admin
   panel feels instant without lying about the database state if a write
   fails.

## What I'd do with another day

- Server-side pagination and search once the lead volume justifies it.
- Email notification to the admin on new lead submission.
- Soft-delete / archive instead of the current no-delete restriction.

## AI usage

I used Claude throughout this task, in five deliberately separated phases:
constraint analysis, system architecture (DB schema, RLS policy logic,
route map, data flow), a security and testing protocol, code generation, and
this documentation. I asked it to hold off on writing any code until the
architecture was settled, so I could review and push back on the schema,
the auth approach, and the RLS design before anything was implemented — for
example, I changed the lead submission flow from a Route Handler to a
Server Action mid-way through and had it re-map that data flow accordingly.
After code generation, I read through every file, ran the manual testing
checklist end to end in a fresh incognito window (unauthorized `/admin`
access, form validation bypass by disabling JS, status toggle persistence
across reloads), fixed the environment/deployment configuration myself, and
adjusted the visual design tokens to make sure the UI didn't read as a
generic AI-generated template. The architecture, the trade-off calls (Server
Actions vs. route handlers, client-side vs. server-side search), and the
testing were mine; Claude accelerated the scaffolding and let me focus my
own time on reviewing decisions rather than typing boilerplate.
