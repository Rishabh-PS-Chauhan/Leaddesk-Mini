"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center gap-1.5 rounded-lg border border-border-hairline px-3.5 py-2 text-sm text-muted transition-colors hover:border-accent hover:text-ivory"
    >
      <LogOut className="h-3.5 w-3.5" strokeWidth={1.75} />
      Sign out
    </button>
  );
}
