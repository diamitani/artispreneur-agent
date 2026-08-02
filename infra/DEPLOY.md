# Artispreneur Agent — AWS Deployment Guide

Deploy your Hermes agent with ROSTR pre-installed on AWS.

## Prerequisites

- AWS Account (148761663702)
- AWS CLI configured
- Node.js 18+
- pnpm or npm

## Quick Start (Already Provisioned)

Your AWS resources are already created:

| Resource | ID/Name |
|----------|---------|
| **Cognito User Pool** | `us-east-1_VyKGNlV9r` |
| **Cognito Client** | `6dfqmemi0kvha7u3vbu2rq8n4h` |
| **Cognito Domain** | `artispreneur-agent.auth.us-east-1.amazoncognito.com` |
| **DynamoDB Table** | `artispreneur-agent-instances` |
| **S3 Hub Bucket** | `artispreneur-agent-hub` |
| **Bedrock Model** | `deepseek.v3-v1:0` |

### 1. Copy Environment File

```bash
cp .env.production.template .env.local
```

### 2. Start Development Server

```bash
npm install
npm run dev
```

### 3. Test Agent Provisioning

```bash
# Check agent status (requires auth)
curl http://localhost:3000/api/agent/provision

# Provision a new agent (requires auth)
curl -X POST http://localhost:3000/api/agent/provision
```

## Production Deployment (Vercel)

### 1. Set Environment Variables in Vercel

Do not paste real values into this file. Everything below is a placeholder.

> **Rotate first.** An earlier revision of this document contained a live
> `AWS_ACCESS_KEY_ID`. It is in git history. Rotate that key pair in IAM before
> this deployment handles anyone's data.

#### Required — the deploy is not safe for real users without these

```bash
# Session cookie encryption. 32+ chars, and NOT the .env.example placeholder —
# that string is published in this repo, and the session cookie is a
# self-contained blob with no server-side store, so anyone could forge one.
#   openssl rand -base64 48
vercel env add SESSION_SECRET production

# Absolute origin. Logout and Stripe Checkout return URLs are built from it;
# unset, they point at localhost and a paying user lands on a dead page.
vercel env add APP_URL production            # https://app.artispreneur.ai

# Auth
vercel env add COGNITO_USER_POOL_ID production
vercel env add COGNITO_CLIENT_ID production
vercel env add COGNITO_DOMAIN production     # https://<domain>.auth.<region>.amazoncognito.com
vercel env add COGNITO_CLIENT_SECRET production   # only if the app client has one

# Control plane. DYNAMODB_TABLE is the canonical name — this document used to
# set only DYNAMODB_INSTANCE_TABLE, which left every project and task write
# throwing while the instance registry worked. Either name is accepted now;
# prefer this one.
vercel env add DYNAMODB_TABLE production     # artispreneur-prod

# Durable workspace storage. The default `fs` backend writes under
# process.cwd(), which is read-only on Vercel — onboarding output, the usage
# ledger, and workspace API keys all silently vanish without these two.
vercel env add HUB_BACKEND production        # s3
vercel env add S3_HUB_BUCKET production

# Inference
vercel env add AWS_REGION production         # us-east-1
vercel env add AWS_ACCESS_KEY_ID production
vercel env add AWS_SECRET_ACCESS_KEY production
vercel env add BEDROCK_MODEL_ID production
```

#### Required to take payments

```bash
vercel env add STRIPE_SECRET_KEY production
# Create ONE endpoint at https://<domain>/api/billing/webhook subscribed to
# checkout.session.completed, customer.subscription.created / updated /
# deleted, and invoice.payment_failed, then copy its signing secret.
# Without it a payment succeeds and the plan never changes.
vercel env add STRIPE_WEBHOOK_SECRET production
```

Price IDs are optional — Checkout uses inline `price_data` derived from
`PRICING` in `src/lib/constants.ts`.

#### Required if you use the Cognito PostConfirmation hook

```bash
vercel env add PAL_WEBHOOK_SECRET production
```

