# V217 Migration Index

This document maps content from Artispreneur v217 to the new Next.js 15 agent app.

---

## Files Created

### 1. `/src/lib/directory-data.ts`
**Source**: `/tmp/artispreneur-v217/directory-data.json`

**Content**:
- 30 music industry contacts (venues, promoters, etc.)
- 15 Chicago venues (Metro, Thalia Hall, Lincoln Hall, etc.)
- 15 national venues (Fillmore, 9:30 Club, Ryman, etc.)
- Typed TypeScript interface: `DirectoryEntry`
- Helper exports: `directoryCategories`, `directorySections`

**Usage**:
```typescript
import { directoryData, DirectoryEntry } from '@/lib/directory-data';
```

---

### 2. `/src/lib/courses.ts`
**Source**: `/tmp/artispreneur-v217/courses/*.html` (16 course files)

**Content**:
- 16 courses with full metadata
- Categories: Royalties, Distribution, Legal, Finance, Licensing, Catalog, Marketing, Business
- Total: 307 modules across 16 courses
- Helper functions: `getCourseBySlug()`, `getCoursesByCategory()`

**Courses**:
1. How to Register with a P.R.O. (17 modules)
2. How to Distribute Your Music (21 modules)
3. How to Set Up an LLC (20 modules)
4. How to License Your Music (15 modules)
5. How to Register an EIN (12 modules)
6. How to Set Up a Business Bank Account (18 modules)
7. How to File Business Taxes (22 modules)
8. How to Copyright Your Music (16 modules)
9. How to Trademark Your Music Brand (14 modules)
10. How to Create a Music Catalogue (13 modules)
11. How to Brand Yourself as an Artist (16 modules)
12. How to Submit Music to Blogs & Playlists (19 modules)
13. How to Promote Your Shows (15 modules)
14. How to Set Up a Music CRM (17 modules)
15. How to Add Songs to Your P.R.O. (16 modules)
16. How to Add Music to Collaborative Playlists (14 modules)

**Usage**:
```typescript
import { courses, getCourseBySlug } from '@/lib/courses';
```

---

### 3. `/docs/V217_BACKEND_REFERENCE.md`
**Source**: `/tmp/artispreneur-v217/backend/` (8 Python files + agent modules)

**Content**:
- Complete catalog of v217 backend APIs and logic
- Python module breakdown (11 core modules)
- Agent framework architecture
- Database schema (8 tables)
- API routes (4 route groups)
- LLM integration details (AWS Bedrock → Anthropic API)
- Storage migration plan (S3 → Vercel Blob)
- Priority porting order
- Cost estimates ($26/month → $0-50/month)

**Key Modules Documented**:
- `onboarding.py` - S3 provisioning, link scraping, PAL bio generation
- `skills_webhook.py` - PDF generation (EPK, contracts, splitsheets)
- `tts.py` - Resemble AI voice synthesis
- `hermes_provisioner.py` - Multi-tenant workspace provisioning
- `agents/framework.py` - Base agent class, tool registry, intent routing
- 11 agent implementations (PRO, Distribution, Licensing, Legal, Finance, Manager, ROSTR, Outreach, Tutor, Catalog, Business)

**Port Priority**:
1. Agent framework → TypeScript
2. Onboarding flow → Next.js API routes
3. Agent chat → Vercel AI SDK
4. Auth → NextAuth
5. PDF generation → @react-pdf/renderer
6. TTS → Resemble API route
7. Database → Prisma schema
8. Individual agents → TypeScript tools

---

### 4. `/docs/PRODUCT_VISION.md`
**Source**: Combined from `/tmp/artispreneur-v217/PRD.md` + `/tmp/artispreneur-v217/ARCHITECTURE.md`

**Content**:
- Complete product vision and mission
- The 11 agents (detailed breakdown)
- Key user flows (signup, agent chat, release planning)
- Technical architecture (frontend + backend stacks)
- MVP feature set (what's in, what's not)
- Pricing tiers (6 plans: Free → Enterprise)
- Success metrics (North Star: Weekly Active Artists)
- Design principles (5 core principles)
- Competitive landscape (4 direct competitors)
- 5-phase roadmap (MVP → Mobile)
- Launch strategy (3-phase plan)
- 5-year vision (500K+ artists)

