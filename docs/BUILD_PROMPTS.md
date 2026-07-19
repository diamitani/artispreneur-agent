# Agency Build Prompts + Delivery Plan

Handoff prompts for the implementation agency, generated via ROSTR. Three workstreams:
ROSTR control plane, Hermes runtime, and frontend — plus the PAL enterprise onboarding
compiler and the phased delivery plan.

Context docs: `docs/WORKSPACE_FLOW.md` (schemas, isolation rules),
`docs/PRD_WORKSPACE.md` (scope), `docs/ORG_MODES.md` (Artist/Agency/Label modes).

---

## 1 · ROSTR control-plane prompt

```
You are the ROSTR architecture and control-plane team for Artispreneur.
Build a multi-tenant agent orchestration layer for an artist-focused SaaS application.
Your responsibility is not to create a generic chatbot. Build the orchestration system.

SYSTEM RESPONSIBILITIES
1. Implement PAL compilation:
   - Accept user request, authenticated user ID, workspace ID, project ID if present.
   - Classify intent, ambiguity, risk, required knowledge sources, relevant specialists.
   - Return a structured task manifest.
2. Implement NPAO orchestration:
   - Prioritize tasks by user goal, release deadline, risk, project status, dependencies.
   - Route work to Master Agent or specialist agents.
   - Support sequential, parallel, retry, and human-approval workflow states.
   - Persist task state and agent handoffs.
3. Implement artist workspace context assembly:
   - Load workspace configuration, Master Soul.md, active project context, brand rules.
   - Never load cross-tenant content.
   - Produce a bounded context package for Hermes and specialist agents.
4. Implement Reference Hub:
   - Store decisions, task summaries, artifacts, source citations, agent outputs, learnings.
   - Separate session state, workspace/project state, artist identity state, agent state.
   - Version important assets such as Soul.md, campaign plans, and approval records.
5. Implement policy enforcement:
   - Drafting, research, planning, organization, and recommendations may run automatically.
   - Email sending, publishing, financial actions, legal execution, data deletion, and
     integration changes are approval-gated.
   - Enforce workspace-scoped authorization before every tool call and file retrieval.
6. Implement observability:
   - Emit structured event logs for request received, PAL compiled, context loaded, task
     routed, agent run, approval, and completion.
   - Include workspace ID, project ID, task ID, agent ID, model, token/cost estimates.

INITIAL AGENTS
- Artispreneur Master Agent: intent clarification, planning, project coordination, delegation.
- EPK & Brand Agent: EPK assembly, bios, brand messaging, asset-gap checklists.
- PR & Outreach Agent: media research, outlet matching, pitch drafts, follow-up plans.
- Release Manager: release timeline, distribution checklists, metadata review, launch plan.

REQUIRED OUTPUTS
- Agent manifest schema
- Task manifest schema
- Context package schema
- Event/audit schema
- Agent registry API
- Task orchestration API
- Approval API
- Reference Hub retrieval/write API
- Error and retry policy
- Seed configuration for the four initial agents
- Automated tests proving workspace isolation and approval enforcement

NON-NEGOTIABLES
- Multi-tenant isolation by workspace ID at every layer.
- No generic global agent memory may contain private artist data.
- The UI must receive live task progress without exposing infrastructure details.
- The design must support thousands of artists and horizontal worker scaling.
- All potentially consequential external actions are approval-gated.
```

---

## 2 · Hermes runtime prompt

```
You are the Hermes runtime implementation team for Artispreneur.
Build the Hermes execution service used by the Artispreneur Master Agent and specialists.

ARCHITECTURE
- Run Hermes in a containerized worker environment.
- Hermes receives a short-lived workspace-scoped task token and a compiled task package.
- The runtime must mount or securely retrieve only the approved workspace context.
- Never expose shell access, raw cloud credentials, or unscoped file access to artists.
- Secrets must be injected only at runtime through secure environment configuration.

PER-TASK INPUT
- task_id, workspace_id, artist_id, project_id (when applicable)
- compiled_intent
- selected_agent_profile
- workspace_context_package
- permitted_tools, permitted_libraries
- approval_policy
- output contract

CONTEXT LOADING ORDER
1. Platform agent Soul.md
2. Specialist agent Soul.md
3. Workspace Master Soul.md
4. Active project brief
5. Relevant library retrieval results
6. Recent approved decisions and task summaries
7. Task-specific instructions

HERMES RESPONSIBILITIES
- Maintain personalized, bounded artist memory.
- Load Artispreneur skills only when relevant to the task.
- Produce structured outputs: summary, deliverables, sources used, assumptions, suggestions.
- Save a concise task summary and reusable learning to the Reference Hub through the API.
- Return drafts only for external communication and high-impact actions.
- Ask for clarification only when required data materially changes the result.

REQUIRED HERMES FEATURES
- Agent profiles: master, EPK-brand, PR-outreach, release-manager.
- Workspace-specific Soul.md loading.
- Skills installation and versioning.
- Memory retrieval and update integration.
- Tool allowlisting by agent and task.
- Streaming response support for the UI.
- Task cancellation, timeout, retry-safe execution, and output persistence.
- No cross-workspace cache, memory, file, or index leakage.

TESTS
- Verify two artists with identical requests cannot access each other's files, memory,
  or outputs.
- Verify a PR agent can draft an email but cannot send it without an approved action.
- Verify an artist's brand voice is applied to generated copy.
- Verify task outputs remain available after worker restart.
```

