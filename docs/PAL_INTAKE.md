# PAL Intake — Agent by Artispreneur

## Product decisions

1. **One path:** Onboarding UI → `POST /api/pal/intake` → PAL Roster Agent compiler.
2. **Soft gate:** Incomplete answers still compile a draft Master Soul with gaps listed.
3. **Short form:** 4 steps / ~14 questions — each maps to Soul, config, or roster activation.
4. **Signup webhook:** `POST /api/webhooks/signup` either redirects to onboarding or compiles if answers are present.

## Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/pal/intake` | Run PAL Roster Agent |
| GET | `/api/pal/intake` | Agent discovery |
| GET | `/api/pal/intake/:artistId` | Fetch compiled intake |
| POST | `/api/webhooks/signup` | Auth provider → PAL trigger |

### Demo seed

```bash
curl -X POST http://localhost:3000/api/pal/intake \
  -H 'content-type: application/json' \
  -d '{"seed":"patrick"}'
```

## Outputs (Rostr Hub local)

```
.data/workspaces/{artist-id}/
  00-config/
    master-soul.md
    artist-profile.json
    workspace-config.json
    permissions.yaml
    pal-compilation.json
  03-agent-workflows/
    npao-plan.json
```

## Question → artifact map

| Step | Feeds |
|------|--------|
| Who you are | artist-profile, mode |
| Where you are | goals, NPAO priority |
| How you show up | brand, permissions, Soul guardrails |
| What to activate | specialist roster, release_plan |
