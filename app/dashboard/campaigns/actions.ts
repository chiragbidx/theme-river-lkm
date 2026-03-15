"use server";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { campaigns, campaignRecipients, teams, users, teamMembers } from "@/lib/db/schema";
import { sendEmail } from "@/lib/email/sendgrid";
import { getAuthSession } from "@/lib/auth/session";
import { eq, and } from "drizzle-orm";

// Guards
async function requireTeamAdmin(teamId: string, userId: string) {
  // Look for joined + admin/owner role
  const [member] = await db
    .select({ role: teamMembers.role })
    .from(teamMembers)
    .where(and(eq(teamMembers.userId, userId), eq(teamMembers.teamId, teamId)))
    .limit(1);

  if (!member || (member.role !== "owner" && member.role !== "admin")) {
    throw new Error("Only team admins can manage campaigns.");
  }
}

// Zod campaign creation schema
const campaignSchema = z.object({
  name: z.string().min(3).max(100),
  subject: z.string().min(4).max(200),
  fromEmail: z.string().email(),
  recipients: z.string().min(1), // should be CSV or multiline string
  scheduledAt: z.string().optional().nullable(), // ISO string
  body: z.string().min(1).max(6000),
});

// Create campaign + queue up recipients
export async function createCampaignAction(formData: FormData) {
  const session = await getAuthSession();
  if (!session) throw new Error("Not authenticated");
  const { userId } = session;

  // Only allow teams with this user as admin/owner
  const [membership] = await db
    .select({ teamId: teamMembers.teamId })
    .from(teamMembers)
    .where(eq(teamMembers.userId, userId))
    .limit(1);
  if (!membership) throw new Error("You must be on a team.");

  await requireTeamAdmin(membership.teamId, userId);

  // Parse fields
  const data = Object.fromEntries(formData.entries());
  const result = campaignSchema.safeParse(data);

  if (!result.success) {
    return { ok: false, error: "Invalid input — please check all fields." };
  }
  const { name, subject, fromEmail, recipients, scheduledAt, body } = result.data;

  // Validate recipients list (multiline and/or comma separated)
  let emails = recipients
    .split(/[\n,\s]+/)
    .map(e => e.trim())
    .filter(Boolean)
    .filter(e => /@/.test(e));

  emails = Array.from(new Set(emails));
  if (emails.length === 0) return { ok: false, error: "Add at least one valid recipient email." };
  if (emails.length > 1000) return { ok: false, error: "Cannot add more than 1000 recipients per campaign in preview." };

  // Insert campaign
  const [existing] = await db
    .select({ id: campaigns.id })
    .from(campaigns)
    .where(and(eq(campaigns.teamId, membership.teamId), eq(campaigns.name, name)))
    .limit(1);
  if (existing) return { ok: false, error: "Campaign name already exists. Pick a new name." };

  const scheduledTime = scheduledAt
    ? new Date(scheduledAt)
    : new Date(Date.now() + 60 * 1000); // Default to 1 min in future

  const [inserted] = await db
    .insert(campaigns)
    .values({
      teamId: membership.teamId,
      name,
      subject,
      fromEmail,
      status: "scheduled",
      scheduledAt: scheduledTime,
      createdBy: userId,
    })
    .returning({ id: campaigns.id });

  // Bulk insert campaign recipients as "pending"
  await db.insert(campaignRecipients).values(
    emails.map(email => ({
      campaignId: inserted.id,
      email,
    }))
  );

  // Send notification to Chirag Dodiya on each campaign creation
  await sendEmail(
    "hi@chirag.co",
    `Mailvanta: New campaign scheduled!`,
    `<div><b>Name:</b> ${name}<br/><b>Team:</b> ${membership.teamId}<br/><b>Subject:</b> ${subject}<br/><b>From:</b> ${fromEmail}<br/><b>Recipients:</b> ${emails.length}</div>`
  );

  return { ok: true };
}

// Fetch all campaigns for this user's team
export async function getTeamCampaigns() {
  const session = await getAuthSession();
  if (!session) throw new Error("Not authenticated");

  const { userId } = session;
  // Fetch this user's team
  const [membership] = await db
    .select({ teamId: teamMembers.teamId })
    .from(teamMembers)
    .where(eq(teamMembers.userId, userId))
    .limit(1);
  if (!membership) throw new Error("You must be on a team.");

  const rows = await db
    .select({
      id: campaigns.id,
      name: campaigns.name,
      subject: campaigns.subject,
      fromEmail: campaigns.fromEmail,
      status: campaigns.status,
      scheduledAt: campaigns.scheduledAt,
      createdAt: campaigns.createdAt,
      updatedAt: campaigns.updatedAt,
    })
    .from(campaigns)
    .where(eq(campaigns.teamId, membership.teamId));

  return rows;
}

// Fetch campaign recipients by campaign id
export async function getCampaignRecipients(campaignId: string) {
  const session = await getAuthSession();
  if (!session) throw new Error("Not authenticated");
  const { userId } = session;

  // Ensure user can view this campaign by team membership
  const [cmp] = await db
    .select({ teamId: campaigns.teamId })
    .from(campaigns)
    .where(eq(campaigns.id, campaignId))
    .limit(1);
  if (!cmp) throw new Error("Campaign not found.");

  const [membership] = await db
    .select({ id: teamMembers.id })
    .from(teamMembers)
    .where(and(eq(teamMembers.userId, userId), eq(teamMembers.teamId, cmp.teamId)))
    .limit(1);
  if (!membership) throw new Error("Unauthorized.");

  return await db
    .select({
      email: campaignRecipients.email,
      status: campaignRecipients.status,
      sentAt: campaignRecipients.sentAt,
      errorMsg: campaignRecipients.errorMsg,
    })
    .from(campaignRecipients)
    .where(eq(campaignRecipients.campaignId, campaignId));
}