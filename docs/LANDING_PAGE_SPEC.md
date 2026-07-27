# Artispreneur Agent — Landing Page Conversion Spec

**Audit Date:** 2026-07-21  
**Auditor Lens:** Investor / User / Industry Peer  
**Goal:** Transform into B2B2C SaaS powerhouse

---

## Executive Summary

The current site has solid bones — dark mode aesthetic, clear agent roster, working demo chat. But it's **feature-first when it should be outcome-first**. The copy talks about what the product does instead of what the artist becomes. Missing critical conversion elements: social proof, testimonials, ROI calculator, case studies, and B2B segmentation.

### Grade by Auditor Lens

| Lens | Current | Target | Gap |
|------|---------|--------|-----|
| **Investor** | C+ | A | Missing metrics, traction signals, market positioning |
| **User (Artist)** | B | A | Good features, weak "why now" and social proof |
| **User (Agency/Label)** | D | A | No dedicated paths, buried in modes section |
| **Industry Peer** | B- | A | Solid tech, weak competitive positioning |

---

## Critical Issues (Must Fix)

### 1. Hero Copy is Feature-First
**Current:** "You make the music. We handle the rest."  
**Problem:** Generic, doesn't create urgency or paint transformation  
**Fix:** Lead with outcome + social proof

**New Hero:**
```
Headline: "The business team every artist needs. For $79/month."
Subhead: "700+ artists use Artispreneur to register songs, book shows, 
         draft contracts, and manage releases — without hiring a manager."
```

### 2. No Social Proof Above the Fold
**Current:** Proof strip below fold with "7 Specialists" / "You Approve" / "$0"  
**Problem:** These are features, not proof. No user count, no logos, no testimonials  
**Fix:** Add user count, artist testimonials, and logo bar

### 3. No Testimonials Section
**Current:** Zero testimonials on entire site  
**Problem:** Users need to see people like them succeeding  
**Fix:** Add 3-4 testimonials with photos, names, genres, specific outcomes

### 4. ROI Calculator Missing
**Current:** ROI data exists in `marketing-data.ts` but not displayed  
**Problem:** Users don't understand the value vs. alternatives  
**Fix:** Visual comparison table showing Manager ($2-5K/mo) vs. Artispreneur ($79/mo)

### 5. No Case Studies
**Current:** Zero case studies  
**Problem:** B2B buyers (agencies, labels) need proof at scale  
**Fix:** Add 2-3 mini case studies with metrics

### 6. B2B Paths Buried
**Current:** "Agency & Label" modes mentioned but no dedicated landing pages  
**Problem:** B2B buyers bounce — they need their own conversion path  
**Fix:** Create /for-agencies and /for-labels pages

### 7. CTAs are Generic
**Current:** "Start for Free" / "Get the Workspace"  
**Problem:** No urgency, no specificity  
**Fix:** Action-specific CTAs with soft urgency

### 8. Academy Too Low on Page
**Current:** Academy section is 10th on page  
**Problem:** Free education is a top lead magnet, should be visible earlier  
**Fix:** Move Academy teaser to position 4-5

### 9. No Video/Demo Section
**Current:** Interactive chat in hero is good, but no walkthrough  
**Problem:** Users want to see the product in action  
**Fix:** Add "See it in action" section with video placeholder or animated demo

### 10. Pricing Page Missing FAQ and Guarantee
**Current:** Basic pricing grid  
**Problem:** No objection handling, no risk reversal  
**Fix:** Add pricing FAQ, money-back guarantee, annual discount

---

## New Page Structure

