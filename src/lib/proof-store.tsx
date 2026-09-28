import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type VerificationStatus = "pending" | "verified" | "disputed" | "reported";

export type MessageSource = "Slack" | "Email" | "WhatsApp" | "LinkedIn" | "Other";

export type PreservedMessage = {
  id: string;
  authorName: string;
  authorEmail: string;
  authorLinkedIn: string;
  authorRole: string;
  company: string;
  relationship: string;
  body: string;
  source: MessageSource;
  status: VerificationStatus;
  preservedAt: string; // ISO date
  originalDate?: string; // ISO date; defaults to preservedAt
  verifyToken?: string; // unique per-message link token, only shared with the author
  requestSentAt?: string; // ISO date the verification email was sent
};

export type Profile = {
  name: string;
  headline: string;
  currentRole: string;
  linkedIn: string;
  bio: string;
  companies: string[];
  photo: string; // data URL, empty when not uploaded
};

const STORAGE_KEY = "proof.state.v2";

// Generic empty profile — each owner fills in their own details via Edit profile.
const defaultProfile: Profile = {
  name: "",
  headline: "",
  currentRole: "",
  linkedIn: "",
  bio: "",
  companies: [],
  photo: "",
};

export function displayName(profile: Profile) {
  return profile.name.trim() || "Your name";
}

type ProofState = { profile: Profile; messages: PreservedMessage[] };

type ProofContextValue = ProofState & {
  addMessage: (
    input: Omit<PreservedMessage, "id" | "status" | "preservedAt" | "originalDate" | "verifyToken" | "requestSentAt"> & {
      originalDate?: string;
    },
  ) => PreservedMessage;
  requestVerification: (id: string) => string; // returns the unique verification link
  setStatus: (id: string, status: VerificationStatus) => void;
  updateProfile: (profile: Profile) => void;
};

const ProofContext = createContext<ProofContextValue | null>(null);

export function ProofProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProofState>({
    profile: defaultProfile,
    messages: [],
  });

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ProofState;
        setState({
          profile: { ...defaultProfile, ...parsed.profile },
          messages: parsed.messages ?? [],
        });
      }
    } catch {
      /* ignore */
    }
  }, []);

  const persist = useCallback((next: ProofState) => {
    setState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<ProofContextValue>(
    () => ({
      ...state,
      addMessage: (input) => {
        const preservedAt = new Date().toISOString().slice(0, 10);
        const message: PreservedMessage = {
          ...input,
          id: `m${Date.now()}`,
          status: "pending",
          preservedAt,
          originalDate: input.originalDate ?? preservedAt,
        };
        persist({ ...state, messages: [message, ...state.messages] });
        return message;
      },
      requestVerification: (id) => {
        const existing = state.messages.find((m) => m.id === id);
        const token =
          existing?.verifyToken ??
          (typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2)}`);
        persist({
          ...state,
          messages: state.messages.map((m) =>
            m.id === id
              ? { ...m, verifyToken: token, status: "pending", requestSentAt: new Date().toISOString() }
              : m,
          ),
        });
        return token;
      },
      setStatus: (id, status) => {
        persist({
          ...state,
          messages: state.messages.map((m) => (m.id === id ? { ...m, status } : m)),
        });
      },
      updateProfile: (profile) => persist({ ...state, profile }),
    }),
    [state, persist],
  );

  return <ProofContext.Provider value={value}>{children}</ProofContext.Provider>;
}

export function useProof() {
  const ctx = useContext(ProofContext);
  if (!ctx) throw new Error("useProof must be used inside ProofProvider");
  return ctx;
}

export function formatDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
