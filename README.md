# Agent by Artispreneur (v2)

Rights-first, ROSTR-driven artist workspace: marketing → PAL onboarding → Mission Control.

## Run locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000) → **Start PAL onboarding** (or use Patrick Diamitani demo).

## PAL intake

```bash
curl -X POST http://127.0.0.1:3000/api/pal/intake \
  -H 'content-type: application/json' \
  -d '{"seed":"patrick"}'
```

See `docs/PAL_INTAKE.md`.

## Env

Copy `.env.example` → `.env.local`. Never commit secrets.
