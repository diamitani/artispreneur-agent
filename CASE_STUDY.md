# Case Study: Artispreneur Agent — AWS Multi-Tenant AI Agent Platform

**Project:** Agent by Artispreneur  
**Timeline:** 1 evening (rapid prototyping session)  
**Role:** Full-Stack Engineer / Cloud Architect  
**Author:** Patrick Diamitani  

---

## Executive Summary

Built a production-ready, multi-tenant AI agent platform that provisions personalized Hermes agents with the ROSTR framework pre-installed. Users sign up, complete an intelligent onboarding flow, and receive their own AI business agent powered by AWS Bedrock — all automated through infrastructure-as-code.

**Key Outcomes:**
- Zero-to-agent provisioning in <30 seconds
- $0 base cost (pay-per-use Bedrock + on-demand DynamoDB)
- Full ROSTR framework (PAL → RAG-DAL → JTBD → NPAO → Instructions) automated during onboarding
- BYOK (Bring Your Own Key) support for free tier users

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           ARTISPRENEUR AGENT PLATFORM                            │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   FRONTEND   │    │   AUTH       │    │   API        │    │   AGENT      │  │
│  │   Next.js    │───▶│   Cognito    │───▶│   Routes     │───▶│   Runtime    │  │
│  │   Vercel     │    │   OAuth/PKCE │    │   Node.js    │    │   Hermes     │  │
│  └──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘  │
│         │                   │                   │                   │           │
│         │                   │                   │                   │           │
│         ▼                   ▼                   ▼                   ▼           │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                         AWS CONTROL PLANE                                │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │   │
│  │  │  Cognito    │  │  DynamoDB   │  │  S3 Hub     │  │  Bedrock    │    │   │
│  │  │  User Pool  │  │  Instances  │  │  Storage    │  │  DeepSeek   │    │   │
│  │  │             │  │             │  │             │  │             │    │   │
│  │  │ us-east-1_  │  │ USER#       │  │ Soul.md     │  │ LLM         │    │   │
│  │  │ VyKGNlV9r   │  │ PROJECT#    │  │ PAL config  │  │ Inference   │    │   │
│  │  │             │  │ AGENT#      │  │ Skills      │  │             │    │   │
│  │  │             │  │ KEY#        │  │ Knowledge   │  │             │    │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## ROSTR Onboarding Pipeline

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        ROSTR ONBOARDING FLOW                                     │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  USER PROMPT                                                                     │
│       │                                                                          │
│       ▼                                                                          │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐           │
│  │   PAL   │──▶│ RAG-DAL │──▶│  JTBD   │──▶│  NPAO   │──▶│   I.A.  │           │
│  │         │   │         │   │         │   │         │   │         │           │
│  │ Extract │   │ Search  │   │ Jobs To │   │Navigate │   │ Master  │           │
│  │ Intent  │   │ Context │   │ Be Done │   │Prioritze│   │ Instruct│           │
│  │         │   │         │   │         │   │Allocate │   │         │           │
│  │ Compile │   │ Gather  │   │ Define  │   │Orchestr │   │ Create  │           │
│  │ Prompt  │   │ Docs    │   │ Success │   │         │   │ Soul.md │           │
│  └─────────┘   └─────────┘   └─────────┘   └─────────┘   └─────────┘           │
│       │             │             │             │             │                  │
│       │             │             │             │             │                  │
│       ▼             ▼             ▼             ▼             ▼                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                              S3 HUB BUCKET                               │   │
│  │  /users/{cognitoSub}/projects/{projectId}/                              │   │
│  │    ├── 00-config/                                                        │   │
│  │    │   ├── master-soul.md          ← Generated instructions              │   │
│  │    │   ├── pal-compilation.json    ← Intent + context                    │   │
│  │    │   ├── rostr-manifest.json     ← Framework config                    │   │
│  │    │   ├── api-keys.json           ← Workspace keys                      │   │
│  │    │   └── skills-library.json     ← Installed skills                    │   │
│  │    ├── knowledge-base/             ← RAG-DAL outputs                     │   │
│  │    │   ├── industry-docs/                                                │   │
│  │    │   ├── best-practices/                                               │   │
│  │    │   └── user-uploads/                                                 │   │
│  │    ├── 03-agent-workflows/                                               │   │
│  │    │   └── npao-plan.json          ← Prioritized job queue               │   │
│  │    └── skills/{slug}/              ← Activated skill packs               │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## PAL Pipeline Detail

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    PAL (Prompt Abstraction Layer) PIPELINE                       │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  STAGE 1: EXTRACTION                                                             │
│  ┌──────────────────────────────────────────────────────────────┐               │
│  │  User Onboarding Answers                                      │               │
│  │  ─────────────────────────                                    │               │
│  │  • stage_name: "Patrick Diamitani"                           │               │
│  │  • mode: "artist" | "agency" | "label"                       │               │
│  │  • genres: ["Hip-Hop", "R&B"]                                │               │
│  │  • goals: ["Release album", "Sync licensing"]                │               │
│  │  • tools: ["DistroKid", "Tunecore"]                          │               │
│  │                                    ▼                          │               │
│  │                          INTENT EXTRACTION                    │               │
│  │                                    │                          │               │
│  │  {                                 │                          │               │
│  │    primary_intent: "manage music release pipeline",          │               │
│  │    domain: "music_business",                                 │               │
│  │    constraints: ["independent", "budget-conscious"],         │               │
│  │    desired_output: "automated release workflow"              │               │
│  │  }                                                            │               │
│  └──────────────────────────────────────────────────────────────┘               │
│                                      │                                           │
│                                      ▼                                           │
│  STAGE 2: CONTEXT INJECTION (RAG-DAL)                                           │
│  ┌──────────────────────────────────────────────────────────────┐               │
│  │  Multi-Pass Knowledge Retrieval                               │               │
│  │  ───────────────────────────────                              │               │
│  │  Pass 1: Broad sweep (5 queries)                             │               │
│  │    • "music distribution best practices 2026"                │               │
│  │    • "PRO registration ASCAP BMI SESAC"                      │               │
│  │    • "sync licensing independent artists"                     │               │
│  │    • "music business automation tools"                        │               │
│  │    • "artist management workflows"                            │               │
│  │                                                               │               │
│  │  Pass 2: Gap fill (low-confidence topics)                    │               │
│  │  Pass 3: Verification (Tier 1 sources only)                  │               │
│  │                                                               │               │
│  │  Source Tiers:                                                │               │
│  │    Tier 1 (1.0): ASCAP, BMI, official docs                   │               │
│  │    Tier 2 (0.75): Music Business Worldwide, Billboard        │               │
│  │    Tier 3 (0.40): Reddit, forums, blogs                      │               │
│  └──────────────────────────────────────────────────────────────┘               │
│                                      │                                           │
│                                      ▼                                           │
│  STAGE 3: JTBD (Jobs To Be Done)                                                │
│  ┌──────────────────────────────────────────────────────────────┐               │
│  │  Success Criteria Definition                                  │               │
│  │  ───────────────────────────                                  │               │
│  │  • What actions must the agent execute?                      │               │
│  │  • What deliverables are expected?                           │               │
│  │  • What constraints apply?                                   │               │
│  │                                                               │               │
│  │  Output:                                                      │               │
│  │  [                                                            │               │
│  │    { job: "Draft EPK", outcome: "PDF + web version" },       │               │
│  │    { job: "Register PRO", outcome: "Confirmation #" },       │               │
│  │    { job: "Submit to DSPs", outcome: "Release URLs" }        │               │
│  │  ]                                                            │               │
│  └──────────────────────────────────────────────────────────────┘               │
│                                      │                                           │
│                                      ▼                                           │
│  STAGE 4: NPAO (Navigate, Prioritize, Allocate, Orchestrate)                    │
│  ┌──────────────────────────────────────────────────────────────┐               │
│  │  Build Plan Generation                                        │               │
│  │  ──────────────────────                                       │               │
│  │  Priority Score = (Phase×0.35) + (Dependency×0.30)           │               │
│  │                 + (Business×0.25) + (Resource×0.10)          │               │
│  │                                                               │               │
│  │  Generated Plan:                                              │               │
│  │  [                                                            │               │
│  │    { id: 1, phase: "PreD", task: "Validate release date",    │               │
│  │      agent: "researcher", priority: 8.2 },                   │               │
│  │    { id: 2, phase: "Design", task: "Create EPK structure",   │               │
│  │      agent: "designer", priority: 7.5 },                     │               │
│  │    { id: 3, phase: "Dev", task: "Generate marketing copy",   │               │
│  │      agent: "copywriter", priority: 6.8 }                    │               │
│  │  ]                                                            │               │
│  └──────────────────────────────────────────────────────────────┘               │
│                                      │                                           │
│                                      ▼                                           │
│  STAGE 5: I.A. (Instruction Architect)                                          │
│  ┌──────────────────────────────────────────────────────────────┐               │
│  │  Master Soul.md Generation                                    │               │
│  │  ──────────────────────────                                   │               │
│  │  # Master Soul — Patrick Diamitani                           │               │
│  │                                                               │               │
│  │  ## Identity                                                  │               │
│  │  You are the AI business manager for Patrick Diamitani,      │               │
│  │  an independent hip-hop artist based in Chicago...           │               │
│  │                                                               │               │
│  │  ## Goals & Constraints                                       │               │
│  │  - Primary: Album release Q4 2026                            │               │
│  │  - Budget: Bootstrap ($0-500/month)                          │               │
│  │  - Voice: Professional but authentic                         │               │
│  │                                                               │               │
│  │  ## Specialist Roster                                         │               │
│  │  - Rights Manager (PRO, publishing)                          │               │
│  │  - Release Coordinator (distribution, DSPs)                  │               │
│  │  - Marketing Strategist (socials, PR)                        │               │
│  │  ...                                                          │               │
│  └──────────────────────────────────────────────────────────────┘               │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## AWS Infrastructure Detail

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         AWS ACCOUNT: 148761663702                                │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                           COGNITO USER POOL                              │   │
│  │  ID: us-east-1_VyKGNlV9r                                                │   │
│  │  Domain: artispreneur-agent.auth.us-east-1.amazoncognito.com           │   │
│  │  Client: 6dfqmemi0kvha7u3vbu2rq8n4h                                    │   │
│  │                                                                          │   │
│  │  Flow: OAuth 2.0 + PKCE                                                 │   │
│  │  ┌────────┐   ┌────────┐   ┌────────┐   ┌────────┐                     │   │
│  │  │ Login  │──▶│ Hosted │──▶│ Token  │──▶│ Verify │                     │   │
│  │  │ Button │   │ UI     │   │Exchange│   │ JWKS   │                     │   │
│  │  └────────┘   └────────┘   └────────┘   └────────┘                     │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                      │                                           │
│                                      ▼                                           │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        DYNAMODB: artispreneur-agent-instances            │   │
│  │  Billing: On-Demand (PAY_PER_REQUEST)                                   │   │
│  │  Partition Key: pk (String)                                              │   │
│  │  Sort Key: sk (String)                                                   │   │
│  │                                                                          │   │
│  │  ┌──────────────────────────────────────────────────────────────────┐  │   │
│  │  │ pk                    │ sk              │ Data                    │  │   │
│  │  ├──────────────────────────────────────────────────────────────────┤  │   │
│  │  │ USER#abc-123          │ PROFILE         │ email, org, tenant      │  │   │
│  │  │ USER#abc-123          │ PROJECT#proj-1  │ workspace_path, plan    │  │   │
│  │  │ USER#abc-123          │ AGENT#hermes    │ model_id, soul_loaded   │  │   │
│  │  │ KEY#sha256...         │ META            │ key_id, user_id         │  │   │
│  │  │ USER#abc-123          │ USAGE#2026-07   │ tokens, cost            │  │   │
│  │  └──────────────────────────────────────────────────────────────────┘  │   │
│  │                                                                          │   │
│  │  GSI: user-id-index (user_id → sk)                                      │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                      │                                           │
│                                      ▼                                           │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                          S3: artispreneur-agent-hub                      │   │
│  │  Encryption: AES-256                                                     │   │
│  │  Versioning: Enabled                                                     │   │
│  │  Public Access: Blocked                                                  │   │
│  │                                                                          │   │
│  │  Hierarchy:                                                              │   │
│  │  orgs/diamitani-industries/tenants/artispreneur-com/products/agent/     │   │
│  │    └── users/{cognitoSub}/projects/{projectId}/                         │   │
│  │          ├── 00-config/                                                  │   │
│  │          │   ├── master-soul.md                                         │   │
│  │          │   ├── pal-compilation.json                                   │   │
│  │          │   ├── rostr-manifest.json                                    │   │
│  │          │   ├── api-keys.json                                          │   │
│  │          │   └── skills-library.json                                    │   │
│  │          ├── knowledge-base/                                             │   │
│  │          ├── skills/{slug}/                                              │   │
│  │          └── 03-agent-workflows/npao-plan.json                          │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                      │                                           │
│                                      ▼                                           │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                          BEDROCK: deepseek.v3-v1:0                       │   │
│  │  Region: us-east-1                                                       │   │
│  │  Auth: Bearer Token (Mantle API Key)                                    │   │
│  │                                                                          │   │
│  │  ┌────────────┐    ┌────────────┐    ┌────────────┐                    │   │
│  │  │ System     │───▶│ Streaming  │───▶│ Usage      │                    │   │
│  │  │ Prompt     │    │ Response   │    │ Tracking   │                    │   │
│  │  │ (Soul +    │    │            │    │ (DynamoDB) │                    │   │
│  │  │  Skills)   │    │            │    │            │                    │   │
│  │  └────────────┘    └────────────┘    └────────────┘                    │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Artispreneur Ecosystem Map

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        DIAMITANI INDUSTRIES ECOSYSTEM                            │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│                              ┌─────────────────┐                                │
│                              │   DIAMITANI     │                                │
│                              │   INDUSTRIES    │                                │
│                              │   (Parent Org)  │                                │
│                              └────────┬────────┘                                │
│                                       │                                          │
│           ┌───────────────────────────┼───────────────────────────┐             │
│           │                           │                           │             │
│           ▼                           ▼                           ▼             │
│  ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐       │
│  │  ARTISPRENEUR   │       │   6TH AGENT     │       │   ROSTR HUB     │       │
│  │    (Tenant)     │       │   (Tenant)      │       │   (Framework)   │       │
│  │                 │       │                 │       │                 │       │
│  │ Music Business  │       │ General AI      │       │ PAL + NPAO +    │       │
│  │ Automation      │       │ Agents          │       │ RAG-DAL         │       │
│  └────────┬────────┘       └────────┬────────┘       └────────┬────────┘       │
│           │                         │                         │                 │
│           ▼                         ▼                         ▼                 │
│  ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐       │
│  │     AGENT       │       │   SIXTHAGENT    │       │   ROSTR-AGENT   │       │
│  │   (Product)     │       │   (Product)     │       │   (OSS)         │       │
│  │                 │       │                 │       │                 │       │
│  │ • Hermes core   │       │ • Multi-tenant  │       │ • Hermes fork   │       │
│  │ • PAL onboard   │       │ • Knowledge     │       │ • ROSTR pre-    │       │
│  │ • Skills market │       │ • Threads       │       │   installed     │       │
│  │ • Music special │       │                 │       │                 │       │
│  └─────────────────┘       └─────────────────┘       └─────────────────┘       │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        SHARED INFRASTRUCTURE                             │   │
│  │                                                                          │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │   │
│  │  │ Cognito  │  │ DynamoDB │  │    S3    │  │ Bedrock  │  │ Vercel   │  │   │
│  │  │ Pools    │  │ Tables   │  │ Buckets  │  │ Models   │  │ Deploy   │  │   │
│  │  │ (per     │  │ (single- │  │ (per     │  │ (shared) │  │ (per     │  │   │
│  │  │ product) │  │ table)   │  │ product) │  │          │  │ product) │  │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Cost Analysis

