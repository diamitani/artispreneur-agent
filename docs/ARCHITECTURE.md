# Artispreneur Agent — Architecture

**Product:** Agent by Artispreneur  
**Stack:** Next.js 15 · React 19 · Tailwind 4 · ROSTR / PAL  
**Design system:** `design-system/` (v1.0) → runtime tokens in `src/app/globals.css`

---

## Workspace hierarchy (tenancy)

```
Diamitani Industries → artispreneur.com → agent → users/{sub} → projects/{id}
```

See `docs/AUTH.md` and `src/lib/tenancy/hierarchy.ts`.

## System overview

```mermaid
flowchart TB
  subgraph Client["Client surfaces"]
    M["/ Marketing<br/>LandingPage + DS"]
    O["/onboarding<br/>OnboardingWizard"]
    W["/workspace<br/>Mission Control"]
  end

  subgraph Auth["AWS Cognito OAuth"]
    L["GET /api/auth/login"]
    CB["GET /api/auth/callback"]
    COG["Cognito Hosted UI + JWKS"]
  end

  subgraph API["Next.js API"]
    PI["POST /api/pal/intake"]
    PG["GET /api/pal/intake/:artistId"]
    WH["POST /api/webhooks/signup"]
  end

  subgraph PAL["ROSTR · PAL Roster Agent"]
    Q["onboarding-questions.ts<br/>4 steps · ~14 fields"]
    C["pal-compiler.ts<br/>L1→L5 compile"]
    S["specialists.ts<br/>7 specialist agents"]
    ST["intake-store.ts<br/>hierarchical hub"]
  end

  subgraph Hub["Rostr Hub · Diamitani → Artispreneur → Agent"]
    SOUL["00-config/master-soul.md"]
    PROF["00-config/artist-profile.json"]
    CFG["00-config/workspace-config.json"]
    TEN["00-config/tenancy.json"]
    PALJ["00-config/pal-compilation.json"]
    NPAO["03-agent-workflows/npao-plan.json"]
  end

  subgraph Ext["External"]
    Vercel["Vercel hosting"]
    Bedrock["Amazon Bedrock<br/>Mantle IAM · chat next"]
    Composio["Composio<br/>planned"]
  end

  M -->|CTA| L
  L --> COG
  COG --> CB
  CB --> O
  O -->|answers + session sub| PI
  WH -->|Cognito Lambda| PI
  PI --> C
  Q --> C
  C --> S
  C --> ST
  ST --> Hub
  W -->|load| PG
  PG --> ST
  Vercel -.-> Client
  Vercel -.-> API
  Bedrock -.-> W
  Composio -.-> W
```

---

## User journey

```mermaid
sequenceDiagram
  actor Artist
  participant Landing as Marketing /
  participant Onboard as /onboarding
  participant API as POST /api/pal/intake
  participant PAL as pal-compiler
  participant Disk as .data/workspaces/{id}
  participant WS as /workspace

  Artist->>Landing: Explore product
  Artist->>Onboard: Start free / Get Workspace
  Onboard->>API: answers + soft-gate
  API->>PAL: compilePalIntake()
  PAL->>PAL: L1 extract → L5 handoff
  PAL->>Disk: soul, profile, roster, NPAO plan
  API-->>Onboard: PalCompilationResult
  Onboard->>WS: redirect ?artist=
  WS->>API: GET /api/pal/intake/:id
  API->>Disk: load pal-compilation.json
  API-->>WS: Mission Control data
```

---

## PAL compilation pipeline

```mermaid
flowchart LR
  A[L1 Extract<br/>intent + answers] --> B[L2 Compose<br/>soul + profile]
  B --> C[L3 Optimize<br/>gaps + soft gate]
  C --> D[L4 Compile<br/>roster + NPAO]
  D --> E[L5 Handoff<br/>artifacts + Mission Control]
```

| Stage | Output |
|-------|--------|
| L1 Extract | Structured answers, domain, constraints |
| L2 Compose | Draft Master Soul, artist profile |
| L3 Optimize | Completeness %, open gaps (soft gate) |
| L4 Compile | Active specialist roster, permissions, NPAO plan |
| L5 Handoff | Artifact paths, workspace ready |

---

## Specialist roster

| Specialist | Surface |
|------------|---------|
| Brand / EPK | Press kits, one-sheets |
| Contracts | Deal drafts, clause education |
| Release | Release readiness |
| Content | Social / brand assets |
| Press | PR outreach drafts |
| Booking | Venues, CRM |
| Finance | Budgets, statements |

Master Agent routes; specialists draft; **approval-first** for send / rights / money.

---

## Repo map

```
APP/
├── design-system/          # Brand DS v1.0 (tokens, kits, logo)
├── docs/
│   ├── ARCHITECTURE.md     # This file
│   └── PAL_INTAKE.md
├── .rostr/agents/          # Agent manifests
├── .data/workspaces/       # Local Rostr Hub (gitignored)
├── public/                 # Logo, hero
└── src/
    ├── app/                # Routes + API + globals.css tokens
    ├── components/
    │   ├── marketing/
    │   ├── onboarding/
    │   ├── workspace/
    │   └── brand/
    └── lib/
        ├── rostr/          # PAL compiler + store
        ├── brand.ts
        └── marketing-data.ts
```

---

## Deployment topology

```mermaid
flowchart LR
  GH[GitHub<br/>diamitani/artispreneur-agent] --> Vercel[Vercel project]
  Vercel --> Edge[Next.js App Router]
  Edge --> FS[".data/workspaces<br/>ephemeral on serverless*"]
  Edge -.-> BR[Bedrock via Mantle / IAM]

  note1["* Local/dev: filesystem hub.<br/>Prod target: DynamoDB + S3 per multi-tenant blueprint."]
```

---

## Design system binding

| Source | Runtime |
|--------|---------|
| `design-system/colors_and_type.css` | `src/app/globals.css` `:root` |
| Crimson `#CC0000` · Gold `#FED001` · Black `#111111` | CTAs, accents, dark heroes |
| Libre Baskerville + Inter | `layout.tsx` next/font |
| `design-system/assets/logo.png` | `public/artispreneur-logo.png` |
| Marketing / Dashboard UI kits | Landing + Mission Control patterns |

---

## Status legend

| Layer | Status |
|-------|--------|
| Marketing + DS | Shipped |
| Cognito OAuth + hierarchy | Shipped (env-gated) |
| PAL intake + soft gate | Shipped |
| Mission Control handoff | Shipped (light) |
| Bedrock DeepSeek Master Agent | Shipped (`/api/agent/chat`) |
| Workspace `apa_*` API keys + usage ledger | Shipped |
| Full Hermes shell (projects, vault) | Next |
| Composio integrations | Planned |
| Durable multi-tenant hub (DynamoDB/S3) | Planned (AWS blueprint) |
