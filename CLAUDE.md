# Artispreneur Agent v3 — Claude Notes

## Overview

AI operating system for independent musicians, agencies, and labels. Built with Next.js 15 (App Router, Turbopack), React 19, Tailwind CSS 4, and AWS (Bedrock, DynamoDB, S3, Cognito).

## Quick Start

```bash
npm install
cp .env.example .env.local   # fill in values or use defaults
AUTH_DEV_BYPASS=1 npm run dev # local dev without Cognito
```

Open http://localhost:3000. The dev bypass skips Cognito auth so you can access all routes.

## Key Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check (`tsc --noEmit`) |

## Architecture

### Data Layer
- **DynamoDB single-table** — `src/lib/db/client.ts` (singleton), `src/lib/db/schema.ts` (key builders)
- **Hub storage** — `src/lib/hub/index.ts` — dual backend (local `.data/` for dev, S3 for prod)
- Table: pk/sk + GSI1 (gsi1pk/gsi1sk), pay-per-request

### Auth
- Cognito OAuth (PKCE) with JWKS verification — `src/lib/auth/cognito.ts`
- Sign up/in flow through Cognito Hosted UI, callback at `/api/auth/callback`
- Middleware soft-protects `/dashboard`, `/workspace`, `/onboarding`, `/skills/library`
- Dev bypass: set `AUTH_DEV_BYPASS=1` when Cognito is not configured

### Agent Runtime
- Types in `src/types/agent.ts` — sessions, messages, tool calls, usage tracking
- Bedrock integration via `@ai-sdk/amazon-bedrock`
- Hermes agent stored as `AGENT#hermes` sort key per user

### Infrastructure
- CloudFormation template at `infrastructure/template.yaml`
- Resources: S3 bucket (encrypted, versioned, private, CORS), DynamoDB table, Cognito User Pool + Client + Domain, IAM role for Bedrock + S3 + DynamoDB

## Domain Types
- `src/types/project.ts` — Project, ProjectStatus, ProjectView
- `src/types/task.ts` — Task, Subtask, Comment, TaskStatus, TaskPriority, NpaoPhase
- `src/types/agent.ts` — AgentSession, AgentMessage, AgentToolCall, AgentUsage

## Design System
- Artispreneur Design System v1.0
- Colors: crimson `#CC0000`, gold `#FED001`
- Fonts: Libre Baskerville (headings) + Inter (body)
- Dark sidebar, light content area

## Dashboard Routes
- `/dashboard` — Home (welcome banner, quick links, recent outputs, roadmap)
- `/dashboard/business` — Business Center (EIN, LLC, PRO service cards)
- `/dashboard/brand` — Brand Center AI chat
- `/dashboard/booking` — Booking Center AI chat
- `/dashboard/academy` — Academy course grid
- `/dashboard/profile` — Artist profile + account details

## Environment Variables

See `.env.example` for the full list. Key vars:

| Variable | Purpose |
|----------|---------|
| `AWS_REGION` | AWS region (default: us-east-1) |
| `DYNAMODB_TABLE` | DynamoDB table name |
| `HUB_BACKEND` | `fs` (local) or `s3` (production) |
| `S3_HUB_BUCKET` | S3 bucket for hub storage |
| `AUTH_DEV_BYPASS` | Set to `1` to skip auth in dev |
| `COGNITO_*` | Cognito User Pool config vars |
| `BEDROCK_MODEL_ID` | Bedrock model for agent runtime |

## Deploy Checklist
1. Set Cognito env vars in Vercel
2. Set `HUB_BACKEND=s3` and `S3_HUB_BUCKET` + `DYNAMODB_TABLE` for production
3. Set Stripe keys if taking paid Skills Marketplace live
4. Set `AUTH_DEV_BYPASS=0` (or remove) in production
5. Deploy CloudFormation stack: `aws cloudformation deploy --template-file infrastructure/template.yaml --stack-name artispreneur-prod --parameter-overrides Environment=prod AppDomain=app.artispreneur.ai`
