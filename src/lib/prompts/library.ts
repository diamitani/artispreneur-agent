/**
 * Prompt Library — task-specific starting prompts linked to platform features.
 *
 * Artists shouldn't have to know how to phrase a request. Each entry is a
 * pre-scoped opener that drops straight into the ROSTR compiler, so a tap
 * becomes a real project rather than a blank chat box.
 *
 * `fills` are the blanks worth completing before compiling; the UI can prompt
 * for them, and PAL will raise them as open questions if left empty.
 */

import type { SkillCategory } from "@/lib/skills/catalog";
import type { UseCase } from "@/lib/rostr/pipeline/types";

export type PromptEntry = {
  id: string;
  title: string;
  /** One line explaining what the artist gets. */
  outcome: string;
  category: SkillCategory;
  use_case: UseCase;
  prompt: string;
  fills: string[];
  /** Skill pack ids that make this prompt materially better. */
  suggested_skills: string[];
  featured?: boolean;
};

export const PROMPT_LIBRARY: PromptEntry[] = [
  {
    id: "prompt_release_plan",
    title: "Plan my next release",
    outcome: "A dated, back-planned release timeline with metadata QC and a DSP checklist.",
    category: "release",
    use_case: "release",
    prompt:
      "Plan the release for my next single {{title}} targeting {{release_date}}. Back-plan the timeline from that date, run metadata QC, and build the DSP delivery checklist.",
    fills: ["title", "release_date"],
    suggested_skills: ["skill_epk_builder"],
    featured: true,
  },
  {
    id: "prompt_blog_outreach",
    title: "Pitch my music to blogs",
    outcome: "A matched target list and personalized pitch drafts waiting for your approval.",
    category: "outreach",
    use_case: "outreach",
    prompt:
      "Find music blogs that fit {{genre}} and draft a personalized pitch for each one about {{release}}. Build the asset pack each outlet expects. Draft only — I approve before anything sends.",
    fills: ["genre", "release"],
    suggested_skills: ["skill_venue_outreach"],
    featured: true,
  },
  {
    id: "prompt_epk",
    title: "Build my EPK",
    outcome: "Bios at three lengths, a one-sheet, and a gap report on what's missing.",
    category: "epk",
    use_case: "brand_epk",
    prompt:
      "Build my EPK. Write bios at 50, 100, and 250 words, assemble the one-sheet, and tell me exactly which assets I'm missing before I can pitch.",
    fills: [],
    suggested_skills: ["skill_epk_builder", "skill_brand_system"],
    featured: true,
  },
  {
    id: "prompt_booking",
    title: "Book shows in a market",
    outcome: "A routed run of venue targets with booking inquiries drafted for approval.",
    category: "outreach",
    use_case: "booking",
    prompt:
      "Find venues in {{market}} that book {{genre}} at my level and build a routed run rather than one-off dates. Package the booking kit and draft the inquiries for my approval.",
    fills: ["market", "genre"],
    suggested_skills: ["skill_venue_outreach"],
  },
  {
    id: "prompt_splits",
    title: "Sort out my splits",
    outcome: "Split sheets for unregistered works plus a PRO registration checklist.",
    category: "legal",
    use_case: "rights",
    prompt:
      "Inventory my catalog's ownership and splits, generate split sheets for anything unregistered, and give me the PRO registration checklist. Flag anything that looks like a dispute risk.",
    fills: [],
    suggested_skills: ["skill_split_sheets", "skill_pro_setup"],
    featured: true,
  },
  {
    id: "prompt_contract_review",
    title: "Review a contract before I sign",
    outcome: "A plain-language breakdown and a red-flag checklist.",
    category: "legal",
    use_case: "rights",
    prompt:
      "Review the contract I uploaded. Explain each clause in plain language, flag anything unusual or one-sided, and tell me what to negotiate. Educational only — tell me when I need a lawyer.",
    fills: [],
    suggested_skills: ["skill_contract_redflags"],
  },
  {
    id: "prompt_budget",
    title: "Budget my campaign",
    outcome: "A campaign budget mapped to revenue channels.",
    category: "finance",
    use_case: "finance",
    prompt:
      "Build a budget for {{campaign}} with a ceiling of {{budget}}. Map it against my revenue channels and show me what each line is expected to return.",
    fills: ["campaign", "budget"],
    suggested_skills: ["skill_royalty_staging"],
  },
  {
    id: "prompt_business_setup",
    title: "Set up my music business",
    outcome: "A sequenced formation checklist for your state.",
    category: "legal",
    use_case: "ops",
    prompt:
      "Walk me through setting up my music business in {{state}}. Sequence the entity, EIN, and banking steps in the right order and tell me what each one costs.",
    fills: ["state"],
    suggested_skills: [],
  },
  {
    id: "prompt_content",
    title: "Plan my content",
    outcome: "A content calendar with hooks and per-piece asset lists.",
    category: "brand",
    use_case: "content",
    prompt:
      "Build a content calendar for {{window}} around {{release}}. Write the hooks, and list exactly which assets I need to shoot so I can batch it in one session.",
    fills: ["window", "release"],
    suggested_skills: ["skill_brand_system"],
  },
];

export function listPrompts(category?: SkillCategory): PromptEntry[] {
  return category ? PROMPT_LIBRARY.filter((p) => p.category === category) : PROMPT_LIBRARY;
}

export function getPrompt(id: string): PromptEntry | null {
  return PROMPT_LIBRARY.find((p) => p.id === id) ?? null;
}

/**
 * Substitute `{{fill}}` placeholders. Unfilled placeholders are left in place
 * deliberately — PAL surfaces them as open questions rather than the agent
 * silently inventing a date or a market.
 */
export function renderPrompt(entry: PromptEntry, fills: Record<string, string> = {}): string {
  return entry.prompt.replace(/\{\{(\w+)\}\}/g, (match, key: string) => {
    const value = fills[key]?.trim();
    return value || match;
  });
}
