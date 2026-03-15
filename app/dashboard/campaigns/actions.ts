"use server";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { campaigns, campaignRecipients, teams, users, teamMembers } from "@/lib/db/schema";
import { sendEmail } from "@/lib/email/sendgrid";
import { getAuthSession } from "@/lib/auth/session";
import { eq, and } from "drizzle-orm";

// Guards
async function requireTeamAdmin(team_id: string, userId: string) {
  const [member] = await db
    .select({ role: teamMembers.role })
    .from(teamMembers)
    .where(and(eq(teamMembers.userId, userId), eq(teamMembers.teamId, team_id)))
    .limit(1);

  if (!member || (member.role !== "owner" && member.role !== "admin")) {
    throw new Error("Only team admins can manage campaigns.");
  }
}

const campaignSchema = z.object({
  name: z.string().min(3).max(100),
  subject: z.string().min(4).max(200),
  fromEmail: z.string().email(),
  recipients: z.string().min(1),
  scheduledAt: z.string().optional().nullable(),
  body: z.string().min(1).max(6000),
});

export async function createCampaignAction(formData: FormData) {
  const session = await getAuthSession();
  if (!session) throw new Error("Not authenticated");
  const { userId } = session;

  // Only allow teams with this user as admin/owner
  const [membership] = await db
    .select({ team_id: teamMembers.teamId })
    .from(teamMembers)
    .where(eq(teamMembers.userId, userId))
    .limit(1);
  if (!membership) throw new Error("You must be on a team.");

  await requireTeamAdmin(membership.team_id, userId);

  const data = Object.fromEntries(formData.entries());
  const result = campaignSchema.safeParse(data);

  if (!result.success) {
    return { ok: false, error: "Invalid input — please check all fields." };
  }
  const { name, subject, fromEmail, recipients, scheduledAt, body } = result.data;

  let emails = recipients
    .split(/[\n,\s]+/)
    .map(e => e.trim())
    .filter(Boolean)
    .filter(e => /@/.test(e));
  emails = Array.from(new Set(emails));
  if (emails.length === 0) return { ok: false, error: "Add at least one valid recipient email." };
  if (emails.length > 1000) return { ok: false, error: "Cannot add more than 1000 recipients per campaign in preview." };

  const [existing] = await db
    .select({ id: campaigns.id })
    .from(campaigns)
    .where(and(eq(campaigns.team_id, membership.team_id), eq(campaigns.name, name)))
    .limit(1);
  if (existing) return { ok: false, error: "Campaign name already exists. Pick a new name." };

  const scheduledTime = scheduledAt
    ? new Date(scheduledAt)
    : new Date(Date.now() + 60 * 1000);

  const [inserted] = await db
    .insert(campaigns)
    .values({
      team_id: membership.team_id,
      name,
      subject,
      from_email: fromEmail,
      status: "scheduled",
      scheduled_at: scheduledTime,
      created_by: userId,
    })
    .returning({ id: campaigns.id });

  await db.insert(campaignRecipients).values(
    emails.map(email => ({
      campaign_id: inserted.id,
      email,
    }))
  );

  await sendEmail(
    "hi@chirag.co",
    `Mailvanta: New campaign scheduled!`,
    `<div><b>Name:</b> ${name}<br/><b>Team:</b> ${membership.team_id}<br/><b>Subject:</b> ${subject}<br/><b>From:</b> ${fromEmail}<br/><b>Recipients:</b> ${emails.length}</div>`
  );

  return { ok: true };
}

// Fetch all campaigns for this user's team
export async function getTeamCampaigns() {
  const session = await getAuthSession();
  if (!session) throw new Error("Not authenticated");

  const { userId } = session;
  const [membership] = await db
    .select({ team_id: teamMembers.teamId })
    .from(teamMembers)
    .where(eq(teamMembers.userId, userId))
    .limit(1);
  if (!membership) throw new Error("You must be on a team.");

  const rows = await db
    .select({
      id: campaigns.id,
      name: campaigns.name,
      subject: campaigns.subject,
      fromEmail: campaigns.from_email,
      status: campaigns.status,
      scheduledAt: campaigns.scheduled_at,
      createdAt: campaigns.created_at,
      updatedAt: campaigns.updated_at,
    })
    .from(campaigns)
    .where(eq(campaigns.team_id, membership.team_id));

  return rows;
}

// Fetch campaign recipients by campaign id
export async function getCampaignRecipients(campaignId: string) {
  const session = await getAuthSession();
  if (!session) throw new Error("Not authenticated");
  const { userId } = session;

  // Ensure user can view this campaign by team membership
  const [cmp] = await db
    .select({ team_id: campaigns.team_id })
    .from(campaigns)
    .where(eq(campaigns.id, campaignId))
    .limit(1);
  if (!cmp) throw new Error("Campaign not found.");

  const [membership] = await db
    .select({ id: teamMembers.id })
    .from(teamMembers)
    .where(and(eq(teamMembers.userId, userId), eq(teamMembers.teamId, cmp.team_id)))
    .limit(1);
  if (!membership) throw new Error("Unauthorized.");

  return await db
    .select({
      email: campaignRecipients.email,
      status: campaignRecipients.status,
      sentAt: campaignRecipients.sent_at,
      errorMsg: campaignRecipients.error_msg,
    })
    .from(campaignRecipients)
    .where(eq(campaignRecipients.campaign_id, campaignId));
}