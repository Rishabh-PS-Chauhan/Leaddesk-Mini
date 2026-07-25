"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { leadFormSchema, statusUpdateSchema } from "@/lib/validations/lead";

export type SubmitLeadState =
  | { status: "idle" }
  | { status: "error"; message: string; fieldErrors?: Record<string, string[]> }
  | { status: "success" };

export async function submitLead(
  _prevState: SubmitLeadState,
  formData: FormData
): Promise<SubmitLeadState> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    budgetRange: formData.get("budgetRange"),
    message: formData.get("message"),
  };

  // Server-side validation is the real gate — this runs regardless of
  // whether client-side JS/RHF validation ran, was bypassed, or was skipped
  // entirely (e.g. a direct POST).
  const parsed = leadFormSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      status: "error",
      message: "Check the fields below and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from("leads").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    budget_range: parsed.data.budgetRange,
    message: parsed.data.message,
  });

  if (error) {
    console.error("submitLead insert failed:", error.message);
    return {
      status: "error",
      message: "Something went wrong on our end. Please try again in a moment.",
    };
  }

  return { status: "success" };
}

export type UpdateStatusResult = { success: true } | { success: false; message: string };

export async function updateLeadStatus(id: string, status: string): Promise<UpdateStatusResult> {
  const parsed = statusUpdateSchema.safeParse({ id, status });

  if (!parsed.success) {
    return { success: false, message: "Invalid status update." };
  }

  const supabase = await createSupabaseServerClient();

  // Re-check the session here even though middleware already gated the
  // /admin route — this Server Action could in principle be reached from
  // a stale client, and RLS is the final backstop either way.
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return { success: false, message: "Your session has expired. Please log in again." };
  }

  const { error } = await supabase
    .from("leads")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.id);

  if (error) {
    console.error("updateLeadStatus failed:", error.message);
    return { success: false, message: "Could not update status. Please retry." };
  }

  revalidatePath("/admin");
  return { success: true };
}
