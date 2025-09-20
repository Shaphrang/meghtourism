// src/app/agency/(public)/login/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

/** Simple brand mark (swap with your logo if you have one) */
function BrandMark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden {...props}>
      <defs>
        <linearGradient id="gt-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5B8DEF" />
          <stop offset="100%" stopColor="#6B72FF" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="32" height="32" rx="8" fill="url(#gt-grad)" />
      <path
        d="M8 18c3-6 7-6 10 0s7 6 6 0"
        stroke="white"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function AgencyLogin() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [showPwd, setShowPwd] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setErr(error.message);
      setBusy(false);
      return;
    }
    router.replace("/agency"); // if no agency row exists, /agency will auto-create one and continue
  };

  return (
    <main className="bg-gradient-to-br from-orange-50 via-white to-emerald-50 relative min-h-dvh bg-white text-gray-900 overflow-hidden">
      {/* Background gradient + abstract shapes (pure CSS/SVG, very light) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -top-40 right-[-10%] h-[420px] w-[420px] rounded-full bg-gradient-to-br from-indigo-200 via-sky-200 to-emerald-200 blur-3xl opacity-50" />
        <div className="absolute -bottom-32 left-[-10%] h-[360px] w-[360px] rounded-full bg-gradient-to-tr from-amber-200 via-rose-200 to-fuchsia-200 blur-3xl opacity-40" />
        <svg className="absolute left-1/2 top-0 -translate-x-1/2 opacity-[0.07]" width="1200" height="600">
          <defs>
            <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="1200" height="600" fill="url(#grid)" />
        </svg>
      </div>

      {/* Top App Bar (mobile-native style) */}
      <header className="sticky top-0 z-10">
        <div className="mx-auto w-full max-w-md px-4 pt-6">
          <div className="flex items-center gap-2">
            <BrandMark className="h-7 w-7" />
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-wider text-gray-500">
                Meghtourism
              </div>
              <h1 className="text-base font-semibold leading-tight">Agency Portal</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Auth Card */}
      <div className="mx-auto w-full max-w-md px-4 pb-10">
        <div className="mt-6 rounded-2xl border bg-white/95 backdrop-blur-sm shadow-sm ring-1 ring-black/5">
          <div className="border-b px-5 pb-4 pt-5">
            <div className="text-lg font-semibold">Welcome back</div>
            <p className="text-sm text-gray-600 mt-0.5">
              Sign in to manage your itineraries and profile.
            </p>
          </div>

          <form onSubmit={submit} className="px-5 py-5 space-y-4">
            {/* Email */}
            <Field label="Email">
              <input
                className="w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
                type="email"
                autoComplete="email"
                inputMode="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@agency.com"
              />
            </Field>

            {/* Password with toggle */}
            <Field label="Password">
              <div className="relative">
                <input
                  className="w-full rounded-xl border px-3 py-2 pr-12 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
                  type={showPwd ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute inset-y-0 right-0 px-3 text-xs text-gray-600 hover:text-gray-900"
                  aria-label={showPwd ? "Hide password" : "Show password"}
                >
                  {showPwd ? "Hide" : "Show"}
                </button>
              </div>
            </Field>

            {err && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {err}
              </div>
            )}

            <button
              disabled={busy}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-slate-900 text-white py-2 text-sm font-medium shadow-sm active:scale-[0.99] transition disabled:opacity-60"
            >
              {busy ? "Signing in…" : "Sign in"}
            </button>

            <div className="flex items-center gap-3 my-1">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs text-gray-500">or</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {/* Primary CTA for new users */}
            <a
              href="/agency/signup"
              className="w-full inline-flex items-center justify-center rounded-xl border bg-white py-2 text-sm font-medium hover:bg-gray-50"
            >
              Create an agency
            </a>
          </form>

          <div className="px-5 pb-5 text-center">
            <p className="text-xs text-gray-500">
              Need help?{" "}
              <a className="underline underline-offset-2 hover:text-gray-700" href="/contact">
                Contact us
              </a>
            </p>
          </div>
        </div>

        {/* Small app hint (feels native/PWA) */}
        <div className="mt-4 text-center text-xs text-gray-500">
          Tip: Add Meghtourism to your Home Screen for a faster, app-like experience.
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="text-xs font-medium text-gray-700">{label}</div>
      <div className="mt-1">{children}</div>
    </label>
  );
}