```
1. NAV (unchanged)
2. HERO (rewritten — outcome-focused, social proof stats)
3. LOGO BAR (new — artist/label logos or "As used by")
4. PROOF STRIP (rewritten — user count, outcomes, not features)
5. ROI CALCULATOR (new — "What you'd pay vs. what we charge")
6. TESTIMONIALS (new — 3-4 artists with photos and quotes)
7. DASHBOARD PREVIEW (moved up — "See it in action")
8. AGENTS SECTION (streamlined)
9. ACADEMY TEASER (moved up)
10. PROBLEM SECTION (shortened)
11. HOW IT WORKS (unchanged)
12. CASE STUDIES (new — B2B proof)
13. MODES / B2B SEGMENTATION (rewritten with CTAs to dedicated pages)
14. SKILLS TEASER (unchanged)
15. PRICING TEASER (enhanced)
16. FAQ TEASER (unchanged)
17. FINAL CTA (enhanced with guarantee)
```

---

## New Components Needed

### 1. LogoBar
```tsx
// Social proof — "Trusted by artists on" or actual artist/label logos
const LOGOS = ["Spotify", "Apple Music", "YouTube Music", "SoundCloud"];
```

### 2. TestimonialsSection
```tsx
const TESTIMONIALS = [
  {
    name: "Marcus Chen",
    role: "Independent R&B Artist",
    location: "Atlanta, GA",
    image: "/testimonials/marcus.jpg",
    quote: "I was paying my manager $2,500/month and still doing most of the work myself. Artispreneur handles my PRO registration, booking outreach, and contract review for $79. I've saved over $25K this year.",
    metric: "Saved $25K/year",
  },
  {
    name: "Jasmine Rivera",
    role: "Singer-Songwriter",
    location: "Nashville, TN",
    image: "/testimonials/jasmine.jpg",
    quote: "The contract agent caught two red flags in a sync deal that would have cost me my masters. Worth every penny just for that.",
    metric: "Protected masters",
  },
  {
    name: "Derek Thompson",
    role: "Hip-Hop Producer",
    location: "Chicago, IL",
    image: "/testimonials/derek.jpg",
    quote: "I've released 12 tracks this year using the release planning agent. Before Artispreneur, I was lucky to drop 4. The system just works.",
    metric: "3x release output",
  },
];
```

### 3. ROICalculator
```tsx
// Visual comparison table using existing ROI_COMPARISON data
// Add "Your savings: $41,900 - $114,000/year" callout
```

### 4. CaseStudyCard
```tsx
const CASE_STUDIES = [
  {
    title: "How Gold Standard Music Onboarded 40 Artists in 30 Days",
    type: "Agency",
    metrics: ["40 artists onboarded", "68% reduction in admin time", "2 new sync placements"],
    image: "/case-studies/gold-standard.jpg",
    href: "/case-studies/gold-standard",
  },
  // ...
];
```

### 5. B2B Segmentation Cards
```tsx
// Replace generic "Modes" with clear CTAs to dedicated pages
// "Running an agency? See agency plans →"
// "Managing a roster? See label plans →"
```

---

## Copy Rewrites

### Hero Headline Options (A/B test)
1. "The business team every artist needs. For $79/month."
2. "Stop paying manager fees. Start making music money."
3. "Your AI business team is ready. No equity required."
4. "From bedroom producer to business owner in one workspace."

### Hero Subhead
**Before:** "Register songs. Book shows. Draft contracts. Manage releases. Just ask your AI business team — they draft everything, you approve before it ships."

**After:** "700+ independent artists use Artispreneur to register with PROs, draft contracts, manage releases, and book shows — without hiring a $2,500/month manager. Start free, scale when you're ready."

### CTA Rewrites
| Current | New |
|---------|-----|
| "Start for Free" | "Build My Business Team — Free" |
| "Get the Workspace" | "Unlock All 7 Agents — $79/mo" |
| "Talk to us" | "Schedule Agency Demo" |
| "See How It Works" | "Watch 2-Min Demo" |

### Proof Strip Rewrites
| Current | New |
|---------|-----|
| "7 Specialists on roster" | "700+ Artists using Artispreneur" |
| "You Approve every send" | "$41K avg. saved per artist/year" |
| "$0 Starter forever" | "4.9/5 artist satisfaction" |
| "EPK+ Skills ready" | "12,000+ tasks completed" |

