# Artispreneur Agent — Portfolio Summary

**Role:** Full-Stack Engineer & Cloud Architect  
**Timeline:** 1 evening rapid build  
**Live:** agent.artispreneur.com  
**GitHub:** github.com/diamitani/artispreneur-agent

---

## What I Built

A production-ready **multi-tenant AI agent platform** that provisions personalized business agents for musicians. Users sign up, complete an intelligent onboarding flow, and get their own AI agent with the ROSTR framework pre-installed — all running on AWS with zero base infrastructure cost.

---

## The Stack

```
Frontend:     Next.js 15, React 19, TypeScript, Tailwind CSS
Backend:      Next.js API Routes (serverless)
Auth:         AWS Cognito (OAuth 2.0 + PKCE)
Database:     DynamoDB (single-table design)
Storage:      S3 (versioned, encrypted)
AI/LLM:       AWS Bedrock (DeepSeek v3)
Deploy:       Vercel (auto-deploy on push)
IaC:          CloudFormation
```

---

## Architecture Highlights

### 1. AWS Infrastructure
- **Cognito User Pool** — Handles OAuth login with hosted UI
- **DynamoDB Single-Table** — USER# / PROJECT# / AGENT# / KEY# entities in one table
- **S3 Hub** — Multi-tenant workspace storage with hierarchy: `orgs/{org}/tenants/{tenant}/products/{product}/users/{userId}/projects/{projectId}/`
- **Bedrock** — DeepSeek model for agent inference with streaming responses

### 2. ROSTR Framework Pipeline
Automated onboarding that runs the full ROSTR pipeline:

```
User Answers → PAL (extract intent) → RAG-DAL (search knowledge) 
→ JTBD (define success) → NPAO (build plan) → I.A. (generate Soul.md)
→ Persist to S3 → Provision AGENT#hermes
```

### 3. Agent Provisioning API
- `GET /api/agent/provision` — Check agent status
- `POST /api/agent/provision` — Spin up new Hermes instance with ROSTR
- Returns agent ID, runtime, model, Soul status, active skills

---

## Key Technical Decisions

