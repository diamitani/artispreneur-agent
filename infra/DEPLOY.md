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

```bash
vercel env add COGNITO_REGION production
# us-east-1

vercel env add COGNITO_USER_POOL_ID production
# us-east-1_VyKGNlV9r

vercel env add COGNITO_CLIENT_ID production
# 6dfqmemi0kvha7u3vbu2rq8n4h

vercel env add COGNITO_DOMAIN production
# https://artispreneur-agent.auth.us-east-1.amazoncognito.com

vercel env add HUB_BACKEND production
# s3

vercel env add S3_HUB_BUCKET production
# artispreneur-agent-hub

vercel env add DYNAMODB_INSTANCE_TABLE production
# artispreneur-agent-instances

vercel env add AWS_REGION production
# us-east-1

vercel env add AWS_ACCESS_KEY_ID production
# AKIASFIXC3DLDCZ66B5F

vercel env add AWS_SECRET_ACCESS_KEY production
# [your-secret-key]

vercel env add AWS_BEARER_TOKEN_BEDROCK production
# [your-bedrock-bearer-token]

vercel env add BEDROCK_MODEL_ID production
# deepseek.v3-v1:0
```

### 2. Deploy

```bash
vercel --prod
```

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
