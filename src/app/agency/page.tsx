// app/agency/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export const dynamic = "force-dynamic";

export default async function AgencyDashboardPage() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/agency/login");

  // Find the agency owned by this user
  const { data: agency, error } = await supabase
    .from("tourism_agencies")
    .select("*")
    .eq("owner_user_id", user.id)
    .single();

  if (error || !agency) {
    // If no agency yet, go to signup
    redirect("/agency/signup");
  }

  // We keep the client list fetching in the client component (fresh + reactive)
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Client component gets the agency row and renders everything */}
      {/* Import is relative to this file’s folder */}
      {/* ts-expect-error Async Server Component to Client boundary */}
      <DashboardClient agency={agency} />
    </div>
  );
}

// Lazy import to avoid Next’s edge issues with client code in server file
// (Next can tree-shake this pattern fine)
async function DashboardClient({ agency }: { agency: any }) {
  const Mod = (await import("./_components/DashboardClient")).default;
  return <Mod agency={agency} />;
}
