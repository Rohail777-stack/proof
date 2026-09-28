import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Page } from "@/components/proof/Chrome";
import { useProof, type MessageSource } from "@/lib/proof-store";

export const Route = createFileRoute("/preserve")({
  head: () => ({
    meta: [
      { title: "Preserve a message — Proof" },
      {
        name: "description",
        content: "Save the original words someone wrote about working with you, exactly as they were written, and ask them to verify them.",
      },
      { property: "og:title", content: "Preserve a message — Proof" },
      {
        property: "og:description",
        content: "Keep the original words that mattered. The author verifies them before they're shown.",
      },
    ],
  }),
  component: PreservePage,
});

const schema = z.object({
  authorName: z.string().trim().min(1, "Add the author's name").max(100),
  authorEmail: z.string().trim().email("Add a valid author email").max(160),
  authorLinkedIn: z.string().trim().max(255).optional(),
  authorRole: z.string().trim().min(1, "Add the author's role").max(120),
  company: z.string().trim().min(1, "Add the company").max(120),
  relationship: z.string().trim().min(1, "Add your relationship").max(120),
  body: z.string().trim().min(1, "Paste the message").max(2000),
  source: z.enum(["Slack", "Email", "WhatsApp", "LinkedIn", "Other"]),
  originalDate: z.string().trim().optional(),
  consent: z.literal(true, { message: "Please confirm you have permission" }),
});

const sources: MessageSource[] = ["Slack", "Email", "WhatsApp", "LinkedIn", "Other"];

function PreservePage() {
  const { addMessage } = useProof();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      authorName: fd.get("authorName"),
      authorEmail: fd.get("authorEmail"),
      authorLinkedIn: fd.get("authorLinkedIn"),
      authorRole: fd.get("authorRole"),
      company: fd.get("company"),
      relationship: fd.get("relationship"),
      body: fd.get("body"),
      source: fd.get("source"),
      originalDate: fd.get("originalDate") || undefined,
      consent: fd.get("consent") === "on",
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    const { consent: _consent, authorLinkedIn, originalDate, ...rest } = parsed.data;
    addMessage({
      ...rest,
      authorLinkedIn: authorLinkedIn ?? "",
      ...(originalDate ? { originalDate } : {}),
    });
    navigate({ to: "/dashboard" });
  }

  return (
    <Page>
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-4xl">
          <p className="label-eyebrow">Add a message</p>
          <h1 className="mt-3 font-display text-4xl tracking-tight">Preserve a message</h1>
          <p className="mt-3 max-w-md text-sm text-ink/70 text-pretty">
            Keep the original words exactly as they were written. We'll ask the author to verify them.
          </p>

          <form onSubmit={onSubmit} className="mt-8 rounded-[1.75rem] bg-card/45 p-7 ring-1 ring-line backdrop-blur-xl sm:p-9">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="font-mono text-[11px] uppercase tracking-wider text-fog">Author name</span>
                <input name="authorName" maxLength={100} className="field-input" placeholder="Full name" />
              </label>
              <label className="block">
                <span className="font-mono text-[11px] uppercase tracking-wider text-fog">Author email</span>
                <input name="authorEmail" type="email" maxLength={160} className="field-input" placeholder="name@company.com" />
                <span className="mt-1.5 block text-xs text-ink/60">
                  The author will receive a verification email at this address. They don't need to create an account.
                </span>
              </label>
              <label className="block">
                <span className="font-mono text-[11px] uppercase tracking-wider text-fog">Author LinkedIn URL</span>
                <input name="authorLinkedIn" maxLength={255} className="field-input" placeholder="linkedin.com/in/username" />
              </label>
              <label className="block">
                <span className="font-mono text-[11px] uppercase tracking-wider text-fog">Author role</span>
                <input name="authorRole" maxLength={120} className="field-input" placeholder="Their role at the time" />
              </label>
              <label className="block">
                <span className="font-mono text-[11px] uppercase tracking-wider text-fog">
                  Company where we worked together
                </span>
                <input name="company" maxLength={120} className="field-input" placeholder="Company name" />
              </label>
              <label className="block">
                <span className="font-mono text-[11px] uppercase tracking-wider text-fog">Relationship</span>
                <input name="relationship" maxLength={120} className="field-input" placeholder="e.g. direct manager" />
              </label>
              <label className="block">
                <span className="font-mono text-[11px] uppercase tracking-wider text-fog">Original source</span>
                <select name="source" className="field-input" defaultValue="Slack">
                  {sources.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="font-mono text-[11px] uppercase tracking-wider text-fog">Original date</span>
                <input name="originalDate" type="date" className="field-input" />
              </label>
              <label className="block sm:col-span-2">
                <span className="font-mono text-[11px] uppercase tracking-wider text-fog">Original message</span>
                <textarea
                  name="body"
                  rows={4}
                  maxLength={2000}
                  className="field-input resize-none"
                  placeholder="Paste the message exactly as it was written…"
                />
              </label>
            </div>

            <label className="mt-6 flex items-start gap-3 text-sm text-ink/80">
              <input type="checkbox" name="consent" className="mt-0.5 size-4 rounded border-line accent-gold" />I
              confirm that I have permission to preserve and display these original words.
            </label>

            {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}

            <button
              type="submit"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
            >
              Preserve message <span aria-hidden="true">→</span>
            </button>
            <p className="mt-3 font-mono text-[11px] text-fog">
              After submitting, this message shows as <span className="text-gold">Verification pending</span>.
            </p>
          </form>

          <Link to="/dashboard" className="mt-6 inline-flex text-sm text-ink/70 transition-colors hover:text-ink">
            ← Back to dashboard
          </Link>
        </div>
      </section>

      <div className="border-t border-line" />
    </Page>
  );
}