---

## 3 · Frontend prompt

```
You are the product-design and frontend engineering agency for Artispreneur.
Design and build a responsive web application that feels as focused and capable as Claude
Code, for independent music artists.

DO NOT expose "ROSTR," "PAL," "NPAO," containers, queues, vector databases, or cloud
infrastructure in any user-facing language.

PRIMARY NAVIGATION
- Home · Projects · Ask Artispreneur · Agents · Knowledge Vault · Prompt Library
- Academy · Contracts · Directory · Billing & Settings

HOME SCREEN
- Large Master Agent command bar: "What do you want to accomplish today?"
- Active project card
- Today's prioritized next actions
- Agent activity panel with plain-language statuses
- Drafts waiting for approval
- Recent deliverables
- Credit usage and plan status

PROJECT SCREEN
- Project title, category, status, release/date milestones
- Goals and key outcomes
- Files and linked knowledge
- Task board: Planned, In Progress, Needs Your Approval, Complete
- Agent activity timeline
- Deliverables panel
- Project conversation context

AGENT CHAT
- Chat-first workspace with persistent project context
- Show which agent is working, what it is doing, and what source files it used
- Allow user to attach files and select an active project
- Stream agent progress in understandable steps
- Convert outputs into tasks, documents, campaign assets, or drafts
- Never show raw hidden prompts or secrets

APPROVAL QUEUE
- Clearly label what action will occur
- Show final content, recipient/account, source project, and risk level
- Buttons: Approve, Edit, Reject
- Require explicit user confirmation before completion
- Show immutable action history after approval

DESIGN SYSTEM
- One shared application shell for EPK, Contracts, Academy, Outreach, Finance, and future
  modules.
- Use category colors only as a secondary accent; do not create separate app designs.
- Optimize for artists who may be overwhelmed: plain language, progressive disclosure.
- Accessible mobile and desktop layouts.
- Dark/light mode optional after MVP.

DELIVERABLES
- Clickable high-fidelity prototype
- Design system and component library
- Complete responsive frontend implementation
- API integration contracts
- Empty / loading / error / permission-denied states
- Accessibility review
- Analytics events for onboarding completion, first agent request, project created, and
  approvals.
```

---

## 4 · PAL enterprise onboarding compiler prompt

```
You are the PAL configuration architect for Artispreneur Agent.
Your task is to build a multi-mode onboarding compiler that turns a new customer's answers
into a complete organization configuration.

PLATFORM MODES
1. Artist: one self-managed artist workspace.
2. Agency: organization hub with staff, client artist workspaces, shared agency playbooks.
3. Label: organization hub with roster workspaces, release calendar, cross-functional roles.
4. Enterprise: agency or label deployment requiring advanced roles, audit exports, SSO.

PAL INPUTS
- Organization type and name
- Team size and staff roles
- Number of artists/clients and whether they already have accounts
- Services provided
- Active releases/projects and deadlines
- Brand, process, and communication standards
- Shared templates, directories, contracts, and academy resources
- Approval workflow requirements
- Billing owner, budget limits, and usage limits
- Security, SSO, data retention, and isolation requirements
- Connected tools and integrations

PAL OUTPUTS
- Organization manifest
- Organization Soul.md
- Workspace template
- Artist Workspace manifest for each roster/client artist
- Artist Soul.md template
- Project templates
- Agent registry configuration
- Skills and library permissions
- Team roles and assignment policies
- Approval routes
- Initial 30-day operational plan
- Enterprise deployment recommendation: pooled, bridge, or dedicated

STRICT RULES
- Never share artist-private data across artist workspaces.
- Organization-level agents may summarize portfolio status but access artist content only
  through assignment-scoped permissions.
- An agency's shared playbook may guide work but cannot overwrite an artist's approved
  brand rules.
- All outbound outreach, publishing, spend, legal execution, and integration actions are
  approval-gated.
- Recommend pooled infrastructure by default.
- Recommend bridge/dedicated deployment only when customer volume, compliance, or contract
  requires it.
- Return a plain-language summary for the customer and a machine-readable YAML config.
```

---

## Agency delivery plan

| Phase | Priority | Agency deliverables | Exit condition |
|-------|----------|--------------------|----------------|
| 0. Architecture | 1 | Final data model, tenant-isolation model, API contracts, threat model, user-flow map | Founder approves architecture before implementation |
| 1. Platform shell | 2 | Auth, workspace creation, unified UI, projects, file uploads, user settings | A new artist can enter a private workspace |
| 2. Onboarding | 3 | Artist questionnaire, configuration generator, Master Soul.md output, first action plan | New workspace is personalized automatically |
| 3. Agent foundation | 4 | ROSTR PAL/NPAO, Reference Hub, Hermes worker, Master Agent | Artist can ask and complete safe planning tasks |
| 4. First specialists | 5 | EPK/Brand, PR/Outreach, Release Manager + approval queue | Artist gets useful business deliverables |
| 5. Knowledge layer | 6 | Library ingestion, retrieval, directory access controls, file citations | Agents use Artispreneur assets safely |
| 6. Scale hardening | 7 | Queue workers, autoscaling, audit logs, cost controls, backups, monitoring | Load tests and tenant-isolation tests pass |
| 7. Growth modules | 8 | Contracts, Academy agent, Booking, Finance, integrations | Expand by reusing shared shell and policies |
