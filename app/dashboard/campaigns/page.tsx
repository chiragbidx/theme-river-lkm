"use client";
import * as React from "react";
import { useForm } from "react-hook-form";
import { getTeamCampaigns, createCampaignAction, getCampaignRecipients } from "./actions";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, PlusCircle, Users, Check, Clock, Ban, Send } from "lucide-react";
import { Separator } from "@/components/ui/separator";

type Campaign = {
  id: string;
  name: string;
  subject: string;
  fromEmail: string;
  status: string;
  scheduledAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};
type Recipient = {
  email: string;
  status: string;
  sentAt: string | null;
  errorMsg?: string | null;
};

function formatDate(dt?: string | null) {
  if (!dt) return "—";
  return new Date(dt).toLocaleDateString() + " " + new Date(dt).toLocaleTimeString();
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [recipientLoading, setRecipientLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getTeamCampaigns().then((result: any) => {
      if (mounted) {
        setCampaigns(result || []);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, [modalOpen, success]);

  function handleViewRecipients(campaign: Campaign) {
    setRecipientLoading(true);
    setSelectedCampaign(campaign);
    getCampaignRecipients(campaign.id)
      .then((result: any) => {
        setRecipients(result || []);
        setRecipientLoading(false);
      });
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Mail className="size-6 text-primary" />
          Campaigns
        </h1>
        <Button onClick={() => setModalOpen(true)} className="gap-2">
          <PlusCircle className="size-4" />
          New Campaign
        </Button>
      </div>
      <p className="text-muted-foreground mb-4">
        Create and manage email campaigns for your team. Schedule a campaign and send to up to 1000 recipients using SendGrid.
      </p>
      <Separator />
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-muted-foreground size-8" />
        </div>
      ) : !campaigns.length ? (
        <div className="py-10 text-center text-muted-foreground text-lg">
          No campaigns created yet.
        </div>
      ) : (
        <div className="space-y-6">
          {campaigns.map(cmp => (
            <Card key={cmp.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="size-4 text-primary" />
                  {cmp.name}
                  <span className="ml-3 text-xs rounded px-2 py-0.5 font-medium border"
                        style={{
                          background: cmp.status === "sent" ? "#ddfadd" : cmp.status === "failed" ? "#ffeaea" : "#dbeafe",
                          color: cmp.status === "sent" ? "#14532d" : cmp.status === "failed" ? "#b91c1c" : "#1e40af",
                          borderColor: cmp.status === "sent" ? "#22c55e" : cmp.status === "failed" ? "#ef4444" : "#1d4ed8"
                        }}>
                    {cmp.status.toUpperCase()}
                  </span>
                </CardTitle>
                <div className="text-xs text-muted-foreground mt-1">
                  Subject: <span className="font-medium">{cmp.subject}</span>
                  <br />
                  From: <span className="font-medium">{cmp.fromEmail}</span>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs">
                  <Clock className="size-3" /> Scheduled: {formatDate(cmp.scheduledAt)}
                  <Users className="size-3 ml-4" /> <Button variant="link" size="sm" className="px-0 h-4 text-xs" onClick={() => handleViewRecipients(cmp)}>
                    View Recipients
                  </Button>
                </div>
                {selectedCampaign && selectedCampaign.id === cmp.id && (
                  <div className="bg-muted/50 rounded p-2 mt-2">
                    <b>Recipients ({recipients.length}):</b>
                    {recipientLoading ? (
                      <div className="text-xs text-muted-foreground flex items-center gap-2"><Loader2 className="animate-spin size-3" /> Loading...</div>
                    ) : recipients.length === 0 ? (
                      <div className="text-xs text-muted-foreground">No recipient data.</div>
                    ) : (
                      <ul className="text-xs max-h-40 overflow-y-auto mt-1">
                        {recipients.map(rcp => (
                          <li key={rcp.email} className="flex gap-2 items-center mb-0.5">
                            {rcp.status === "sent" && <Check className="text-green-500 size-3" />}
                            {rcp.status === "pending" && <Clock className="text-blue-500 size-3" />}
                            {rcp.status === "failed" && <Ban className="text-red-500 size-3" />}
                            {rcp.email}
                            {rcp.status !== "pending" && rcp.sentAt && (
                              <span className="ml-2">{formatDate(rcp.sentAt)}</span>
                            )}
                            {rcp.status === "failed" && rcp.errorMsg && (
                              <span className="ml-2 text-red-600">{rcp.errorMsg}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {/* Modal for creating campaign */}
      {modalOpen && (
        <CreateCampaignModal
          onClose={() => { setModalOpen(false); setError(null); setSuccess(null); }}
          creating={creating}
          setCreating={setCreating}
          setError={setError}
          setSuccess={setSuccess}
        />
      )}
      {error && <div className="text-red-600 font-medium">{error}</div>}
      {success && <div className="text-green-600 font-medium">{success}</div>}
    </div>
  );
}

type CreateCampaignModalProps = {
  onClose: () => void;
  creating: boolean;
  setCreating: (v: boolean) => void;
  setError: (e: string | null) => void;
  setSuccess: (s: string | null) => void;
};

// Quick minimal modal—no animations for now
function CreateCampaignModal({ onClose, creating, setCreating, setError, setSuccess }: CreateCampaignModalProps) {
  const { register, handleSubmit, reset } = useForm();
  const [success, setModalSuccess] = useState<string | null>(null);

  async function onSubmit(data: any) {
    setCreating(true);
    setError(null);

    if (!data || typeof data !== "object") {
      setError("Form submission failed. Please refresh and try again.");
      setCreating(false);
      return;
    }
    // Defensive: prevent crash on bad data/submit
    const fd = new FormData();
    Object.entries(data).forEach(([key, val]) => {
      if (val != null) fd.append(key, val as string);
    });

    const res = await createCampaignAction(fd);
    setCreating(false);
    if (res?.ok) {
      setModalSuccess("Campaign created and scheduled.");
      setSuccess("Campaign created and scheduled.");
      reset();
      setTimeout(() => { setModalSuccess(null); onClose(); }, 1700);
    } else {
      setError(res?.error || "Failed to create campaign.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/20 flex items-center justify-center">
      <div className="bg-background rounded-xl min-w-[340px] max-w-md shadow-lg p-6 w-full relative">
        <button className="absolute right-3 top-2 text-lg" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-bold mb-4 flex gap-2 items-center">
          <PlusCircle className="size-4" />
          New Campaign
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div>
            <Label>Name</Label>
            <Input {...register("name")} required minLength={3} maxLength={100} />
          </div>
          <div>
            <Label>Subject</Label>
            <Input {...register("subject")} required minLength={4} maxLength={200} />
          </div>
          <div>
            <Label>From Email</Label>
            <Input {...register("fromEmail")} required type="email" />
          </div>
          <div>
            <Label>Recipients (one per line or comma separated, up to 1000 emails)</Label>
            <textarea
              {...register("recipients")}
              required
              rows={4}
              className="bg-muted w-full rounded px-3 py-2 border text-sm"
              placeholder="foo@example.com&#10;bar@example.com"
            />
          </div>
          <div>
            <Label>Email Body</Label>
            <textarea
              {...register("body")}
              required
              rows={6}
              className="bg-muted w-full rounded px-3 py-2 border text-sm"
              placeholder="Write your campaign message..."
            />
          </div>
          {/* Optionally allow scheduling later */}
          {/* <div>
            <Label>Schedule for (optional)</Label>
            <Input {...register("scheduledAt")} type="datetime-local" />
          </div> */}
          <Button type="submit" className="mt-2" disabled={creating}>
            <Send className="size-4 mr-1" />
            {creating ? "Creating..." : "Create & Schedule"}
          </Button>
          {success && <div className="text-green-600 text-sm mt-2">{success}</div>}
        </form>
      </div>
    </div>
  );
}