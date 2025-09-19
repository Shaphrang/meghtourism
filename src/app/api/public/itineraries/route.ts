import { NextResponse } from "next/server";
import { getRouteClient } from "@/lib/supabaseClients";

export const revalidate = 300; // ISR: 5 minutes

export async function GET() {
  const supabase = getRouteClient();
  const { data, error } = await supabase
    .from("itineraries")
    .select("id,title,price,cover_image,slug,updated_at")
    .eq("approval_status","approved")
    .eq("visibilitystatus","visible")
    .eq("is_active", true)
    .order("updated_at", { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data ?? [] });
}
