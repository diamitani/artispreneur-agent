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
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { getAgent, type AgentId } from "@/lib/agents";
import { ARTIFACTS, SESSIONS, type Artifact, type ViewId } from "@/lib/workspace-data";

type WorkspaceState = {
  view: ViewId;
  setView: (v: ViewId) => void;
  agentId: AgentId;
  setAgentId: (id: AgentId) => void;
  sessionId: string;
  setSessionId: (id: string) => void;
  // Real AI chat state
  messages: UIMessage[];
  sendMessage: (content: string) => void;
  status: "ready" | "submitted" | "streaming" | "error";
  error: Error | undefined;
  input: string;
  setInput: (val: string) => void;
  stop: () => void;
  // UI
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
  const [selectedArtifactId, setSelectedArtifactId] = useState(ARTIFACTS[0]!.id);
  const [chatOpen, setChatOpen] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const selectedArtifact =
    (ARTIFACTS.find((a) => a.id === selectedArtifactId) ?? ARTIFACTS[0])!;

  const openArtifact = useCallback((id: string) => {
    setSelectedArtifactId(id);
    setView("canvas");
  }, []);

  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/agent/chat" }),
    [],
  );

  const {
    messages,
    sendMessage: chatSend,
    status,
    error,
    input,
    setInput,
    stop,
  } = useChat({ transport });

  const sendMessage = useCallback(
    (content: string) => {
      const trimmed = content.trim();
      if (!trimmed) return;
      chatSend({ text: trimmed });
    },
    [chatSend],
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
      status,
      error,
      input,
      setInput,
      stop,
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
      status,
      error,
      input,
      setInput,
      stop,
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
