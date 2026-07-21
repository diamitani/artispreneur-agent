"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { brand } from "@/lib/brand";

const ease = [0.16, 1, 0.3, 1] as const;

const AGENT_CAPABILITIES = [
  "Registering songs with your PRO",
  "Distribution strategy & planning",
  "Music licensing opportunities",
  "Setting up your LLC or business entity",
  "Business taxes & accounting",
  "Building & protecting your brand",
];

export function NewHeroChat() {
  const reduce = useReducedMotion();
  const [messages, setMessages] = useState<Array<{ role: "user" | "agent"; text: string }>>([
    { role: "agent", text: "Hey! I'm your Artispreneur agent." },
    { role: "agent", text: "I can help you with:\n• Registering songs with your PRO\n• Distribution strategy & planning\n• Music licensing opportunities\n• Setting up your LLC or business entity\n• Business taxes & accounting\n• Building & protecting your brand\n\nWhat do you want to work on?" },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { role: "user", text: input },
      { role: "agent", text: "On it — drafting the package now. Nothing ships until you approve." },
    ]);
    setInput("");
  };

  return (
    <section className="relative min-h-[100dvh] overflow-hidden bg-[color:var(--color-bg-dark)] text-white">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/hero-studio.jpg"
          alt=""
          fill
          priority
          className="object-cover object-center opacity-30"
          sizes="100vw"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-br from-[color:var(--color-bg-dark)] via-[color:var(--color-bg-dark)]/95 to-[color:var(--color-bg-dark)]/80"
        />
      </div>

      <div className="container-page relative z-10 flex min-h-[100dvh] flex-col justify-center pb-16 pt-32 md:pb-20 md:pt-28">
        {/* Two-column: copy left, chat right */}
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_520px] xl:gap-16">
          {/* LEFT — Copy */}
          <motion.div
            className="max-w-2xl"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
          >
            <motion.div
              className="mb-6 flex items-center gap-2.5"
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease }}
            >
              <Image src={brand.logo.primaryPng} alt="" width={40} height={40} className="h-10 w-10" priority />
              <div>
                <p className="font-heading text-xl tracking-tight text-white">Artispreneur</p>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-[color:var(--color-gold)]">
                  Agent
                </p>
              </div>
            </motion.div>

            <motion.h1
              className="font-heading text-white"
              style={{ fontSize: "clamp(2.5rem, 7vw, 3.5rem)", lineHeight: 1.1 }}
              initial={reduce ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease }}
            >
              Your Music Business
              <br />
              <span className="text-[color:var(--color-gold)]">Operating System</span>
            </motion.h1>

            <motion.p
              className="mt-6 max-w-lg text-[clamp(0.95rem,2vw,1.125rem)] leading-relaxed text-white/70"
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.2, ease }}
            >
              AI agents handle your PROs, distribution, licensing, contracts, accounting, and brand — so you focus on making music. Set up your business, stay organized, and get expert guidance without the legal bill.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-wrap gap-3"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.28, ease }}
            >
              <a href="/api/auth/login?signup=1&return=/onboarding" className="btn btn--primary btn--lg">
                Get Started Free
              </a>
              <a href="#agents" className="btn btn--outline-on-dark btn--lg">
                See the Agents
              </a>
            </motion.div>

            <motion.div
              className="mt-10 flex gap-10"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.35 }}
            >
              <div>
                <p className="font-heading text-[28px] text-white">6</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/40">AI Agents</p>
              </div>
              <div>
                <p className="font-heading text-[28px] text-white">16</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/40">Courses</p>
              </div>
              <div>
                <p className="font-heading text-[28px] text-white">$0</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-white/40">To Start</p>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT — Chat UI */}
          <motion.div
            className="flex justify-center lg:justify-end"
            initial={reduce ? false : { opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease }}
          >
            {/* Browser frame */}
            <div className="w-full max-w-[480px] overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] shadow-2xl">
              {/* Browser chrome */}
              <div className="flex items-center justify-between gap-3 border-b border-[color:var(--color-border)] bg-[color:var(--color-card)] px-4 py-2.5">
                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                  <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                  <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
                </div>
                <span className="font-mono text-[12px] font-semibold text-white">Artispreneur OS</span>
                <span className="font-mono text-[11px] text-[color:var(--color-gold)]">Live Demo</span>
              </div>

              {/* Chat area */}
              <div className="flex h-[420px] flex-col bg-[color:var(--color-surface)]">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 p-4">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[75%] rounded-lg px-3 py-2 text-[13px] leading-relaxed ${
                          msg.role === "user"
                            ? "bg-[color:var(--color-gold)] text-black"
                            : "bg-[color:var(--color-card)] text-[color:var(--color-text-secondary)]"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="border-t border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-3">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSend();
                    }}
                    className="flex gap-2"
                  >
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask me anything about your music business..."
                      className="flex-1 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-card)] px-3 py-2 text-[12px] text-white placeholder:text-[color:var(--color-text-dim)] outline-none focus:border-[color:var(--color-gold)]"
                    />
                    <button
                      type="submit"
                      className="rounded-lg bg-[color:var(--color-gold)] px-3 py-2 text-[12px] font-bold text-black transition-colors hover:bg-[color:var(--color-gold-light)]"
                    >
                      Send
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