### AWS Monthly Cost Estimate

| Service | Usage Assumption | Unit Cost | Monthly Est. |
|---------|------------------|-----------|--------------|
| **Cognito** | 1,000 MAU | Free (first 50k) | **$0** |
| **DynamoDB** | 100k reads, 50k writes | On-demand | **~$1.50** |
| **S3** | 10GB storage, 100k requests | Standard | **~$0.50** |
| **Bedrock (DeepSeek)** | 10M input, 2M output tokens | $0.14/$0.28 per 1M | **~$2.00** |
| **Data Transfer** | 50GB outbound | $0.09/GB | **~$4.50** |

**Total Infrastructure: ~$8.50/month** (scales with usage)

### Cost Per User

| Tier | Onboarding | Monthly Active | Cost/User |
|------|------------|----------------|-----------|
| Free (BYOK) | ~50k tokens | ~500k tokens | **$0** (user pays) |
| Starter | ~50k tokens | ~2M tokens | **~$0.35/month** |
| Pro | ~100k tokens | ~10M tokens | **~$1.50/month** |

### BYOK (Bring Your Own Key) Model

Users on free tier can connect their own API keys:
- Google Gemini (free tier: 1M tokens/month)
- OpenAI API
- Anthropic API
- Any OpenAI-compatible endpoint

