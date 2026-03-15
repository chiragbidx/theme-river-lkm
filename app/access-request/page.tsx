"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { submitAccessRequest } from "./actions";

export default function AccessRequestPage() {
  const [status, setStatus] = useState<"idle"|"loading"|"done"|"error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    const res = await submitAccessRequest(new FormData(e.target as HTMLFormElement));
    if (res?.ok) {
      setStatus("done");
      setEmail("");
    } else {
      setStatus("error");
      setError(res?.error || "Request failed.");
    }
  }

  return (
    <section className="flex flex-col items-center justify-center min-h-[60vh] py-24">
      <Card className="w-full max-w-md shadow-sm rounded-xl bg-background/70">
        <CardHeader>
          <CardTitle>Request Early Access</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="flex flex-col gap-6">
            <label className="text-base font-medium" htmlFor="email">Email address</label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@email.com"
              className="mb-0"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={status==="loading" || status==="done"}
            />
            <input type="hidden" name="context" value="LandingPageAccess" />
            {status === "done" && (
              <p className="text-green-600 font-semibold">
                Thank you! You’re on the early access list—check your inbox soon.
              </p>
            )}
            {error && (
              <p className="text-red-600 font-medium">{error}</p>
            )}
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={status==="loading" || status==="done"}
            >
              {status==="loading"
                ? "Sending..."
                : status==="done"
                ? "Request Sent"
                : "Request Access"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </section>
  );
}