**Key Sections**:
- Mission: "You make the music. We handle the rest."
- Core value prop: Replace $200+/month tools + $2-5K manager with $19/month AI agents
- 11 agents, 51 tools total
- Next.js 15 + Anthropic Claude Sonnet 4.5 + Vercel AI SDK
- Launch target: 100 signups/week by month 3

---

## Workspace UI Structure (from workspace.html)

### Sidebar Navigation
```
Session
├── Terminal (chat interface)
├── Agents (11 agents, 52 tools)
├── Skills (15 skills marketplace)
└── Outputs (generated files)

Platform
├── Academy (16 courses)
├── Directory (74+ contacts)
├── Pricing (6 tiers)
└── Exit
```

### Toolbar (Agent Switcher)
- Manager (◎) - default
- PRO (♩)
- Distribution (↗)
- Legal (§)
- Finance ($)
- ROSTR (◎)

### Chat Interface Components
1. **Welcome screen** with 6 quick actions:
   - Register my new song with BMI
   - Find playlists for alternative R&B
   - Set up an LLC in Illinois
   - Estimate my quarterly taxes
   - Build my artist package
   - Generate an EPK for my release

2. **Message types**:
   - User messages (gold bubble, right-aligned)
   - Agent messages (left-aligned)
   - Thinking blocks (collapsible, gold border)
   - Tool calls (spinner → checkmark, output preview)

3. **Input area**:
   - Auto-resizing textarea
   - Send button (arrow up icon)
   - Keyboard shortcuts hint (⌘K palette, ⌘1-6 agent switch)

---

## Agent Roster (from workspace.html)

| Agent | Icon | Tools | Description |
|-------|------|-------|-------------|
| Manager | ◎ | 7 | Orchestrator — routes to specialists, daily briefing, plans |
| PRO | ♩ | 5 | BMI/ASCAP registration, royalties, splitsheets |
| Distribution | ↗ | 5 | DSPs, playlists, ad campaigns |
| Licensing | ⚡ | 4 | Sync, TV/film, music libraries |
| Legal | § | 5 | LLC, EIN, contracts, trademarks |
| Finance | $ | 5 | Banking, taxes, revenue analysis |
| ROSTR | ◎ | 5 | Compiler — onboarding → soul.md, bio, plans |
| Outreach | 📣 | 4 | Pitch blogs, playlists, radio, CRM |
| Tutor | 🎓 | 4 | Academy guide, projects, accountability |
| Catalog | 🎵 | 4 | Publishing, ISRC, splitsheets, discography |
| Business | 🏢 | 4 | LLC formation, EIN, state checklists |

**Total**: 11 agents, 51 tools (note: v217 had 52, slight discrepancy)

---

## Skills Marketplace (from workspace.html)

| Skill | Icon | Description | Installed |
|-------|------|-------------|-----------|
| PRO Registration | ♩ | Auto-register songs with BMI/ASCAP/SESAC | ✓ |
| Playlist Submitter | 📀 | Auto-submit to genre-matched Spotify playlists | ✓ |
| Sync Finder | 🎬 | Search music libraries and supervisor databases | ✗ |
| LLC Formation | ⚖️ | File LLC documents with your state | ✓ |
| Tax Estimator | 💰 | Calculate quarterly estimated tax payments | ✗ |
| Contract Generator | 📄 | Generate industry-standard music contracts | ✓ |
| EPK Builder | 📋 | Generate Electronic Press Kits from profile | ✓ |
| Splitsheet Generator | 📊 | Create splitsheets from track metadata | ✓ |
| Release Planner | 📅 | Create release timelines with milestones | ✗ |
| Brand Kit Generator | 🎨 | Create consistent visual brand assets | ✗ |
| Catalog Manager | 🎵 | Upload and manage music catalog metadata | ✗ |
| Voiceover Generator | 🎙 | Generate audio with Remy voice (Resemble AI) | ✗ |

**Total**: 12 skills, 7 installed in v217

---

## Design System (from workspace.html CSS)

