# Auth — AWS Cognito OAuth

**Identity:** AWS Cognito User Pool (Hosted UI + PKCE)  
**Not product auth:** Mantle (Bedrock/Claude Code IAM only)

Aligned with Diamitani multi-tenant blueprint and FCRAgent Cognito patterns.

---

## Workspace hierarchy

```
Diamitani Industries                 ← org (holding)
  └── artispreneur.com               ← tenant (product family)
        └── agent                    ← product (this app)
              └── users/{cognitoSub}
                    └── projects/{projectId}
                          ├── 00-config/     (soul, PAL, identity)
                          ├── projects/      (web apps, campaigns)
                          └── uploads/
```

**Disk / future S3 key:**

```
.data/orgs/diamitani-industries/tenants/artispreneur-com/products/agent/
  users/{sub}/projects/{projectId}/
```

Code: `src/lib/tenancy/hierarchy.ts`, `user-shell.ts`

---

## OAuth flow

```
User → GET /api/auth/login(?signup=1&return=/onboarding)
     → Cognito Hosted UI (PKCE)
     → GET /api/auth/callback?code&state
     → verify ID token (JWKS)
     → set httpOnly session cookie
     → ensureUserShell() under hierarchy
     → redirect return path
```

| Route | Role |
|-------|------|
| `GET /api/auth/login` | Start OAuth |
| `GET /api/auth/callback` | Code exchange + session |
| `GET /api/auth/logout` | Clear session (+ Cognito logout) |
| `GET /api/auth/me` | Session + hierarchy |
| `POST /api/webhooks/signup` | Cognito Lambda / admin hook |

Middleware soft-protects `/onboarding` and `/workspace` when Cognito env is set.

---

## Cognito app client setup

1. Create **User Pool** (email sign-in).
2. App client: **public** (no client secret), OAuth code grant.
3. Hosted UI domain: e.g. `artispreneur-agent`.
4. Callback URL: `{APP_URL}/api/auth/callback`
5. Sign-out URL: `{APP_URL}/`
6. Scopes: `openid email profile`
7. Optional IdPs: Google / Apple later via Cognito federation.

Env (see `.env.example`):

```
COGNITO_REGION=us-east-1
COGNITO_USER_POOL_ID=us-east-1_xxxxx
COGNITO_CLIENT_ID=xxxxx
COGNITO_DOMAIN=artispreneur-agent.auth.us-east-1.amazoncognito.com
APP_URL=https://artispreneur-agent.vercel.app
```

Local without a pool:

```
AUTH_DEV_BYPASS=1
```

---

## Session

- Cookie: `artispreneur_session` (httpOnly) — `{ idToken, refreshToken?, projectId }`
- Verified each request via Cognito JWKS (`jose`)
- Session user includes `orgId`, `tenantId`, `productId`, `projectId`, `workspacePath`

---

## PAL binding

`POST /api/pal/intake` uses Cognito `sub` as `userId` when the session is present, then persists under the hierarchical path (plus a legacy `.data/workspaces/{artist_id}` alias).
