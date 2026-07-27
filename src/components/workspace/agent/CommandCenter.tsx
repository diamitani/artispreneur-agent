"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { Markdown } from "./Markdown";
import { T } from "./theme";
import type {
  BoardTask,
  CustomAgent,
  Deliverable,
  PromptEntry,
  ProvisionSummary,
  VaultFile,
} from "./types";

const MAX_UPLOAD_BYTES = 2_000_000;
const TEXT_EXT = /\.(txt|md|markdown|csv|tsv|json|ya?ml|html?|xml|rtf|log)$/i;

type Toast = { id: number; tone: "ok" | "err" | "info"; text: string };

/**
 * Your Command Center — the Artispreneur workspace.
 *
 * Layout and language follow the `Dashboard.html` reference: Welcome Back /
 * Your Command Center, Quick Access, Your Roadmap, Recent Outputs, Setup
 * Progress. Every panel is powered by the ROSTR backend (compile → provision
 * → execute → approve) running on AWS AgentCore.
 */
export function CommandCenter() {
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [tasks, setTasks] = useState<BoardTask[]>([]);
  const [files, setFiles] = useState<VaultFile[]>([]);
  const [prompts, setPrompts] = useState<PromptEntry[]>([]);
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [agents, setAgents] = useState<CustomAgent[]>([]);
  const [provision, setProvision] = useState<ProvisionSummary | null>(null);
  const [openDoc, setOpenDoc] = useState<{ path: string; content: string } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const dragDepth = useRef(0);
  const fileInput = useRef<HTMLInputElement>(null);

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

  async function buildPlan() {
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
      if (!res.ok) throw new Error(data.error ?? "Could not build the plan");
      toast("ok", "Your plan is ready.");
      setPrompt("");
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

  async function run(limit: number) {
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
      if (ok.length) toast("ok", `Finished ${ok.length} item${ok.length > 1 ? "s" : ""}.`);
      if (failed) toast("err", failed.detail ?? "That step didn't finish");
      if (!ok.length && !failed) toast("info", "Nothing left to work on.");
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
      if (!res.ok) throw new Error(data.error ?? "Could not update");
      if (status === "approved") {
        await fetch("/api/rostr/tasks", {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ task_id: taskId, status: "done" }),
        }).catch(() => undefined);
      }
      toast("ok", status === "approved" ? "Approved." : "Sent back.");
      await refresh();
    } catch (e) {
      toast("err", (e as Error).message);
    } finally {
      setBusy(null);
    }
  }

  const upload = useCallback(
    async (list: File[]) => {
      if (!list.length) return;
      setBusy("upload");
      try {
        const payload = [];
        for (const file of list) {
          if (file.size > MAX_UPLOAD_BYTES) {
            toast("err", `${file.name} is over 2MB.`);
            continue;
          }
          const isText = TEXT_EXT.test(file.name) || file.type.startsWith("text/");
          if (isText) {
            payload.push({ name: file.name, content: await file.text(), content_type: file.type || "text/plain" });
          } else {
            const bytes = new Uint8Array(await file.arrayBuffer());
            let bin = "";
            for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i] ?? 0);
            payload.push({
              name: file.name,
              content: btoa(bin),
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
        if (data.stored?.length) toast("ok", `Added ${data.stored.length} file(s).`);
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

  // Scaffolding ("N") is real work but not the artist's concern — collapse it.
  const setup = tasks.filter((t) => t.npao === "N");
  const roadmap = tasks.filter((t) => t.npao !== "N");
  const needsYou = tasks.filter((t) => t.status === "needs_approval");
  const runnable = tasks.filter((t) => t.status === "planned" || t.status === "in_progress").length;
  const draftFor = new Map(deliverables.map((d) => [d.path.split("/").pop()?.split("-")[0] ?? "", d]));
  const setupDone = setup.filter((t) => t.status === "done").length;

  return (
    <div
      style={{ background: T.bg, color: T.text, minHeight: "100dvh" }}
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
      onDrop={(e) => {
        e.preventDefault();
        dragDepth.current = 0;
        setDragging(false);
        upload(Array.from(e.dataTransfer.files ?? []));
      }}
    >
      {dragging && (
        <div className="pointer-events-none fixed inset-0 z-[900] flex items-center justify-center" style={{ background: "rgba(31,31,31,.55)" }}>
          <div className="rounded-2xl border-2 border-dashed bg-white px-12 py-10 text-center" style={{ borderColor: T.red }}>
            <p className="text-xl font-bold" style={{ color: T.red }}>Drop to add</p>
            <p className="mt-1 text-sm" style={{ color: T.textMuted }}>
              Files join your knowledge base and your agents cite them.
            </p>
          </div>
        </div>
      )}

      {/* Top bar */}
      <header className="sticky top-0 z-[500] border-b" style={{ background: T.surface, borderColor: T.line }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <div className="flex items-center gap-2.5">
            <Image src={brand.logo.primaryPng} alt="" width={28} height={28} className="h-7 w-7" />
            <span className="text-[15px] font-extrabold tracking-tight">Artispreneur</span>
            <span className="rounded px-1.5 py-0.5 text-[10px] font-bold" style={{ background: T.redSoft, color: T.red }}>
              WORKSPACE
            </span>
          </div>
          <div className="flex items-center gap-4 text-[13px]">
            <span className="flex items-center gap-1.5" style={{ color: T.textMuted }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: T.green }} />
              Online
            </span>
            <Link href="/skills" className="font-medium hover:underline" style={{ color: T.textMuted }}>Skills</Link>
            <Link href="/onboarding" className="font-medium hover:underline" style={{ color: T.textMuted }}>Setup</Link>
            <a href="/api/auth/logout" style={{ color: T.textDim }}>Sign out</a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-7">
        {/* Welcome Back / Your Command Center */}
        <section className="rounded-2xl border p-6" style={{ background: T.surface, borderColor: T.line }}>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: T.gold }}>Welcome Back</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight">Your Command Center</h1>
          <p className="mt-1.5 text-[13.5px]" style={{ color: T.textMuted }}>
            Tell your team what you want to get done. They&apos;ll plan it, do the work, and check
            with you before anything goes out.
          </p>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === "Enter") buildPlan(); }}
            rows={3}
            placeholder="Get my new single to music blogs next month and line up 3 shows in Chicago…"
            className="mt-4 w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2"
            style={{ background: T.bg, borderColor: T.line, color: T.text }}
          />
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={buildPlan}
              disabled={!prompt.trim() || busy !== null}
              className="rounded-lg px-4 py-2 text-[13px] font-bold text-white disabled:opacity-40"
              style={{ background: T.red }}
            >
              {busy === "compile" ? "Building…" : "Build My Plan →"}
            </button>
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              disabled={busy !== null}
              className="rounded-lg border px-4 py-2 text-[13px] font-semibold disabled:opacity-40"
              style={{ borderColor: T.line, color: T.text }}
            >
              {busy === "upload" ? "Adding…" : "Add files"}
            </button>
            <input
              ref={fileInput}
              type="file"
              multiple
              hidden
              onChange={(e) => { upload(Array.from(e.target.files ?? [])); e.target.value = ""; }}
            />
            <span className="ml-auto text-[11px]" style={{ color: T.textDim }}>⌘↵ · drop files anywhere</span>
          </div>

          {/* Quick Access */}
          {prompts.filter((p) => p.featured).length > 0 && (
            <div className="mt-5 border-t pt-4" style={{ borderColor: T.lineSoft }}>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: T.textDim }}>
                Quick Access
              </p>
              <div className="flex flex-wrap gap-2">
                {prompts.filter((p) => p.featured).slice(0, 5).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    title={p.outcome}
                    onClick={() => setPrompt(p.prompt)}
                    className="rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition-colors hover:border-current"
                    style={{ borderColor: T.line, color: T.textMuted, background: T.bg }}
                  >
                    {p.title}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Needs your OK */}
        {needsYou.length > 0 && (
          <section className="mt-5 rounded-2xl border p-5" style={{ background: T.redSoft, borderColor: T.red }}>
            <p className="text-[15px] font-bold" style={{ color: T.red }}>
              {needsYou.length === 1 ? "One thing needs your OK" : `${needsYou.length} things need your OK`}
            </p>
            <p className="mb-3 mt-1 text-[13px]" style={{ color: T.textMuted }}>
              Read it first — nothing has been sent, published, or filed. It only goes out if you say so.
            </p>
            <ul className="space-y-2">
              {needsYou.map((t) => (
                <li key={t.id} className="flex flex-wrap items-center gap-2.5 rounded-xl border bg-white px-4 py-3" style={{ borderColor: T.line }}>
                  <span className="min-w-[180px] flex-1 text-[13.5px] font-semibold">{t.title}</span>
                  <button type="button" onClick={() => { const d = draftFor.get(t.id); if (d) openDeliverable(d.path); else toast("info", "No draft yet."); }}
                    className="rounded-lg border px-3 py-1.5 text-[12.5px] font-semibold" style={{ borderColor: T.line }}>
                    Review
                  </button>
                  <button type="button" onClick={() => decide(t.id, "rejected")} disabled={busy !== null}
                    className="rounded-lg px-3 py-1.5 text-[12.5px] font-semibold disabled:opacity-40" style={{ color: T.textMuted }}>
                    Reject
                  </button>
                  <button type="button" onClick={() => decide(t.id, "approved")} disabled={busy !== null}
                    className="rounded-lg px-4 py-1.5 text-[12.5px] font-bold text-white disabled:opacity-40" style={{ background: T.green }}>
                    {busy === t.id ? "…" : "Approve"}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_300px]">
          {/* Your Roadmap */}
          <section className="rounded-2xl border p-5" style={{ background: T.surface, borderColor: T.line }}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: T.gold }}>Your Roadmap</p>
                <p className="mt-0.5 text-[12.5px]" style={{ color: T.textDim }}>
                  {roadmap.filter((t) => t.status === "done").length} of {roadmap.length} finished
                </p>
              </div>
              {roadmap.length > 0 && (
                <div className="flex gap-2">
                  <button type="button" onClick={() => run(1)} disabled={busy !== null || runnable === 0}
                    className="rounded-lg border px-3 py-1.5 text-[12.5px] font-semibold disabled:opacity-40" style={{ borderColor: T.line }}>
                    Do one
                  </button>
                  <button type="button" onClick={() => run(6)} disabled={busy !== null || runnable === 0}
                    className="rounded-lg px-4 py-1.5 text-[12.5px] font-bold text-white disabled:opacity-40" style={{ background: T.red }}>
                    {busy === "execute" ? "Working…" : "Start Now"}
                  </button>
                </div>
              )}
            </div>

            {roadmap.length === 0 ? (
              <div className="rounded-xl border border-dashed py-10 text-center" style={{ borderColor: T.line }}>
                <p className="text-[15px] font-bold">No plan yet</p>
                <p className="mx-auto mt-1.5 max-w-xs text-[13px]" style={{ color: T.textMuted }}>
                  Describe what you want above and your team will build the roadmap.
                </p>
              </div>
            ) : (
              <>
                {setup.length > 0 && (
                  <div className="mb-3 flex items-center gap-2.5 rounded-xl border px-4 py-2.5" style={{ background: T.bg, borderColor: T.lineSoft }}>
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: setupDone === setup.length ? T.green : T.textDim }} />
                    <span className="text-[12.5px]" style={{ color: T.textMuted }}>
                      {setupDone === setup.length ? "Workspace ready" : `Setting up your workspace — ${setupDone} of ${setup.length}`}
                    </span>
                  </div>
                )}
                <ol className="space-y-2">
                  {roadmap.map((t) => (
                    <li key={t.id} className="flex items-start gap-3 rounded-xl border px-4 py-3"
                      style={{ background: t.status === "needs_approval" ? T.redSoft : T.bg, borderColor: t.status === "needs_approval" ? T.red : T.lineSoft }}>
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ background: t.status === "done" ? T.green : t.status === "needs_approval" ? T.red : t.status === "in_progress" ? T.gold : "#C9C9C9" }} />
                      <div className="min-w-0 flex-1">
                        <p className="text-[13.5px] font-semibold">{t.title}</p>
                        <p className="mt-0.5 text-[11.5px]" style={{ color: T.textDim }}>
                          {t.requires_approval ? "We'll draft this and check with you before it goes out" : t.owner}
                        </p>
                      </div>
                      {draftFor.has(t.id) && (
                        <button type="button" onClick={() => { const d = draftFor.get(t.id); if (d) openDeliverable(d.path); }}
                          className="shrink-0 text-[12px] font-semibold underline" style={{ color: T.red }}>
                          Read it
                        </button>
                      )}
                      <span className="shrink-0 rounded px-2 py-0.5 text-[10.5px] font-semibold"
                        style={{
                          background: t.status === "done" ? T.greenSoft : t.status === "needs_approval" ? "#fff" : T.lineSoft,
                          color: t.status === "done" ? T.greenInk : t.status === "needs_approval" ? T.red : T.textMuted,
                        }}>
                        {t.status === "done" ? "Done" : t.status === "needs_approval" ? "Your call" : t.status === "in_progress" ? "Working" : "Up next"}
                      </span>
                    </li>
                  ))}
                </ol>
              </>
            )}
          </section>

          <aside className="space-y-4">
            <Panel title="Setup Progress">
              {provision ? (
                <>
                  <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: T.lineSoft }}>
                    <div className="h-full rounded-full" style={{ width: `${(provision.done / Math.max(provision.total, 1)) * 100}%`, background: T.green }} />
                  </div>
                  <p className="mt-2 text-[12.5px]" style={{ color: T.textMuted }}>
                    {provision.status === "complete" ? "Your workspace is ready." : `${provision.done} of ${provision.total} complete`}
                  </p>
                </>
              ) : (
                <p className="text-[12.5px]" style={{ color: T.textMuted }}>Build a plan to set up your workspace.</p>
              )}
            </Panel>

            <Panel title="Knowledge Base" action={{ label: "+ Add", onClick: () => fileInput.current?.click() }}>
              {files.length ? (
                <ul className="space-y-2">
                  {files.slice(0, 6).map((f) => (
                    <li key={f.id} className="text-[12.5px]">
                      <span className="block truncate font-medium">{f.name}</span>
                      <span className="text-[11px]" style={{ color: T.textDim }}>
                        {(f.bytes / 1024).toFixed(1)}kb · {f.indexed ? "searchable" : "stored"}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[12.5px]" style={{ color: T.textMuted }}>
                  Drop your EPK, contracts, notes, or catalog here.
                </p>
              )}
            </Panel>

            {deliverables.length > 0 && (
              <Panel title={`Recent Outputs · ${deliverables.length}`}>
                <ul className="space-y-2">
                  {deliverables.slice(0, 8).map((d) => (
                    <li key={d.path}>
                      <button type="button" onClick={() => openDeliverable(d.path)}
                        className="block w-full truncate text-left text-[12.5px] hover:underline" style={{ color: T.textMuted }}>
                        {d.summary}
                      </button>
                    </li>
                  ))}
                </ul>
              </Panel>
            )}

            {agents.length > 0 && (
              <Panel title="Your Agents">
                <ul className="space-y-2">
                  {agents.map((a) => (
                    <li key={a.id} className="text-[12.5px]">
                      <span className="block font-medium">{a.name}</span>
                      <span className="text-[11px]" style={{ color: T.textDim }}>{a.status}</span>
                    </li>
                  ))}
                </ul>
              </Panel>
            )}
          </aside>
        </div>
      </main>

      {openDoc && (
        <div className="fixed inset-0 z-[800] flex justify-end" style={{ background: "rgba(31,31,31,.45)" }}>
          <button type="button" aria-label="Close" className="flex-1 cursor-default" onClick={() => setOpenDoc(null)} />
          <div className="flex h-full w-full max-w-2xl flex-col border-l" style={{ background: T.surface, borderColor: T.line }}>
            <div className="flex items-center justify-between gap-3 border-b px-5 py-3" style={{ borderColor: T.line }}>
              <p className="truncate text-[11px]" style={{ color: T.textDim }}>{openDoc.path}</p>
              <button type="button" onClick={() => setOpenDoc(null)} className="rounded-lg border px-3 py-1 text-[12.5px] font-semibold" style={{ borderColor: T.line }}>
                Close
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5 [&_*]:!text-inherit" style={{ color: T.text }}>
              <Markdown content={openDoc.content} />
            </div>
          </div>
        </div>
      )}

      <div className="pointer-events-none fixed bottom-5 right-5 z-[950] flex w-[320px] flex-col gap-2">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto rounded-xl border px-3.5 py-2.5 text-[13px] shadow-lg"
            style={{
              background: T.surface,
              borderColor: t.tone === "ok" ? T.green : t.tone === "err" ? T.red : T.line,
              color: t.tone === "ok" ? T.greenInk : t.tone === "err" ? T.red : T.textMuted,
            }}>
            {t.text}
          </div>
        ))}
      </div>
    </div>
  );
}

function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: { label: string; onClick: () => void };
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border p-4" style={{ background: T.surface, borderColor: T.line }}>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: T.textDim }}>{title}</p>
        {action && (
          <button type="button" onClick={action.onClick} className="text-[11px] font-bold" style={{ color: T.red }}>
            {action.label}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}
