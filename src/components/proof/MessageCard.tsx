import { formatDate, type PreservedMessage, type VerificationStatus } from "@/lib/proof-store";

const tints = ["bg-peach/45 hover:bg-peach/65", "bg-lilac/45 hover:bg-lilac/65", "bg-mint/45 hover:bg-mint/65"];

export function StatusMark({ status }: { status: VerificationStatus }) {
  if (status === "verified") {
    return (
      <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-fog">
        <span className="size-1.5 rounded-full bg-mint ring-1 ring-line" />
        Verified author
      </span>
    );
  }
  if (status === "pending") {
    return (
      <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-gold">
        <span className="size-1.5 rounded-full bg-gold/70 ring-1 ring-line" />
        Verification pending
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-destructive">
      <span className="size-1.5 rounded-full bg-destructive/70 ring-1 ring-line" />
      {status === "disputed" ? "Not recognised" : "Reported"}
    </span>
  );
}

export function MessageCard({ message, index = 0 }: { message: PreservedMessage; index?: number }) {
  const originalDate = message.originalDate ?? message.preservedAt;
  return (
    <figure
      className={`rounded-2xl p-6 ring-1 ring-line backdrop-blur transition-all duration-300 hover:-translate-y-0.5 ${tints[index % tints.length]}`}
    >
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-paper/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-ink/70 ring-1 ring-line">
          {message.source}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-fog">
          originally written {formatDate(originalDate)}
        </span>
      </div>
      <blockquote className="mt-4 font-display text-lg leading-snug text-ink text-pretty">
        “{message.body}”
      </blockquote>
      <figcaption className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        <div>
          <a
            href={message.authorLinkedIn}
            target="_blank"
            rel="noreferrer noopener"
            className="group inline-flex items-center gap-1 text-sm font-medium transition-colors hover:text-ink"
          >
            {message.authorName}{" "}
            <span aria-hidden="true" className="opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              ↗
            </span>
          </a>
          <p className="text-xs text-ink/60">
            {message.authorRole} · {message.company}
          </p>
        </div>
        <div className="text-right">
          <StatusMark status={message.status} />
          <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-fog">
            preserved {formatDate(message.preservedAt)}
          </p>
        </div>
      </figcaption>
    </figure>
  );
}
