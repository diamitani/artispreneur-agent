# Artispreneur Design System

> **Version 1.0 | 2026**

## About Artispreneur

Artispreneur is an **AI-powered music business operating platform** that helps independent artists manage their careers like true entrepreneurs. Tagline: **"Art Means Business."**

### Mission
Empower artists to become successful entrepreneurs by providing access to essential resources, knowledge, and tools tailored to their unique creative journeys.

### Vision
To be the go-to platform for artists seeking to become entrepreneurs — enabling them to thrive in their careers and create a sustainable future through their art.

### What They Offer
- **Legal Business Formation** — EIN, LLC, C-Corp registration & setup
- **Financial Operations** — Bank account setup, bookkeeping, tax support
- **Publishing Administration** — PRO registration, copyright/trademark, music catalogue
- **Branding** — Social media, press kits, graphic design
- **Booking** — CRM, outreach, directory of labels/venues/DSPs
- **Academy** — Courses, articles, video library

### Product Surfaces
1. **Marketing / Landing Site** — artispreneur.com; hero, sign-up CTA, feature breakdown
2. **Dashboard App** — Authenticated workspace with Home, Business Center, Brand Center, Booking Center, Academy, Profile
3. **Checkout** — Stripe-integrated subscription/upgrade flow

### Sources
- `uploads/Artispreneur Brand Guidelines .pdf` — Official brand guidelines (v1.0, 2026; created in Pages for macOS)
- `uploads/artispreneur logo.png` — Primary logo PNG (400×400)
- Contact: hello@artispreneur.com

---

## CONTENT FUNDAMENTALS

### Voice Attributes
| Attribute | Description |
|---|---|
| **Professional & Credible** | Confident, knowledgeable language. Facts, structure, organized. No slang in official materials. |
| **Empowering & Direct** | Speaks to artists as capable entrepreneurs. Active voice, clear CTAs. Doesn't hedge. |
| **Focused & Purposeful** | Every word earns its place. Not verbose. Communicates clearly and moves on. |
| **Inspirational (But Grounded)** | Inspires through achievement and results — not empty hype. Real success stories, practical wins. |

### Tone by Context
- **Marketing copy**: Bold, aspirational, confident. Short sentences. Active verbs.
- **Dashboard/Product UI**: Direct, clear, functional. Action-oriented labels.
- **AI Manager voice**: Each AI manager maintains consistent professional tone aligned with brand guidelines, adapting to its domain (publishing, booking, finance, PR) — always speaking with authority and warmth of an experienced industry mentor.
- **Academy/Educational**: Knowledgeable, structured, mentorship-style.

### Casing & Style
- Brand name: **Artispreneur** (capital A, no space)
- Tagline always with period: **"Art Means Business."**
- Headers: Title Case for section headings
- Body copy: Sentence case
- Pronouns: **We/Our** (brand) and **You/Your** (artist); direct and warm
- No emoji in official materials; no slang
- Hashtags: `#Artispreneur #ArtMeansBusiness #ArtistEntrepreneur #MusicBusiness #IndependentArtist #CreativeBusiness`

### Sample Copy — Right vs. Wrong
| ✅ Right | ❌ Wrong |
|---|---|
| "Build your music business." | "Let's get you started on your journey!" |
| "Register your EIN in minutes." | "We'll help you maybe get your business stuff sorted." |
| "Your catalogue. Your royalties. Your business." | "Unlock your potential and discover endless possibilities!" |

---

## VISUAL FOUNDATIONS

### Color System
| Token | Name | Hex | Usage |
|---|---|---|---|
| `--color-crimson` | Crimson Red | `#CC0000` | Primary brand color; CTAs, logo A, headers |
| `--color-gold` | Brand Gold | `#FED001` | Accent; laurel, highlights, secondary CTAs |
| `--color-gold-light` | Light Gold | `#FEE55E` | Hover states, backgrounds, badges |
| `--color-black` | Rich Black | `#111111` | Primary text, dark backgrounds |
| `--color-charcoal` | Charcoal | `#222222` | Secondary dark backgrounds |
| `--color-gray-dark` | Dark Gray | `#444444` | Secondary text |
| `--color-gray-mid` | Mid Gray | `#777777` | Placeholder, muted text |
| `--color-gray-light` | Light Gray | `#F5F5F5` | Page backgrounds, card fills |
| `--color-white` | White | `#FFFFFF` | Text on dark; card backgrounds |

Color philosophy: **Crimson and Gold represent ambition, achievement, and excellence** — colors that have symbolized prestige for centuries. Drawn directly from the logo. Use with purpose and intention.

### Typography
Primary pairing: **Classical serif + clean sans-serif** — prestige balanced with approachability.

