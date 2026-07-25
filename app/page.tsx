import { LeadForm } from "@/components/LeadForm";

// Mirrors the status tokens in tailwind.config.ts (status.new / .contacted / .closed).
// Kept as literal hex here because this array feeds an inline style, not a
// static Tailwind class — see the note in StatusToggle.tsx for why.
const SIGNAL_STAGES = [
  { label: "New", color: "#E8A33D" },
  { label: "Contacted", color: "#4FB6A8" },
  { label: "Closed", color: "#6FCF97" },
];

export default function LandingPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      <div className="grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:items-start">
        <div>
          <div className="flex items-center gap-2">
            {SIGNAL_STAGES.map((stage) => (
              <span
                key={stage.label}
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: stage.color }}
              />
            ))}
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
              Lead intake
            </span>
          </div>

          <h1 className="mt-6 font-display text-4xl font-bold leading-tight text-ivory sm:text-5xl">
            Tell us where the work stands.
          </h1>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">
            One message gets your project into our pipeline — a real
            person reads every submission and replies within one business day.
          </p>

          <dl className="mt-10 space-y-4 border-t border-border-hairline pt-6">
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-sm text-muted">Response time</dt>
              <dd className="font-display text-sm text-ivory">Under 24 hours</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-sm text-muted">Who reads this</dt>
              <dd className="font-display text-sm text-ivory">A project lead, directly</dd>
            </div>
          </dl>
        </div>

        <LeadForm />
      </div>
    </main>
  );
}
