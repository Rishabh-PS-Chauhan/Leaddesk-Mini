export type LeadStatus = "new" | "contacted" | "closed";
export type BudgetRange = "under_1k" | "1k_5k" | "5k_15k" | "15k_plus";

export interface Lead {
  id: string;
  name: string;
  email: string;
  budget_range: BudgetRange;
  message: string;
  status: LeadStatus;
  created_at: string;
  updated_at: string;
}
