# Skills Marketplace + Hermes Library

Digital skill packs for Agent workspaces. Free during launch; Stripe + HubSpot ready for paid.

**Runtime model:** Skills Library → install into **Hermes Agent** (Bedrock DeepSeek) with **PAL / ROSTR** Soul + specialist roster.

```
Marketplace claim / Stripe
        ↓
Vault: skills/{slug}/SKILL.md
        ↓ install (auto on free claim)
Hermes registry: 00-config/hermes-skills.json
        ↓
POST /api/agent/chat
  system = base + Master Soul + roster/NPAO + active SKILL.md packs
```

## Surfaces

| Route | Role |
|-------|------|
| `/skills` | Marketplace browse |
| `/skills/[slug]` | Product detail + checkout |
| `/skills/library` | Owned packs · install / deactivate in Hermes |
| `/skills/success` | Post-checkout confirmation |
| `/workspace` | Hermes Mission Control (loads active skills) |

## APIs

| Method | Path | Role |
|--------|------|------|
| `POST` | `/api/skills/checkout` | Free claim or Stripe Checkout |
| `POST` | `/api/skills/webhook` | Stripe `checkout.session.completed` |
| `GET/PATCH` | `/api/skills/library` | List · install/deactivate · Hermes snapshot |
| `GET` | `/api/hermes/runtime` | Soul / PAL / active skills status |
| `POST` | `/api/agent/chat` | Hermes chat (injects installed packs) |
| `POST` | `/api/skills/track` | HubSpot + local `skill_viewed` |

## Own vs install

| State | Meaning |
|-------|---------|
| **Owned** | Pack in vault (`skills/{slug}/`) + library JSON |
| **Installed / Hermes active** | Pack body injected into Hermes system prompt |

Free claims and Stripe fulfills **auto-install**. Library UI can deactivate / reinstall without losing ownership.

## Pack content

Real playbooks live in `src/lib/skills/packs.ts` (rendered to `SKILL.md` on claim). Each catalog item maps to a ROSTR `specialistId`.

## Free launch

- Catalog `priceCents: 0` + `SKILLS_FORCE_FREE=1` (default)
- Checkout claims instantly, writes pack + activates Hermes
- HubSpot event: `skill_added_free`

## Paid (when ready)

1. Set `SKILLS_FORCE_FREE=0`
2. Raise `priceCents` on catalog items
3. Set `STRIPE_SECRET_KEY` + webhook to `/api/skills/webhook`
4. Checkout uses Stripe `price_data` → success page + webhook fulfill (auto-install)

## HubSpot

- `HUBSPOT_ACCESS_TOKEN` — private app with contacts + notes write
- Events always logged to `.data/hubspot-events/skills.jsonl`
- When token set: upsert contact by email + engagement note

## Catalog

Edit `src/lib/skills/catalog.ts` and add a body in `src/lib/skills/packs.ts`.
