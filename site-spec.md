# Artispreneur — Site Spec
> Compiled by site-builder skill — 2026-07-19

## 1. Intent

```yaml
product: Music business operating system for independent artists (Agent + Directory + Academy + EPK + Contracts + Catalog)
audience: Independent artists, managers, and small labels who need royalties literacy, contracts, education, and ops tools
primary_action: Sign up / become an Artispreneur
tier: marketing
revenue_model: freemium (free platform accounts · $99/mo Agent + all platforms)
brand: Knowledge Base Design System v1.0 (crimson #CC0000, gold #FED001, Libre Baskerville + Inter, logo PNG)
references:
  - https://heatfix.framer.website
  - https://landio.framer.website
  - https://clayai.framer.website
constraints: Rebuild in existing Next.js 15 App Router marketing shell at ARTISPRENEUR.AGENT/APP
```

## 2. Archetype

**SaaS Marketing** (hybrid with course/directory modules).

Rationale: Primary CTA is signup/subscription; products are modular platforms under one OS narrative.

Template anchors:
1. [Heatfix](https://heatfix.framer.website) — bold red energy, conversion-forward
2. [Landio](https://landio.framer.website) — creator/agency hybrid sections
3. [Clay AI](https://clayai.framer.website) — AI product clarity without generic purple

## 3. Sitemap (v1)

| Page | Primary CTA |
|------|-------------|
| `/` Homepage | Become an Artispreneur |
| `/onboarding` | Complete signup intake |
| `/workspace` | Sign in |
| Product subpages (links from Products) | Explore Agent / Directory / Academy / EPK / Contracts / Catalog |

## 4. Page Spec — Homepage

**Design read:** SaaS marketing landing for independent musicians, bold brand-red creative-ops language, existing Artispreneur red/gold/parchment system, asymmetric split hero.

**Dials:** `DESIGN_VARIANCE: 7` · `MOTION_INTENSITY: 6` · `VISUAL_DENSITY: 4`

### Sections

#### nav
- Purpose: brand + section anchors + primary CTA
- Components: logo, nav-links (Why · Products · Use cases · How), Sign in, Get started
- CTA label (locked): **Become an Artispreneur**

#### hero
- Purpose: state value prop, drive signup
- Layout: asymmetric split (copy left, side image right)
- Copy:
  - Title: **Artispreneur**
  - Sub: **Art Means Business.**
  - Description: The music business operating system for artists who want ownership, income, and a real career plan.
  - Primary CTA: Become an Artispreneur
  - Secondary: See how it works → `#how`
- Visual: full-bleed side photography (studio / stage / creative ops mood)

#### why (What / Why it matters)
- Clever title: **Every artist is an entrepreneur.**
- Body: why royalties, education, and contracts decide who gets paid and who gets played
- Three pillars (not equal cards): Royalties · Education · Contracts

#### products
- Direct message: **Build your music business operating system.**
- Six portfolio platforms (external subdomains):
  1. Agent → https://agent.artispreneur.com — custom Hermes Agent workspace for artists
  2. Academy → https://academy.artispreneur.com — online course platform and general media
  3. EPKs → https://epks.artispreneur.com — EPK builder and microsite agent
  4. Contracts → https://contracts.artispreneur.com — contract builder agent and CMS dashboard
  5. Directory → https://directory.artispreneur.com — industry directory plus outreach agent and CMS
  6. Catalog → https://catalog.artispreneur.com — artist music catalog agent and CMS workspace
- Each: name + one-line job + outbound link to subdomain

#### use-cases (When to use it)
- Headline: **Everything you need to navigate the music industry**
- Sub: When to use Artispreneur
- Three use cases:
  1. Create legal business registration
  2. Look up venues hiring artists near you
  3. Create your EPK and social media content

#### how
- Headline: **Sign up and become an Artispreneur**
- Path A: Free account on each platform
- Path B: $99/month for Agent access and all platforms
- CTA: Become an Artispreneur

#### footer
- Brand mark, tagline, product links, contact, legal year

## 5. Brand Application

| Token | Value |
|-------|-------|
| Accent | `#C0272D` |
| Highlight | `#F5C100` |
| Surface warm | `#F9F6EF` |
| Ink | `#1A1A1A` |
| Display | Playfair Display |
| Body | Lato |
| Radius | 8px (buttons); soft system locked |
| Theme | Light lock (parchment/white/charcoal), red hero + charcoal footer as brand blocks |

## 6. Build Plan

Stack: Next.js 15 App Router · Tailwind v4 · existing `btn` / `section` / `container-page` utilities · Phosphor icons · Motion where useful.

Sprint:
1. Spec (this file)
2. Update `brand.ts` products + Agent pricing
3. Rebuild `LandingPage.tsx`, `Nav.tsx`, `Footer.tsx`
4. Hero image asset in `public/`
5. Stub product routes under `app/products/[slug]/page.tsx` for deep links

## 7. Open Questions

- Confirm $99/mo replaces prior Premium/Pro ($9.99 / $19.99) as the public Agent plan.
- Product subpages: stub now vs. link to hash anchors only until content exists.