| Challenge | Solution |
|-----------|----------|
| Multi-tenant data isolation | DynamoDB single-table with composite keys (USER#, PROJECT#) |
| Zero base cost | On-demand DynamoDB + S3 + Bedrock (pay per use) |
| Fast agent provisioning | Pre-compiled Soul.md during onboarding, instant activation |
| Free tier users | BYOK (Bring Your Own Key) for Gemini/OpenAI |
| Secure auth without secrets | PKCE flow (proof key for code exchange) |
| Context management | Token budgeting: Soul (6k) + Skills (3.5k each, max 5) |

---

## What Makes This Hard

### 1. Single-Table DynamoDB Design
Most engineers use one table per entity. I designed a single table that handles:
- User profiles
- Project metadata
- Agent registry
- API key lookups
- Usage metrics

All with efficient query patterns using composite sort keys.

### 2. ROSTR Pipeline Automation
The onboarding doesn't just collect answers — it:
- Extracts intent from natural language
- Searches knowledge bases (multi-pass RAG with source credibility)
- Defines jobs-to-be-done with success criteria
- Generates prioritized build plans
- Writes custom system instructions (Soul.md)
- Provisions agent runtime

All in one automated flow.

### 3. Multi-Tenant S3 Hierarchy
Every user gets isolated storage with this pattern:
```
orgs/diamitani-industries/tenants/artispreneur-com/products/agent/
  users/{cognitoSub}/projects/{projectId}/
    00-config/master-soul.md
    knowledge-base/...
    skills/{slug}/...
```

Enforced via IAM policies and application-level scoping.

---

## Cost Breakdown

### Infrastructure (per month)
- **Cognito:** $0 (first 50k MAU free)
- **DynamoDB:** ~$1.50 (on-demand, 100k reads/50k writes)
- **S3:** ~$0.50 (10GB storage)
- **Bedrock:** ~$2.00 (10M input / 2M output tokens)
- **Data Transfer:** ~$4.50 (50GB)

**Total:** ~$8.50/month baseline (scales with usage)

### Per-User Cost
- **Free tier (BYOK):** $0 (user provides API key)
- **Starter:** ~$0.35/month (2M tokens)
- **Pro:** ~$1.50/month (10M tokens)

---

## Technical Skills Demonstrated

### Cloud Architecture
- Infrastructure as Code (CloudFormation)
- Multi-tenant data modeling
- IAM role-based access control
- Serverless cost optimization
- OAuth 2.0 + PKCE implementation

### Backend Engineering
- TypeScript API development
- Token-based authentication
- Streaming responses (SSE)
- Usage metering and tracking
- Single-table DynamoDB patterns

### Frontend Development
- React Server + Client Components
- Framer Motion animations
- Progressive enhancement
- Responsive design system

### AI/ML Engineering
- Prompt engineering (ROSTR framework)
- RAG architecture with multi-pass retrieval
- Agent orchestration
- Context window management
- Token budgeting

### DevOps
- Git workflow (conventional commits)
- CI/CD (Vercel auto-deploy)
- Environment management
- Secrets handling

---

## Visual Architecture

See [CASE_STUDY.md](./CASE_STUDY.md) for detailed diagrams:
- AWS Infrastructure Detail
- ROSTR Onboarding Pipeline
- PAL Pipeline (5 stages)
- User Flow Diagram
- Artispreneur Ecosystem Map

---

## Results

✅ **Provisioned AWS infrastructure** (Cognito, DynamoDB, S3, Bedrock)  
✅ **Built agent provisioning API** (GET/POST /api/agent/provision)  
✅ **Created AgentSelector dropdown** (shows runtime, model, Soul status)  
✅ **Automated ROSTR pipeline** (PAL → RAG-DAL → JTBD → NPAO → I.A.)  
✅ **Deployed to production** (Vercel, auto-deploys on git push)  
✅ **Cost-optimized** (~$0.35/user/month on infrastructure)  

---

## Code Samples

### Agent Provisioning API
```typescript
// artispreneur-agent/src/app/api/agent/provision/route.ts
export async function POST(req: Request) {
  const session = await getSessionUser();
  if (!session) return unauthorized();

  // Check if agent already exists
  const existing = await getAwsHermesAgent(session.sub);
  if (existing?.soul_loaded) {
    return json({ ok: true, agent: existing, status: "ready" });
  }

  // Provision new agent
  const { agent } = await ensureAwsInstance({
    userId: session.sub,
    email: session.email,
    name: session.name,
    projectId: session.projectId,
    workspacePath: session.workspacePath,
  });

  // Load Soul.md from S3
  const soul = await loadSoul(session.sub, session.projectId);
  
  // Update agent status
  await syncInstanceRuntime({
    userId: session.sub,
    projectId: session.projectId,
    soulLoaded: !!soul,
  });

  return json({ ok: true, agent, status: "provisioned" });
}
```

### DynamoDB Single-Table Pattern
```typescript
// artispreneur-agent/src/lib/aws/instance-registry.ts
export async function ensureAwsInstance(input: {
  userId: string;
  email: string;
  projectId: string;
  workspacePath: string;
}) {
  const now = new Date().toISOString();
  const pk = `USER#${input.userId}`;

  // USER#abc → PROFILE
  await putItem({
    pk,
    sk: "PROFILE",
    user_id: input.userId,
    email: input.email,
    org_id: "diamitani-industries",
    tenant_id: "artispreneur-com",
    product_id: "agent",
    created_at: now,
  });

  // USER#abc → PROJECT#xyz
  await putItem({
    pk,
    sk: `PROJECT#${input.projectId}`,
    user_id: input.userId,
    project_id: input.projectId,
    workspace_path: input.workspacePath,
    s3_prefix: input.workspacePath,
    hub_backend: "s3",
    hermes_runtime: "hermes+pal-rostr",
    created_at: now,
  });

  // USER#abc → AGENT#hermes
  await putItem({
    pk,
    sk: "AGENT#hermes",
    user_id: input.userId,
    project_id: input.projectId,
    runtime: "hermes+pal-rostr",
    llm_provider: "amazon_bedrock",
    model_id: "deepseek.v3-v1:0",
    soul_loaded: false,
    created_at: now,
  });
}
```

---

## What's Next

- [ ] Vector embeddings for RAG-DAL (Pinecone/pgvector)
- [ ] Multi-model routing (route simple tasks to cheaper models)
- [ ] Skill marketplace with Stripe payments
- [ ] Team workspaces with RBAC
- [ ] Mobile app (React Native)

---

**Portfolio Link:** github.com/diamitani/artispreneur-agent  
**Case Study:** [CASE_STUDY.md](./CASE_STUDY.md)  
**Live Demo:** agent.artispreneur.com

*Built by Patrick Diamitani — Diamitani Industries, Inc.*
