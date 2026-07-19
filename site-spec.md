# Agent by Artispreneur — SaaS Marketing Site Spec
> PAL compile (site-builder) + TasteSkill design-taste-frontend · 2026-07-19

## 1. Intent (PAL Stage 1)

```yaml
product: Hermes Agent workspace for independent musicians — PAL/ROSTR Soul, specialist roster, Skills Library
audience: Indie artists, managers, small labels who need ops without hiring a full team
primary_action: Start free → Cognito signup → PAL onboarding
tier: marketing (SaaS)
revenue_model: freemium (Starter $0 · Workspace $79/mo · Agency custom)
brand: Artispreneur DS v1.0 — crimson #CC0000, gold #FED001, Libre Baskerville + Inter
references: HeatSale (energy) · Landio (creator SaaS) · Clay AI (AI clarity, no purple)
constraints: Next.js 15 App Router · preserve DS · TasteSkill anti-slop
```

## 2. Design read (TasteSkill)

**Reading this as:** SaaS marketing for music-business operators, bold brand-crimson creative-ops language, Artispreneur red/gold/editorial system — not purple AI mesh, not cream terracotta.

**Dials:** `DESIGN_VARIANCE: 7` · `MOTION_INTENSITY: 6` · `VISUAL_DENSITY: 4`

## 3. Archetype

**SaaS Marketing** — Home, Features, Pricing, About, FAQ, Skills (marketplace), Auth (Cognito).

## 4. Sitemap

| Route | Purpose | Primary CTA |
|-------|---------|-------------|
| `/` | Conversion home | Start for Free |
| `/features` | Product depth (Hermes · PAL · Skills · AWS) | Get Workspace |
| `/pricing` | Plan comparison | Start free / Get Workspace |
| `/about` | Brand mission + Diamitani hierarchy | Become an Artispreneur |
| `/faq` | Objections | Start for Free |
| `/skills` | Skills Marketplace | Claim packs |
| Cognito login | Auth | Sign in / Sign up |

## 5. Homepage sections

1. **nav** — Product · Features · Skills · Pricing · About · FAQ · Sign in · Get Started Free
2. **hero** — full-bleed studio · brand hero · one headline · one sentence · CTA pair
3. **terminal** — product proof below fold
4. **problem** — “The business side eats the art” · 3 pains (asymmetric)
5. **solution** — PAL → Soul → Hermes → Skills · process strip
6. **how** — 4 steps
7. **agents** — Master + specialists
8. **approval** — trust / rights-first
9. **modes** — Artist · Agency · Label
10. **skills teaser** — marketplace
11. **pricing teaser** — 3 tiers → /pricing
12. **academy bridge**
13. **faq teaser** → /faq
14. **final CTA** — crimson band

## 6. Copy locks

- Product name in hero: **Artispreneur** + AGENT badge
- Tagline: **Art Means Business.**
- Headline: **Hire your AI business team.**
- Primary CTA: **Start for Free** / **Become an Artispreneur**
- Never claim agents send/publish without approval
