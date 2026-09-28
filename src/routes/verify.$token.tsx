import { createFileRoute, Link } from "@tanstack/react-router";
import { Page } from "@/components/proof/Chrome";
import { formatDate, useProof } from "@/lib/proof-store";

export const Route = createFileRoute("/verify/$token")({
  head: () => ({
    meta: [
      { title: "Verify a message — Proof" },
      { name: "description", content: "Confirm that you wrote these original words and approve preserving them on Proof." },
      { property: "og:title", content: "Verify a message — Proof" },
      { property: "og:description", content: "Confirm you wrote these words before they are preserved on someone's archive." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: VerifyPage,
});

function VerifyPage() {
  const { token } = Route.useParams();
  const { messages, profile, setStatus } = useProof();
  const message = messages.find((m) => m.verifyToken === token);

  if (!message) {
    return (
      <Page>
        <section className="py-24 text-center">
          <h1 className="font-display text-4xl tracking-tight">This link is no longer valid</h1>
          <p className="mt-3 text-sm text-ink/70">The message may have been removed, or the link has expired.</p>
          <Link to="/" className="mt-6 inline-flex text-sm text-ink/70 hover:text-ink">
            ← Back home
          </Link>
        </section>
      </Page>
    );
  }

  return (
    <Page>
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-2xl">
          <p className="label-eyebrow">Verification</p>
          <h1 className="mt-3 font-display text-4xl tracking-tight">
            {message.authorName}, did you write this?
          </h1>
          <p className="mt-3 text-sm text-ink/70 text-pretty">
            You are being asked to verify a message you originally wrote. {profile.name || "the profile owner"} is preserving original words
            you wrote while you both worked at {message.company}. Nothing is shown as verified until you say so, and you
            don't need an account.
          </p>

          <article className="mt-8 rounded-[1.75rem] bg-card/45 p-7 ring-1 ring-line backdrop-blur-xl sm:p-9">
            <blockquote className="font-display text-xl leading-snug text-ink text-pretty">
              “{message.body}”
            </blockquote>
            <dl className="mt-6 grid gap-3 border-t border-line pt-5 text-sm sm:grid-cols-2">
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-wider text-fog">You</dt>
                <dd className="mt-1 text-ink/80">
                  {message.authorName} · {message.authorRole}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-wider text-fog">Preserved by</dt>
                <dd className="mt-1 text-ink/80">{profile.name || "the profile owner"}</dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-wider text-fog">Context</dt>
                <dd className="mt-1 text-ink/80">
                  {message.company} · {message.relationship}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-wider text-fog">Originally written</dt>
                <dd className="mt-1 text-ink/80">
                  {message.source} · {formatDate(message.originalDate ?? message.preservedAt)}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-wider text-fog">Preserved on</dt>
                <dd className="mt-1 text-ink/80">{formatDate(message.preservedAt)}</dd>
              </div>
            </dl>

            {message.status === "pending" ? (
              <div className="mt-8 flex flex-col gap-3">
                <button
                  onClick={() => setStatus(message.id, "verified")}
                  className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-all duration-300 hover:-translate-y-0.5"
                >
                  Yes, I wrote this and approve preserving it
                </button>
                <button
                  onClick={() => setStatus(message.id, "disputed")}
                  className="rounded-full bg-card/60 px-6 py-3 text-sm font-medium text-ink ring-1 ring-line transition-all duration-300 hover:bg-card/85"
                >
                  I don't recognize this
                </button>
                <button
                  onClick={() => setStatus(message.id, "reported")}
                  className="py-2 text-sm font-medium text-fog transition-colors hover:text-destructive"
                >
                  Decline
                </button>
              </div>
            ) : (
              <p className="mt-8 rounded-2xl bg-mint/40 px-5 py-4 text-sm text-ink/80 ring-1 ring-line">
                {message.status === "verified"
                  ? "Thank you — these original words are now preserved as verified."
                  : message.status === "disputed"
                    ? "Thanks. These words are marked as not recognised and won't show as verified."
                    : "Thanks. You declined — these words won't be shown as verified."}
              </p>
            )}
          </article>
        </div>
      </section>

      <div className="border-t border-line" />
    </Page>
  );
}