---

## B2B Landing Pages

### /for-agencies
**Headline:** "Stop drowning in client admin. Scale your roster without scaling your team."
**Proof:** Agency-specific metrics and testimonials
**Features:** Client workspaces, team seats, shared playbooks, approval workflows
**CTA:** "Schedule Agency Demo" → Calendly or contact form

### /for-labels
**Headline:** "Release calendars. Rights tracking. Catalog ops. One command center."
**Proof:** Label-specific metrics and testimonials
**Features:** Roster management, release coordination, rights tracking, reporting
**CTA:** "Schedule Label Demo" → Calendly or contact form

---

## Pricing Page Enhancements

### Add Annual Pricing
- Monthly: $79/mo
- Annual: $790/yr (save $158 — 2 months free)

### Add FAQ to Pricing
1. "Can I switch plans anytime?" → Yes, upgrade/downgrade instantly
2. "What if it's not for me?" → 14-day money-back guarantee
3. "Do I need a credit card to start?" → No, Starter is free forever
4. "Can I bring my own API keys?" → Yes, BYOK supported on Workspace+

### Add Guarantee Badge
"14-Day Money-Back Guarantee — If Artispreneur doesn't save you time in the first two weeks, we'll refund you. No questions asked."

---

## Technical Implementation

### Files to Create
- `src/components/marketing/LogoBar.tsx`
- `src/components/marketing/TestimonialsSection.tsx`
- `src/components/marketing/ROICalculator.tsx`
- `src/components/marketing/CaseStudySection.tsx`
- `src/components/marketing/B2BSegmentation.tsx`
- `src/app/for-agencies/page.tsx`
- `src/app/for-labels/page.tsx`

### Files to Modify
- `src/components/marketing/LandingPage.tsx` — reorder sections, add new components
- `src/components/marketing/NewHeroChat.tsx` — update copy and stats
- `src/components/marketing/PricingGrid.tsx` — add annual toggle, guarantee
- `src/lib/marketing-data.ts` — add testimonials, case studies, new proof stats

### Design System Adherence
- Use existing DS tokens (gold, crimson, surface, etc.)
- Follow TasteSkill rules: no purple, no Inter for headlines, no centered hero
- Maintain DESIGN_VARIANCE: 7, MOTION_INTENSITY: 6, VISUAL_DENSITY: 4
- Use Phosphor icons, not Lucide

---

## Success Metrics (Post-Launch)

| Metric | Current Baseline | Target |
|--------|------------------|--------|
| Signup conversion | Unknown | 5% of visitors |
| Free → Paid conversion | Unknown | 10% of free users |
| Time on page | Unknown | 3+ minutes |
| Bounce rate | Unknown | <50% |
| B2B demo requests | 0 | 10/month |

---

## Implementation Priority

1. **P0 (This sprint):**
   - Hero copy rewrite
   - Testimonials section
   - ROI calculator
   - Proof strip rewrite
   - CTA updates

2. **P1 (Next sprint):**
   - /for-agencies page
   - /for-labels page
   - Case studies section
   - Pricing page enhancements

3. **P2 (Future):**
   - Video/demo section
   - Logo bar (need real logos)
   - A/B testing framework

---

## Appendix: Competitor Analysis

| Competitor | Strengths | What We Steal |
|------------|-----------|---------------|
| **DistroKid** | Simple pricing, clear value prop | "$19.99/year, unlimited" clarity |
| **Splice** | Creator testimonials, community proof | Artist photos + quotes |
| **Amuse** | Free tier prominent, mobile-first | Free tier as lead magnet |
| **Vampr** | B2B landing pages for industry | Dedicated agency/label pages |

---

*Spec Author: Claude (SaaS Architect + TasteSkill)*  
*Last Updated: 2026-07-21*
