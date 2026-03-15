// Root server layout: applies global styles and mounts client-only ErrorReporter.
import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import ErrorReporter from "../components/ErrorReporter";
import { ThemeProvider } from "@/components/theme/theme-provider";

export const metadata: Metadata = {
  title: "Mailvanta — Simple, powerful email marketing SaaS",
  description: "Launch email campaigns, automations, and collect actionable insights with Mailvanta. Built for founders and teams who want to get results fast.",
  openGraph: {
    title: "Mailvanta — Simple, powerful email marketing SaaS",
    description: "Launch email campaigns, automations, and collect actionable insights with Mailvanta.",
    url: process.env.BASE_URL ?? "https://mailvanta.com",
    type: "website",
    images: [
      {
        url: "/hero-image-light.jpeg",
        width: 1600,
        height: 900,
        alt: "Mailvanta email SaaS dashboard preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@chiragdodiya",
    title: "Mailvanta — Simple, powerful email marketing SaaS",
    description: "Launch email campaigns, automations, and collect actionable insights with Mailvanta.",
    creator: "@chiragdodiya",
    images: ["/hero-image-light.jpeg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable} font-sans`}
    >
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ErrorReporter />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}