### Colors
```css
--bg: #09090b;          /* Background */
--surf: #0d0d10;        /* Surface (cards) */
--card: #131316;        /* Card background */
--border: #1e1e24;      /* Borders */
--text: #ededef;        /* Text */
--muted: #8b8b92;       /* Muted text */
--dim: #56565c;         /* Dim text */
--gold: #c9a227;        /* Gold accent */
--gold-l: #e0b832;      /* Gold light */
--gold-bg: rgba(201,162,39,0.06); /* Gold background */
--green: #22c55e;       /* Success */
--red: #ef4444;         /* Error */
--blue: #3b82f6;        /* Info */
```

### Typography
- **UI**: Inter (300-900 weights)
- **Headings**: Playfair Display (700-900 weights)
- **Code**: JetBrains Mono (400-600 weights)

### Component Patterns
- **Sidebar**: 220px fixed width, dark surface
- **Cards**: Rounded corners (6-12px), subtle borders
- **Badges**: Pill-shaped, small text (9-11px)
- **Buttons**: Rounded (6-8px), gold accent
- **Chat bubbles**: User (gold gradient), Agent (text only)
- **Thinking blocks**: Collapsible details, gold left border
- **Tool cards**: Spinner → checkmark animation, output preview

---

## Next Steps for Implementation

### 1. UI Components to Build
Based on workspace.html structure:
- `Sidebar` with collapsible nav
- `Toolbar` with agent switcher chips
- `ChatArea` with message types (user, agent, thinking, tool)
- `ChatInput` with auto-resize textarea
- `AgentCard` for agents panel
- `SkillCard` for skills marketplace
- `OutputCard` for outputs panel
- `ThinkingBlock` (collapsible details element)
- `ToolCallCard` (spinner, output preview)

### 2. Pages to Build
- `/` - Landing page
- `/workspace` - Main agent chat interface
- `/workspace/agents` - Agent directory
- `/workspace/skills` - Skills marketplace
- `/workspace/outputs` - Generated files
- `/academy` - Course catalog
- `/academy/[slug]` - Course detail pages
- `/directory` - Industry contacts
- `/pricing` - Pricing tiers
- `/signup` - Onboarding wizard (5 steps)
- `/login` - Auth

### 3. API Routes to Build
- `/api/auth/*` - NextAuth routes
- `/api/chat` - Agent chat (streaming)
- `/api/onboarding` - Save profile, scrape links, generate bio
- `/api/skills/generate` - PDF generation
- `/api/tts` - Resemble AI voice synthesis
- `/api/directory` - Contact search
- `/api/outputs` - File management

### 4. Database Schema (Prisma)
Migrate 8 tables from v217:
- `workspace_users`
- `agent_sessions`
- `agent_actions`
- `soul_docs`
- `contacts`
- `music_catalog`
- `splits`
- `outputs`

### 5. Agent System
- Create TypeScript `BaseAgent` abstract class
- Build `AgentRegistry` singleton
- Port 11 agent implementations to TypeScript
- Define tool schemas with Zod
- Implement intent routing (keyword-based → LLM-based)

---

## File Locations Summary

| What | Where | Lines |
|------|-------|-------|
| Directory data | `/src/lib/directory-data.ts` | 60 |
| Courses catalog | `/src/lib/courses.ts` | 130 |
| Backend reference | `/docs/V217_BACKEND_REFERENCE.md` | 350 |
| Product vision | `/docs/PRODUCT_VISION.md` | 600 |
| This index | `/docs/V217_MIGRATION_INDEX.md` | 400 |

**Total**: ~1,540 lines of structured migration documentation

---

## Questions for Patrick

1. **Agent personalities**: Should agents have distinct voices, or unified neutral tone?
2. **Auto-execution**: Should tools auto-run, or always ask for confirmation?
3. **Mobile priority**: MVP desktop-only, or responsive from day 1?
4. **LLM provider**: Anthropic Claude, or also support OpenAI?
5. **Pricing launch**: Start with free-only, or paid tiers from day 1?
6. **Academy**: Static HTML course pages, or build interactive lessons?
7. **Directory**: Keep as static JSON, or build searchable database?
8. **Voice**: Add Resemble AI TTS in MVP, or defer to v1.1?

---

**Migration Status**: Content extraction complete. Ready to build Next.js components and API routes.