OAuth flow guides users through key setup if they don't have one.

---

## User Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              USER JOURNEY                                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  1. LANDING                                                                      │
│  ┌──────────┐                                                                   │
│  │  Visit   │──▶ See hero, features, pricing                                   │
│  │  Site    │                                                                   │
│  └──────────┘                                                                   │
│       │                                                                          │
│       ▼                                                                          │
│  2. SIGN UP                                                                      │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐                                    │
│  │  Click   │──▶│ Cognito  │──▶│ Callback │──▶ ensureUserShell()               │
│  │ "Start"  │   │ Hosted   │   │ /api/    │    Creates USER# + PROJECT#        │
│  └──────────┘   │ UI       │   │ auth     │                                    │
│                 └──────────┘   └──────────┘                                    │
│       │                                                                          │
│       ▼                                                                          │
│  3. ONBOARDING (PAL Intake)                                                     │
│  ┌──────────────────────────────────────────────────────────────────────────┐  │
│  │                                                                           │  │
│  │  Step 1: Identity          Step 2: Goals           Step 3: Tools         │  │
│  │  ┌─────────────────┐      ┌─────────────────┐     ┌─────────────────┐   │  │
│  │  │ • Stage name    │      │ • Primary goal  │     │ • Current tools │   │  │
│  │  │ • Mode (artist/ │──▶   │ • Timeline      │──▶  │ • Budget        │   │  │
│  │  │   agency/label) │      │ • Success metric│     │ • Integrations  │   │  │
│  │  └─────────────────┘      └─────────────────┘     └─────────────────┘   │  │
│  │                                                                           │  │
│  │                              │                                            │  │
│  │                              ▼                                            │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐    │  │
│  │  │                    PAL COMPILATION                               │    │  │
│  │  │  POST /api/pal/intake                                           │    │  │
│  │  │                                                                  │    │  │
│  │  │  → Extract intent                                               │    │  │
│  │  │  → RAG-DAL knowledge retrieval                                  │    │  │
│  │  │  → JTBD success criteria                                        │    │  │
│  │  │  → NPAO build plan                                              │    │  │
│  │  │  → Generate Master Soul.md                                      │    │  │
│  │  │  → Persist to S3 hub                                            │    │  │
│  │  │  → Create AGENT#hermes in DynamoDB                              │    │  │
│  │  └─────────────────────────────────────────────────────────────────┘    │  │
│  └──────────────────────────────────────────────────────────────────────────┘  │
│       │                                                                          │
│       ▼                                                                          │
│  4. AGENT SELECTOR (Dropdown)                                                   │
│  ┌──────────────────────────────────────────────────────────────────────────┐  │
│  │  GET /api/agent/provision  →  Check status                               │  │
│  │  POST /api/agent/provision →  Provision if needed                        │  │
│  │                                                                           │  │
│  │  ┌─────────────────────────────┐                                         │  │
│  │  │ ● Hermes Ready              │  Agent ID: hermes-abc12345             │  │
│  │  │ ─────────────────────────── │  Runtime: hermes+pal-rostr             │  │
│  │  │ Runtime    hermes+pal-rostr │  Model: deepseek.v3-v1:0               │  │
│  │  │ Model      deepseek.v3      │  Hub: s3                               │  │
│  │  │ ROSTR      ✓ Installed      │  Soul: ✓ Loaded                        │  │
│  │  │ Soul       ✓ Loaded         │                                         │  │
│  │  │ Skills     3 active         │  [Connect to Agent]                    │  │
│  │  └─────────────────────────────┘                                         │  │
│  └──────────────────────────────────────────────────────────────────────────┘  │
│       │                                                                          │
│       ▼                                                                          │
│  5. MISSION CONTROL (Workspace)                                                 │
│  ┌──────────────────────────────────────────────────────────────────────────┐  │
│  │                                                                           │  │
│  │  ┌─────────────────────────────────────┐  ┌─────────────────────────┐   │  │
│  │  │         HERMES CHAT                 │  │      SIDEBAR            │   │  │
│  │  │                                     │  │                         │   │  │
│  │  │  What should we work on, Patrick?   │  │  Skills Library (3)    │   │  │
│  │  │                                     │  │  • Rights Manager      │   │  │
│  │  │  ┌──────────────────────────────┐  │  │  • Release Coord       │   │  │
│  │  │  │ > Draft EPK for new single   │  │  │  • Marketing           │   │  │
│  │  │  └──────────────────────────────┘  │  │                         │   │  │
│  │  │                                     │  │  Active Roster         │   │  │
│  │  │  [Hermes responding...]             │  │  • 7 specialists       │   │  │
│  │  │                                     │  │                         │   │  │
│  │  └─────────────────────────────────────┘  └─────────────────────────┘   │  │
│  │                                                                           │  │
│  │  NPAO Plan                                                                │  │
│  │  ┌───────────────────────────────────────────────────────────────────┐  │  │
│  │  │ [N] Validate release date  │ researcher │ PreD    │ ████████░░ │  │  │
│  │  │ [P] Create EPK structure   │ designer   │ Design  │ ██████░░░░ │  │  │
│  │  │ [A] Generate marketing     │ copywriter │ Dev     │ ████░░░░░░ │  │  │
│  │  └───────────────────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────────────┘  │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## Technical Skills Applied

