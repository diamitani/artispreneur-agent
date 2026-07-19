# V217 Backend Reference

This document catalogs the backend APIs and logic from Artispreneur v217 that should be ported to the Next.js 15 agent app.

## Architecture Overview

- **Runtime**: Python 3.12 + FastAPI
- **Deployment**: AWS Lambda (via Mangum adapter)
- **LLM**: AWS Bedrock (DeepSeek V3)
- **Database**: AWS RDS PostgreSQL 16.3
- **Storage**: AWS S3
- **Cache**: AWS ElastiCache Redis
- **Auth**: AWS Cognito

---

## Core Backend Modules

### 1. `main.py`
- **Purpose**: Lambda entry point
- **Lines**: 3
- **Handler**: Wraps FastAPI app with Mangum adapter
- **Port Notes**: In Next.js, replace with API route handlers

### 2. `onboarding.py`
- **Purpose**: S3 provisioning, link scraping, PAL bio generation
- **Classes**:
  - `ArtistProfile` - dataclass for artist metadata
  - `S3Provisioner` - creates per-user S3 folder structure
  - `LinkScraper` - extracts metadata from Spotify/YouTube/Instagram URLs
  - `PALBioGenerator` - generates artist bios from profile data using templates
  - `KnowledgeBaseBuilder` - compiles onboarding data into soul.md + JSON
- **Key Functions**:
  - `process_onboarding(data)` - full pipeline: provision → scrape → build → save to S3
- **Port Notes**:
  - Move scraping to Next.js API routes
  - Use OpenAI/Anthropic for bio generation instead of templates
  - Replace S3 with Vercel Blob or database storage

### 3. `skills_webhook.py`
- **Purpose**: Generates PDFs from skill/agent data, saves to S3, returns pre-signed URL
- **Functions**:
  - `generate_epk_pdf(artist_data)` - creates EPK PDF using ReportLab
  - `_simple_text_pdf(data, doc_type)` - fallback plain-text PDF
- **Lambda Handler**: `POST /v1/skills/generate`
- **Port Notes**:
  - Replace ReportLab with `@react-pdf/renderer` or `puppeteer` for PDF generation
  - Store in Vercel Blob or return as download

### 4. `tts.py`
- **Purpose**: Resemble AI text-to-speech integration (Remy voice)
- **API**: `https://p.cluster.resemble.ai/synthesize`
- **Voice ID**: `31f74317`
- **Function**: `generate_voiceover(text)` - synthesizes audio, saves to S3, returns pre-signed URL
- **Port Notes**:
  - Keep Resemble API integration
  - Store audio in Vercel Blob
  - Add API route `/api/tts`

### 5. `hermes_provisioner.py`
- **Purpose**: Multi-tenant Hermes agent workspace provisioning
- **Architecture**:
  - Free/Artist/Pro plans → shared Hermes instance, isolated namespace
  - Label/Enterprise → dedicated EC2 instance
- **Function**: `provision_workspace(username, user_data, plan)` - creates S3 folders, saves soul.md
- **Port Notes**:
  - May not be needed for initial Next.js version
  - Document for future multi-tenant scaling

---

## Agent Framework

### 6. `app/agents/framework.py`
- **Purpose**: Base agent class, tool registry, intent routing
- **Classes**:
  - `Tool` - dataclass for agent tool definition
  - `BaseAgent` - abstract base class for all agents
  - `AgentRegistry` - singleton registry, routes intents to agents
- **Methods**:
  - `BaseAgent.execute(tool_name, **params)` - runs a registered tool
  - `BaseAgent.tool_schema()` - returns JSON schema for LLM function calling
  - `AgentRegistry.route(message)` - keyword-based intent routing
- **Port Notes**:
  - Adapt to TypeScript/Zod schemas
  - Use Vercel AI SDK for tool calling
  - Keep intent routing logic

### 7. Agent Implementations
Located in `app/agents/`:
- `pro_agent.py` - PRO registration, splitsheets, royalties (5 tools)
- `distribution_agent.py` - DSP distribution, playlists, ads (5 tools)
- `licensing_agent.py` - Sync licensing, music libraries (4 tools)
- `legal_agent.py` - LLC, EIN, contracts, trademarks (5 tools)
- `finance_agent.py` - Banking, taxes, revenue analysis (5 tools)
- `manager_agent.py` - Orchestrator, daily briefing, plans (6 tools)
- `rostr_agent.py` - PAL compiler, soul.md, manifests
- `outreach_agent.py` - Pitch blogs, playlists, radio
- `tutor_agent.py` - Academy guide, projects
- `catalog_agent.py` - Publishing, ISRC, discography
- `business_agent.py` - LLC formation, EIN, state checklists

