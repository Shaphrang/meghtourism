"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function AgencyLogin() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false); const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setErr(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setErr(error.message); setBusy(false); return; }
    router.replace("/agency");
  };

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-xl font-bold">Agency login</h1>
      <form onSubmit={submit} className="mt-4 space-y-3">
        <Field label="Email">
          <input className="mt-1 w-full rounded-xl border p-2" type="email" required
                 value={email} onChange={e=>setEmail(e.target.value)}/>
        </Field>
        <Field label="Password">
          <input className="mt-1 w-full rounded-xl border p-2" type="password" required
                 value={password} onChange={e=>setPassword(e.target.value)}/>
        </Field>
        {err && <div className="text-rose-600 text-sm">{err}</div>}
        <button disabled={busy} className="w-full rounded-xl bg-gray-900 text-white py-2">
          {busy ? "Signing in..." : "Sign in"}
        </button>
        <p className="text-xs text-gray-500 mt-2">Trouble? <a className="underline" href="/contact">Contact us</a>.</p>
      </form>
    </main>
  );
}
function Field({ label, children }: any) { return <div><div className="text-sm font-medium">{label}</div>{children}</div>; }
