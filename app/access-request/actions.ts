"use server";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { accessRequests } from "@/lib/db/schema";
import { sendEmail } from "@/lib/email/sendgrid";
import { redirect } from "next/navigation";

const schema = z.object({
  email: z.string().email(),
  context: z.string().optional(),
});

export async function submitAccessRequest(formData: FormData) {
  const result = schema.safeParse({
    email: formData.get("email"),
    context: formData.get("context") ?? undefined,
  });

  if (!result.success) {
    return { ok: false, error: "Please provide a valid email address." };
  }
  const { email, context } = result.data;

  // Insert row
  try {
    await db.insert(accessRequests).values({
      email,
      context,
    });
    // Send lead notification
    await sendEmail(
      "hi@chirag.co",
      "New access request for Mailvanta",
      `<b>Email:</b> ${email}${context ? `<br/><b>Context:</b> ${context}` : ""}`
    );
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e?.message ?? "Something went wrong." };
  }
}