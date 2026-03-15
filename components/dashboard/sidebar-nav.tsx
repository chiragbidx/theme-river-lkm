"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Home,
  Settings,
  Users,
  CreditCard,
  Shield,
  Gavel,
  Mail as MailIcon,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  external?: boolean;
};

const sections: { title: string; items: NavItem[] }[] = [
  {
    title: "Platform",
    items: [
      { label: "Overview", href: "/dashboard", icon: Home },
      { label: "Campaigns", href: "/dashboard/campaigns", icon: MailIcon },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Team", href: "/dashboard/team", icon: Users },
      { label: "Billing", href: "#", icon: CreditCard, disabled: true },
      { label: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
  {
    title: "Legal",
    items: [
      { label: "Privacy Policy", href: "/privacy", icon: Shield },
      { label: "Terms of Service", href: "/terms", icon: Gavel },
    ],
  },
];

function NavLink({
  href,
  label,
  icon: Icon,
  isActive,
  disabled,
  external,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
  disabled?: boolean;
  external?: boolean;
}) {
  if (disabled) {
    return (
      <span className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground/40 cursor-not-allowed select-none">
        <Icon className="size-4" />
        {label}
      </span>
    );
  }

  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
        isActive
          ? "bg-primary/10 text-primary font-medium"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      }`}
    >
      <Icon className="size-4" />
      {label}
    </Link>
  );
}

function NavSection({
  title,
  items,
  pathname,
  defaultOpen,
}: {
  title: string;
  items: NavItem[];
  pathname: string;
  defaultOpen: boolean;
}) {
  function checkActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    if (href === "#") return false;
    return pathname.startsWith(href);
  }

  return (
    <Collapsible defaultOpen={defaultOpen}>
      <CollapsibleTrigger className="group flex w-full items-center justify-between px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 hover:text-muted-foreground transition-colors">
        {title}
        <ChevronDown className="size-3.5 transition-transform group-data-[state=closed]:-rotate-90" />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-1 space-y-0.5">
          {items.map((item) => (
            <NavLink
              key={item.label}
              {...item}
              isActive={checkActive(item.href)}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-1 flex-col">
      <nav className="flex-1 space-y-4">
        {sections.map((section) => (
          <NavSection
            key={section.title}
            title={section.title}
            items={section.items}
            pathname={pathname}
            defaultOpen={section.title !== "Legal"}
          />
        ))}
      </nav>
    </div>
  );
}