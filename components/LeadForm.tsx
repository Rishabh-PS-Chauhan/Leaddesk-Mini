"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, Send, TriangleAlert } from "lucide-react";
import { leadFormSchema, BUDGET_RANGES, type LeadFormValues } from "@/lib/validations/lead";
import { submitLead } from "@/app/actions/lead";

export function LeadForm() {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: { name: "", email: "", budgetRange: undefined, message: "" },
  });

  const onSubmit = (values: LeadFormValues) => {
    setServerError(null);

    const formData = new FormData();
    formData.set("name", values.name);
    formData.set("email", values.email);
    formData.set("budgetRange", values.budgetRange);
    formData.set("message", values.message);

    startTransition(async () => {
      const result = await submitLead({ status: "idle" }, formData);

      if (result.status === "success") {
        setIsSuccess(true);
        reset();
        return;
      }

      if (result.status === "error") {
        setServerError(result.message);

        if (result.fieldErrors) {
          for (const [field, messages] of Object.entries(result.fieldErrors)) {
            if (messages?.[0]) {
              setError(field as keyof LeadFormValues, { type: "server", message: messages[0] });
            }
          }
        }
      }
    });
  };

  if (isSuccess) {
    return (
      <div className="rounded-2xl border border-border-hairline bg-surface p-8 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-status-closed" strokeWidth={1.5} />
        <h3 className="mt-4 font-display text-xl text-ivory">Message received</h3>
        <p className="mt-2 text-sm text-muted">
          Thanks — we'll reply within one business day.
        </p>
        <button
          type="button"
          onClick={() => setIsSuccess(false)}
          className="mt-6 text-sm font-medium text-accent transition-colors hover:text-accent-hover"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-5 rounded-2xl border border-border-hairline bg-surface p-6 sm:p-8"
    >
      {serverError && (
        <div className="flex items-start gap-2 rounded-lg border border-error-border bg-error-bg px-4 py-3 text-sm text-error-text">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
          <span>{serverError}</span>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-ivory">
          Name
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          {...register("name")}
          className="mt-1.5 w-full rounded-lg border border-border-hairline bg-ink px-3.5 py-2.5 text-ivory placeholder:text-muted-dim focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          placeholder="Jordan Lee"
        />
        {errors.name && <p className="mt-1.5 text-sm text-error-text">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-ivory">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          {...register("email")}
          className="mt-1.5 w-full rounded-lg border border-border-hairline bg-ink px-3.5 py-2.5 text-ivory placeholder:text-muted-dim focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          placeholder="jordan@company.com"
        />
        {errors.email && <p className="mt-1.5 text-sm text-error-text">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="budgetRange" className="block text-sm font-medium text-ivory">
          Budget range
        </label>
        <select
          id="budgetRange"
          defaultValue=""
          {...register("budgetRange")}
          className="mt-1.5 w-full rounded-lg border border-border-hairline bg-ink px-3.5 py-2.5 text-ivory focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        >
          <option value="" disabled>
            Select a range
          </option>
          {BUDGET_RANGES.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
        {errors.budgetRange && <p className="mt-1.5 text-sm text-error-text">Select a budget range.</p>}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-ivory">
          Message
        </label>
        <textarea
          id="message"
          rows={4}
          {...register("message")}
          className="mt-1.5 w-full resize-none rounded-lg border border-border-hairline bg-ink px-3.5 py-2.5 text-ivory placeholder:text-muted-dim focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          placeholder="Tell us about the project…"
        />
        {errors.message && <p className="mt-1.5 text-sm text-error-text">{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-3 font-medium text-ink transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
            Sending…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" strokeWidth={2} />
            Send message
          </>
        )}
      </button>
    </form>
  );
}
