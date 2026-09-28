export function Avatar({
  src,
  name,
  className = "size-24",
}: {
  src?: string;
  name: string;
  className?: string;
}) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${className} shrink-0 rounded-full object-cover outline-1 -outline-offset-1 outline-line`}
      />
    );
  }

  return (
    <div
      aria-label={`${name} — no photo uploaded yet`}
      className={`${className} grid shrink-0 place-items-center rounded-full bg-card/70 font-display text-2xl text-ink/50 outline-1 -outline-offset-1 outline-line`}
    >
      {initials || "—"}
    </div>
  );
}
