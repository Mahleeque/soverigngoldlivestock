# Sovereign Gold Livestock — Frontend

React + TypeScript storefront, customer account area and staff console for the Sovereign Gold
Livestock API.

## Stack

- React 19 + Vite 8 + TypeScript
- Tailwind CSS v4 (design tokens in `src/index.css`)
- TanStack Query for server state, Zustand for cart/auth/toasts
- React Router (`src/App.tsx`)

## Running

```bash
npm install
npm run dev        # http://localhost:5173
```

In dev, `/api/v1` is proxied to the backend (`VITE_PROXY_TARGET`, default
`http://localhost:8081`). In production set `VITE_API_URL` to the deployed API base.

```bash
npm run lint       # oxlint
npm run build      # tsc -b && vite build
```

Backend setup (separate folder):

```bash
cd ../backend
npm install
npm run dev
npm run seed:demo  # 19 animals, 5 delivery zones, 2 coupons, demo accounts
```

## Structure

| Path | Purpose |
| --- | --- |
| `src/pages` | Route components (home, catalogue, detail, cart, checkout, auth, account, admin) |
| `src/components` | Layouts, cards and the small UI kit (`components/ui`) |
| `src/lib/queries.ts` | Every API call, wrapped in typed React Query hooks |
| `src/lib/api.ts` | Axios client, token refresh, error normalisation |
| `src/lib/media.ts` | Image resolution with per-category local fallbacks |
| `src/store` | Cart, auth and toast stores (persisted to `localStorage`) |
| `src/types.ts` | Types mirroring the backend models |

## Design system

Dark forest/ink greens with warm gold accents and moss green for positive states;
Fraunces for display headings, Plus Jakarta Sans for UI text. Tokens live at the top of
`src/index.css` — change them there and the whole app follows.

## Images

Photos in `public/images` are Creative Commons files from Wikimedia Commons, cropped and
resized for the app. Attribution for every file (title, author, licence, source page) is in
`public/images/credits.json`.
