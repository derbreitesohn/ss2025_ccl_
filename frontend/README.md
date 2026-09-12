# PatPat frontend

PatPat keeps pet discovery public. Visitors can browse, filter, search, and open listing details. An account is required to contact an owner, save a favorite, or manage pets and listings.

## Local presentation preview

Requires Node.js 20 or newer.

```sh
npm ci
npm run dev:demo -- --host 127.0.0.1 --port 5174
```

Open http://127.0.0.1:5174. This explicitly enables example pets through `.env.demo`. Login and registration show an explanation instead of sending account requests. No database is needed. The regular app never substitutes sample pets for failed or empty live requests.

## Run with the real backend

Configure the backend's existing `DB_USERNAME`, `DB_PASSWORD`, and `ACCESS_TOKEN_SECRET` environment variables, then run `npm start` in `backend`. In a separate terminal:

```sh
npm run dev
```

Vite proxies `/api` and `/socket.io` to http://localhost:3000. The frontend defaults to the backend's existing `/api` routes, rather than hard-coded localhost URLs.

Copy `.env.example` to `.env` only when overriding settings. A deployment with another API prefix can set `VITE_API_BASE_URL`; it must serve the same route contract and support credential cookies. Keep `VITE_DEMO_MODE=false` for the live app.

For the existing Vercel services configuration, the backend prefix is `/_/backend`, so the API base would be `/_/backend/api`. The hosting platform must also support the app's existing persistent Socket.IO server for live messaging. Hosting and database access are separate from the local presentation preview.

## Checks

```sh
npm run lint
npm run build
npx playwright install chromium
npm run test:e2e
```

On Windows with Edge installed, use `$env:PLAYWRIGHT_CHANNEL = 'msedge'` before running the browser tests instead of downloading Chromium.

The browser suite starts ordinary and demo Vite servers, tests public browsing, filters, authentication handoffs, favorites, logout, error states, and phone layouts. Real-mode browser tests stub the API; they do not use a production account or database. Run `npm test` in `backend` to check public routes and real JWT cookie behavior with an isolated data fixture.

Pet workflow checks cover creating a pet with its description and photo, creating a linked listing, updating the correct linked record after a rename, retrying failed submissions, and confirming deletion. Backend checks cover ownership, creation payloads, and the existing MySQL column contract. These use isolated test data and do not verify persistence against the hosted MySQL instance.

## Flow and layout

- The public home introduces playdates and adoption, then leads directly to the listing cards.
- Separate species and connection filters combine with search. The URL retains filters when opening details and returning.
- Navigation shows public links and a top-right login button to guests; signed-in members retain Profile, My Listings, Favorites, and Messages.
- A safe local `next` destination survives login and sign-up. Registration leads to a success message on login because the backend does not automatically create a session.
- Logout expires the HTTP-only session cookie through `POST /api/logout`.
- The original logo, purple palette, white cards, and Fee photograph remain. Auth styles are scoped so they no longer alter account forms.
- Account screens retain their layout, with responsive grids, clearer empty states, and visible request errors.
- Pet forms use the backend's `about` and `pet_picture` fields. Listings retain `pet_id`, so edits follow the selected pet instead of matching names or breeds. Pet and listing changes require the signed-in owner.

## Preview photo sources

Fee and the PatPat logo are the repository's original assets. The example pet names and profiles are fictional. Additional preview photos are from Unsplash:

- [Dog photo](https://images.unsplash.com/photo-1552053831-71594a27632d)
- [Cat photo](https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba)
- [Ginger cat photo](https://images.unsplash.com/photo-1573865526739-10659fec78a5)
