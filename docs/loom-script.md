# Loom Video Script — LeadDesk Mini Walkthrough (target: ~3 minutes)

## Intro (15s)
- "Hey, this is [name] walking through LeadDesk Mini, a lead-capture tool
  I built for the Digital Heroes Full Stack Development task."
- "I'll show three things: submitting a lead, the auth barrier on the
  admin panel, and updating a lead's status."

## Part 1 — Form submission (60s)
- Open the live URL in a fresh incognito window — call this out explicitly:
  "This is a brand new incognito window, no prior login, no local storage."
- Point at the footer: "Required credit line for the task, linked to
  digitalheroesco.com."
- Try submitting the form empty. "Client-side validation catches this
  instantly — no network request needed."
- Fill in a short message (under 10 characters) to show a specific
  validation rule firing.
- Fill in valid data (name, email, budget range, a real message) and submit.
- "And that's a successful submission — it's now sitting in Postgres via
  Supabase, not just held in the browser."

## Part 2 — Auth barrier (45s)
- Navigate directly to /admin in the URL bar.
- "Watch — I'm not logged in, so this should redirect me straight to
  login, not show me any lead data even briefly."
- Show the redirect happening.
- "This is enforced by middleware checking the session server-side before
  the admin page ever renders — and it's backed by Row Level Security at
  the database level too, so even a bug in my app code couldn't leak this
  data to an unauthenticated request."
- Log in with the seeded admin credentials.

## Part 3 — Status toggle (45s)
- Land on /admin, point out the lead just submitted in Part 1 at the top
  of the list.
- Use the search bar to filter by that lead's name — show it narrowing
  correctly.
- Clear the search.
- Click the status toggle on that lead — New → Contacted.
- "That's an optimistic update — the UI reflects it instantly, but it's
  actually writing to Supabase behind the scenes."
- Reload the page (hard refresh).
- "And after a full reload, it's still Contacted — confirming this
  persisted to the database and isn't just local component state."

## Close (15s)
- "That's the core flow — public form, server + DB-level validation,
  session-based auth gating the admin panel, and a persisted status
  pipeline. README has the full architecture writeup. Thanks for
  watching."
