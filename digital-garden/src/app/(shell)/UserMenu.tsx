import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function UserMenu() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <Link href="/login" className="px-3 py-2 rounded-full border border-[var(--border)] bg-[var(--surface)]/90 hover:bg-[var(--surface-2)] text-sm">Sign in</Link>;
  }

  return (
    <form action="/auth/signout" method="post">
      <span className="text-sm text-[var(--muted-foreground)] mr-2">{user.email}</span>
      <button className="px-3 py-2 rounded-full border border-[var(--border)] bg-[var(--surface)]/90 hover:bg-[var(--surface-2)] text-sm">Sign out</button>
    </form>
  );
}


