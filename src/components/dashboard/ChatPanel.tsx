"use client";

import { useState } from "react";

/* eslint-disable @typescript-eslint/no-unused-vars */
export function ChatPanel({
  title,
  placeholder,
  greeting,
}: {
  title: string;
  placeholder: string;
  greeting: string;
}) {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([
    { role: "assistant", text: greeting },
  ]);
  const [input, setInput] = useState("");

  function send() {
    if (!input.trim()) return;
    const txt = input.trim();
    setMessages((m) => [...m, { role: "user", text: txt }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: `I'm analyzing your profile to give you a personalized recommendation on "${txt}". Here's what I'd suggest based on your current setup...`,
        },
      ]);
    }, 700);
  }

  return (
    <div className="flex h-full flex-col bg-[color:var(--color-bg-surface)]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-6 md:px-7">
        <div className="mx-auto flex max-w-3xl flex-col gap-3.5">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-end gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[color:var(--color-crimson)]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                </div>
              )}
              <div
                className={`max-w-[75%] px-3.5 py-2.5 text-[13px] leading-relaxed shadow-[0_1px_3px_rgba(0,0,0,0.07)] ${
                  msg.role === "user"
                    ? "rounded-[10px_10px_2px_10px] bg-[color:var(--color-crimson)] text-white"
                    : "rounded-[10px_10px_10px_2px] bg-white text-[color:var(--color-black)]"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-[color:var(--color-border)] bg-white px-5 py-4 md:px-7">
        <div className="mx-auto flex max-w-3xl items-center gap-2.5 rounded-lg bg-[color:var(--color-bg-surface)] px-3 py-2">
          <input
            type="text"
            placeholder={placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            className="min-w-0 flex-1 border-0 bg-transparent text-[14px] text-[color:var(--color-black)] outline-none"
          />
          <button
            onClick={send}
            className="shrink-0 rounded-md bg-[color:var(--color-crimson)] px-4 py-1.5 text-[12px] font-semibold text-white hover:bg-[color:var(--color-crimson-dark)]"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
