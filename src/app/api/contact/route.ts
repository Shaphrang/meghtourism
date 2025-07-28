import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Save to Supabase
    const { error: dbError } = await supabase.from("contact_queries").insert([body]);
    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    // Send via Resend if API key present
    if (process.env.RESEND_API_KEY) {
      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "Meghtourism <onboarding@resend.dev>", // Replace with custom domain later
            to: ["ryngksaibusiness@gmail.com"],
            subject: `New Contact Submission - ${body.type || "General"}`,
            text: `
              Name: ${body.name || "N/A"}
              Email: ${body.email || "N/A"}
              Phone: ${body.phone || "N/A"}
              Type: ${body.type || "N/A"}
              Message:
              ${body.message || "N/A"}
            `.trim(),
          }),
        });

        const result = await res.json();
        if (res.status >= 400) {
          console.error("Resend email failed", result);
        }
      } catch (emailError) {
        console.error("Email error", emailError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("Unexpected error", e);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
