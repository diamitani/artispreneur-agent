"use client";

import {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { brand } from "@/lib/brand";

// ─── Types ────────────────────────────────────────────────────────────────────

type NavTab = "chat" | "skills" | "knowledge" | "outputs" | "settings";

type Skill = {
  id: string;
  name: string;
  description?: string;
  installed: boolean;
  active: boolean;
  tier: "free" | "workspace" | "studio";
};

type VaultFile = {
  name: string;
  path?: string;
  category?: string;
  size?: number;
  updated_at?: string;
};

type UploadingFile = {
  id: string;
  name: string;
  status: "uploading" | "done" | "error";
};

type ToolStep = { id: string; label: string; status: "running" | "done" };

// ─── Helpers ──────────────────────────────────────────────────────────────────

function msgText(m: UIMessage): string {
  if (!m.parts?.length) return "";
  return m.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");
}

function extractToolSteps(messages: UIMessage[]): ToolStep[] {
  const steps: ToolStep[] = [];
  for (const m of messages) {
    if (m.role !== "assistant") continue;
    for (const part of m.parts ?? []) {
      if (part.type.startsWith("tool-")) {
        const p = part as unknown as { type: string; toolCallId: string; state: string };
        steps.push({
          id: p.toolCallId ?? part.type,
          label: part.type.replace(/^tool-/, "").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          status: p.state === "output-available" || p.state === "output-denied" ? "done" : "running",
        });
      }
    }
  }
  return steps;
}

function fmtSize(bytes?: number) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1] ?? "");
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const SUGGESTIONS = [
  "Draft my artist bio in three lengths",
  "Plan a 42-day release for my next single",
  "Find venues near me that book my genre",
  "What do I need to register with a PRO?",
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function NavButton({
  id,
  active,
  onClick,
  icon,
  label,
}: {
  id: string;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13px] transition-colors ${
        active
          ? "bg-[color:var(--color-gold)]/10 font-semibold text-[color:var(--color-gold)]"
          : "text-[color:var(--color-text-muted)] hover:bg-white/5 hover:text-white"
      }`}
    >
      {icon}
      <span className="hidden xl:inline">{label}</span>
    </button>
  );
}

function SkillsPanel() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/skills/library")
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setSkills(d.skills ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function toggle(skill: Skill) {
    setToggling(skill.id);
    try {
      const res = await fetch("/api/skills/library", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skillId: skill.id, install: !skill.installed }),
      });
      const data = await res.json();
      if (data.ok) {
        setSkills((prev) =>
          prev.map((s) => (s.id === skill.id ? { ...s, installed: !s.installed, active: !s.installed } : s))
        );
      }
    } catch {}
    setToggling(null);
  }

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-[color:var(--color-gold)] border-t-transparent" />
      </div>
    );
  }

  const active = skills.filter((s) => s.installed);
  const available = skills.filter((s) => !s.installed);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
      {active.length > 0 && (
        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-gold)]">
            Active · {active.length}
          </p>
          <div className="space-y-2">
            {active.map((s) => (
              <SkillCard key={s.id} skill={s} toggling={toggling === s.id} onToggle={() => toggle(s)} />
            ))}
          </div>
        </div>
      )}
      {available.length > 0 && (
        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-text-dim)]">
            Available
          </p>
          <div className="space-y-2">
            {available.map((s) => (
              <SkillCard key={s.id} skill={s} toggling={toggling === s.id} onToggle={() => toggle(s)} />
            ))}
          </div>
        </div>
      )}
      {skills.length === 0 && (
        <p className="text-center text-[12px] text-[color:var(--color-text-dim)] pt-8">
          No skills available yet.
        </p>
      )}
    </div>
  );
}

function SkillCard({
  skill,
  toggling,
  onToggle,
}: {
  skill: Skill;
  toggling: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[12px] font-semibold text-white truncate">{skill.name}</p>
          {skill.description && (
            <p className="mt-0.5 text-[11px] text-[color:var(--color-text-dim)] line-clamp-2">
              {skill.description}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onToggle}
          disabled={toggling}
          className={`shrink-0 rounded-full px-2.5 py-1 font-mono text-[10px] font-bold transition-colors disabled:opacity-50 ${
            skill.installed
              ? "bg-[color:var(--color-gold)]/15 text-[color:var(--color-gold)] hover:bg-red-500/15 hover:text-red-400"
              : "border border-[color:var(--color-border)] text-[color:var(--color-text-dim)] hover:border-[color:var(--color-gold)] hover:text-[color:var(--color-gold)]"
          }`}
        >
          {toggling ? "…" : skill.installed ? "On" : "Add"}
        </button>
      </div>
    </div>
  );
}

function KnowledgePanel({
  uploads,
  onUpload,
}: {
  uploads: UploadingFile[];
  onUpload: (files: FileList) => void;
}) {
  const [files, setFiles] = useState<VaultFile[]>([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    fetch("/api/vault/files")
      .then((r) => r.json())
      .then((d) => { if (d.ok) setFiles(d.files ?? []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [uploads]);

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length) onUpload(e.dataTransfer.files);
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 px-4 py-4 gap-4">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-6 transition-colors ${
          dragging
            ? "border-[color:var(--color-gold)] bg-[color:var(--color-gold)]/5"
            : "border-[color:var(--color-border)] hover:border-[color:var(--color-gold)]/50"
        }`}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
        </svg>
        <p className="text-[12px] font-medium text-[color:var(--color-text-muted)]">
          Drop files or click to upload
        </p>
        <p className="text-[11px] text-[color:var(--color-text-dim)]">
          PDF, DOCX, TXT, MP3, images
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && onUpload(e.target.files)}
        />
      </div>

      {/* In-progress uploads */}
      {uploads.length > 0 && (
        <div className="space-y-1.5">
          {uploads.map((u) => (
            <div key={u.id} className="flex items-center gap-2 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-card)] px-3 py-2">
              {u.status === "uploading" ? (
                <span className="h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-[color:var(--color-gold)] border-t-transparent" />
              ) : u.status === "done" ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-crimson)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
              )}
              <span className="flex-1 truncate text-[12px] text-[color:var(--color-text-muted)]">{u.name}</span>
              <span className={`font-mono text-[10px] ${u.status === "error" ? "text-[color:var(--color-crimson)]" : "text-[color:var(--color-text-dim)]"}`}>
                {u.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* File list */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex h-20 items-center justify-center">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-[color:var(--color-gold)] border-t-transparent" />
          </div>
        ) : files.length === 0 ? (
          <p className="text-center text-[12px] text-[color:var(--color-text-dim)] pt-6">
            No files yet. Upload above to give your agent context.
          </p>
        ) : (
          <div className="space-y-1.5">
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-2.5 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-card)] px-3 py-2.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-dim)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-[12px] font-medium text-white">{f.name}</p>
                  {f.category && (
                    <p className="font-mono text-[10px] text-[color:var(--color-text-dim)]">{f.category}</p>
                  )}
                </div>
                {f.size && <span className="shrink-0 font-mono text-[10px] text-[color:var(--color-text-dim)]">{fmtSize(f.size)}</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function AgentWorkspace({ artistId }: { artistId?: string }) {
  const [tab, setTab] = useState<NavTab>("chat");
  const [input, setInput] = useState("");
  const [uploads, setUploads] = useState<UploadingFile[]>([]);
  const [pendingFiles, setPendingFiles] = useState<{ name: string; content: string }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/agent/chat", body: artistId ? { artistId } : {} }),
    [artistId],
  );

  const { messages, sendMessage, status, error } = useChat({ transport });
  const busy = status === "submitted" || status === "streaming";
  const toolSteps = extractToolSteps(messages);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`;
  }, [input]);

  async function handleFiles(fileList: FileList) {
    const arr = Array.from(fileList);
    const newUploads: UploadingFile[] = arr.map((f) => ({
      id: `${f.name}-${Date.now()}`,
      name: f.name,
      status: "uploading",
    }));
    setUploads((prev) => [...prev, ...newUploads]);

    const toIngest: { name: string; content: string; content_type: string; binary: boolean }[] = [];

    for (let i = 0; i < arr.length; i++) {
      const file = arr[i];
      if (!file) continue;
      const uid = newUploads[i]?.id;
      if (!uid) continue;
      try {
        const isText = file.type.startsWith("text/") ||
          file.name.endsWith(".txt") || file.name.endsWith(".md") ||
          file.name.endsWith(".csv") || file.name.endsWith(".json");

        let content: string;
        let binary = false;
        if (isText) {
          content = await file.text();
        } else {
          content = await fileToBase64(file);
          binary = true;
        }

        toIngest.push({ name: file.name, content, content_type: file.type, binary });
        setPendingFiles((prev) => [...prev, { name: file.name, content: isText ? content.slice(0, 500) : `[${file.name}]` }]);

        setUploads((prev) => prev.map((u) => u.id === uid ? { ...u, status: "done" } : u));
      } catch {
        setUploads((prev) => prev.map((u) => u.id === uid ? { ...u, status: "error" } : u));
      }
    }

    if (toIngest.length) {
      fetch("/api/vault/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files: toIngest }),
      }).catch(() => {});
    }

    setTimeout(() => setUploads((prev) => prev.filter((u) => u.status === "uploading")), 3000);
  }

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");

    let fullText = text;
    if (pendingFiles.length) {
      const fileCtx = pendingFiles.map((f) => `[Attached: ${f.name}]\n${f.content}`).join("\n\n");
      fullText = `${text}\n\n---\n${fileCtx}`;
      setPendingFiles([]);
    }

    await sendMessage({ text: fullText });
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) handleFiles(e.target.files);
    e.target.value = "";
  }

  const NAV: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    {
      id: "chat",
      label: "Chat",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
      ),
    },
    {
      id: "skills",
      label: "Skills",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ),
    },
    {
      id: "knowledge",
      label: "Knowledge",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M4 19.5A2.5 2.5 0 014 17V5a2.5 2.5 0 012.5-2.5H20v17H6.5z" />
        </svg>
      ),
    },
    {
      id: "outputs",
      label: "Outputs",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
    },
    {
      id: "settings",
      label: "Settings",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex h-[100dvh] bg-[color:var(--color-bg-page)] text-[color:var(--color-text-primary)]">
      {/* ── LEFT SIDEBAR ─────────────────────────────────────────────────── */}
      <aside className="flex w-[52px] xl:w-[220px] shrink-0 flex-col border-r border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
        {/* Logo */}
        <div className="flex items-center gap-2.5 border-b border-[color:var(--color-border)] px-3 py-3.5">
          <Image src={brand.logo.primaryPng} alt="" width={26} height={26} className="h-6.5 w-6.5 shrink-0" />
          <div className="hidden min-w-0 xl:block">
            <p className="truncate font-heading text-[13px] font-bold text-white">Artispreneur</p>
            <p className="font-mono text-[9px] text-[color:var(--color-gold)]">Agent · Workspace</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-1.5 py-3">
          {NAV.map((n) => (
            <NavButton key={n.id} id={n.id} active={tab === n.id} onClick={() => setTab(n.id)} icon={n.icon} label={n.label} />
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-[color:var(--color-border)] px-2 py-3">
          <Link
            href="/api/auth/logout"
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[11px] text-[color:var(--color-text-dim)] transition-colors hover:text-[color:var(--color-crimson)]"
            title="Sign out"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            <span className="hidden xl:inline">Sign out</span>
          </Link>
        </div>
      </aside>

      {/* ── MAIN AREA ────────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">

        {/* ── CHAT TAB ──────────────────────────────────────────── */}
        {tab === "chat" && (
          <>
            {/* Header */}
            <header className="flex items-center justify-between border-b border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-5 py-3 shrink-0">
              <div>
                <h1 className="font-heading text-[15px] font-bold text-white">Hermes Agent</h1>
                <p className="font-mono text-[9px] text-[color:var(--color-text-dim)]">
                  DeepSeek · PAL/ROSTR · approval-first
                </p>
              </div>
              <div className="flex items-center gap-2">
                {busy && (
                  <span className="font-mono text-[10px] text-[color:var(--color-gold)]">thinking…</span>
                )}
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-success)] animate-pulse" />
                  <span className="font-mono text-[10px] text-[color:var(--color-text-dim)]">Online</span>
                </span>
              </div>
            </header>

            {/* Tool steps */}
            {toolSteps.length > 0 && (
              <div className="border-b border-[color:var(--color-border)] bg-[#111113] px-5 py-2 shrink-0">
                <div className="flex items-center gap-4 overflow-x-auto">
                  {toolSteps.slice(-5).map((step, i, arr) => (
                    <div key={step.id} className="flex items-center gap-1.5 whitespace-nowrap">
                      {step.status === "done" ? (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                      ) : (
                        <span className="h-3 w-3 animate-spin rounded-full border-2 border-[color:var(--color-gold)] border-t-transparent" />
                      )}
                      <span className={`font-mono text-[10px] ${step.status === "done" ? "text-[color:var(--color-text-dim)]" : "text-[color:var(--color-gold)]"}`}>
                        {step.label}
                      </span>
                      {i < arr.length - 1 && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--color-gray-mid)" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <div className="mx-auto max-w-3xl">
                {messages.length === 0 && (
                  <div className="flex h-full flex-col items-center justify-center py-20 text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--color-gold)]/10">
                      <Image src={brand.logo.primaryPng} alt="" width={32} height={32} />
                    </div>
                    <p className="font-heading text-lg font-bold text-white">What should we work on?</p>
                    <p className="mt-2 max-w-sm text-[13px] text-[color:var(--color-text-muted)]">
                      Ask for an EPK draft, release plan, contract review, outreach list, or business checklist.
                      Nothing sends without your approval.
                    </p>
                    <div className="mt-5 flex flex-wrap justify-center gap-2">
                      {SUGGESTIONS.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setInput(s)}
                          className="rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-card)] px-3 py-1.5 text-[12px] text-[color:var(--color-text-muted)] transition-colors hover:border-[color:var(--color-gold)] hover:text-[color:var(--color-gold)]"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((m) => {
                  const text = msgText(m);
                  if (!text) return null;
                  const isUser = m.role === "user";
                  return (
                    <div key={m.id} className={`mb-5 flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
                      {/* Avatar */}
                      <div className={`h-7 w-7 shrink-0 rounded-full flex items-center justify-center text-[10px] font-bold ${isUser ? "bg-[color:var(--color-gold)]/20 text-[color:var(--color-gold)]" : "bg-[color:var(--color-gold)]/10"}`}>
                        {isUser ? "You" : <Image src={brand.logo.primaryPng} alt="" width={16} height={16} />}
                      </div>
                      {/* Bubble */}
                      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-[13.5px] leading-relaxed ${isUser ? "bg-[color:var(--color-gold)]/10 text-white rounded-tr-sm" : "bg-[color:var(--color-card)] text-[color:var(--color-text-secondary)] rounded-tl-sm"}`}>
                        {isUser ? (
                          <p className="whitespace-pre-wrap">{text}</p>
                        ) : (
                          <div className="prose prose-invert prose-sm max-w-none prose-p:my-1 prose-pre:bg-black/40 prose-pre:text-[12px] prose-code:text-[color:var(--color-gold)] prose-headings:text-white prose-a:text-[color:var(--color-gold)]">
                            <ReactMarkdown>{text}</ReactMarkdown>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Thinking indicator */}
                {busy && messages[messages.length - 1]?.role === "user" && (
                  <div className="mb-5 flex gap-3">
                    <div className="h-7 w-7 shrink-0 rounded-full bg-[color:var(--color-gold)]/10 flex items-center justify-center">
                      <Image src={brand.logo.primaryPng} alt="" width={16} height={16} />
                    </div>
                    <div className="rounded-2xl rounded-tl-sm bg-[color:var(--color-card)] px-4 py-3">
                      <span className="inline-flex gap-1">
                        {[0, 150, 300].map((d) => (
                          <span key={d} className="h-2 w-2 animate-bounce rounded-full bg-[color:var(--color-gold)]" style={{ animationDelay: `${d}ms` }} />
                        ))}
                      </span>
                    </div>
                  </div>
                )}

                {error && (
                  <p className="mb-4 rounded-lg bg-red-900/20 px-4 py-3 text-[13px] text-red-400">{error.message}</p>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input bar */}
            <div className="border-t border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-3 shrink-0">
              {/* Pending file chips */}
              {pendingFiles.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {pendingFiles.map((f, i) => (
                    <span key={i} className="flex items-center gap-1 rounded-full bg-[color:var(--color-gold)]/10 px-2.5 py-1 font-mono text-[10px] text-[color:var(--color-gold)]">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /></svg>
                      {f.name}
                      <button type="button" onClick={() => setPendingFiles((p) => p.filter((_, j) => j !== i))} className="ml-0.5 opacity-60 hover:opacity-100">×</button>
                    </span>
                  ))}
                </div>
              )}

              <div className="mx-auto max-w-3xl flex items-end gap-2">
                {/* File attach */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Attach file"
                  className="mb-1.5 shrink-0 rounded-lg p-1.5 text-[color:var(--color-text-dim)] transition-colors hover:bg-white/5 hover:text-[color:var(--color-gold)]"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
                  </svg>
                </button>
                <input ref={fileInputRef} type="file" multiple className="hidden" onChange={onFileChange} />

                {/* Textarea */}
                <div className="flex flex-1 items-end rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] px-3 py-2.5 focus-within:border-[color:var(--color-gold)] transition-colors">
                  <textarea
                    ref={textareaRef}
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder="Tell your agent what to work on… (Shift+Enter for new line)"
                    disabled={busy}
                    className="flex-1 resize-none bg-transparent text-[13.5px] text-white placeholder:text-[color:var(--color-text-dim)] outline-none"
                    style={{ minHeight: "24px", maxHeight: "160px" }}
                  />
                </div>

                {/* Send */}
                <button
                  type="button"
                  onClick={send}
                  disabled={busy || !input.trim()}
                  className="mb-1.5 shrink-0 flex h-9 w-9 items-center justify-center rounded-lg bg-[color:var(--color-gold)] text-black transition-all hover:opacity-90 disabled:opacity-30"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" />
                  </svg>
                </button>
              </div>
              <p className="mx-auto mt-1.5 max-w-3xl text-center font-mono text-[10px] text-[color:var(--color-text-dim)]">
                Drafts land in your approval queue — nothing sends without your review
              </p>
            </div>
          </>
        )}

        {/* ── SKILLS TAB ──────────────────────────────────────────── */}
        {tab === "skills" && (
          <div className="flex flex-col flex-1 min-h-0">
            <header className="border-b border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-5 py-4 shrink-0">
              <h1 className="font-heading text-[15px] font-bold text-white">Skills Library</h1>
              <p className="font-mono text-[10px] text-[color:var(--color-text-dim)]">Toggle packs to extend your agent</p>
            </header>
            <SkillsPanel />
          </div>
        )}

        {/* ── KNOWLEDGE TAB ──────────────────────────────────────── */}
        {tab === "knowledge" && (
          <div className="flex flex-col flex-1 min-h-0">
            <header className="border-b border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-5 py-4 shrink-0">
              <h1 className="font-heading text-[15px] font-bold text-white">Knowledge Base</h1>
              <p className="font-mono text-[10px] text-[color:var(--color-text-dim)]">Files your agent can read and cite</p>
            </header>
            <KnowledgePanel uploads={uploads} onUpload={handleFiles} />
          </div>
        )}

        {/* ── OUTPUTS TAB ─────────────────────────────────────────── */}
        {tab === "outputs" && (
          <div className="flex flex-col flex-1 min-h-0">
            <header className="border-b border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-5 py-4 shrink-0">
              <h1 className="font-heading text-[15px] font-bold text-white">Outputs</h1>
              <p className="font-mono text-[10px] text-[color:var(--color-text-dim)]">Agent-generated drafts pending your approval</p>
            </header>
            <div className="flex flex-1 items-center justify-center">
              <p className="text-[13px] text-[color:var(--color-text-dim)]">No outputs yet — start a chat to generate content.</p>
            </div>
          </div>
        )}

        {/* ── SETTINGS TAB ────────────────────────────────────────── */}
        {tab === "settings" && (
          <div className="flex flex-col flex-1 min-h-0">
            <header className="border-b border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-5 py-4 shrink-0">
              <h1 className="font-heading text-[15px] font-bold text-white">Settings</h1>
              <p className="font-mono text-[10px] text-[color:var(--color-text-dim)]">Account & workspace configuration</p>
            </header>
            <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4 max-w-lg">
              <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-text-dim)] mb-3">Account</p>
                <Link href="/dashboard/profile" className="block text-[13px] text-[color:var(--color-gold)] hover:underline">Edit profile →</Link>
              </div>
              <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-text-dim)] mb-3">Integrations</p>
                <Link href="/dashboard/integrations" className="block text-[13px] text-[color:var(--color-gold)] hover:underline">Manage integrations →</Link>
              </div>
              <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--color-text-dim)] mb-3">Dashboard</p>
                <Link href="/dashboard" className="block text-[13px] text-[color:var(--color-gold)] hover:underline">Back to dashboard →</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
