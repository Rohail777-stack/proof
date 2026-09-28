import { createFileRoute, Link } from "@tanstack/react-router";
import { Page } from "@/components/proof/Chrome";
import { Avatar } from "@/components/proof/Avatar";
import { MessageCard } from "@/components/proof/MessageCard";
import { displayName, useProof } from "@/lib/proof-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Proof — What people remember about working with you" },
      {
        name: "description",
        content:
          "Preserve the original messages, notes and words people wrote about working with you — verified by the people who wrote them.",
      },
      { property: "og:title", content: "Proof — What people remember about working with you" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        property: "og:description",
        content: "Your résumé shows what you did. Proof preserves the real words people wrote about working with you.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { profile, messages } = useProof();

  return (
    <Page>
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="animate-bloom label-eyebrow">Preserved, verified, permanent</p>
          <h1 className="animate-rise mt-6 font-display text-[2.75rem] leading-[1.04] tracking-tight text-balance [animation-delay:60ms] sm:text-6xl">
            What do people remember about working with you?
          </h1>
          <p className="animate-rise mx-auto mt-6 max-w-xl text-base leading-relaxed text-ink/70 text-pretty [animation-delay:140ms] sm:text-lg">
            Your résumé shows what you did. Proof preserves the real words people wrote about working with you.
          </p>
          <div className="animate-rise mt-9 flex flex-col items-center justify-center gap-3 [animation-delay:220ms] sm:flex-row">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper shadow-[0_14px_34px_-14px_oklch(0.27_0.028_55/0.5)] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
            >
              Create your profile <span aria-hidden="true">→</span>
            </Link>
            <Link
              to="/profile"
              className="inline-flex items-center rounded-full bg-card/55 px-6 py-3 text-sm font-medium text-ink ring-1 ring-line backdrop-blur-md transition-all duration-300 hover:bg-card/85 hover:-translate-y-0.5 active:translate-y-0"
            >
              See the archive
            </Link>
          </div>
        </div>
      </section>

      <div className="border-t border-line" />

      <section className="py-20">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="label-eyebrow">(a) A public archive</p>
              <h2 className="mt-3 font-display text-4xl tracking-tight">Read like a letter, kept in a sleeve</h2>
            </div>
          </div>

          <article className="mt-10 rounded-[2rem] bg-card/45 p-8 ring-1 ring-line backdrop-blur-xl sm:p-12">
            <header className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <Avatar src={profile.photo} name={displayName(profile)} className="size-24" />
              <div className="flex-1">
                <h3 className="font-display text-3xl tracking-tight">{displayName(profile)}</h3>
                <p className="mt-1 text-ink/70">{profile.headline}</p>
                {profile.currentRole ? <p className="mt-1 text-sm text-ink/70">{profile.currentRole}</p> : null}
              </div>
            </header>

            <div className="mt-10 border-t border-line pt-8">
              <h4 className="font-display text-2xl tracking-tight">In their words</h4>
              {messages.length ? (
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  {messages.slice(0, 2).map((m, i) => (
                    <MessageCard key={m.id} message={m} index={i} />
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-2xl bg-card/40 px-6 py-10 text-center ring-1 ring-line">
                  <p className="font-display text-xl text-ink/70">No messages preserved yet.</p>
                  <Link
                    to="/preserve"
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    Preserve your first message <span aria-hidden="true">→</span>
                  </Link>
                </div>
              )}
              <Link
                to="/profile"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink/80 transition-colors hover:text-ink"
              >
                See the full profile <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </article>
        </div>
      </section>

      <div className="border-t border-line" />

      <section className="py-20">
        <div className="mx-auto max-w-4xl">
          <p className="label-eyebrow">(b) Add a message</p>
          <h2 className="mt-3 font-display text-4xl tracking-tight">Preserve a message</h2>
          <p className="mt-3 max-w-md text-sm text-ink/70 text-pretty">
            Keep the original words exactly as they were written. We'll ask the author to verify them.
          </p>
          <Link
            to="/preserve"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
          >
            Preserve a message <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <div className="border-t border-line" />
    </Page>
  );
}
