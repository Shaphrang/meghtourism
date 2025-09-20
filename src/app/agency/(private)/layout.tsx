//src\app\agency\(private)\layout.tsx
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { AgencyProvider } from "./../../../contexts/AgencyContext"; // adjust import if needed

export const metadata: Metadata = { title: "Agency • Meghtourism" };
export const dynamic = "force-dynamic";

export default async function PrivateAgencyLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/agency/signup");
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <AgencyProvider>{children}</AgencyProvider>
    </div>
  );
}

