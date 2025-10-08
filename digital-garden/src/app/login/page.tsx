"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const signIn = async () => {
    setLoading(true);
    setMessage(null);
    let supabase;
    try {
      supabase = createClient();
    } catch (_err: unknown) {
      setLoading(false);
      setMessage("Supabase env missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    setMessage(error ? error.message : "Signed in");
    if (!error) window.location.href = "/";
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)]">
      <h1 className="text-xl font-semibold">Sign in</h1>
      <div className="mt-4 grid gap-3">
        <label className="text-sm text-[var(--muted-foreground)]">Email</label>
        <input className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <label className="text-sm text-[var(--muted-foreground)]">Password</label>
        <input type="password" className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <button disabled={loading} onClick={signIn} className="mt-2 px-4 py-2 rounded-full bg-black text-white w-fit">{loading?"Signing in...":"Sign in"}</button>
        {message && <p className="text-sm text-[var(--muted-foreground)]">{message}</p>}
      </div>
      <p className="mt-4 text-sm text-[var(--muted-foreground)]">Need an account? <Link className="underline" href="#">Contact admin</Link></p>
    </div>
  );
}


