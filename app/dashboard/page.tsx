import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sparkles, BarChart3, Users, Zap, Mail } from "lucide-react";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default async function DashboardPage() {
  const session = await getAuthSession();
  if (!session) redirect("/auth#signin");

  const [user] = await db
    .select({ firstName: users.firstName })
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);

  const firstName = user?.firstName || "there";

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <Sparkles className="text-primary size-6" />
          Welcome to your Mailvanta Dashboard, {firstName}!
        </h1>
        <p className="mt-2 text-muted-foreground">
          Your HQ for managing campaigns, lists, and email performance insights.<br/>
          <span className="font-medium">New:</span> As an early access user, you’ll get priority support and shape our roadmap!
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button asChild variant="default">
            <Link href="mailto:hi@chirag.co">
              <Mail className="size-4 mr-2" />
              Contact Founder
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/access-request">
              Invite a colleague
            </Link>
          </Button>
          <Button asChild variant="outline" className="text-sm">
            <Link href="https://mailvanta.com" target="_blank">
              Visit Homepage
            </Link>
          </Button>
        </div>
      </section>

      <div className="flex flex-col md:flex-row gap-6">
        <Card className="flex-1 min-w-[280px] bg-primary/5 border border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="text-primary size-5" />
              Automations & Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Create, schedule, and automate your email campaigns.<br />
              <span className="font-bold">Coming soon:</span> Early users get feature voting & beta access.
            </p>
            <Button asChild className="mt-3" variant="secondary" disabled>
              <Link href="#">
                Coming Soon
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="flex-1 min-w-[280px] bg-accent/10 border border-accent/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="text-accent size-5" />
              Insights & Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Track opens, clicks, and deliverability.<br />
              <span className="font-bold">Coming soon:</span> Share feedback to shape reporting tools!
            </p>
            <Button asChild className="mt-3" variant="secondary" disabled>
              <Link href="#">
                Coming Soon
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="flex-1 min-w-[280px] bg-muted/10 border border-muted/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="text-muted-foreground size-5" />
              List & Audience
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Manage contacts, segments, and opt-in flows.<br />
              <span className="font-bold">Coming soon:</span> Interested? Let us know!
            </p>
            <Button asChild className="mt-3" variant="secondary" disabled>
              <Link href="#">
                Coming Soon
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      {/* Insert original DashboardContent below if you want demo/taglines */}
    </div>
  );
}