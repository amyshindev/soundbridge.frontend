# SoundBridge Frontend

Next.js 16 + React 19.

| Env | Where | Description |
|-----|-------|-------------|
| `NEXT_PUBLIC_API_URL` | Local | 백엔드 직접 연결 (`http://localhost:8000`) |
| `API_URL` | **Vercel** | 배포된 백엔드 URL. `/api/soundbridge/*` 프록시 대상 |
| `NEXT_PUBLIC_USE_MOCK` | Optional | `true` = API 실패 시 mock fallback |

## Vercel 배포 (프론트만)

1. **백엔드를 공개 URL에 배포** (Railway, Render, Fly.io, VPS + Docker 등)
2. Vercel → Settings → Environment Variables:
   - `API_URL` = `https://your-api.example.com` (끝에 `/` 없이)
   - `NEXT_PUBLIC_API_URL` 은 **설정하지 않음** (same-origin 프록시 사용)
3. 백엔드 `.env`에 `FRONTEND_URL=https://your-app.vercel.app` (CORS)
4. Redeploy

UI 데모만 필요하면 `NEXT_PUBLIC_USE_MOCK=true` 로 mock 검색 결과 사용 가능.

```bash
npm install && npm run dev
```

See [SMOKE_TEST.md](./SMOKE_TEST.md) for API verification.