`/api/webhooks/signup` returns 503 without it rather than provisioning a
workspace for any `userId` a stranger posts.

#### Must NOT be set

`AUTH_DEV_BYPASS`. It is ignored in production, but its presence means a
development env file reached the deployment.

### 2. Deploy

```bash
vercel --prod
```

### 2a. Verify before pointing anyone at it

```bash
curl -s https://<your-domain>/api/health | jq
```

Unauthenticated by design — which is the point, because a bad `SESSION_SECRET`
makes signing in impossible, so an authenticated check could never catch it. It
returns booleans and explanations only, never a value. `ok: false` (HTTP 503)
means something in the required list above is missing; `env_issues` names each
one and says what breaks.

### 3. Update Cognito Callback URLs

In AWS Console → Cognito → `artispreneur-agent` → App integration → App client:

Add to Callback URLs:
- `https://your-domain.vercel.app/api/auth/callback`
- `https://agent.artispreneur.com/api/auth/callback`

Add to Sign out URLs:
- `https://your-domain.vercel.app/`
- `https://agent.artispreneur.com/`

## Architecture

```
User → Cognito Login
         ↓
     OAuth Callback → ensureUserShell()
         ↓
     DynamoDB (USER# / PROJECT# / AGENT#hermes)
         ↓
     S3 Hub (Soul, PAL, Skills)
         ↓
     Hermes Agent Chat → Bedrock DeepSeek
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/agent/provision` | Check agent status |
| `POST` | `/api/agent/provision` | Provision Hermes instance |
| `POST` | `/api/agent/chat` | Chat with Hermes agent |
| `GET` | `/api/aws/instance` | Full instance details |
| `GET` | `/api/hermes/runtime` | Runtime snapshot |

## Agent Selector UI

The workspace includes a dropdown (`AgentSelector`) that:

1. Checks if user has a provisioned agent
2. Shows status (Ready / Needs Setup / Error)
3. Provisions new agent on demand
4. Displays runtime details (model, hub, ROSTR status)

Located at: `src/components/workspace/AgentSelector.tsx`

## ROSTR Framework

Every provisioned agent includes:

- **PAL** (Prompt Abstraction Layer) — Intent compilation
- **NPAO** (Navigate, Prioritize, Allocate, Orchestrate) — Phase routing
- **RAG DAL** (Dynamic Acquisition Layer) — Knowledge retrieval (configurable)
- **Rostr Hub** — Persistent state management

ROSTR manifest written to: `{workspace}/00-config/rostr-manifest.json`

## Troubleshooting

### "Bedrock not configured"

Ensure both credentials are set:
```bash
AWS_BEARER_TOKEN_BEDROCK=...  # Preferred
# OR
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
```

### "Cognito is not configured"

Check these env vars:
```bash
COGNITO_USER_POOL_ID=us-east-1_VyKGNlV9r
COGNITO_CLIENT_ID=6dfqmemi0kvha7u3vbu2rq8n4h
COGNITO_DOMAIN=https://artispreneur-agent.auth.us-east-1.amazoncognito.com
```

### DynamoDB/S3 Access Denied

Verify IAM user has permissions:
- `dynamodb:GetItem`, `PutItem`, `UpdateItem`, `Query`
- `s3:GetObject`, `PutObject`, `DeleteObject`, `ListBucket`

### Local Development Without AWS

Set `HUB_BACKEND=fs` (default) — uses local `.data/` directory:
```bash
HUB_BACKEND=fs
# AUTH_DEV_BYPASS=1  # Skip Cognito in dev
```

## CloudFormation (Optional)

If you need to recreate resources from scratch:

```bash
aws cloudformation deploy \
  --template-file infra/cloudformation.yaml \
  --stack-name artispreneur-agent-prod \
  --parameter-overrides Environment=production AppDomain=agent.artispreneur.com \
  --capabilities CAPABILITY_NAMED_IAM
```

## Support

- Repo: `github.com/diamitani/rostr-agent`
- Hermes docs: See `AGENTS.md` in rostr-agent repo
