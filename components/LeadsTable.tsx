"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Lead } from "@/lib/types";
import { BUDGET_RANGES } from "@/lib/validations/lead";
import { StatusToggle } from "@/components/StatusToggle";

const budgetLabel = (value: string) =>
  BUDGET_RANGES.find((range) => range.value === value)?.label ?? value;

export function LeadsTable({ initialLeads }: { initialLeads: Lead[] }) {
  const [query, setQuery] = useState("");

  const filteredLeads = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return initialLeads;
    return initialLeads.filter(
      (lead) =>
        lead.name.toLowerCase().includes(q) ||
        lead.email.toLowerCase().includes(q) ||
        lead.message.toLowerCase().includes(q)
    );
  }, [query, initialLeads]);

  return (
    <div className="rounded-2xl border border-border-hairline bg-surface">
      <div className="border-b border-border-hairline p-4">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-dim"
            strokeWidth={1.75}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, or message…"
            className="w-full rounded-lg border border-border-hairline bg-ink py-2.5 pl-9 pr-3.5 text-sm text-ivory placeholder:text-muted-dim focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
      </div>

      {filteredLeads.length === 0 ? (
        <div className="p-10 text-center text-sm text-muted">
          {initialLeads.length === 0
            ? "No leads yet — new submissions will show up here."
            : "No leads match your search."}
        </div>
      ) : (
        <div className="divide-y divide-border-hairline">
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                  <span className="font-display font-medium text-ivory">{lead.name}</span>
                  <span className="text-sm text-muted">{lead.email}</span>
                  <span className="rounded-full border border-border-hairline px-2 py-0.5 text-xs text-muted">
                    {budgetLabel(lead.budget_range)}
                  </span>
                </div>
                <p className="mt-1.5 line-clamp-2 text-sm text-muted">{lead.message}</p>
                <p className="mt-1.5 font-mono text-xs text-muted-dim">
                  {new Intl.DateTimeFormat("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                    timeZone: "UTC",
                  }).format(new Date(lead.created_at))}{" "}
                  UTC
                </p>
              </div>

              <StatusToggle leadId={lead.id} currentStatus={lead.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
