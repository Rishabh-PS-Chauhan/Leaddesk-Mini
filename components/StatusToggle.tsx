"use client";

import { useState, useTransition } from "react";
import { Check, Loader2 } from "lucide-react";
import type { LeadStatus } from "@/lib/types";
import { updateLeadStatus } from "@/app/actions/lead";

// These hex values are the literal values behind the status.new/.contacted/.closed
// tokens in tailwind.config.ts. They're duplicated here (rather than referencing
// a Tailwind class) because `backgroundColor` is set dynamically per-option at
// runtime, and Tailwind can't resolve a class name built from a JS variable
// without an explicit safelist — inline style + token-matching hex is the
// pragmatic choice here, not an inconsistency.
const STATUS_OPTIONS: { value: LeadStatus; label: string; color: string }[] = [
  { value: "new", label: "New", color: "#E8A33D" },
  { value: "contacted", label: "Contacted", color: "#4FB6A8" },
  { value: "closed", label: "Closed", color: "#6FCF97" },
];

export function StatusToggle({ leadId, currentStatus }: { leadId: string; currentStatus: LeadStatus }) {
  const [status, setStatus] = useState<LeadStatus>(currentStatus);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleChange = (next: LeadStatus) => {
    if (next === status) return;
    const previous = status;
    setStatus(next); // optimistic
    setError(null);

    startTransition(async () => {
      const result = await updateLeadStatus(leadId, next);
      if (!result.success) {
        setStatus(previous); // roll back on failure
        setError(result.message);
      }
    });
  };

  return (
    <div className="flex shrink-0 flex-col items-end gap-1.5">
      <div className="flex items-center gap-1 rounded-full border border-border-hairline bg-ink p-1">
        {STATUS_OPTIONS.map((option) => {
          const isActive = option.value === status;
          return (
            <button
              key={option.value}
              type="button"
              disabled={isPending}
              onClick={() => handleChange(option.value)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed ${
                isActive ? "text-ink" : "text-muted hover:text-ivory"
              }`}
              style={isActive ? { backgroundColor: option.color } : undefined}
            >
              {isPending && isActive ? (
                <Loader2 className="h-3 w-3 animate-spin" strokeWidth={2} />
              ) : isActive ? (
                <Check className="h-3 w-3" strokeWidth={2.5} />
              ) : null}
              {option.label}
            </button>
          );
        })}
      </div>
      {error && <p className="text-xs text-error-text">{error}</p>}
    </div>
  );
}
