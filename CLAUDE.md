# Artispreneur Agent — Claude Notes

## What was shipped

### Dashboard (new)
- `/dashboard` — Home screen with welcome banner, quick links, recent outputs, roadmap/tasks
- `/dashboard/business` — Business Center with service cards (EIN, LLC, PRO, etc.)
- `/dashboard/brand` — Brand Center AI chat
- `/dashboard/booking` — Booking Center AI chat
- `/dashboard/academy` — Academy course grid
- `/dashboard/profile` — Artist profile + account details

All wrapped in `DashboardShell` with dark sidebar nav, responsive mobile menu, and links to Hermes Mission Control + Skills Library.

### Auth flow wired
- Sign up → `/api/auth/login?signup=1&return=/onboarding` → Cognito Hosted UI → callback → `/dashboard`
- Sign in → `/api/auth/login?return=/dashboard` → Cognito → callback → `/dashboard`
- Logout → `/api/auth/logout` → clears cookies → redirects home
- Middleware soft-protects `/dashboard`, `/workspace`, `/onboarding`, `/skills/library`
- Dev bypass available with `AUTH_DEV_BYPASS=1` when Cognito not configured

### AWS setup
- Cognito OAuth (PKCE) with JWKS verification — `src/lib/auth/cognito.ts`
- DynamoDB USER# / PROJECT# / AGENT#hermes control plane — `src/lib/aws/instance-registry.ts`
- S3/fs hub for workspace files — `src/lib/hub/store.ts`
- Bedrock DeepSeek integration — `src/lib/agent/bedrock.ts`
- `.env.example` provided with all required keys

### Redirects
- `/workspace` → `/dashboard` (WorkspaceMissionControl still accessible at `/workspace` but redirect ensures new dashboard is primary)
- After onboarding completion → `/dashboard`
- Footer/Nav "Sign in" links point to `/dashboard`

## Design
- Uses Artispreneur Design System v1.0 (crimson #CC0000, gold #FED001, Libre Baskerville + Inter)
- Dashboard matches the style of the `design-system/ui_kits/dashboard/` reference implementation
- Dark sidebar, light content area, Artispreneur brand everywhere

## Next steps for deploy
1. Set Cognito env vars in Vercel
2. Flip `HUB_BACKEND=s3` and set `S3_HUB_BUCKET` + `DYNAMODB_INSTANCE_TABLE` for production
3. Set Stripe keys if taking paid Skills Marketplace live
4. Set `AUTH_DEV_BYPASS=0` (or remove) in production
