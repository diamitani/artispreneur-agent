"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { brand } from "@/lib/brand";
import styles from "./LandingV0.module.css";
import {
  CHAT_FOLLOWUP_HTML,
  CHAT_RESPONSES,
  CHAT_WELCOME,
  ECOSYSTEM_CARDS,
  FEATURE_TILES,
  FOOTER_LINKS,
  HERO_CHECKS,
  LEGAL_CARDS,
  LEGAL_LIST,
  NAV_LINKS,
  PILLARS,
  PRICE_CARDS,
  RIGHTS_CARDS,
} from "./landing-v0-data";

const SIGNUP_HREF = "/signup?next=/onboarding";
const DASHBOARD_HREF = "/signin?next=/workspace";

/** Artispreneur Landing v0 — imported from Claude Design (claude.ai/design/p/c761442d…). */
export function LandingV0() {
  return (
    <div className={styles.page}>
      <LandingNav />
      <Hero />
      <FeatureStrip />
      <PillarsSection />
      <LegalSection />
      <RightsSection />
      <EcosystemSection />
      <ChatDemoSection />
      <PricingSection />
      <FinalCta />
      <LandingFooter />
    </div>
  );
}

function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ""}`}>
      <div className={styles.navInner}>
        <a href="#" className={styles.logo}>
          <Image src={brand.logo.primaryPng} alt="" width={28} height={28} style={{ objectFit: "contain" }} />
          <span>ARTISPRENEUR</span>
        </a>
        <div className={styles.navLinks}>
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
          <a href={DASHBOARD_HREF}>Dashboard</a>
        </div>
        <div className={styles.navRight}>
          <a href={DASHBOARD_HREF} className={styles.navSignin}>
            Sign In
          </a>
          <a href={SIGNUP_HREF} className={`${styles.btn} ${styles.btnRed}`}>
            Get Started Free
          </a>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroBg} />
      <div className={styles.heroGlow1} />
      <div className={styles.heroGlow2} />
      <div className={styles.heroInner}>
        <div className={styles.heroBadge}>
          <span className={styles.heroDot} />
          <span>THE MUSIC BUSINESS OPERATING SYSTEM</span>
        </div>
        <h1 className={styles.serif}>
          Build Your Music <em className={styles.heroGold}>Business</em>
          <br />
          Operating System
        </h1>
        <p>
          Artispreneur helps artists become entrepreneurs. Register your brand, update your
          P.R.O.s, and manage your independent career — all with an AI manager working for you.
        </p>
        <div className={styles.heroBtns}>
          <a href={SIGNUP_HREF} className={`${styles.btn} ${styles.btnRed} ${styles.btnLg}`}>
            Register Your Business →
          </a>
          <a href="#pillars" className={`${styles.btn} ${styles.btnOutline} ${styles.btnLg}`}>
            See What&apos;s Included
          </a>
        </div>
        <div className={styles.heroChecks}>
          {HERO_CHECKS.map((c) => (
            <div key={c} className={styles.heroCheck}>
              <span>✓</span>
              {c}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureStrip() {
  return (
    <div className={styles.strip}>
      <div className={styles.stripHead}>
        <div className={styles.eyebrow} style={{ marginBottom: 0 }}>
          Core Architecture
        </div>
      </div>
      <div className={styles.grid8}>
        {FEATURE_TILES.map((t) => (
          <div key={t.title} className={styles.featTile}>
            <div className={styles.featGlyph} style={{ background: t.color }}>
              {t.glyph}
            </div>
            <h4>{t.title}</h4>
            <p>{t.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PillarsSection() {
  return (
    <section id="pillars" className={styles.section}>
      <div className={`${styles.secHead} ${styles.secHeadCenter}`} style={{ margin: "0 auto 48px" }}>
        <div className={styles.eyebrow}>Core Architecture</div>
        <h2 className={styles.serif}>The foundational pillars of your music business operating system.</h2>
      </div>
      <div className={styles.grid4}>
        {PILLARS.map((p) => (
          <div key={p.title} className={styles.pillar}>
            <div className={styles.ic}>{p.icon}</div>
            <h3>{p.title}</h3>
            <p>{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function LegalSection() {
  return (
    <section className={styles.legal}>
      <div className={styles.legalInner}>
        <div className={styles.legalLeft}>
          <div className={styles.eyebrow}>Legal &amp; Finance</div>
          <h2 className={styles.serif}>Establish your business and manage your money.</h2>
          <ul className={styles.legalList}>
            {LEGAL_LIST.map((item) => (
              <li key={item}>
                <span>✓</span>
                {item}
              </li>
            ))}
          </ul>
          <a href={SIGNUP_HREF} className={styles.legalLink}>
            Start your business registration →
          </a>
        </div>
        <div className={styles.legalRight}>
          {LEGAL_CARDS.map((c) => (
            <div key={c.title} className={styles.legalCard}>
              <div className={styles.ic}>{c.icon}</div>
              <h4>{c.title}</h4>
              <p>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RightsSection() {
  return (
    <section className={styles.section}>
      <div className={`${styles.secHead} ${styles.secHeadCenter}`} style={{ margin: "0 auto 48px", maxWidth: 640 }}>
        <div className={styles.eyebrow}>Rights, Royalties &amp; Growth</div>
        <h2 className={styles.serif}>Maximize your earnings by protecting your work.</h2>
        <p>
          Track royalties, manage your catalog, find industry contacts, and handle contracts from
          one dashboard.
        </p>
      </div>
      <div className={styles.grid3}>
        {RIGHTS_CARDS.map((c) => (
          <div key={c.title} className={styles.rightsCard}>
            <div className={styles.ic}>{c.icon}</div>
            <h3>{c.title}</h3>
            <ul>
              {c.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function EcosystemSection() {
  return (
    <section
      id="ecosystem"
      className={styles.section}
      style={{ background: "var(--lv0-surface)", borderTop: "1px solid var(--lv0-border)" }}
    >
      <div className={`${styles.secHead} ${styles.secHeadCenter}`} style={{ margin: "0 auto 48px", maxWidth: 640 }}>
        <div className={styles.eyebrow}>The Artispreneur Ecosystem</div>
        <h2 className={styles.serif}>Everything you need to learn, grow, and operate your music business.</h2>
      </div>
      <div className={styles.grid3}>
        {ECOSYSTEM_CARDS.map((c) => (
          <a
            key={c.title}
            href={c.href}
            className={styles.ecoCard}
            {...("external" in c && c.external ? { target: "_blank", rel: "noreferrer" } : {})}
          >
            <div className={styles.ic} style={{ color: c.color }}>
              {c.icon}
            </div>
            <h3>{c.title}</h3>
            <p>{c.body}</p>
            <span className={styles.go} style={{ color: c.color }}>
              {c.go}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

type ChatMessage = { role: "agent" | "user"; html: string };

function ChatDemoSection() {
  const [messages, setMessages] = useState<ChatMessage[]>([CHAT_WELCOME]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing]);

  function send() {
    const msg = input.trim();
    if (!msg) return;

    setMessages((prev) => [...prev, { role: "user", html: msg }]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      setTyping(false);
      const low = msg.toLowerCase();
      let resp = CHAT_RESPONSES.default ?? "";
      for (const [key, val] of Object.entries(CHAT_RESPONSES)) {
        if (key !== "default" && low.includes(key)) {
          resp = val;
          break;
        }
      }
      setMessages((prev) => {
        const next: ChatMessage[] = [...prev, { role: "agent", html: resp }];
        const userTurns = next.filter((m) => m.role === "user").length;
        if (userTurns >= 3 && !prev.some((m) => m.html === CHAT_FOLLOWUP_HTML)) {
          setTimeout(() => {
            setMessages((withFollowup) => [...withFollowup, { role: "agent", html: CHAT_FOLLOWUP_HTML }]);
          }, 1600);
        }
        return next;
      });
    }, 1300);
  }

  return (
    <section id="demo" className={styles.section}>
      <div className={`${styles.secHead} ${styles.secHeadCenter}`} style={{ margin: "0 auto 40px", maxWidth: 600 }}>
        <div className={styles.eyebrow}>Live Demo</div>
        <h2 className={styles.serif}>Meet your AI manager.</h2>
        <p>
          Ask about PROs, distribution, licensing, LLC setup, taxes, or promotion — see how the
          agent responds.
        </p>
      </div>
      <div className={styles.demoWrap}>
        <div className={styles.chatWidget}>
          <div className={styles.chatHeader}>
            <div className={`${styles.chatDot} ${styles.chatDotGold}`} />
            <div className={`${styles.chatDot} ${styles.chatDotDim}`} />
            <div className={`${styles.chatDot} ${styles.chatDotDim}`} />
            <span className={styles.chatTitle}>Artispreneur OS</span>
            <span className={styles.chatBadge}>Live Demo</span>
          </div>
          <div className={styles.chatBody} ref={bodyRef}>
            {messages.map((m, i) =>
              m.role === "user" ? (
                <div key={i} className={`${styles.chatMsg} ${styles.chatMsgUser}`}>
                  {m.html}
                </div>
              ) : (
                <div
                  key={i}
                  className={`${styles.chatMsg} ${styles.chatMsgAgent}`}
                  // Static, developer-authored canned responses only — never user input.
                  dangerouslySetInnerHTML={{ __html: m.html }}
                />
              )
            )}
          </div>
          {typing && <div className={styles.chatTyping}>Agent is thinking...</div>}
          <div className={styles.chatInputRow}>
            <input
              type="text"
              className={styles.chatInput}
              placeholder="Ask me anything about your music business..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") send();
              }}
            />
            <button type="button" className={styles.chatSend} onClick={send}>
              Send
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section
      id="pricing"
      className={styles.section}
      style={{ background: "var(--lv0-surface)", borderTop: "1px solid var(--lv0-border)" }}
    >
      <div className={`${styles.secHead} ${styles.secHeadCenter}`} style={{ margin: "0 auto 48px" }}>
        <div className={styles.eyebrow}>Pricing</div>
        <h2 className={styles.serif}>Start Free. Bring Your Own Key.</h2>
        <p>No credit card. Sign up, get your agent workspace provisioned instantly.</p>
      </div>
      <div className={styles.pricingGrid}>
        {PRICE_CARDS.map((p) => (
          <div key={p.name} className={`${styles.priceCard} ${p.featured ? styles.priceCardFeatured : ""}`}>
            <h3>{p.name}</h3>
            <div className={styles.priceAmt}>
              {p.amount}
              <span>{p.per}</span>
            </div>
            <p className={styles.priceDesc}>{p.desc}</p>
            <ul>
              {p.feats.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <a
              href={SIGNUP_HREF}
              className={`${styles.priceBtn} ${p.featured ? styles.priceBtnGold : styles.priceBtnOutline}`}
            >
              {p.cta}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className={styles.cta}>
      <div className={styles.ctaBg} />
      <div className={styles.ctaInner}>
        <h2 className={styles.serif}>Ready to build your music business?</h2>
        <p>
          Start your business registration, set up your P.R.O.s, and activate your AI manager —
          all in one place.
        </p>
        <a href={SIGNUP_HREF} className={`${styles.btn} ${styles.btnRed} ${styles.btnLg}`}>
          Start Building Now
        </a>
      </div>
    </section>
  );
}

function LandingFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerTop}>
          <div className={styles.footerLogo}>
            <Image src={brand.logo.primaryPng} alt="" width={22} height={22} style={{ objectFit: "contain" }} />
            <span>ARTISPRENEUR</span>
          </div>
          <div className={styles.footerLinks}>
            {FOOTER_LINKS.map((l) => (
              <a key={l.href} href={l.href} {...("external" in l && l.external ? { target: "_blank", rel: "noreferrer" } : {})}>
                {l.label}
              </a>
            ))}
          </div>
        </div>
        <div className={styles.footerBottom}>© {new Date().getFullYear()} Artispreneur. Art Means Business.</div>
      </div>
    </footer>
  );
}
