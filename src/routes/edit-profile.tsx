import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Page } from "@/components/proof/Chrome";
import { Avatar } from "@/components/proof/Avatar";
import { useProof } from "@/lib/proof-store";

export const Route = createFileRoute("/edit-profile")({
  head: () => ({
    meta: [
      { title: "Edit your profile — Proof" },
      { name: "description", content: "Update your photo, name, headline, current role, bio, LinkedIn link and companies on Proof." },
      { property: "og:title", content: "Edit your profile — Proof" },
      { property: "og:description", content: "Keep your Proof profile current." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: EditProfile,
});

const schema = z.object({
  name: z.string().trim().min(1, "Add your name").max(100),
  headline: z.string().trim().min(1, "Add a professional headline").max(160),
  currentRole: z.string().trim().max(160),
  linkedIn: z.string().trim().max(255),
  bio: z.string().trim().min(1, "Add a short bio").max(1200),
  companies: z.string().trim().max(300),
});

function EditProfile() {
  const { profile, updateProfile } = useProof();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [photo, setPhoto] = useState(profile.photo);
  const [name, setName] = useState(profile.name);

  function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setError("Please choose an image under 4MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(String(reader.result));
      setError(null);
    };
    reader.readAsDataURL(file);
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      name: fd.get("name"),
      headline: fd.get("headline"),
      currentRole: fd.get("currentRole"),
      linkedIn: fd.get("linkedIn"),
      bio: fd.get("bio"),
      companies: fd.get("companies"),
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    const { companies, ...rest } = parsed.data;
    updateProfile({
      ...rest,
      companies: companies.split(",").map((c) => c.trim()).filter(Boolean),
      photo,
    });
    navigate({ to: "/dashboard" });
  }

  return (
    <Page>
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="label-eyebrow">Your profile</p>
          <h1 className="mt-3 font-display text-4xl tracking-tight">Edit profile</h1>

          <form onSubmit={onSubmit} className="mt-8 rounded-[1.75rem] bg-card/45 p-7 ring-1 ring-line backdrop-blur-xl sm:p-9">
            <div className="flex flex-col items-start gap-5 border-b border-line pb-7 sm:flex-row sm:items-center">
              <Avatar src={photo} name={name} className="size-24" />
              <div>
                <span className="font-mono text-[11px] uppercase tracking-wider text-fog">Profile photo</span>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <label className="cursor-pointer rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition-transform duration-300 hover:-translate-y-0.5">
                    {photo ? "Change photo" : "Upload photo"}
                    <input type="file" accept="image/*" className="sr-only" onChange={onPhoto} />
                  </label>
                  {photo ? (
                    <button
                      type="button"
                      onClick={() => setPhoto("")}
                      className="rounded-full bg-card/60 px-4 py-2 text-sm font-medium text-ink ring-1 ring-line transition-colors hover:bg-card/85"
                    >
                      Remove
                    </button>
                  ) : null}
                </div>
                <p className="mt-2 font-mono text-[11px] text-fog">JPG or PNG, up to 4MB.</p>
              </div>
            </div>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="font-mono text-[11px] uppercase tracking-wider text-fog">Name</span>
                <input
                  name="name"
                  defaultValue={profile.name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={100}
                  className="field-input"
                />
              </label>
              <label className="block">
                <span className="font-mono text-[11px] uppercase tracking-wider text-fog">Current company &amp; role</span>
                <input name="currentRole" defaultValue={profile.currentRole} maxLength={160} className="field-input" />
              </label>
              <label className="block sm:col-span-2">
                <span className="font-mono text-[11px] uppercase tracking-wider text-fog">Professional headline</span>
                <input name="headline" defaultValue={profile.headline} maxLength={160} className="field-input" />
              </label>
              <label className="block sm:col-span-2">
                <span className="font-mono text-[11px] uppercase tracking-wider text-fog">LinkedIn profile link</span>
                <input name="linkedIn" defaultValue={profile.linkedIn} maxLength={255} className="field-input" />
              </label>
              <label className="block sm:col-span-2">
                <span className="font-mono text-[11px] uppercase tracking-wider text-fog">About</span>
                <textarea name="bio" defaultValue={profile.bio} rows={6} maxLength={1200} className="field-input resize-none" />
              </label>
              <label className="block sm:col-span-2">
                <span className="font-mono text-[11px] uppercase tracking-wider text-fog">
                  Companies worked at (comma separated)
                </span>
                <input name="companies" defaultValue={profile.companies.join(", ")} maxLength={300} className="field-input" />
              </label>
            </div>

            {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-all duration-300 hover:-translate-y-0.5"
              >
                Save profile
              </button>
              <Link to="/dashboard" className="text-sm text-ink/70 transition-colors hover:text-ink">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </section>

      <div className="border-t border-line" />
    </Page>
  );
}
