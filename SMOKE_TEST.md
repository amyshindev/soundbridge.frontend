# SoundBridge Frontend — API Smoke Test

`docker compose up --build` 후 Network 탭으로 확인.

| # | Request | Expected |
|---|---------|----------|
| 1 | `GET /health` | 200 `{ status: "ok" }` |
| 2 | `GET /api/soundbridge/discover/popular?limit=6` | 200, `jangdan`, `emotion_tags` |
| 3 | `GET /api/soundbridge/create/samples` | 200 `{ tracks, total }` |
| 4 | `POST /api/soundbridge/discover` body `{ input, lang }` | 200 `{ tracks, input_summary }` or 503 (Gemini) |

Env: `NEXT_PUBLIC_API_URL=http://localhost:8000`, root `.env` `FRONTEND_URL=http://localhost:3000`

## Build verification

```bash
cd frontend && npm install && npm run build
```

Routes: `/`, `/discover`, `/create`, `/terms`, `/privacy`, `not-found`, `error`
