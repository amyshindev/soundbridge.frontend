# SoundBridge Frontend

Next.js 16 + React 19. API base: `NEXT_PUBLIC_API_URL` (default `http://localhost:8000`).

| Env | Description |
|-----|-------------|
| `NEXT_PUBLIC_API_URL` | Backend origin (`/api/soundbridge/...`) |
| `NEXT_PUBLIC_USE_MOCK` | `true` = API 실패 시 mock fallback (dev 기본) |

```bash
npm install && npm run dev
```

See [SMOKE_TEST.md](./SMOKE_TEST.md) for API verification.
