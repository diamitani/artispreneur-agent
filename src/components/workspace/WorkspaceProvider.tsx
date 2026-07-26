"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getAgent, type AgentId } from "@/lib/agents";
import {
  ARTIFACTS,
  STARTER_THREAD,
  type Artifact,
  type ChatMessage,
  type ViewId,
} from "@/lib/workspace-data";

type WorkspaceState = {
  view: ViewId;
  setView: (v: ViewId) => void;
  agentId: AgentId;
  setAgentId: (id: AgentId) => void;
  sessionId: string;
  setSessionId: (id: string) => void;
  messages: ChatMessage[];
  sendMessage: (content: string) => void;
  thinking: boolean;
  selectedArtifactId: string;
  openArtifact: (id: string) => void;
  selectedArtifact: Artifact;
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;
};

const WorkspaceContext = createContext<WorkspaceState | null>(null);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<ViewId>("briefing");
  const [agentId, setAgentId] = useState<AgentId>("orchestrator");
  const [sessionId, setSessionId] = useState("s3");
  const [messages, setMessages] = useState<ChatMessage[]>(STARTER_THREAD);
  const [selectedArtifactId, setSelectedArtifactId] = useState(ARTIFACTS[0].id);
  const [chatOpen, setChatOpen] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [thinking, setThinking] = useState(false);

  const selectedArtifact =
    ARTIFACTS.find((a) => a.id === selectedArtifactId) ?? ARTIFACTS[0];

  const openArtifact = useCallback((id: string) => {
    setSelectedArtifactId(id);
    setView("canvas");
  }, []);

  const sendMessage = useCallback(
    (content: string) => {
      const trimmed = content.trim();
      if (!trimmed) return;
      const now = Date.now();
      const agent = getAgent(agentId);
      const userMsg: ChatMessage = {
        id: `u-${now}`,
        role: "user",
        content: trimmed,
        timestamp: "just now",
      };
      setMessages((prev) => [...prev, userMsg]);
      setThinking(true);

      window.setTimeout(() => {
        const routed = routeIntent(trimmed);
        const toolMsg: ChatMessage = {
          id: `t-${now}`,
          role: "tool",
          toolName: routed.tool,
          content: routed.toolNote,
          timestamp: "just now",
        };
        const agentMsg: ChatMessage = {
          id: `a-${now}`,
          role: "agent",
          agentId,
          content: routed.reply(agent.name),
          timestamp: "just now",
        };
        setMessages((prev) => [...prev, toolMsg, agentMsg]);
        setThinking(false);
      }, 750);
    },
    [agentId],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((p) => !p);
      }
      if (e.key === "Escape") setPaletteOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const value = useMemo(
    () => ({
      view,
      setView,
      agentId,
      setAgentId,
      sessionId,
      setSessionId,
      messages,
      sendMessage,
      thinking,
      selectedArtifactId,
      openArtifact,
      selectedArtifact,
      chatOpen,
      setChatOpen,
      sidebarOpen,
      setSidebarOpen,
      paletteOpen,
      setPaletteOpen,
    }),
    [
      view,
      agentId,
      sessionId,
      messages,
      sendMessage,
      thinking,
      selectedArtifactId,
      openArtifact,
      selectedArtifact,
      chatOpen,
      sidebarOpen,
      paletteOpen,
    ],
  );

  return (
    <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used within WorkspaceProvider");
  return ctx;
}

function routeIntent(input: string): {
  tool: string;
  toolNote: string;
  reply: (agent: string) => string;
} {
  const l = input.toLowerCase();
  if (l.includes("rights") || l.includes("split") || l.includes("clear")) {
    return {
      tool: "rights.check",
      toolNote: "Scored 5 tracks · 2 blocked · gate enforced",
      reply: () =>
        "Two N-class blockers stop commercial activation right now: Neon Prayer splits total 110%, and its sample is uncleared. I've drafted the amendment and a clearance task. Nothing distributes, licenses, or allocates until a rights owner signs off — that's the gate.",
    };
  }
  if (l.includes("release") || l.includes("distribut") || l.includes("ship")) {
    return {
      tool: "release.plan",
      toolNote: "Midnight Circuit · scheduled · 42 days out",
      reply: () =>
        "Midnight Circuit is rights-complete and scheduled 42 days out with metadata locked for the Spotify pitch. I can't trigger DSP delivery without your named approval — say the word and I'll queue the approval packet.",
    };
  }
  if (l.includes("licens") || l.includes("sync") || l.includes("quote")) {
    return {
      tool: "sync.brief",
      toolNote: "Halo Creative · 30s trailer · NA · $6,500 draft",
      reply: () =>
        "The Halo Creative brief is a 30s trailer, North America, 1 year. Track is 100% cleared, so I drafted a $6,500 quote from the approved rate card. It's non-binding until a licensing admin approves rights, term, media, territory, exclusivity, and fee.",
    };
  }
  if (l.includes("royalt") || l.includes("statement") || l.includes("pay")) {
    return {
      tool: "royalty.reconcile",
      toolNote: "Q2 staged · 3 exceptions · payout gate on",
      reply: () =>
        "Q2 reconciles to $11.5K across DSP, mechanical, and sync. Three YouTube CID rows are unmatched — they're in the exception queue, not a statement. No payout goes out without founder approval.",
    };
  }
  if (l.includes("book") || l.includes("venue") || l.includes("epk") || l.includes("gig")) {
    return {
      tool: "booking.pipeline",
      toolNote: "3 warm leads · EPK ready",
      reply: () =>
        "The EPK is ready and three warm leads need a follow-up before Friday. Want me to draft the pitch emails and queue them, or open the EPK on the canvas first?",
    };
  }
  return {
    tool: "pal.compile",
    toolNote: "Intent compiled · NPAO N→A→P→O",
    reply: () =>
      "Compiled that through PAL and ranked it against your open work. Highest-priority items are the two rights blockers, then the Midnight Circuit pitch metadata and the Halo sync approval. Tell me which outcome you want and I'll put the draft on the canvas.",
  };
}
