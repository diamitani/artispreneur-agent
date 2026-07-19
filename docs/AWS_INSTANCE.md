# AWS Instance System

Agent by Artispreneur runs on the Diamitani multi-tenant **AWS instance** model:

| Plane | AWS | Role |
|-------|-----|------|
| Auth | Cognito | Product login (not Mantle) |
| Control | DynamoDB `USER#` table | PROFILE · PROJECT# · AGENT#hermes · KEY# · USAGE# |
| Hub | S3 (or local `.data` fs) | Soul, PAL, Skills, usage, api-keys |
| LLM | Bedrock DeepSeek | Hermes chat |
| Runtime | Hermes + PAL/ROSTR | Skills Library activated packs |

```
Cognito login
  → ensureUserShell()
  → Hub ensure workspace prefix
  → DynamoDB USER# / PROJECT# / AGENT#hermes
  → apa_* workspace key

PAL intake / Skills claim / Chat
  → Hub read/write under workspaceLogicalPath
  → syncInstanceRuntime() updates PROJECT# + AGENT#hermes
```

## Hierarchy (S3 key = logical path)

```
orgs/diamitani-industries/tenants/artispreneur-com/products/agent/
  users/{cognitoSub}/projects/{projectId}/
    00-config/          identity, soul, PAL, skills-library, hermes-skills, usage, api-keys
    skills/{slug}/      SKILL.md + manifest
    03-agent-workflows/ npao-plan.json
    projects/ uploads/
```

## Env

```bash
# Default local
HUB_BACKEND=fs

# Production durable hub
HUB_BACKEND=s3
S3_HUB_BUCKET=artispreneur-agent-hub
DYNAMODB_INSTANCE_TABLE=artispreneur-agent-instances
AWS_REGION=us-east-1
# Same IAM as Bedrock/Cognito (or dedicated hub role)
```

### DynamoDB table (minimal)

- Partition key: `pk` (S)
- Sort key: `sk` (S)
- Billing: on-demand

Item shapes:

| pk | sk | Purpose |
|----|----|---------|
| `USER#{sub}` | `PROFILE` | Email, org/tenant/product |
| `USER#{sub}` | `PROJECT#{id}` | s3_prefix, plan, active skills |
| `USER#{sub}` | `AGENT#hermes` | Runtime + model |
| `KEY#{sha256}` | `META` | apa_* lookup |
| `USER#{sub}` | `USAGE#{YYYY-MM-DD}` | Token rollup |

## APIs

| Method | Path | Role |
|--------|------|------|
| `GET` | `/api/aws/instance` | Control plane + Hermes snapshot |
| `GET` | `/api/hermes/runtime` | Runtime status |
| `POST` | `/api/agent/chat` | Hermes (loads hub Soul + skills) |

## Code map

| Module | Path |
|--------|------|
| Hub store | `src/lib/hub/store.ts` |
| Instance registry | `src/lib/aws/instance-registry.ts` |
| AWS config | `src/lib/aws/config.ts` |
| Hierarchy | `src/lib/tenancy/hierarchy.ts` |
| User shell | `src/lib/tenancy/user-shell.ts` |

## Deferred (blueprint, not required for hub)

- Per-user Lightsail / ECS Hermes VPS
- Step Functions full provision pipeline
- RDS per-user schemas
- Mantle for product chat (dev harness only)

## Local without AWS hub

Leave `HUB_BACKEND=fs` (default). Instance registry mirrors to  
`.data/global/aws-instances/...` so Skills + Hermes still behave as one system.
