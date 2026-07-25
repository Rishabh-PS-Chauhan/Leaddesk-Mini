import { z } from "zod";

export const BUDGET_RANGES = [
  { value: "under_1k", label: "Under $1,000" },
  { value: "1k_5k", label: "$1,000 – $5,000" },
  { value: "5k_15k", label: "$5,000 – $15,000" },
  { value: "15k_plus", label: "$15,000+" },
] as const;

export const budgetRangeEnum = z.enum(["under_1k", "1k_5k", "5k_15k", "15k_plus"]);

export const leadFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Enter your full name.")
    .max(100, "That name's too long — 100 characters max."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Enter your email.")
    .email("Enter a valid email address."),
  budgetRange: budgetRangeEnum,
  message: z
    .string()
    .trim()
    .min(10, "Tell us a bit more — at least 10 characters.")
    .max(2000, "Keep it under 2,000 characters."),
});

export type LeadFormValues = z.infer<typeof leadFormSchema>;

export const statusEnum = z.enum(["new", "contacted", "closed"]);

export const statusUpdateSchema = z.object({
  id: z.string().uuid("Invalid lead id."),
  status: statusEnum,
});

export type StatusUpdateValues = z.infer<typeof statusUpdateSchema>;
