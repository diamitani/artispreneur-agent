# Artispreneur Agent — Product Vision

Combined product vision from v217 PRD and Architecture documents.

---

## Mission

**"You make the music. We handle the rest."**

Artispreneur is the first AI agent operating system for independent music artists. It replaces what a record label does — PRO registration, distribution, licensing, legal, finance, and management — with specialized AI agents that work through a chat interface.

---

## Product Definition

### What We're Building

An AI-powered workspace where independent music artists can:
- Sign up in 5 minutes through an intelligent onboarding interview
- Get 11 specialized AI agents that handle every business task
- Chat naturally to execute complex music business operations
- Generate contracts, EPKs, tax filings, and release plans instantly
- Access a 16-course academy with 307 modules
- Browse a curated directory of 74+ music industry contacts

### Who It's For

**Primary**: Independent music artists at all levels
- Emerging artists (0-2 years) — need structure, guidance, business basics
- Established artists (3-10 years) — need efficiency, automation, scaling
- Veteran artists (10+ years) — need catalog management, legacy building

**Secondary**: Producers, songwriters, music entrepreneurs

---

## Core Value Proposition

### What Artists Get

| Without Artispreneur | With Artispreneur |
|---------------------|-------------------|
| Hire manager ($2-5K/month) | $19/month |
| Pay lawyer for LLC ($500-2K) | Free, 5-minute flow |
| Research PROs for hours | Agent registers in 10 min |
| Spreadsheet splitsheets | Auto-generated PDFs |
| Google tax deductions | Agent calculates quarterly taxes |
| Miss sync opportunities | Agent pitches to libraries |
| Playlist research paralysis | Agent finds + submits 8 playlists |
| Scattered tools ($200+/mo) | One workspace, one price |

---

## The 11 Agents

| Agent | Icon | Tools | What It Does |
|-------|------|-------|--------------|
| **Manager** | ◎ | 6 | Orchestrator — routes to specialists, daily briefing, release planning |
| **PRO** | ♩ | 5 | BMI/ASCAP/SESAC registration, splitsheets, royalty tracking |
| **Distribution** | ↗ | 5 | DSP uploads, playlist finding, streaming ads |
| **Licensing** | ⚡ | 4 | Sync opportunities, music library pitches, supervisor outreach |
| **Legal** | § | 5 | LLC formation, EIN, contracts, trademarks, operating agreements |
| **Finance** | $ | 5 | Banking setup, tax filing, quarterly estimates, revenue analysis |
| **ROSTR** | ◎ | 5 | PAL compiler — onboarding → soul.md, bio, agent manifests |
| **Outreach** | 📣 | 4 | Pitch blogs, playlists, radio, CRM management |
| **Tutor** | 🎓 | 4 | Academy guide, course recommendations, project accountability |
| **Catalog** | 🎵 | 4 | Publishing, ISRC assignment, discography management |
| **Business** | 🏢 | 4 | LLC formation wizard, state-specific checklists, compliance |

**Total**: 11 agents, 51 tools

---

## Key User Flows

### 1. Signup Flow (5 minutes)
```
Landing page → "Start Free Trial"
  ↓
5-step wizard (identity, story, situation, experience, goals + links)
  ↓
AI scrapes links (Spotify, IG, YouTube) in background
  ↓
PAL bio generation (soul.md + profile)
  ↓
Workspace ready → 11 agents configured
```

### 2. Agent Chat Flow
```
Artist: "Register my new song with BMI"
  ↓
Manager Agent: routes to PRO Agent
  ↓
PRO Agent: "I need song title, ISRC, co-writers, splits"
  ↓
Artist provides info
  ↓
PRO Agent: runs BMI registration tool → generates splitsheet PDF
  ↓
Output saved to Outputs panel → downloadable
```

### 3. Release Planning Flow
```
Artist: "Plan my EP release for August 15"
  ↓
Manager Agent: creates stepped plan
  1. Finalize tracks (July 1)
  2. Register with PRO (July 10)
  3. Upload to distributor (July 25)
  4. Submit to playlists (Aug 1)
  5. Launch marketing campaign (Aug 8)
  6. Release day (Aug 15)
  ↓
Each step has agent assignments + tool execution
  ↓
Artist checks plan panel → sees progress indicators
```

---

## Technical Architecture

