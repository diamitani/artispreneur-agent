"use client";

import { useState, useRef, useEffect } from "react";
import { UnifiedSidebar } from "@/components/shared/unified-sidebar";
import { Send, Sparkles, Paperclip, Mic, Zap, Settings, ChevronDown } from "lucide-react";
import Link from "next/link";

interface Message {
  id: string;
  role: "user" | "agent";
  content: string;
  timestamp: Date;
}

const ACTIVE_SKILLS = [
  { id: "master", name: "Hermes Agent", active: true },
  { id: "legal", name: "Legal Manager", active: true },
  { id: "contracts", name: "Contracts", active: true },
  { id: "publishing", name: "Publishing", active: false },
];

const SUGGESTED_ACTIONS = [
  "Register my EIN with the IRS",
  "Generate a performance contract",
  "Research venues in Austin for my tour",
  "Create my electronic press kit",
  "Check for unclaimed royalties on ASCAP",
  "Draft a press release for my single release",
];

const WELCOME_MESSAGES: Message[] = [
  {
    id: "welcome",
    role: "agent",
    content:
      "Hey! I'm your Artispreneur agent. I can handle your music business — legal formation, contracts, publishing, bookings, finances, and more. What do you want to tackle first?",
    timestamp: new Date(),
  },
  {
    id: "welcome-2",
    role: "agent",
    content:
      "Here's a quick snapshot: your publishing agent found 2 unregistered tracks on ASCAP. Your legal agent has your EIN application ready to submit. And there are 47 venues in Austin matching your tour criteria. Want me to start on any of these?",
    timestamp: new Date(),
  },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(WELCOME_MESSAGES);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsStreaming(true);

    // Simulate streaming response — replace with actual AI SDK streaming
    setTimeout(() => {
      const agentMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "agent",
        content: `Got it! I'm working on "${input}". This is where the real-time AI streaming from Bedrock/Claude would appear, executing tools through Composio integrations and following the ROSTR agent framework.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, agentMsg]);
      setIsStreaming(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-white">
      <UnifiedSidebar />

      {/* Main chat area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Chat header */}
        <header className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-white px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-crimson">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="font-display text-base text-black">Hermes Agent</h1>
              <p className="text-[11px] text-gray-400">Your AI music business team</p>
            </div>
          </div>

          {/* Active skills chips */}
          <div className="hidden items-center gap-2 md:flex">
            {ACTIVE_SKILLS.filter((s) => s.active).map((skill) => (
              <span
                key={skill.id}
                className="rounded-full bg-crimson/10 px-2.5 py-1 text-[11px] font-medium text-crimson"
              >
                {skill.name}
              </span>
            ))}
            <Link
              href="/skills/library"
              className="rounded-full border border-dashed border-gray-200 px-2.5 py-1 text-[11px] text-gray-400 hover:border-crimson hover:text-crimson transition-colors"
            >
              + Add Skills
            </Link>
            <Link
              href="/workspace/config"
              className="flex items-center gap-1 rounded-full bg-gray-50 px-2.5 py-1 text-[11px] text-gray-500 hover:text-black transition-colors"
            >
              <Settings className="h-3 w-3" />
              Config
            </Link>
          </div>
        </header>

        {/* Welcome / empty state */}
        {messages.length <= 2 && (
          <div className="border-b border-gray-50 bg-gray-50/50 px-6 py-4">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-gray-400">Suggested Actions</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_ACTIONS.map((action) => (
                <button
                  key={action}
                  onClick={() => {
                    setInput(action);
                  }}
                  className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[12px] text-gray-600 hover:border-crimson hover:text-crimson transition-colors text-left"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-3xl space-y-6 px-6 py-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
              >
                {msg.role === "agent" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-crimson">
                    <Zap className="h-3.5 w-3.5 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-crimson text-white rounded-br-md"
                      : "bg-gray-50 text-gray-700 rounded-bl-md"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
                {msg.role === "user" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black">
                    <span className="text-[10px] font-bold text-white">You</span>
                  </div>
                )}
              </div>
            ))}
            {isStreaming && (
              <div className="flex gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-crimson">
                  <Zap className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="rounded-2xl rounded-bl-md bg-gray-50 px-4 py-3">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-300" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-300" style={{ animationDelay: "150ms" }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-300" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="shrink-0 border-t border-gray-100 bg-white px-6 py-4">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-end gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 focus-within:border-crimson focus-within:bg-white transition-colors">
              <button className="shrink-0 rounded p-1 text-gray-400 hover:text-gray-600">
                <Paperclip className="h-4 w-4" />
              </button>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message your agent..."
                rows={1}
                className="flex-1 resize-none bg-transparent text-sm text-black placeholder:text-gray-400 focus:outline-none"
                disabled={isStreaming}
              />
              <button className="shrink-0 rounded p-1 text-gray-400 hover:text-gray-600">
                <Mic className="h-4 w-4" />
              </button>
              <button
                onClick={handleSend}
                disabled={!input.trim() || isStreaming}
                className="shrink-0 rounded-lg bg-crimson p-2 text-white hover:bg-crimson-dark transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] text-gray-400">
              Hermes agent drafts — you approve. Nothing sends without your review.
            </p>
          </div>
        </div>
      </div>

      {/* Context panel (right sidebar) — hidden on mobile */}
      <aside className="hidden w-[280px] shrink-0 border-l border-gray-100 bg-white xl:flex xl:flex-col">
        <div className="border-b border-gray-100 px-4 py-3">
          <h3 className="font-display text-sm text-black">Active Skills</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {ACTIVE_SKILLS.map((skill) => (
            <div
              key={skill.id}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm ${
                skill.active ? "bg-crimson/5 text-crimson" : "text-gray-400"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  skill.active ? "bg-crimson" : "bg-gray-200"
                }`}
              />
              {skill.name}
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 p-4">
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-[11px] font-medium text-gray-600 mb-1">Quick Stats</p>
            <div className="space-y-2 text-[11px] text-gray-500">
              <div className="flex justify-between">
                <span>Projects</span>
                <span className="font-medium text-black">3</span>
              </div>
              <div className="flex justify-between">
                <span>Outputs</span>
                <span className="font-medium text-black">12</span>
              </div>
              <div className="flex justify-between">
                <span>Active Skills</span>
                <span className="font-medium text-crimson">3</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}