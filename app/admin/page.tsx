import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { LeadsTable } from "@/components/LeadsTable";
import { SignOutButton } from "@/components/SignOutButton";
import type { Lead } from "@/lib/types";

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/admin/login");
  }

  const { data: leads, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ivory">Leads</h1>
          <p className="mt-1 text-sm text-muted">
            {leads?.length ?? 0} total — signed in as {session.user.email}
          </p>
        </div>
        <SignOutButton />
      </div>

      {error ? (
        <div className="rounded-lg border border-error-border bg-error-bg px-4 py-3 text-sm text-error-text">
          Could not load leads. Refresh to try again.
        </div>
      ) : (
        <LeadsTable initialLeads={(leads as Lead[]) ?? []} />
      )}
    </main>
  );
}
