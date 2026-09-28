import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Page } from "@/components/proof/Chrome";
import { StatusMark } from "@/components/proof/MessageCard";
import { formatDate, displayName, useProof } from "@/lib/proof-store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Your archive — Proof" },
      { name: "description", content: "See your preserved messages, their verification status, and edit your Proof profile." },
      { property: "og:title", content: "Your archive — Proof" },
      { property: "og:description", content: "A quiet archive of the original words people wrote about working with you." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

type SentNotice = { name: string; email: string; link: string };

function Dashboard() {
  const { profile, messages, requestVerification } = useProof();
  const [sent, setSent] = useState<SentNotice | null>(null);

  function onAsk(id: string, name: string, email: string) {
    const token = requestVerification(id);
    const link = `${window.location.origin}/verify/${token}`;
    setSent({ name, email, link });
  }

  const verified = messages.filter((m) => m.status === "verified").length;
  const pending = messages.filter((m) => m.status === "pending").length;

  return (
    <Page>
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-4xl">
          <p className="label-eyebrow">Your archive</p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-4xl tracking-tight">{displayName(profile)}</h1>
              <p className="mt-1 font-mono text-xs text-fog">
                {messages.length} preserved · {verified} verified · {pending} awaiting the author
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                to="/preserve"
                className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition-transform duration-300 hover:-translate-y-0.5"
              >
                Add another message
              </Link>
              <Link
                to="/edit-profile"
                className="rounded-full bg-card/60 px-4 py-2 text-sm font-medium text-ink ring-1 ring-line transition-all duration-300 hover:bg-card/85"
              >
                Edit profile
              </Link>
              <Link
                to="/profile"
                className="rounded-full bg-card/60 px-4 py-2 text-sm font-medium text-ink ring-1 ring-line transition-all duration-300 hover:bg-card/85"
              >
                View public profile
              </Link>
            </div>
          </div>

          {sent ? (
            <div className="mt-8 rounded-2xl bg-mint/40 px-6 py-5 ring-1 ring-line">
              <p className="font-display text-xl text-ink">Verification request sent</p>
              <p className="mt-1 text-sm text-ink/70">
                An email has been sent to {sent.name} at {sent.email}.
              </p>
              <p className="mt-3 font-mono text-[11px] break-all text-fog">{sent.link}</p>
              <button
                onClick={() => setSent(null)}
                className="mt-3 font-mono text-[10px] uppercase tracking-wider text-ink/60 transition-colors hover:text-ink"
              >
                Dismiss
              </button>
            </div>
          ) : null}

          {messages.length === 0 ? (
            <div className="mt-10 rounded-[1.75rem] bg-card/45 px-7 py-14 text-center ring-1 ring-line backdrop-blur-xl">
              <p className="font-display text-2xl text-ink/70">No messages preserved yet.</p>
              <Link
                to="/preserve"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-transform duration-300 hover:-translate-y-0.5"
              >
                Preserve your first message <span aria-hidden="true">→</span>
              </Link>
            </div>
          ) : (
            <div className="mt-10 overflow-hidden rounded-[1.75rem] bg-card/45 ring-1 ring-line backdrop-blur-xl">
              {messages.map((m) => (
                <div key={m.id} className="flex flex-col gap-3 border-b border-line px-7 py-6 last:border-b-0 sm:flex-row sm:items-center">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-lg text-ink">“{m.body}”</p>
                    <p className="mt-1 text-xs text-ink/60">
                      {m.authorName} · {m.authorRole} · {m.company} · {m.source} · originally written{" "}
                      {formatDate(m.originalDate ?? m.preservedAt)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-5">
                    <div className="text-right">
                      <StatusMark status={m.status} />
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-fog">
                        {formatDate(m.preservedAt)}
                      </p>
                    </div>
                    {m.status === "pending" ? (
                      <button
                        onClick={() => onAsk(m.id, m.authorName, m.authorEmail)}
                        className="rounded-full bg-card/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-ink ring-1 ring-line transition-colors hover:bg-card"
                      >
                        {m.requestSentAt ? "Resend verification email" : "Ask author to verify"}
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="border-t border-line" />
    </Page>
  );
}