### Cloud Architecture
- **AWS CloudFormation** — Infrastructure as Code for Cognito, DynamoDB, S3, IAM
- **DynamoDB Single-Table Design** — Efficient multi-entity data model (USER#, PROJECT#, AGENT#, KEY#)
- **S3 Object Hierarchy** — Multi-tenant namespace with org/tenant/product/user/project structure
- **AWS Bedrock** — Managed LLM inference with streaming responses
- **Cognito OAuth 2.0 + PKCE** — Secure authentication without client secrets

### Backend Engineering
- **Next.js 15 API Routes** — Serverless endpoints on Vercel
- **TypeScript** — Full type safety across API and frontend
- **Streaming Responses** — Real-time LLM output via Vercel AI SDK
- **Token-Based Auth** — JWT verification with JWKS rotation
- **Usage Metering** — Per-workspace token tracking for billing

### Frontend Development
- **React 19** — Server and Client components
- **Framer Motion** — Fluid animations for AgentSelector dropdown
- **Tailwind CSS** — Design system implementation
- **Progressive Enhancement** — Works without JS, enhanced with it

### AI/ML Engineering
- **Prompt Engineering** — ROSTR framework implementation (PAL → NPAO)
- **RAG Architecture** — Multi-pass retrieval with source credibility scoring
- **Agent Orchestration** — Specialist roster with phase-aware task routing
- **Context Management** — Token budgeting (Soul: 6k, Skills: 3.5k each, max 5)

### DevOps & Deployment
- **Git Workflow** — Feature branches, conventional commits
- **Vercel CD** — Auto-deploy on push to main
- **Environment Management** — Secure secrets handling across dev/prod
- **Monitoring** — Usage tracking via DynamoDB time-series

### Framework Design
- **ROSTR Framework** — Novel multi-agent architecture
  - PAL (Prompt Abstraction Layer)
  - RAG-DAL (Dynamic Acquisition Layer)
  - JTBD (Jobs To Be Done)
  - NPAO (Navigate, Prioritize, Allocate, Orchestrate)
  - I.A. (Instruction Architect)

---

## Key Technical Decisions

| Decision | Rationale |
|----------|-----------|
| **DynamoDB single-table** | Eliminates joins, consistent latency at any scale |
| **S3 for hub storage** | Unlimited scale, versioning, cross-region replication ready |
| **Bedrock over direct API** | Unified billing, no API key management, compliance |
| **PKCE auth flow** | Secure for SPAs without backend secrets |
| **Streaming responses** | Better UX, first token in <500ms |
| **On-demand pricing** | $0 base cost, scales with usage |
| **BYOK support** | Free tier users bring their own LLM keys |

---

## Lessons Learned

1. **Single-table DynamoDB is worth the upfront design** — Querying USER# + PROJECT# + AGENT# in one call is extremely fast.

2. **PAL compilation must be idempotent** — Users re-run onboarding; don't create duplicate records.

3. **Context budget is critical** — With Soul (6k) + Skills (5×3.5k), you hit model limits fast. Clip intelligently.

4. **BYOK unlocks free tier** — Users with their own Gemini/OpenAI keys cost $0 to serve.

5. **CloudFormation outputs → env vars** — Automate the connection between infra and app config.

---

## Future Enhancements

- [ ] RAG-DAL with vector embeddings (Pinecone/pgvector)
- [ ] Multi-model routing (use cheaper models for simple tasks)
- [ ] Skill marketplace with Stripe payments
- [ ] Team workspaces with RBAC
- [ ] Webhook integrations (Zapier, n8n)
- [ ] Mobile app (React Native)

---

## Repository

- **Frontend/API:** `github.com/diamitani/artispreneur-agent`
- **Framework:** `github.com/diamitani/rostr-agent`
- **Live:** `agent.artispreneur.com` (Vercel)

---

*Built by Patrick Diamitani — Diamitani Industries, Inc.*  
*July 2026*
