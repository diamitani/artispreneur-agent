"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { Markdown } from "./Markdown";
import {
  STATUS_LABEL,
  STATUS_TONE,
  type BoardSummary,
  type BoardTask,
  type CustomAgent,
  type Deliverable,
  type PromptEntry,
  type ProvisionSummary,
  type VaultFile,
} from "./types";

const MAX_UPLOAD_BYTES = 2_000_000;
const TEXT_EXT = /\.(txt|md|markdown|csv|tsv|json|ya?ml|html?|xml|rtf|log)$/i;

type Toast = { id: number; tone: "ok" | "err" | "info"; text: string };

/**
 * Agent Workspace — the artist-facing shell.
 *
 * Drop files, ask in plain language, watch the agents work, approve what
 * leaves the building. Everything here drives the ROSTR backend:
 * compile → provision → execute → approve.
 */
export function AgentWorkspace() {
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [tasks, setTasks] = useState<BoardTask[]>([]);
  const [summary, setSummary] = useState<BoardSummary | null>(null);
  const [files, setFiles] = useState<VaultFile[]>([]);
  const [prompts, setPrompts] = useState<PromptEntry[]>([]);
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [agents, setAgents] = useState<CustomAgent[]>([]);
  const [provision, setProvision] = useState<ProvisionSummary | null>(null);
  const [openDoc, setOpenDoc] = useState<{ path: string; content: string } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const dragDepth = useRef(0);

  const toast = useCallback((tone: Toast["tone"], text: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, tone, text }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 5000);
  }, []);

  const refresh = useCallback(async () => {
    const [board, vault, deliv, ag, prov] = await Promise.all([
      fetch("/api/rostr/tasks").then((r) => r.json()).catch(() => null),
      fetch("/api/vault/files").then((r) => r.json()).catch(() => null),
      fetch("/api/rostr/deliverables").then((r) => r.json()).catch(() => null),
      fetch("/api/rostr/agents").then((r) => r.json()).catch(() => null),
      fetch("/api/userops/provision").then((r) => r.json()).catch(() => null),
    ]);
    if (board?.board) {
      setTasks(board.board.tasks ?? []);
      setSummary(board.summary ?? null);
    }
    if (vault?.files) setFiles(vault.files);
    if (deliv?.deliverables) setDeliverables(deliv.deliverables);
    if (ag?.agents) setAgents(ag.agents);
    if (prov?.summary) setProvision(prov.summary);
  }, []);

  useEffect(() => {
    fetch("/api/prompts")
      .then((r) => r.json())
      .then((d) => setPrompts(d.prompts ?? []))
      .catch(() => undefined);
    refresh();
  }, [refresh]);

  // ---------------------------------------------------------------- actions

  async function compile() {
    const text = prompt.trim();
    if (!text || busy) return;
    setBusy("compile");
    try {
      const res = await fetch("/api/rostr/compile", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ prompt: text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Compile failed");

      toast("ok", `Planned ${data.stages.npao.steps} steps for "${data.intent.use_case}".`);
      setPrompt("");

      // Provision on first compile so the workspace is ready to execute.
      await fetch("/api/userops/provision", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ compile_id: data.compile_id }),
      }).catch(() => undefined);

      await refresh();
    } catch (e) {
      toast("err", (e as Error).message);
    } finally {
      setBusy(null);
    }
  }

  async function runNext(limit = 1) {
    if (busy) return;
    setBusy("execute");
    try {
      const res = await fetch("/api/rostr/execute", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ limit }),
      });
      const data = await res.json();
      const ok = (data.results ?? []).filter((r: { ok: boolean }) => r.ok);
      const failed = (data.results ?? []).find((r: { ok: boolean }) => !r.ok);

      if (ok.length) toast("ok", `Completed ${ok.length} task${ok.length > 1 ? "s" : ""}.`);
      if (failed) toast("err", failed.detail ?? "Task failed");
      if (!ok.length && !failed) toast("info", "Nothing left to run.");

      await refresh();
    } catch (e) {
      toast("err", (e as Error).message);
    } finally {
      setBusy(null);
    }
  }

  async function decide(taskId: string, status: "approved" | "rejected") {
    setBusy(taskId);
    try {
      const res = await fetch("/api/rostr/tasks", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ task_id: taskId, status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Update failed");

      // Approving clears the gate; complete it so the plan moves on.
      if (status === "approved") {
        await fetch("/api/rostr/tasks", {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ task_id: taskId, status: "done" }),
        }).catch(() => undefined);
      }
      toast("ok", status === "approved" ? "Approved." : "Rejected — sent back.");
      await refresh();
    } catch (e) {
      toast("err", (e as Error).message);
    } finally {
      setBusy(null);
    }
  }

  const upload = useCallback(
    async (fileList: File[]) => {
      if (!fileList.length) return;
      setBusy("upload");
      try {
        const payload = [];
        for (const file of fileList) {
          if (file.size > MAX_UPLOAD_BYTES) {
            toast("err", `${file.name} is too large (max 2MB).`);
            continue;
          }
          const isText = TEXT_EXT.test(file.name) || file.type.startsWith("text/");
          if (isText) {
            payload.push({
              name: file.name,
              content: await file.text(),
              content_type: file.type || "text/plain",
            });
          } else {
            const buf = await file.arrayBuffer();
            let binary = "";
            const bytes = new Uint8Array(buf);
            for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
            payload.push({
              name: file.name,
              content: btoa(binary),
              content_type: file.type || "application/octet-stream",
              binary: true,
            });
          }
        }
        if (!payload.length) return;

        const res = await fetch("/api/vault/files", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ files: payload, category: "music-and-artist-assets" }),
        });
        const data = await res.json();
        const stored = data.stored?.length ?? 0;
        if (stored) toast("ok", `Added ${stored} file${stored > 1 ? "s" : ""} to your vault.`);
        for (const f of data.failed ?? []) toast("err", `${f.name}: ${f.error}`);
        await refresh();
      } catch (e) {
        toast("err", (e as Error).message);
      } finally {
        setBusy(null);
      }
    },
    [refresh, toast],
  );

  async function openDeliverable(path: string) {
    try {
      const res = await fetch(`/api/rostr/deliverables?path=${encodeURIComponent(path)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not open");
      setOpenDoc({ path, content: data.content });
    } catch (e) {
      toast("err", (e as Error).message);
    }
  }

  // ------------------------------------------------------------ drag & drop

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      dragDepth.current = 0;
      setDragging(false);
      upload(Array.from(e.dataTransfer.files ?? []));
    },
    [upload],
  );

  const needsApproval = tasks.filter((t) => t.status === "needs_approval");
  const runnable = tasks.filter((t) => t.status === "planned" || t.status === "in_progress");
  const deliverableByTask = new Map(
    deliverables.map((d) => [d.path.split("/").pop()?.split("-")[0] ?? "", d]),
  );

  return (
    <div
      className="min-h-[100dvh] bg-[color:var(--color-bg-page)] text-[color:var(--color-text-primary)]"
      onDragEnter={(e) => {
        e.preventDefault();
        dragDepth.current += 1;
        setDragging(true);
      }}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={(e) => {
        e.preventDefault();
        dragDepth.current -= 1;
        if (dragDepth.current <= 0) setDragging(false);
      }}
      onDrop={onDrop}
    >
      {dragging && (
        <div className="pointer-events-none fixed inset-0 z-[900] flex items-center justify-center bg-[color:var(--color-black)]/80 backdrop-blur-sm">
          <div className="rounded-[14px] border-2 border-dashed border-[color:var(--color-gold)] px-12 py-10 text-center">
            <p className="font-heading text-2xl text-[color:var(--color-gold)]">Drop to add</p>
            <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">
              Files go into your Knowledge Vault and become context for every agent.
            </p>
          </div>
        </div>
      )}

      <Header provision={provision} summary={summary} />

      <main className="mx-auto max-w-6xl px-4 py-7">
        <CommandBar
          prompt={prompt}
          setPrompt={setPrompt}
          onCompile={compile}
          busy={busy}
          prompts={prompts}
          onUploadClick={upload}
        />

        {needsApproval.length > 0 && (
          <ApprovalQueue
            tasks={needsApproval}
            busy={busy}
            onDecide={decide}
            onOpen={(t) => {
              const d = deliverableByTask.get(t.id);
              if (d) openDeliverable(d.path);
              else toast("info", "No draft recorded for this task yet.");
            }}
          />
        )}

        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_300px]">
          <TaskBoard
            tasks={tasks}
            summary={summary}
            busy={busy}
            runnable={runnable.length}
            onRun={runNext}
            onOpen={(t) => {
              const d = deliverableByTask.get(t.id);
              if (d) openDeliverable(d.path);
              else toast("info", "This task hasn't produced a draft yet.");
            }}
            hasDraft={(t) => deliverableByTask.has(t.id)}
          />

          <aside className="space-y-4">
            <VaultPanel files={files} onPick={upload} busy={busy} />
            <DeliverablePanel items={deliverables} onOpen={openDeliverable} />
            <AgentPanel agents={agents} />
          </aside>
        </div>
      </main>

      {openDoc && <DocDrawer doc={openDoc} onClose={() => setOpenDoc(null)} />}

      <div className="pointer-events-none fixed bottom-5 right-5 z-[950] flex w-[320px] flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto rounded-[8px] border px-3.5 py-2.5 text-[13px] shadow-[var(--shadow-lg)] ${
              t.tone === "ok"
                ? "border-[color:var(--color-success)] bg-[color:var(--color-surface)] text-[color:var(--color-success)]"
                : t.tone === "err"
                  ? "border-[color:var(--color-crimson)] bg-[color:var(--color-surface)] text-[color:var(--color-crimson-light)]"
                  : "border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-text-muted)]"
            }`}
          >
            {t.text}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- sections

function Header({
  provision,
  summary,
}: {
  provision: ProvisionSummary | null;
  summary: BoardSummary | null;
}) {
  return (
    <header className="sticky top-0 z-[500] border-b border-[color:var(--color-border)] bg-[color:var(--color-surface)]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-3">
          <Image src={brand.logo.primaryPng} alt="" width={30} height={30} className="h-[30px] w-[30px]" />
          <div>
            <div className="flex items-center gap-2">
              <p className="font-heading text-[15px]">Artispreneur</p>
              <span className="badge-agent">AGENT</span>
            </div>
            <p className="text-[11px] text-[color:var(--color-text-dim)]">
              {summary?.needs_approval
                ? `${summary.needs_approval} waiting on you`
                : provision?.status === "complete"
                  ? "Your team is ready"
                  : "Setting up your workspace"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <Link href="/skills" className="font-semibold text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text-primary)]">
            Skills
          </Link>
          <Link href="/onboarding" className="font-semibold text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text-primary)]">
            Soul
          </Link>
          <a href="/api/auth/logout" className="text-[color:var(--color-text-dim)] hover:text-[color:var(--color-gold)]">
            Sign out
          </a>
        </div>
      </div>
    </header>
  );
}

function CommandBar({
  prompt,
  setPrompt,
  onCompile,
  busy,
  prompts,
  onUploadClick,
}: {
  prompt: string;
  setPrompt: (v: string) => void;
  onCompile: () => void;
  busy: string | null;
  prompts: PromptEntry[];
  onUploadClick: (files: File[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const featured = prompts.filter((p) => p.featured).slice(0, 5);

  return (
    <section className="rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5">
      <p className="type-mono-label mb-2 text-[color:var(--color-gold)]">Ask for anything</p>
      <h1 className="font-heading text-xl text-[color:var(--color-text-primary)]">
        What do you want to accomplish?
      </h1>

      <div className="mt-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") onCompile();
          }}
          rows={3}
          placeholder="Get my new single to music blogs next month and line up 3 shows in Chicago…"
          className="w-full resize-none rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-bg-page)] px-4 py-3 text-sm text-[color:var(--color-text-primary)] outline-none placeholder:text-[color:var(--color-text-dim)] focus:border-[color:var(--color-gold)]"
        />
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onCompile}
            disabled={!prompt.trim() || busy !== null}
            className="btn btn--primary btn--sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy === "compile" ? "Planning…" : "Plan it →"}
          </button>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy !== null}
            className="btn btn--outline btn--sm disabled:opacity-40"
          >
            {busy === "upload" ? "Adding…" : "Add files"}
          </button>
          <input
            ref={inputRef}
            type="file"
            multiple
            hidden
            onChange={(e) => {
              onUploadClick(Array.from(e.target.files ?? []));
              e.target.value = "";
            }}
          />
          <span className="ml-auto font-mono text-[10px] text-[color:var(--color-text-dim)]">
            ⌘↵ to plan · drop files anywhere
          </span>
        </div>
      </div>

      {featured.length > 0 && (
        <div className="mt-4 border-t border-[color:var(--color-border)] pt-3">
          <p className="type-mono-label mb-2 text-[color:var(--color-text-dim)]">Or start here</p>
          <div className="flex flex-wrap gap-2">
            {featured.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPrompt(p.prompt)}
                title={p.outcome}
                className="rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-card)] px-3 py-1.5 text-[12px] text-[color:var(--color-text-muted)] transition-colors hover:border-[color:var(--color-gold)] hover:text-[color:var(--color-text-primary)]"
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function ApprovalQueue({
  tasks,
  busy,
  onDecide,
  onOpen,
}: {
  tasks: BoardTask[];
  busy: string | null;
  onDecide: (id: string, s: "approved" | "rejected") => void;
  onOpen: (t: BoardTask) => void;
}) {
  return (
    <section className="mt-5 rounded-[12px] border border-[color:var(--color-crimson)] bg-[color:var(--color-surface)] p-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-[color:var(--color-crimson)]" />
        <p className="font-heading text-[15px] text-[color:var(--color-text-primary)]">
          {tasks.length === 1 ? "One thing needs your OK" : `${tasks.length} things need your OK`}
        </p>
      </div>
      <p className="mb-4 text-[13px] text-[color:var(--color-text-muted)]">
        Read it first — nothing has been sent, published, or filed. It only goes out if you
        say so.
      </p>
      <ul className="space-y-2.5">
        {tasks.map((t) => (
          <li
            key={t.id}
            className="flex flex-wrap items-center gap-3 rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-card)] px-4 py-3"
          >
            <div className="min-w-[200px] flex-1">
              <p className="text-sm font-semibold text-[color:var(--color-text-primary)]">{t.title}</p>
              <p className="mt-0.5 font-mono text-[10px] text-[color:var(--color-text-dim)]">
                {t.owner} · {t.phase}
              </p>
            </div>
            <button type="button" onClick={() => onOpen(t)} className="btn btn--outline btn--sm">
              Review draft
            </button>
            <button
              type="button"
              onClick={() => onDecide(t.id, "rejected")}
              disabled={busy !== null}
              className="btn btn--ghost btn--sm disabled:opacity-40"
            >
              Reject
            </button>
            <button
              type="button"
              onClick={() => onDecide(t.id, "approved")}
              disabled={busy !== null}
              className="btn btn--primary btn--sm disabled:opacity-40"
            >
              {busy === t.id ? "…" : "Approve"}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function TaskBoard({
  tasks,
  summary,
  busy,
  runnable,
  onRun,
  onOpen,
  hasDraft,
}: {
  tasks: BoardTask[];
  summary: BoardSummary | null;
  busy: string | null;
  runnable: number;
  onRun: (limit?: number) => void;
  onOpen: (t: BoardTask) => void;
  hasDraft: (t: BoardTask) => boolean;
}) {
  const [showSetup, setShowSetup] = useState(false);

  if (!tasks.length) {
    return (
      <section className="rounded-[12px] border border-dashed border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-10 text-center">
        <p className="font-heading text-lg text-[color:var(--color-text-primary)]">
          Nothing in progress
        </p>
        <p className="mx-auto mt-2 max-w-sm text-[13px] text-[color:var(--color-text-muted)]">
          Tell your team what you want to get done. They&apos;ll figure out the steps, do the
          work, and check with you before anything goes out.
        </p>
      </section>
    );
  }

  // "N" steps are workspace scaffolding — real work, but not the artist's
  // problem. They collapse into one line so the board shows what the artist
  // actually asked for.
  const setup = tasks.filter((t) => t.npao === "N");
  const work = tasks.filter((t) => t.npao !== "N");
  const setupDone = setup.filter((t) => t.status === "done").length;
  const workDone = work.filter((t) => t.status === "done").length;

  return (
    <section className="rounded-[12px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="type-overline">What we&apos;re doing</p>
          <p className="mt-1 text-[12px] text-[color:var(--color-text-dim)]">
            {workDone} of {work.length} finished
            {summary?.needs_approval ? ` · ${summary.needs_approval} waiting on you` : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onRun(1)}
            disabled={busy !== null || runnable === 0}
            className="btn btn--outline btn--sm disabled:opacity-40"
          >
            Do one
          </button>
          <button
            type="button"
            onClick={() => onRun(6)}
            disabled={busy !== null || runnable === 0}
            className="btn btn--primary btn--sm disabled:opacity-40"
          >
            {busy === "execute" ? "Working…" : "Start working"}
          </button>
        </div>
      </div>

      {setup.length > 0 && (
        <div className="mb-3">
          <button
            type="button"
            onClick={() => setShowSetup((v) => !v)}
            className="flex w-full items-center gap-2.5 rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-bg-page)] px-4 py-2.5 text-left transition-colors hover:border-[color:var(--color-border-dark)]"
          >
            <span
              className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                setupDone === setup.length
                  ? "bg-[color:var(--color-success)]"
                  : "bg-[color:var(--color-text-dim)]"
              }`}
            />
            <span className="flex-1 text-[12.5px] text-[color:var(--color-text-muted)]">
              {setupDone === setup.length
                ? "Workspace ready"
                : `Setting up your workspace — ${setupDone} of ${setup.length}`}
            </span>
            <span className="text-[11px] text-[color:var(--color-text-dim)]">
              {showSetup ? "Hide" : "Details"}
            </span>
          </button>
          {showSetup && (
            <ul className="mt-2 space-y-1.5 pl-4">
              {setup.map((t) => (
                <li
                  key={t.id}
                  className="flex items-center gap-2 text-[12px] text-[color:var(--color-text-dim)]"
                >
                  <span>{t.status === "done" ? "✓" : "·"}</span>
                  <span className="flex-1">{t.title}</span>
                  {hasDraft(t) && (
                    <button
                      type="button"
                      onClick={() => onOpen(t)}
                      className="text-[11px] text-[color:var(--color-gold)] underline"
                    >
                      view
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <ol className="space-y-2">
        {work.map((t) => (
          <li
            key={t.id}
            className={`flex items-start gap-3 rounded-[10px] border bg-[color:var(--color-card)] px-4 py-3 ${
              t.status === "needs_approval"
                ? "border-[color:var(--color-crimson)]"
                : "border-[color:var(--color-border)]"
            }`}
          >
            <span
              className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${
                t.status === "done"
                  ? "bg-[color:var(--color-success)]"
                  : t.status === "needs_approval"
                    ? "bg-[color:var(--color-crimson)]"
                    : t.status === "in_progress"
                      ? "bg-[color:var(--color-gold)]"
                      : "bg-[color:var(--color-gray-mid)]"
              }`}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-[color:var(--color-text-primary)]">{t.title}</p>
              <p className="mt-0.5 text-[11.5px] text-[color:var(--color-text-dim)]">
                {t.requires_approval
                  ? "We'll draft this and check with you before it goes out"
                  : t.owner}
              </p>
            </div>
            {hasDraft(t) && (
              <button
                type="button"
                onClick={() => onOpen(t)}
                className="shrink-0 text-[11.5px] text-[color:var(--color-gold)] underline hover:text-[color:var(--color-gold-light)]"
              >
                Read it
              </button>
            )}
            <span
              className={`shrink-0 rounded border px-2 py-0.5 text-[10.5px] ${STATUS_TONE[t.status]}`}
            >
              {STATUS_LABEL[t.status]}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function VaultPanel({
  files,
  onPick,
  busy,
}: {
  files: VaultFile[];
  onPick: (files: File[]) => void;
  busy: string | null;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="type-overline">Knowledge Vault</p>
        <button
          type="button"
          onClick={() => ref.current?.click()}
          disabled={busy !== null}
          className="font-mono text-[10px] text-[color:var(--color-gold)] hover:text-[color:var(--color-gold-light)] disabled:opacity-40"
        >
          + Add
        </button>
        <input
          ref={ref}
          type="file"
          multiple
          hidden
          onChange={(e) => {
            onPick(Array.from(e.target.files ?? []));
            e.target.value = "";
          }}
        />
      </div>
      {files.length ? (
        <ul className="space-y-2">
          {files.slice(0, 8).map((f) => (
            <li key={f.id} className="text-[12.5px]">
              <span className="block truncate text-[color:var(--color-text-primary)]">{f.name}</span>
              <span className="font-mono text-[10px] text-[color:var(--color-text-dim)]">
                {(f.bytes / 1024).toFixed(1)}kb · {f.indexed ? "searchable" : "stored"}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[12.5px] text-[color:var(--color-text-muted)]">
          Drop your EPK, contracts, notes, or catalog here. Agents cite them when they work.
        </p>
      )}
    </div>
  );
}

function DeliverablePanel({
  items,
  onOpen,
}: {
  items: Deliverable[];
  onOpen: (path: string) => void;
}) {
  if (!items.length) return null;
  return (
    <div className="rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4">
      <p className="type-overline mb-3">Deliverables · {items.length}</p>
      <ul className="space-y-2">
        {items.slice(0, 10).map((d) => (
          <li key={d.path}>
            <button
              type="button"
              onClick={() => onOpen(d.path)}
              className="block w-full truncate text-left text-[12.5px] text-[color:var(--color-text-muted)] hover:text-[color:var(--color-gold)]"
            >
              {d.summary}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AgentPanel({ agents }: { agents: CustomAgent[] }) {
  if (!agents.length) return null;
  return (
    <div className="rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4">
      <p className="type-overline mb-3">Your agents</p>
      <ul className="space-y-2.5">
        {agents.map((a) => (
          <li key={a.id} className="text-[12.5px]">
            <span className="block text-[color:var(--color-text-primary)]">{a.name}</span>
            <span className="font-mono text-[10px] text-[color:var(--color-text-dim)]">{a.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DocDrawer({
  doc,
  onClose,
}: {
  doc: { path: string; content: string };
  onClose: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[800] flex justify-end bg-[color:var(--color-black)]/70 backdrop-blur-sm">
      <button type="button" aria-label="Close" className="flex-1 cursor-default" onClick={onClose} />
      <div className="flex h-full w-full max-w-2xl flex-col border-l border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
        <div className="flex items-center justify-between gap-3 border-b border-[color:var(--color-border)] px-5 py-3">
          <p className="truncate font-mono text-[11px] text-[color:var(--color-text-dim)]">{doc.path}</p>
          <button type="button" onClick={onClose} className="btn btn--ghost btn--sm">
            Close
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <Markdown content={doc.content} />
        </div>
      </div>
    </div>
  );
}
