# Agent by Artispreneur (v2)

Rights-first, ROSTR-driven artist workspace: marketing → PAL onboarding → Mission Control.

## Run locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000) → **Start PAL onboarding** (or use Patrick Diamitani demo).

## PAL intake

```bash
curl -X POST http://127.0.0.1:3000/api/pal/intake \
  -H 'content-type: application/json' \
  -d '{"seed":"patrick"}'
```

See `docs/PAL_INTAKE.md`.

## Docs

| Doc | Covers |
|-----|--------|
| `docs/ARCHITECTURE.md` | Shipped system, PAL pipeline, repo map |
| `docs/WORKSPACE_FLOW.md` | Canonical workspace flow, Hermes/Rostr roles, config schemas, tenant isolation |
| `docs/PRD_WORKSPACE.md` | Workspace PRD — principles, MVP scope, agent hierarchy |
| `docs/ORG_MODES.md` | Artist / Agency / Label / Enterprise operating modes |
| `docs/BUILD_PROMPTS.md` | ROSTR, Hermes, and frontend build prompts + delivery plan |
| `docs/PRODUCT_VISION.md` | v217 vision, agents, metrics, roadmap |
| `docs/AWS_INSTANCE.md` | Multi-tenant hub (fs/S3 + DynamoDB) |

## Env

Copy `.env.example` → `.env.local`. Never commit secrets.
