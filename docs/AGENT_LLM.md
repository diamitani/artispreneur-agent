# Master Agent — Bedrock DeepSeek + workspace API keys

## LLM

| Setting | Value |
|---------|--------|
| Provider | Amazon Bedrock (server-side) |
| Model | `deepseek.v3-v1:0` (override `BEDROCK_MODEL_ID`) |
| Route | `POST /api/agent/chat` |
| UI | Mission Control `MasterAgentChat` |

Platform auth (pick one):

1. `AWS_BEARER_TOKEN_BEDROCK` — Bedrock API key  
2. `AWS_ACCESS_KEY_ID` + `AWS_SECRET_ACCESS_KEY` — SigV4  

Customers never receive these credentials.

---

## Customer workspace Agent API keys

Issued per Diamitani → Artispreneur → Agent project workspace for **usage tracking**.

| | |
|--|--|
| Format | `apa_{live\|test}_{96 hex chars}` (~131 chars) |
| Header | `X-Artispreneur-Agent-Key: apa_…` or `Authorization: Bearer apa_…` |
| Storage | SHA-256 hash only (`api-keys.json` + `.data/agent-keys/by-hash/`) |
| Reveal | Once via `api-key.once.json` / `GET /api/agent/keys` |
| Ledger | `00-config/usage.jsonl` + `usage-summary.json` |

### Issue / manage

```
POST /api/agent/keys          { "label": "CI" }     → new key (plaintext once)
POST /api/agent/keys          { "ensure": true }    → create if missing
GET  /api/agent/keys                                → list + usage + one-time reveal
DELETE /api/agent/keys?keyId=key_…                  → revoke
```

Keys are created automatically on Cognito callback via `ensureUserShell()`.

### Example (external / BYOK-style agent call)

```bash
curl -X POST "$APP_URL/api/agent/chat" \
  -H "Content-Type: application/json" \
  -H "X-Artispreneur-Agent-Key: apa_live_…" \
  -d '{"messages":[{"id":"1","role":"user","parts":[{"type":"text","text":"Draft a 7-day release checklist"}]}]}'
```

---

## Auth for chat

1. Cognito session (browser), or  
2. Workspace `apa_*` key  

Both attribute tokens to the workspace ledger under the key id / prefix.
