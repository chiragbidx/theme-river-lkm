import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { icons } from "lucide-react";

interface FeaturesProps {
  icon: string;
  title: string;
  description: string;
}

const featureList: FeaturesProps[] = [
  {
    icon: "MessagesSquare",
    title: "Drag/drop campaigns",
    description:
      "Build beautiful emails with built-in templates and block-based editor.",
  },
  {
    icon: "TimerReset",
    title: "Automations & Drips",
    description:
      "Set rules to welcome new users, follow up, or react to events—zero code needed.",
  },
  {
    icon: "Send",
    title: "Deliver with Confidence",
    description:
      "Built on solid sender reputation, with monitoring and suppression tools.",
  },
  {
    icon: "AreaChart",
    title: "Real-Time Analytics",
    description:
      "Instant open/click rates, heatmaps, audience trends, and delivery stats.",
  },
  {
    icon: "Users2",
    title: "Audience Growth",
    description:
      "Seamless opt-in forms, list hygiene tools, and CRM syncs.",
  },
  {
    icon: "Layers3",
    title: "Unlimited Segments",
    description:
      "Segment and personalize for every campaign or flow.",
  },
];

export const LayoutFeatureGridSection = () => {
  return (
    <section id="features" className="container py-24 sm:py-32">
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        Platform Features
      </h2>

      <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
        Everything you need for email success
      </h2>

      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8">
        Mailvanta's all-in-one toolkit powers campaigns, automations, analytics, and growth.
      </h3>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {featureList.map(({ icon, title, description }) => (
          <div key={title}>
            <Card className="h-full bg-background border-0 shadow-none">
              <CardHeader className="flex justify-center items-center">
                <div className="bg-primary/20 p-2 rounded-full ring-8 ring-primary/10 mb-4">
                  <Icon
                    name={icon as keyof typeof icons}
                    size={24}
                    className="text-primary"
                  />
                </div>

                <CardTitle>{title}</CardTitle>
              </CardHeader>

              <CardContent className="text-muted-foreground text-center">
                {description}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
}