# PRD — Artispreneur Agent Workspace

Product requirements for the workspace product. Complements `docs/PRODUCT_VISION.md`
(v217 vision, agents, metrics, roadmap) with the workspace-first requirements: principles,
MVP scope with definitions of done, out-of-scope, and hierarchy.

---

## Product

**Artispreneur Agent Workspace** — an AI operating system that helps independent artists
organize, operate, and grow their music businesses.

## Vision

Give every artist a private, personalized team of AI business agents in one workspace. The
experience should feel as direct and capable as **Claude Code** — chat-first, file-aware,
project-based, transparent about work in progress — powered by Artispreneur's music-business
expertise, knowledge libraries, templates, and directory assets.

## Problem

Independent artists must manage brand building, releases, content, outreach, booking,
contracts, finances, and learning across too many disconnected tools. Most lack an
experienced manager or team, and generic AI tools do not understand their goals, approved
assets, business stage, brand voice, release timeline, or permission boundaries.

## Primary user

A self-managed independent artist who needs help turning creative goals into organized
business actions, with a preference for plain language over technical agent-management
concepts.

## Core user story

> As an artist, I want to tell one trusted assistant what I am trying to accomplish, so it
> can use my files, goals, brand rules, and Artispreneur resources to build a plan, activate
> the right specialist, and return drafts for my approval.

---

## Product principles

1. **One workspace**, not a collection of disconnected apps.
2. **One Master Agent**, not a confusing agent marketplace.
3. **Artist context first**: every agent starts with the workspace configuration, Soul.md,
   approved assets, and active project context.
4. **Approval before impact**: agents may research, plan, draft, organize, and recommend
   autonomously; they cannot send messages, publish content, spend money, sign documents,
   or change connected accounts without explicit approval.
5. **Show work visibly**: artists see agent status, source files, drafts, actions, decisions.
6. **Hide platform complexity**: ROSTR, containers, queues, and retrieval systems are
   backend infrastructure, not user-facing product language.
7. **Scale through shared services**: tenant isolation enforced in identity, storage,
   retrieval, task execution, and logs.

---

## MVP scope

| Area | MVP requirement | Definition of done |
|------|-----------------|--------------------|
| Workspace onboarding | Collect artist identity, goals, business stage, current project, brand direction, assets, tools, permissions | Generates a versioned workspace profile and Soul.md |
| Master Agent | Artist-facing Hermes agent that can plan, explain, route, and summarize | Uses workspace context on every task |
| Projects | Create projects by category: Release, Brand, EPK, Outreach, Booking, Legal, Finance, Academy | Each project has files, goals, tasks, agent runs, deliverables |
| Knowledge Vault | Upload, organize, retrieve, and cite artist files + approved Artispreneur library materials | Retrieval restricted to authorized workspace/library scopes |
| Specialist agents | Launch EPK/Brand, PR/Outreach, and Release Manager first | Master Agent delegates work and returns structured drafts |
| Approval Queue | Queue all external or consequential actions | Artist approval creates an immutable audit record |
| Prompt Library | Task-specific, editable starting prompts linked to platform features | Prompt opens a pre-scoped Master Agent request |
| Mission Control | Show active tasks, agent status, current project, recent outputs, errors | Artist understands what is happening without technical knowledge |
| Usage controls | Plans, credits, model usage, alerts, upgrade path | User sees current balance and upcoming limits |

## Out of scope for MVP

- Fully autonomous email sending or publishing
- Automated legal advice or contract execution
- Autonomous financial transactions
- Dedicated infrastructure per artist
- Every proposed specialist agent at launch
- Real-time multi-user collaboration
- Unrestricted web actions without workspace policy controls

---

## Agent hierarchy

```
Artispreneur Platform
└── Artist Workspace
    ├── Master Agent (Hermes runtime)
    │   ├── Plans and clarifies
    │   ├── Loads artist context
    │   ├── Calls ROSTR routing
    │   └── Coordinates specialists
    ├── Specialist Agents
    │   ├── EPK & Brand Agent
    │   ├── PR & Outreach Agent
    │   └── Release Manager
    ├── Skills
    │   ├── EPK Builder
    │   ├── Press Pitch Generator
    │   ├── Release Timeline Builder
    │   ├── Legal Business Setup
    │   └── Contract Drafting
    └── Libraries
        ├── Artist Knowledge Vault
        ├── Artispreneur Academy
        ├── Contract Library
        ├── Media / Playlist / Venue Directory
        └── Prompt Library
```

The Agent → Skill → Library hierarchy is the correct simplification for artists: agents do
the work, skills are on-demand workflows, libraries are governed knowledge.

---

## Founder actions (pre-build)

1. Approve the v1 agent list: Master Agent, EPK & Brand, PR & Outreach, Release Manager.
2. Choose the first onboarded artist persona — ideally an artist preparing a release in the
   next 30–90 days (exercises EPK, content, PR, distribution, and planning in one workflow).
3. Provide platform assets: existing EPK builder, contract builder, Academy course
   documents, prompt library, media-directory files.
4. Require a working **vertical slice** before full build: sign up → onboarding → Soul.md →
   create project → ask Master Agent → specialist draft → approval queue → saved deliverable.
5. No direct production agent actions at launch — drafting and approval-gated workflows
   first; unlock integrations gradually after audit logs and tenant isolation are proven.

Checkpoints: `#workspace-shell` `#master-agent-live` `#rostr-control-plane`
`#hermes-runtime` `#approval-queue` `#tenant-isolation-tested` `#first-user-ready`
