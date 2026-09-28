import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function Ambient() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute -top-32 right-[-6rem] size-[32rem] rounded-full bg-rose/50 blur-3xl" />
      <div className="absolute top-1/3 left-[-8rem] size-[30rem] rounded-full bg-lilac/55 blur-3xl" />
      <div className="absolute bottom-[-8rem] right-1/4 size-[28rem] rounded-full bg-mint/50 blur-3xl" />
    </div>
  );
}

export function Nav() {
  return (
    <nav className="sticky top-0 z-20 border-b border-line bg-paper/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-full bg-ink font-display text-base text-paper">
            p
          </span>
          <span className="font-display text-2xl tracking-tight">Proof</span>
        </Link>
        <div className="hidden items-center gap-8 text-sm text-ink/70 sm:flex">
          <Link to="/profile" className="transition-colors hover:text-ink">
            Public profile
          </Link>
          <Link to="/preserve" className="transition-colors hover:text-ink">
            Preserve a message
          </Link>
        </div>
        <Link
          to="/dashboard"
          className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0"
        >
          Dashboard
        </Link>
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-ink/60 sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="grid size-6 place-items-center rounded-full bg-ink font-display text-sm text-paper">
            p
          </span>
          <span className="font-display text-lg text-ink">Proof</span>
        </div>
        <p>Words preserved, not posted. © 2026 Proof.</p>
        <div className="flex gap-6">
          <Link to="/profile" className="transition-colors hover:text-ink">
            Public profile
          </Link>
          <Link to="/preserve" className="transition-colors hover:text-ink">
            Preserve
          </Link>
        </div>
      </div>
    </footer>
  );
}

export function Page({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-paper font-body text-ink selection:bg-rose/60 selection:text-ink">
      <Ambient />
      <Nav />
      <main className="mx-auto max-w-6xl px-6">{children}</main>
      <Footer />
    </div>
  );
}
