import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { icons } from "lucide-react";

interface BenefitsProps {
  icon: string;
  title: string;
  description: string;
}

const benefitList: BenefitsProps[] = [
  {
    icon: "Send",
    title: "Launch in Days",
    description:
      "Skip the dev wait—Mailvanta gets your first campaign out the door fast.",
  },
  {
    icon: "GaugeCircle",
    title: "Deliverability First",
    description:
      "World-class sender reputation and deep monitoring as you grow.",
  },
  {
    icon: "BarChartBig",
    title: "Actionable Analytics",
    description:
      "See real impact with open/click metrics, audience insights, and campaign health.",
  },
  {
    icon: "Zap",
    title: "Automate Leads",
    description:
      "Set up hands-off automations, onboarding drips, and triggered sends in minutes.",
  },
];

export const LayoutBenefitsSection = () => {
  return (
    <section id="benefits" className="container py-24 sm:py-32">
      <div className="grid lg:grid-cols-2 place-items-center lg:gap-24">
        <div>
          <h2 className="text-lg text-primary mb-2 tracking-wider">Why Mailvanta</h2>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, scalable email marketing for startups
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            We handle templates, sender reputation, analytics, and compliance—so you stay focused on reaching your customers and hitting growth goals.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 w-full">
          {benefitList.map(({ icon, title, description }, index) => (
            <Card
              key={title}
              className="bg-muted/50 dark:bg-card hover:bg-background transition-all delay-75 group/number"
            >
              <CardHeader>
                <div className="flex justify-between">
                  <Icon
                    name={icon as keyof typeof icons}
                    size={32}
                    className="mb-6 text-primary"
                  />
                  <span className="text-5xl text-muted-foreground/15 font-medium transition-all delay-75 group-hover/number:text-muted-foreground/30">
                    0{index + 1}
                  </span>
                </div>

                <CardTitle>{title}</CardTitle>
              </CardHeader>

              <CardContent className="text-muted-foreground">
                {description}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}