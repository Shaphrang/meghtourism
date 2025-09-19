//src\app\agency\(private)\profile\page.tsx

import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import ProfileForm from "./profile-form";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: agency } = await supabase
    .from("tourism_agencies")
    .select("*")
    .eq("owner_user_id", user?.id ?? "")
    .single();

  return <ProfileForm agency={agency} />;
}
