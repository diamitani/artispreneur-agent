"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { AgentProvisionResult } from "@/app/api/agent/provision/route";

type AgentStatus = "idle" | "loading" | "ready" | "onboarding_required" | "error";

type AgentSelectorProps = {
  onAgentReady?: (agent: AgentProvisionResult) => void;
  className?: string;
};

export function AgentSelector({ onAgentReady, className = "" }: AgentSelectorProps) {
  const [status, setStatus] = useState<AgentStatus>("idle");
  const [agent, setAgent] = useState<AgentProvisionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const checkAgent = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/agent/provision");
      const data = await res.json();
      if (data.status === "not_provisioned") {
        setStatus("idle");
        return null;
      }
      if (!data.ok) throw new Error(data.error || "Unknown error");
      setAgent(data);
      setStatus(data.status === "ready" ? "ready" : "onboarding_required");
      return data;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to check agent");
      setStatus("error");
      return null;
    }
  }, []);

  const provisionAgent = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/agent/provision", { method: "POST", body: "{}" });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Provisioning failed");
      setAgent(data);
      setStatus(data.status === "ready" ? "ready" : "onboarding_required");
      onAgentReady?.(data);
      return data;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to provision agent");
      setStatus("error");
      return null;
    }
  }, [onAgentReady]);

  useEffect(() => {
    checkAgent().then((a) => {
      if (a?.status === "ready") onAgentReady?.(a);
    });
  }, [checkAgent, onAgentReady]);

  const statusColor = {
    idle: "bg-neutral-500",
    loading: "bg-amber-400 animate-pulse",
    ready: "bg-emerald-500",
    onboarding_required: "bg-amber-500",
    error: "bg-red-500",
  }[status];

  const statusLabel = {
    idle: "No Agent",
    loading: "Connecting...",
    ready: "Hermes Ready",
    onboarding_required: "Needs Setup",
    error: "Error",
  }[status];

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 rounded-[8px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 transition-colors hover:border-[color:var(--color-gold-muted)]"
      >
        <span className={`h-2.5 w-2.5 rounded-full ${statusColor}`} />
        <span className="text-sm font-medium text-[color:var(--color-text-primary)]">
          {agent ? `hermes-${agent.agent_id.slice(-8)}` : "Select Agent"}
        </span>
        <svg
          className={`h-4 w-4 text-[color:var(--color-text-dim)] transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-2 w-72 rounded-[10px] border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4 shadow-lg"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-wider text-[color:var(--color-text-dim)]">
                Hermes Agent
              </p>
              <span
                className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-bold ${
                  status === "ready"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : status === "onboarding_required"
                      ? "bg-amber-500/20 text-amber-400"
                      : status === "error"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-neutral-500/20 text-neutral-400"
                }`}
              >
                {statusLabel}
              </span>
            </div>

            {agent && (
              <div className="mb-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[color:var(--color-text-muted)]">Runtime</span>
                  <span className="font-mono text-[color:var(--color-gold)]">{agent.runtime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[color:var(--color-text-muted)]">Model</span>
                  <span className="font-mono text-[color:var(--color-text-primary)]">{agent.model_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[color:var(--color-text-muted)]">Hub</span>
                  <span className="font-mono text-[color:var(--color-text-primary)]">{agent.hub_backend}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[color:var(--color-text-muted)]">ROSTR</span>
                  <span className="font-mono text-emerald-400">
                    {agent.rostr_installed ? "Installed" : "Not installed"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[color:var(--color-text-muted)]">Soul</span>
                  <span
                    className={`font-mono ${agent.soul_loaded ? "text-emerald-400" : "text-amber-400"}`}
                  >
                    {agent.soul_loaded ? "Loaded" : "Pending onboarding"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[color:var(--color-text-muted)]">Active Skills</span>
                  <span className="font-mono text-[color:var(--color-text-primary)]">
                    {agent.active_skills}
                  </span>
                </div>
                {agent.completeness !== null && (
                  <div className="flex justify-between">
                    <span className="text-[color:var(--color-text-muted)]">Completeness</span>
                    <span className="font-mono text-[color:var(--color-text-primary)]">
                      {agent.completeness}%
                    </span>
                  </div>
                )}
              </div>
            )}

            {error && (
              <p className="mb-3 rounded bg-red-500/10 px-2 py-1 text-xs text-red-400">{error}</p>
            )}

            <div className="flex flex-col gap-2">
              {status === "idle" && (
                <button
                  onClick={provisionAgent}
                  className="w-full rounded-[6px] bg-[color:var(--color-gold)] px-3 py-2 text-sm font-semibold text-[color:var(--color-charcoal)] transition-colors hover:bg-[color:var(--color-gold-light)]"
                >
                  Provision Hermes Agent
                </button>
              )}

              {status === "onboarding_required" && (
                <a
                  href="/onboarding"
                  className="block w-full rounded-[6px] bg-[color:var(--color-gold)] px-3 py-2 text-center text-sm font-semibold text-[color:var(--color-charcoal)] transition-colors hover:bg-[color:var(--color-gold-light)]"
                >
                  Complete PAL Onboarding
                </a>
              )}

              {status === "ready" && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onAgentReady?.(agent!);
                  }}
                  className="w-full rounded-[6px] bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-500"
                >
                  Connect to Agent
                </button>
              )}

              {status === "error" && (
                <button
                  onClick={checkAgent}
                  className="w-full rounded-[6px] border border-[color:var(--color-border)] bg-transparent px-3 py-2 text-sm font-medium text-[color:var(--color-text-primary)] transition-colors hover:bg-[color:var(--color-card)]"
                >
                  Retry
                </button>
              )}

              {(status === "ready" || status === "onboarding_required") && (
                <button
                  onClick={provisionAgent}
                  className="w-full rounded-[6px] border border-[color:var(--color-border)] bg-transparent px-3 py-2 text-sm font-medium text-[color:var(--color-text-muted)] transition-colors hover:bg-[color:var(--color-card)]"
                >
                  Refresh Instance
                </button>
              )}
            </div>

            <p className="mt-3 text-center font-mono text-[9px] text-[color:var(--color-text-dim)]">
              {agent?.workspace_path || "orgs/diamitani-industries/..."}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
