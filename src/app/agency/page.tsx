// src/app/agency/page.tsx
import { cookies as nextCookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export const dynamic = "force-dynamic";

export default async function AgencyDashboardPage() {
  // ✅ Always pass a *store*, not the function. Handle both async/sync cookies().
  let cookieStore: any;
  try {
    // Next 14/15+ (async dynamic API)
    cookieStore = await (nextCookies as any)();
  } catch {
    // Older Next (sync API)
    cookieStore = (nextCookies as any)();
  }

  const supabase = createServerComponentClient({
    // The helper expects a function returning the store object
    cookies: () => cookieStore,
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/agency/login");

  // Try to load the agency for this user
  const { data: agency, error: fetchErr } = await supabase
    .from("tourism_agencies")
    .select("*")
    .eq("owner_user_id", user.id)
    .maybeSingle();

  // Auto-create minimal agency row if not found (slug handled by your trigger)
  if (!agency) {
    const defaultName =
      user.email?.split("@")[0]?.replace(/[^a-z0-9\s-]/gi, " ").trim() || "New Agency";

    const { data: created, error: insertErr } = await supabase
      .from("tourism_agencies")
      .insert({
        name: defaultName,
        owner_user_id: user.id,
      })
      .select("*")
      .single();

    if (insertErr) {
      console.error("[/agency] auto-create agency error:", insertErr, { fetchErr });
      redirect("/agency/signup");
    }

    // ts-expect-error RSC -> client boundary
    return <DashboardClient agency={created} />;
  }

  // ts-expect-error RSC -> client boundary
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <DashboardClient agency={agency} />
    </div>
  );
}

// Lazy client import for app router
async function DashboardClient({ agency }: { agency: any }) {
  const Mod = (await import("./_components/DashboardClient")).default;
  return <Mod agency={agency} />;
}
