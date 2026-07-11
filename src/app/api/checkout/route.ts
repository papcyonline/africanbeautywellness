import { NextResponse } from "next/server";

// Creates a Flutterwave payment link for the $29.99 featured listing.
// Returns 503 until FLW_SECRET_KEY is set, so the rest of the app runs today.
export async function POST(req: Request) {
  const secret = process.env.FLW_SECRET_KEY;
  if (!secret) {
    return NextResponse.json(
      { configured: false, error: "Payments are not configured yet." },
      { status: 503 }
    );
  }

  const body = (await req.json().catch(() => ({}))) as {
    ref?: string;
    email?: string;
    name?: string;
  };

  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3100";

  const res = await fetch("https://api.flutterwave.com/v3/payments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tx_ref: `abw-${body.ref ?? Date.now()}`,
      amount: 29.99,
      currency: "USD",
      redirect_url: `${site}/register?paid=1`,
      customer: { email: body.email, name: body.name },
      customizations: {
        title: "Africa Beauty & Wellness — Featured Listing",
        description: "One-time featured directory listing",
      },
    }),
  });

  const data = await res.json();
  return NextResponse.json({
    configured: true,
    link: data?.data?.link ?? null,
    status: data?.status ?? null,
  });
}
