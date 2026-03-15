-- Create campaigns table
CREATE TABLE "campaigns" (
    "id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "team_id" text NOT NULL REFERENCES "teams" ("id") ON DELETE CASCADE,
    "name" text NOT NULL,
    "subject" text NOT NULL,
    "from_email" text NOT NULL,
    "status" text NOT NULL DEFAULT 'draft',
    "scheduled_at" timestamp with time zone,
    "created_by" text NOT NULL REFERENCES "users" ("id"),
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX "team_campaigns_unique_idx" ON "campaigns" ("team_id", "name");

-- Create campaign_recipients table
CREATE TABLE "campaign_recipients" (
    "id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "campaign_id" text NOT NULL REFERENCES "campaigns" ("id") ON DELETE CASCADE,
    "email" text NOT NULL,
    "status" text NOT NULL DEFAULT 'pending',
    "sent_at" timestamp with time zone,
    "error_msg" text,
    UNIQUE ("campaign_id", "email")
);