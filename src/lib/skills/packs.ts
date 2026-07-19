/**
 * Real skill pack bodies — installed into workspace vault as SKILL.md.
 * Hermes runtime injects active packs into the Master Agent system prompt.
 */

import type { SkillProduct } from "./catalog";

export function renderSkillPackMarkdown(skill: SkillProduct): string {
  const body = PACK_BODIES[skill.id] ?? defaultPackBody(skill);
  return `# ${skill.name}

> ${skill.tagline}

**Version:** ${skill.version}  
**Format:** ${skill.format}  
**Routes to specialist:** ${skill.agent}  
**Category:** ${skill.category}

${skill.description}

## Includes

${skill.includes.map((i) => `- ${i}`).join("\n")}

---

${body}

## Approval gates (always)

- Draft only — never send email, file legal docs, spend money, or publish without human approval.
- Label legal/tax content as educational; recommend a qualified professional when stakes are high.
- Prefer concrete artifacts (checklists, templates, calendars) over vague advice.
`;
}

function defaultPackBody(skill: SkillProduct): string {
  return `## Runtime protocol

When this skill is active and the artist asks about ${skill.category}:

1. Confirm goal in one sentence.
2. Pull relevant facts from Master Soul / artist profile.
3. Produce the primary artifact for this pack.
4. List next 3 approval-gated actions.
`;
}

const PACK_BODIES: Record<string, string> = {
  skill_epk_builder: `## Runtime protocol

When the artist asks for EPK / press kit / bio / one-sheet work:

### Step 1 — Asset inventory
Ask (or infer from Soul) for: stage name, genre, home city, recent release, notable credits, photo status, links (Spotify, IG, website).

### Step 2 — Bio variants
Produce three bios:
- **Short** (40–60 words) — playlist / form fields
- **Medium** (120–180 words) — press / booking
- **Long** (250–400 words) — website / EPK

Voice must match Master Soul brand rules.

### Step 3 — One-sheet outline
Sections: headline · logline · bio short · key credits · press quotes (or placeholders) · streaming links · contact · photo placeholders.

### Step 4 — Completeness checklist
Mark each asset READY / MISSING / NEEDS UPDATE. Never invent press quotes.

### Step 5 — Export brief
Describe PDF vs web export structure for the artist to approve.
`,

  skill_contract_redflags: `## Runtime protocol

When reviewing a deal, offer, or contract language:

### Step 1 — Scope the document
Identify deal type (booking, sync, distribution, management, producer, feature, label).

### Step 2 — Red-flag scan
Check for: perpetual / exclusive rights grabs, vague territory, unpaid option periods, cross-collateralization, indemnities that bury the artist, "work for hire" surprises, audit rights missing, termination traps.

### Step 3 — Plain-language report
For each flag: clause gist → risk in plain English → question to ask → severity (LOW / MED / HIGH).

### Step 4 — When-to-lawyer
If HIGH severity or money/rights are material, stop drafting "fixes" and recommend counsel.

### Hard limits
You do not give legal advice as counsel. You educate and prepare questions. Human must approve any next step.
`,

  skill_release_42: `## Runtime protocol

When planning a release:

### Step 1 — Anchor dates
Confirm: street date (or target window), masters ready?, artwork ready?, distributor.

### Step 2 — Build 42-day calendar
Working backward from street date, day-by-day buckets:
- Days −42 to −29: metadata, ISRC/UPC, artwork, assets
- Days −28 to −15: content batch, pitch prep, CRM targets
- Days −14 to −8: DSP pitch windows, press drafts (approval)
- Days −7 to −1: reminders, social queue, final QC
- Day 0: street + day-of assets
- Days +1 to +14: follow-ups, playlist tracking, thank-yous

### Step 3 — Metadata QC
Title, artists, featuring, genre, language, lyrics ownership notes, explicit flag.

### Step 4 — Approval gates
Nothing pitches or publishes without human OK. Output as checklist + calendar table.
`,

  skill_venue_outreach: `## Runtime protocol

When building venue / blog / playlist outreach:

### Step 1 — Target brief
City/region, capacity range, genre fit, date window, offer type (guarantee / door / DJ).

### Step 2 — Prospect list fields
Name · venue/blog · city · contact · fit reason · status (research / draft / approved / sent).

### Step 3 — Pitch drafts
Personalized short pitch (under 150 words) + optional longer follow-up. Use Soul voice.

### Step 4 — Follow-up sequence
Day 0 draft → Day 5 nudge → Day 12 close-loop. Tag every message APPROVAL REQUIRED before send.

### Hard limits
Never claim an email was sent. Queue only.
`,

  skill_pro_setup: `## Runtime protocol

When helping with ASCAP / BMI / SESAC / repertoire:

### Step 1 — Education brief
Compare PROs at high level (not legal advice): membership fees if known as general knowledge, writer vs publisher, when to register works.

### Step 2 — Repertoire sheet
Columns: work title · writers % · publishers % · ISWC (if any) · PRO · status.

### Step 3 — Registration checklist
Account created · IPI on file · works submitted · splits confirmed · statements path understood.

### Step 4 — Soul update
Propose a short soul.md addition under Rights & Admin once the artist confirms their PRO choice.
`,

  skill_brand_system: `## Runtime protocol

When defining brand / voice / content pillars:

### Step 1 — Positioning one-liner
Audience · promise · proof · personality in one sentence aligned to Master Soul.

### Step 2 — Voice rules
Do / Don't list (8–12 bullets). Example lines that sound like the artist vs off-brand.

### Step 3 — Content pillars
3–5 pillars with: name · purpose · example posts · CTA style.

### Step 4 — Hook scripts
5 short-form hooks for the current campaign or release.

### Step 5 — Visual direction brief
Mood, palette cues (respect Artispreneur DS if co-branded), photo/video dos and don'ts.
`,

  skill_royalty_staging: `## Runtime protocol

When organizing money / royalties / simple P&L:

### Step 1 — Channel map
List: DSP · sync · shows · merch · other. Mark which have statements vs estimates.

### Step 2 — Statement organizer
Prompt the artist for period + source files. Build a staging table: source · period · gross · fees · net · notes.

### Step 3 — Budget sketch
Monthly: income (staged) · costs · runway note. Educational only — not tax advice.

### Step 4 — Payout gate
Before any "spend" recommendation: confirm approval packet (amount · purpose · risk · alternative).
`,

  skill_split_sheets: `## Runtime protocol

When drafting splits / contributor grids:

### Step 1 — Contributor inventory
Name · role (writer/producer/featured/mixer) · ownership % claims · contact · PRO affiliation if known.

### Step 2 — Split sheet draft
Work title · writers with % · producers with % · notes · date · signature placeholders.

### Step 3 — Sanity check
Percentages must total 100% per ownership class. Flag conflicts; do not invent agreements.

### Step 4 — ISRC/UPC prep notes
Remind what must be locked before distribution upload.

### Hard limits
Draft only. No one "signs" via the Agent. Human approval required before sharing externally.
`,
};
