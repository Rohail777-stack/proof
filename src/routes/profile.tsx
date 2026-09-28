import { createFileRoute, Link } from "@tanstack/react-router";
import { Page } from "@/components/proof/Chrome";
import { Avatar } from "@/components/proof/Avatar";
import { MessageCard } from "@/components/proof/MessageCard";
import { useProof } from "@/lib/proof-store";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Public archive — Proof" },
      {
        name: "description",
        content:
          "A preserved archive of the original words people wrote about working with this person, verified by the authors.",
      },
      { property: "og:title", content: "Public archive — Proof" },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        property: "og:description",
        content: "Original messages preserved in the words of the people who wrote them.",
      },
    ],
  }),
  component: PublicProfile,
});

function PublicProfile() {
  const { profile, messages } = useProof();

  return (
    <Page>
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-4xl">
          <p className="label-eyebrow">A public archive</p>

          <article className="mt-8 rounded-[2rem] bg-card/45 p-8 ring-1 ring-line backdrop-blur-xl sm:p-12">
            <header className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <Avatar src={profile.photo} name={profile.name} className="size-28" />
              <div className="flex-1">
                <h1 className="font-display text-4xl tracking-tight">{profile.name}</h1>
                <p className="mt-2 text-ink/70">{profile.headline}</p>
                {profile.currentRole ? <p className="mt-1 text-sm text-ink/70">{profile.currentRole}</p> : null}
                {profile.linkedIn ? (
                  <a
                    href={profile.linkedIn}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-ink/80 transition-colors hover:text-ink"
                  >
                    View LinkedIn <span aria-hidden="true">↗</span>
                  </a>
                ) : null}
              </div>
            </header>

            {profile.bio ? (
              <div className="mt-8 max-w-xl space-y-3 text-sm leading-relaxed text-ink/70 text-pretty">
                {profile.bio.split("\n").filter(Boolean).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            ) : null}

            {profile.companies.length ? (
              <div className="mt-8 border-t border-line pt-6">
                <p className="label-eyebrow">Companies worked at</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {profile.companies.map((c) => (
                    <span
                      key={c}
                      className="rounded-full bg-card/60 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-ink/70 ring-1 ring-line"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-10 border-t border-line pt-8">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <h2 className="font-display text-3xl tracking-tight">In their words</h2>
                <span className="font-mono text-[11px] uppercase tracking-wider text-fog">
                  {messages.length} preserved
                </span>
              </div>
              {messages.length ? (
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  {messages.map((m, i) => (
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
            </div>
          </article>
        </div>
      </section>

      <div className="border-t border-line" />
    </Page>
  );
}
