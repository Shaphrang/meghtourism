"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function AgencySignup() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const validEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setErr(null);

    try {
      const name = form.name.trim();
      const email = form.email.trim().toLowerCase();
      const password = form.password; // keep as-is

      if (!validEmail(email)) { setErr("Please enter a valid email address."); setBusy(false); return; }
      if (!name) { setErr("Agency name is required."); setBusy(false); return; }

      // 1) Ensure unique agency name (case-insensitive)
      const { data: exists, error: nameErr } = await supabase
        .from("tourism_agencies").select("id").ilike("name", name).limit(1);
      if (nameErr) throw nameErr;
      if ((exists?.length ?? 0) > 0) { setErr("Agency name already in use."); setBusy(false); return; }

      // 2) Sign up (email confirmations disabled in your project)
      const { data: { user }, error: signErr } = await supabase.auth.signUp({ email, password });
      if (signErr) throw signErr;
      if (!user) throw new Error("Signup failed");

      // 3) Create agency row for this owner (RLS expects owner_user_id = auth.uid())
      const { error: insErr } = await supabase
        .from("tourism_agencies")
        .insert({ name, owner_user_id: user.id });
      if (insErr && insErr.code !== "23505") throw insErr;

      router.replace("/agency"); // will hit the (private) dashboard
    } catch (e: any) {
      setErr(e.message ?? "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-xl font-bold">Create your agency</h1>
      <form onSubmit={submit} className="mt-4 space-y-3" noValidate>
        <Field label="Agency name">
          <input required className="mt-1 w-full rounded-xl border p-2"
                 value={form.name} onChange={e=>setForm({...form, name: e.target.value})}/>
        </Field>
        <Field label="Email">
          <input required type="email" inputMode="email" autoComplete="email"
                 className="mt-1 w-full rounded-xl border p-2"
                 value={form.email} onChange={e=>setForm({...form, email: e.target.value})}/>
        </Field>
        <Field label="Password">
          <input required type="password" autoComplete="new-password"
                 className="mt-1 w-full rounded-xl border p-2"
                 value={form.password} onChange={e=>setForm({...form, password: e.target.value})}/>
        </Field>

        {err && <div className="text-rose-600 text-sm">{err}</div>}

        <button disabled={busy} className="w-full rounded-xl bg-gray-900 text-white py-2">
          {busy ? "Creating..." : "Create account"}
        </button>

        <p className="text-xs text-gray-500">Already have an account? <a className="underline" href="/agency/login">Log in</a></p>
      </form>
    </main>
  );
}
function Field({ label, children }: any) {
  return <div><div className="text-sm font-medium">{label}</div>{children}</div>;
}
