import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const LayoutHeroSection = () => {
  return (
    <section className="container w-full">
      <div className="grid place-items-center lg:max-w-screen-xl gap-8 mx-auto py-20 md:py-32">
        <div className="text-center space-y-8">
          <Badge variant="outline" className="text-sm py-2">
            <span className="mr-2 text-primary">
              <Badge>New</Badge>
            </span>
            <span>Mailvanta: Email SaaS for Growth Teams</span>
          </Badge>

          <div className="max-w-screen-md mx-auto text-center text-4xl md:text-6xl font-bold">
            <h1>
              Accelerate your
              <span className="text-transparent px-2 bg-gradient-to-r from-[#3B82F6] via-[#14B8A6] to-[#D247BF] bg-clip-text">
                email campaigns
              </span>
              with Mailvanta
            </h1>
          </div>

          <p className="max-w-screen-sm mx-auto text-xl text-muted-foreground">
            Send beautiful campaigns with confidence. Automation, insights & deliverability in one simple dashboard. Join our early access—get powerful features from day one!
          </p>

          <div className="space-y-4 md:space-y-0 md:space-x-4 flex flex-col md:flex-row justify-center items-center">
            <Button asChild className="w-60 font-bold group/arrow">
              <Link href="/access-request">
                Request Access
                <ArrowRight className="size-5 ml-2 group-hover/arrow:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <Button
              asChild
              variant="secondary"
              className="w-60 font-bold"
            >
              <Link href="#features">
                Explore features
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative group mt-14">
          <div className="absolute top-2 lg:-top-8 left-1/2 transform -translate-x-1/2 w-[90%] mx-auto h-24 lg:h-80 bg-primary/50 rounded-full blur-3xl"></div>
          <Image
            width={1200}
            height={1200}
            className="w-full md:w-[1200px] mx-auto rounded-lg relative leading-none flex items-center border border-t-2 border-secondary border-t-primary/30 dark:hidden"
            src="/hero-image-light.jpeg"
            alt="Mailvanta email SaaS dashboard preview"
          />
          <Image
            width={1200}
            height={1200}
            className="hidden w-full md:w-[1200px] mx-auto rounded-lg relative leading-none border border-t-2 border-secondary border-t-primary/30 dark:block"
            src="/hero-image-dark.jpeg"
            alt="Mailvanta email SaaS dashboard preview"
          />

          <div className="absolute bottom-0 left-0 w-full h-20 md:h-28 bg-gradient-to-b from-background/0 via-background/50 to-background rounded-lg"></div>
        </div>
      </div>
    </section>
  );
};