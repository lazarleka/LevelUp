# Frontend

React 19 + TypeScript + Vite + Tailwind CSS v4 + shadcn/ui + React Router + TanStack Query.
Dizajn je opisan u @DESIGN.md, entiteti u @../docs/entities.md.
Sve putanje ispod su relativne u odnosu na `frontend/`.

## Feature-first
Svaki feature (games, cart, users…) živi u `src/features/<name>/` i ima samo podfoldere koji mu
trebaju: `api/`, `components/`, `hooks/`, `types.ts`. Feature-i ne uvoze jedni druge; ruta u
`src/app/routes/` ih kombinuje na jednoj stranici. Deljeni kod ide u `src/components/ui` ili
`src/lib`, i to tek kad ga koriste najmanje dva feature-a.
Smer zavisnosti: deljeni kod -> feature-i -> app, nikad obrnuto.

## Struktura
- `src/app/router.tsx`: sve rute; `src/app/providers.tsx`: globalni provideri (TanStack Query)
- `src/app/routes/`: jedan fajl po ruti, samo kombinuje feature-e i layout
- `src/features/<name>/types.ts`: tipovi entiteta tog feature-a
- `src/features/<name>/api/<name>-api.ts`: jedino mesto koje dohvata podatke (za sada mock)
- `src/features/<name>/api/use-<name>.ts`: TanStack Query hookovi oko API-ja
- `src/features/<name>/components/`: komponente tog feature-a (npr. `game-box.tsx`)
- `src/components/ui/`: shadcn/ui komponente, dodaju se sa `pnpm dlx shadcn@latest add <name>` (pokreni u `frontend/`)
- `src/components/layout/`: layout aplikacije (header, navigacija)
- `src/lib/`: `utils.ts` (`cn`) i `mock-db.ts` (mock baza i kašnjenje)

## Pravila
- Feature nikad ne uvozi drugi feature; `src/components` i `src/lib` nikad ne uvoze iz `src/features` ili `src/app`
- Bez barrel `index.ts` fajlova: uvozi fajl direktno (`@/features/games/components/games-grid`)
- Komponente i rute nikad ne pozivaju `*-api.ts` direktno, samo preko hooka iz `use-<name>.ts`
- Prvo koristi postojeću komponentu iz `src/components/ui`, tek onda pravi novu
- Boje, fontovi i radius samo iz tokena u `src/index.css`, bez hex vrednosti u komponentama
- Svaka lista i stranica sa podacima ima stanja učitavanja, prazne liste i greške
- Bez `any` i bez `!` (non-null assertion)
- Ako nisi siguran kako radi API neke biblioteke (Tailwind v4, React Router 8, TanStack Query 5), proveri dokumentaciju preko Context7, nemoj da pogađaš.

## Gotovo kada
- `pnpm typecheck` i `pnpm lint` prolaze
- Stranica je otvorena preko Playwright MCP-a i screenshotovi na 375 px i 1440 px odgovaraju DESIGN.md
- Nema grešaka u konzoli browsera