### Frontend Stack
- **Framework**: Next.js 15 (App Router, React Server Components)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Fonts**: Inter (UI), Playfair Display (headings), Geist Mono (code)
- **Design System**: Dark mode (#09090b) + Gold (#c9a227)

### Backend Stack
- **Runtime**: Node.js 20 (Vercel Edge)
- **API Routes**: Next.js App Router API routes
- **LLM**: Anthropic Claude Sonnet 4.5 (via Vercel AI SDK)
- **Auth**: NextAuth.js (email, Google OAuth)
- **Database**: Vercel Postgres (PostgreSQL)
- **ORM**: Prisma
- **Storage**: Vercel Blob (PDFs, audio, images)
- **Streaming**: Vercel AI SDK streaming

### Agent Framework
- **Tool Calling**: Vercel AI SDK `tool()` helper
- **Schema Validation**: Zod
- **Base Class**: TypeScript abstract `BaseAgent`
- **Registry**: Singleton agent registry with intent routing
- **Execution**: Async tool execution with error handling

### Data Flow
```
User message → Next.js API route
  ↓
Intent router (keyword-based or LLM-based)
  ↓
Agent selection
  ↓
Tool execution (Zod-validated parameters)
  ↓
LLM streaming (Vercel AI SDK)
  ↓
Response chunks → React Server Component
  ↓
UI updates (chat messages, progress cards, outputs)
```

---

## MVP Feature Set (v1.0)

### Core Features
- ✅ 5-step onboarding wizard
- ✅ AI-generated artist profile + bio
- ✅ 11 agent chat interface
- ✅ Tool calling with streaming responses
- ✅ Progress cards (thinking, tool execution, outputs)
- ✅ Outputs panel (downloadable files)
- ✅ Academy (16 courses, 307 modules)
- ✅ Directory (74+ contacts, searchable)
- ✅ Email auth + Google OAuth

### Agent Capabilities
- ✅ PRO registration simulation
- ✅ Playlist finding + submission
- ✅ LLC formation wizard
- ✅ Tax estimation
- ✅ Contract generation (PDF)
- ✅ EPK builder (PDF)
- ✅ Splitsheet generator (PDF)

### Not in MVP (v1.1+)
- ❌ Live PRO API integration (BMI, ASCAP, SESAC)
- ❌ Live Spotify API (playlist submission)
- ❌ Live DSP integrations (DistroKid, TuneCore)
- ❌ Payment processing (Stripe)
- ❌ Email verification flow
- ❌ Real-time collaboration (multi-user sessions)
- ❌ Mobile app (iOS, Android)
- ❌ Resemble AI voiceovers
- ❌ Multi-tenant workspace isolation

---

## Pricing Tiers (Future)

| Plan | Price | Features |
|------|-------|----------|
| **Free** | $0 | 3 agents, 100 messages/month, 1 project |
| **Artist** | $19/mo | 11 agents, unlimited messages, 5 projects, 10GB storage |
| **Pro** | $49/mo | Artist + priority support, 50GB storage, custom branding |
| **BYOK** | $29/mo | Bring your own API keys (Anthropic, OpenAI), unlimited usage |
| **Label** | $199/mo | Multi-user, team collaboration, dedicated support |
| **Enterprise** | Custom | Dedicated Hermes instance, SLA, custom agents |

---

## Success Metrics

### North Star Metric
**Weekly Active Artists (WAA)** — artists who send at least 1 message to an agent per week

### Key Metrics
- **Signups** → Target: 100/week by month 3
- **Activation** → Complete onboarding + send 1st message (Target: 70%)
- **Retention** → 7-day return rate (Target: 40%)
- **Engagement** → Avg messages per session (Target: 5+)
- **Conversion** → Free → Paid (Target: 10%)
- **Revenue** → MRR (Target: $5K by month 6)

### Agent Metrics
- Most used agent (hypothesis: Manager, PRO)
- Most triggered tools (hypothesis: playlist finder, LLC wizard)
- Avg session duration (target: 8 minutes)
- Outputs generated per user (target: 3/week)

---

## Design Principles

### 1. Terminal-First Aesthetic
- Dark, high-contrast UI (#09090b background, #fafafa text)
- Monospace code blocks for technical content
- Minimal, functional design (no decorative elements)
- Inspired by: Claude Code, Cursor, Linear

### 2. Conversational Interface
- No complex forms — chat drives everything
- Progressive disclosure — ask for info only when needed
- Agents explain what they're doing (thinking blocks)
- Natural language input (no command memorization)

### 3. Instant Gratification
- Response streaming (word-by-word)
- Inline progress indicators (spinner → checkmark)
- Immediate file downloads (PDF, Excel, audio)
- No "processing" screens — show work in real-time

### 4. Trust Through Transparency
- Show agent reasoning (thinking blocks)
- Show tool calls with parameters
- Show source data for answers
- Allow manual review before execution

### 5. Mobile-First (Eventually)
- Desktop-optimized for MVP
- Responsive design prepared
- Mobile app planned for v2.0

---

## Competitive Landscape

### Direct Competitors
| Competitor | Strengths | Weaknesses |
|-----------|-----------|------------|
| **SymphonicHQ** | All-in-one music biz platform | Clunky UI, no AI, expensive ($50+/mo) |
| **Vampire Squid** | Distribution + marketing | Limited agents, no legal/finance |
| **Amuse** | Free distribution | No agent chat, basic features |
| **DistroKid** | Popular, affordable | Distribution only, no agents |

### Indirect Competitors
- **Record labels** — expensive, take ownership
- **Managers** — $2-5K/month, limited availability
- **Music lawyers** — $200-500/hour, one-time services
- **DIY tools** — scattered (Google Sheets, Notion, etc.)

### Artispreneur Differentiators
- ✅ Only platform with AI agent chat
- ✅ Only all-in-one covering PRO, legal, finance, distribution
- ✅ Only $19/month for everything
- ✅ Only PAL-compiled artist intelligence
- ✅ Only terminal-inspired, developer-quality UI

---

## Roadmap

### Phase 1: MVP (Current)
- Core agent chat interface
- Onboarding flow
- 11 agents with simulated tools
- PDF generation (EPK, contracts, splitsheets)
- Academy + Directory
- Email auth

### Phase 2: Live Integrations (Q3 2026)
- BMI/ASCAP/SESAC APIs
- Spotify API (playlist submission)
- DistroKid/TuneCore/CD Baby APIs
- Stripe payments
- Email verification

### Phase 3: Collaboration (Q4 2026)
- Multi-user workspaces
- Real-time co-editing
- Team plans (Label tier)
- Slack/Discord integrations

### Phase 4: Advanced Agents (Q1 2027)
- Sync licensing automation
- Radio promotion agent
- Social media agent (auto-posting)
- Analytics agent (streaming insights)
- Tour booking agent

### Phase 5: Mobile (Q2 2027)
- iOS app
- Android app
- Offline mode
- Push notifications

---

## Open Questions

1. **Agent orchestration**: Should Manager Agent always route, or can users directly address specialist agents?
2. **Tool execution**: Auto-execute tools, or always confirm with user first?
3. **Data retention**: How long to keep agent session history?
4. **API rate limits**: How to handle when users hit Anthropic rate limits?
5. **Multi-language**: When to add Spanish, Portuguese, French support?
6. **Voice input**: Should we add voice-to-text for mobile?
7. **Agent personalities**: Should agents have distinct personalities, or unified voice?

---

## Dependencies

### External Services
- **Anthropic API** (Claude Sonnet 4.5) — $15/million tokens
- **Vercel** (hosting, Postgres, Blob) — $20-50/month
- **Resemble AI** (TTS, Remy voice) — $0.006/second
- **Spotify API** (playlist submission) — free
- **BMI/ASCAP APIs** (PRO registration) — negotiating access

### Open Source
- **Hermes Agent** (Nous Research) — agent framework inspiration
- **ROSTR Framework** — PAL compilation + NPAO orchestration
- **Vercel AI SDK** — LLM streaming, tool calling
- **shadcn/ui** — UI components

---

## Launch Strategy

### Pre-Launch (Now)
- ✅ Build MVP
- ✅ Internal dogfooding
- ⏳ Invite 10 beta artists (friends, local Chicago artists)
- ⏳ Collect feedback, iterate

### Launch (Month 1)
- 🎯 Product Hunt launch
- 🎯 Reddit (r/WeAreTheMusicMakers, r/makinghiphop)
- 🎯 Twitter/X launch thread
- 🎯 LinkedIn post (Patrick's network)
- 🎯 Indie Hackers post
- 🎯 HackerNews Show HN

### Growth (Months 2-3)
- 🎯 Partnership with music blogs (Hypebot, DIY Musician)
- 🎯 YouTube tutorials (how-to videos)
- 🎯 TikTok demos (short agent clips)
- 🎯 Affiliate program (10% recurring commission)
- 🎯 SEO content (blog posts on music biz topics)

### Scale (Months 4-6)
- 🎯 Paid ads (Meta, Google)
- 🎯 Influencer partnerships (music YouTubers)
- 🎯 Conference presence (SXSW, A3C, Indie Week)
- 🎯 Press outreach (TechCrunch, The Verge, Billboard)

---

## Why Now?

1. **LLMs are production-ready** — Claude Sonnet 4.5, GPT-4.5 are reliable enough for real work
2. **Artists are DIY** — 67% of artists are independent (MIDiA Research, 2025)
3. **Tools are fragmented** — average artist uses 8+ tools/month
4. **AI adoption is mainstream** — ChatGPT has 200M users, artists are ready
5. **Music economy is growing** — streaming revenue up 12% YoY (IFPI 2026)

---

## Vision (5 Years)

**Artispreneur becomes the default operating system for independent artists.**

- 500K+ active artists
- 11 → 30+ specialized agents
- Full automation of music business operations
- API marketplace (3rd-party agents)
- International expansion (10+ languages)
- Artist-owned cooperative model (profit sharing)

**Outcome**: Independent artists have the same infrastructure as major-label artists, for $19/month.

---

## Contact

**Patrick Diamitani**  
GTM AI & Automation Manager, Atlas HXM  
Founder, Artispreneur  
pdiamitani@atlashxm.com  
linkedin.com/in/diamitani
