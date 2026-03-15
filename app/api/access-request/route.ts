import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { accessRequests } from "@/lib/db/schema";
import { sendEmail } from "@/lib/email/sendgrid";
import { eq } from "drizzle-orm";

// Removed: export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const email = typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
    const context = typeof data.context === "string" ? data.context : undefined;
    // Remove req.ip; it doesn't exist on NextRequest in Edge/serverless context
    const ip = req.headers.get("x-forwarded-for")?.split(",")?.[0] || null;
    const userAgent = req.headers.get("user-agent") || null;

    // Basic email and rate-limit check
    if (!email.match(/^[^@]+@[^@]+\.[^@]+$/)) {
      return NextResponse.json({ ok: false, error: "Enter a valid email address." }, { status: 400 });
    }

    // Check for recent requests (15 min lock per email)
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const existing = await db
      .select()
      .from(accessRequests)
      .where(eq(accessRequests.email, email))
      .orderBy(accessRequests.requestedAt);

    if (
      existing.length &&
      existing[existing.length - 1].requestedAt &&
      new Date(existing[existing.length - 1].requestedAt) > fifteenMinutesAgo
    ) {
      return NextResponse.json({ ok: false, error: "This email was recently used. Please wait before trying again." }, { status: 429 });
    }

    // Persist lead
    await db.insert(accessRequests).values({
      email,
      context,
      ip: ip || undefined,
      userAgent: userAgent || undefined,
    });

    // Send notification email to owner
    await sendEmail(
      "hi@chirag.co",
      "New Mailvanta Access Request",
      `<b>Email:</b> ${email}<br/>${context ? `<b>Context:</b> ${context}<br/>` : ""}${ip ? `<b>IP:</b> ${ip}<br/>` : ""}${userAgent ? `<b>UA:</b> ${userAgent}` : ""}`
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[AccessRequest] error:", err);
    return NextResponse.json({ ok: false, error: "Could not process your request." }, { status: 500 });
  }
}