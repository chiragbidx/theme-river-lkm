import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";

enum PopularPlan {
  NO = 0,
  YES = 1,
}

interface PlanProps {
  title: string;
  popular: PopularPlan;
  price: number;
  description: string;
  buttonText: string;
  benefitList: string[];
}

const plans: PlanProps[] = [
  {
    title: "Starter",
    popular: 0,
    price: 0,
    description:
      "Perfect for makers and teams launching their first email campaign.",
    buttonText: "Request Access",
    benefitList: [
      "Up to 2500 emails/mo",
      "Core automation blocks",
      "List builder forms",
      "Basic analytics",
      "Live chat support",
    ],
  },
  {
    title: "Growth",
    popular: 1,
    price: 49,
    description:
      "Unlock advanced segmentation, automations, and split tests for scaling startups.",
    buttonText: "Request Access",
    benefitList: [
      "Unlimited sending",
      "Advanced triggers & flows",
      "Power analytics",
      "Multi-list management",
      "API access",
    ],
  },
  {
    title: "Enterprise",
    popular: 0,
    price: 199,
    description:
      "Get compliance, integrations, custom onboarding, and premium support.",
    buttonText: "Contact us",
    benefitList: [
      "Dedicated send domain",
      "Integration support",
      "SOC2/ISO-ready",
      "Onboarding workshop",
      "SAML/SSO",
    ],
  },
];

export const LayoutPricingSection = () => {
  return (
    <section id="pricing" className="container py-24 sm:py-32">
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        Pricing
      </h2>

      <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
        Pricing for every campaign
      </h2>

      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground pb-14">
        Join our early access and lock-in discounts as we launch.
      </h3>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-4">
        {plans.map(
          ({ title, popular, price, description, buttonText, benefitList }) => (
            <Card
              key={title}
              className={
                popular === PopularPlan?.YES
                  ? "drop-shadow-xl shadow-black/10 dark:shadow-white/10 border-[1.5px] border-primary lg:scale-[1.1]"
                  : ""
              }
            >
              <CardHeader>
                <CardTitle className="pb-2">{title}</CardTitle>

                <CardDescription className="pb-4">
                  {description}
                </CardDescription>

                <div>
                  <span className="text-3xl font-bold">${price}</span>
                  <span className="text-muted-foreground"> /month</span>
                </div>
              </CardHeader>

              <CardContent className="flex">
                <div className="space-y-4">
                  {benefitList.map((benefit) => (
                    <span key={benefit} className="flex">
                      <Check className="text-primary mr-2" />
                      <h3>{benefit}</h3>
                    </span>
                  ))}
                </div>
              </CardContent>

              <CardFooter>
                {
                  buttonText.toLowerCase().includes("contact") ? (
                    <Button asChild variant="secondary" className="w-full">
                      <Link href="#contact">{buttonText}</Link>
                    </Button>
                  ) : (
                    <Button asChild className="w-full">
                      <Link href="/access-request">{buttonText}</Link>
                    </Button>
                  )
                }
              </CardFooter>
            </Card>
          )
        )}
      </div>
    </section>
  );
}