**Port Notes**:
- Convert Python agents to TypeScript
- Maintain tool manifests as Zod schemas
- Use Vercel AI SDK `tool()` helper

---

## API Routes

### 8. `app/routes/auth.py`
- `POST /auth/signup` - Cognito registration
- `POST /auth/login` - JWT token exchange

### 9. `app/routes/agents.py`
- `POST /agent/chat` - Bedrock DeepSeek V3 invocation
- `GET /agent/status` - Agent health check

### 10. `app/routes/outputs.py`
- `GET /outputs` - List generated files
- `POST /outputs` - Upload/manage outputs

### 11. `app/routes/directory.py`
- `GET /directory` - Contact search

**Port Notes**:
- Implement as Next.js App Router API routes (`/app/api/*`)
- Use NextAuth for authentication
- Replace Bedrock with Anthropic API (Claude) or OpenAI

---

## Database Schema

```sql
workspace_users      (id, cognito_sub, username, email, first_name, last_name, 
                      artist_name, artist_type, genre, created_at)

agent_sessions       (id, user_id, agent_type, status, started_at, last_active)

agent_actions        (id, session_id, tool_name, input, output, duration_ms)

soul_docs            (id, user_id, content, compiled_at)

contacts             (id, category, name, location, url, genre, notes)

music_catalog        (id, user_id, title, isrc, bpm, key, duration, pro_status)

splits               (id, catalog_id, collaborator, role, percentage)

outputs              (id, user_id, type, title, s3_key, status, created_at)
```

**Port Notes**:
- Use Prisma ORM for Next.js
- Migrate to PostgreSQL (Vercel Postgres or Supabase)
- Keep schema structure

---

## LLM Integration

- **Provider**: AWS Bedrock
- **Model**: DeepSeek V3
- **Usage**: Agent chat, intent routing, bio generation
- **Port Notes**:
  - Replace with Anthropic API (Claude Sonnet 4.5) or OpenAI
  - Use Vercel AI SDK for streaming
  - Maintain tool calling patterns

---

## Storage

- **Current**: AWS S3 buckets
  - `artispreneur-outputs` - user files, PDFs, audio
  - Folder structure: `users/{username}/.rostr/`, `outputs/`, `catalog/`, etc.
- **Port Notes**:
  - Replace with Vercel Blob Storage
  - Keep folder structure convention

---

## Key Dependencies to Port

- **FastAPI** → Next.js App Router API routes
- **boto3** (AWS SDK) → Vercel SDK, Anthropic SDK
- **ReportLab** (PDF) → `@react-pdf/renderer` or `puppeteer`
- **Bedrock** → Anthropic API or OpenAI
- **Cognito** → NextAuth with OAuth providers
- **RDS PostgreSQL** → Vercel Postgres or Supabase
- **S3** → Vercel Blob Storage

---

## Priority Porting Order

1. **Agent framework** (`framework.py`) → TypeScript agent base class
2. **Onboarding flow** (`onboarding.py`) → Next.js API routes
3. **Agent chat** (`agents/chat.py`) → Vercel AI SDK streaming
4. **Auth** (`routes/auth.py`) → NextAuth
5. **PDF generation** (`skills_webhook.py`) → `@react-pdf/renderer`
6. **TTS** (`tts.py`) → Resemble API route
7. **Database models** → Prisma schema
8. **Individual agents** → TypeScript tool definitions

---

## Cost Estimates (v217 Production)

| Service | Monthly Cost |
|---------|--------------|
| Vercel | $0 (Free Tier) |
| CloudFront | $0 (Free Tier) |
| S3 | $0 (5GB) |
| Lambda | $0 (1M requests) |
| API Gateway | $0 (1M requests) |
| Cognito | $0 (50K MAU) |
| RDS | ~$12 (db.t4g.micro) |
| ElastiCache | ~$12 (cache.t3.micro) |
| Bedrock (DeepSeek) | ~$2 |
| **TOTAL** | **~$26/month** |

**Next.js Target**: $0-$50/month (Vercel Pro + Postgres + Blob)