| Role | Font | Fallback (Google Fonts) | Style |
|---|---|---|---|
| Display / Hero | Georgia | Libre Baskerville | Bold, large, serif |
| H1 – Page Title | Georgia Bold | Libre Baskerville | Bold serif |
| H2 – Section Header | Georgia | Libre Baskerville | Serif |
| H3 – Subheader | Helvetica Neue | Inter | Bold sans-serif |
| Body Copy | Helvetica Neue | Inter | Regular sans-serif |
| Caption / Label | Helvetica Neue | Inter | Small, regular |

> **⚠ Font Substitution:** The brand uses Georgia (system serif) and Helvetica Neue (system sans-serif). This design system substitutes **Libre Baskerville** (Google Fonts) for Georgia and **Inter** (Google Fonts) for Helvetica Neue. Request original font files from the brand team if exact matching is required.

### Backgrounds & Surfaces
- **Page backgrounds**: White (`#FFFFFF`) or Light Gray (`#F5F5F5`)
- **Hero/feature sections**: Rich Black (`#111111`) or Crimson (`#CC0000`) — bold, full-bleed
- **Cards**: White with subtle shadow; or light gray fill
- No busy gradients; color is used as solid fills only
- Photography: Real, aspirational, polished — artists in studio, on stage, at their desks. Warm, premium quality. Not stock-photo generic.

### Cards
- Background: `#FFFFFF`
- Border: none, or very subtle `1px solid #EEEEEE`
- Corner radius: `8px` (subtle; not pill-shaped)
- Shadow: `0 2px 8px rgba(0,0,0,0.08)` — soft, not dramatic
- Padding: `24px`

### Buttons
- **Primary**: Crimson fill (`#CC0000`), white text, `border-radius: 6px`
- **Secondary**: Gold fill (`#FED001`), black text
- **Outlined**: 1.5px crimson border, crimson text, transparent fill
- **Ghost**: No border, black/gray text
- Hover: Darken fill by ~10%; no scale transform
- Press: Slightly darker; no shrink animation

### Borders & Dividers
- Radius: `6–8px` for cards/buttons; `4px` for inputs; `0` for table rows
- Dividers: `1px solid #EEEEEE`
- No accent left-border cards

### Shadow System
- `--shadow-sm`: `0 1px 3px rgba(0,0,0,0.08)`
- `--shadow-md`: `0 2px 8px rgba(0,0,0,0.10)`
- `--shadow-lg`: `0 4px 20px rgba(0,0,0,0.12)`

### Spacing System
- Base unit: `4px`
- Scale: `4, 8, 12, 16, 24, 32, 48, 64, 96px`

### Animation & Motion
- Subtle; functional only
- Transitions: `200ms ease` for most hover/focus states
- No bounce; no spring; no dramatic entrance animations
- Brand feel is refined and professional, not playful

### Iconography
- See ICONOGRAPHY section below

### Color Vibe of Imagery
- Warm tones preferred
- High contrast, polished
- Not desaturated or grainy
- No filters; natural and professional

---

## ICONOGRAPHY

Artispreneur does not have a proprietary icon font. Icons are functional, supporting the professional brand feel.

- **Recommended CDN**: [Lucide Icons](https://unpkg.com/lucide@latest/dist/umd/lucide.min.js) — clean, stroke-based, consistent weight
- **Style**: Outline/stroke icons at 1.5px stroke weight; 20–24px at standard size
- **No emoji** in official product UI
- **No custom hand-drawn icons** unless specifically branded
- Logo is always the PNG asset (`assets/logo.png`) — never recreated in SVG

### Lucide Usage (CDN)
```html
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
<i data-lucide="music"></i>
<script>lucide.createIcons();</script>
```

---

## File Index

```
README.md                    ← This file; full brand reference
SKILL.md                     ← Agent skill definition
colors_and_type.css          ← CSS custom properties for color + type
assets/
  logo.png                   ← Primary logo (400×400 PNG)
preview/
  colors-primary.html        ← Primary color swatches
  colors-supporting.html     ← Supporting/neutral colors
  colors-semantic.html       ← Semantic color usage
  type-scale.html            ← Full type scale specimen
  type-body.html             ← Body & UI type
  spacing.html               ← Spacing tokens
  shadows.html               ← Shadow system
  buttons.html               ← Button states
  inputs.html                ← Form inputs
  cards.html                 ← Card components
  badges.html                ← Badges & tags
  logo-usage.html            ← Logo versions & usage
ui_kits/
  dashboard/
    index.html               ← Dashboard app (interactive prototype)
    Sidebar.jsx
    TopNav.jsx
    HomeScreen.jsx
    BusinessCenter.jsx
  marketing/
    index.html               ← Marketing landing page
    Hero.jsx
    Features.jsx
    Pricing.jsx
```
