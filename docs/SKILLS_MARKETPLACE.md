# Skills Marketplace

Digital-download marketplace for Agent skill packs. Free during launch; Stripe + HubSpot ready for paid.

## Surfaces

| Route | Role |
|-------|------|
| `/skills` | Marketplace browse |
| `/skills/[slug]` | Product detail + checkout |
| `/skills/library` | Owned / installed packs |
| `/skills/success` | Post-checkout confirmation |

## APIs

| Method | Path | Role |
|--------|------|------|
| `POST` | `/api/skills/checkout` | Free claim or Stripe Checkout |
| `POST` | `/api/skills/webhook` | Stripe `checkout.session.completed` |
| `GET/PATCH` | `/api/skills/library` | List / mark installed |
| `POST` | `/api/skills/track` | HubSpot + local `skill_viewed` |

## Free launch

- Catalog `priceCents: 0` + `SKILLS_FORCE_FREE=1` (default)
- Checkout claims instantly, writes `skills/{slug}/SKILL.md` into workspace
- HubSpot event: `skill_added_free`

## Paid (when ready)

1. Set `SKILLS_FORCE_FREE=0`
2. Raise `priceCents` on catalog items
3. Set `STRIPE_SECRET_KEY` + webhook to `/api/skills/webhook`
4. Checkout uses Stripe `price_data` → success page + webhook fulfill

## HubSpot

- `HUBSPOT_ACCESS_TOKEN` — private app with contacts + notes write
- Events always logged to `.data/hubspot-events/skills.jsonl`
- When token set: upsert contact by email + engagement note

## Catalog

Edit `src/lib/skills/catalog.ts`.
