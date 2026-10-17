# AGENTS.md

Uputstva za svakog AI agenta koji radi u ovom repozitorijumu (Claude Code, Codex, Cursor,
Copilot…). Claude Code čita i `CLAUDE.md` i `.claude/`; pravila tamo i ovde su ista.

## Projekat
**LevelUp**: online prodavnica novih video igara, mobile first, za gejmere od 15 do 30 godina.
pnpm monorepo: `frontend/` (React aplikacija), `backend/` (sledeća radionica), `docs/`.

Pročitaj pre nego što bilo šta menjaš:

| Fajl | Šta određuje |
|---|---|
| [SPEC.md](SPEC.md) | ekrane, MVP i šta znači „gotovo“ za svaki ekran |
| [frontend/DESIGN.md](frontend/DESIGN.md) | izgled i osećaj, boje, fontove, kutiju igre, interakcije |
| [docs/entities.md](docs/entities.md) | entitete, polja, pravila i API koji frontend očekuje |
| [frontend/CLAUDE.md](frontend/CLAUDE.md) | strukturu frontenda i pravila pisanja koda |

Ako je zahtev u sukobu sa nekim od ovih fajlova, reci to i pitaj; nemoj prećutno izabrati jedno.

## Stack
React 19, TypeScript, Vite, Tailwind CSS v4, shadcn/ui, React Router 8, TanStack Query 5,
react-hook-form + zod, lucide-react. Node 22, pnpm. Ne dodaj biblioteku bez pitanja.

## Komande (iz korena repoa)
```
pnpm install     # zavisnosti
pnpm dev         # http://localhost:5173
pnpm typecheck   # TypeScript provera
pnpm lint        # oxlint + provera granica između feature-a
pnpm build       # produkcijski build
```

## Struktura (frontend/src)
- `features/<name>/`: `types.ts`, `api/<name>-api.ts` (jedino mesto koje radi sa podacima, za
  sada mock), `api/use-<name>.ts` (TanStack Query hookovi), `components/`
- Trenutni feature-i: `games`, `cart`, `users`
- `app/routes/`: jedan fajl po ruti, samo kombinuje feature-e i layout
- `components/ui/`: shadcn/ui komponente, dodaju se sa `pnpm dlx shadcn@latest add <name>` u
  `frontend/`; nikad se ne menjaju ručno
- `components/layout/`, `lib/`: deljeni kod

## Pravila
- Feature nikad ne uvozi drugi feature; deljeni kod ide u `components/` ili `lib/` tek kad ga
  koriste dva feature-a. Smer: deljeni kod → feature-i → app
- Komponente dobijaju podatke samo preko hookova iz `use-<name>.ts`, nikad direktnim pozivom
  `*-api.ts`
- Boje, fontovi i radius samo iz tokena u `frontend/src/index.css`; bez hex vrednosti u
  komponentama. Žuta (`primary`) je samo za akcije i cene na popustu
- Mobile first: osnovne klase su za 375 px, `md:` / `lg:` za veće ekrane
- Svaka lista i stranica sa podacima ima stanja učitavanja, prazne liste i greške
- Bez `any`, bez `!` (non-null assertion), bez barrel `index.ts` fajlova
- Ikonice samo iz `lucide-react`, nikad emoji
- Kad se entitet promeni, u istoj izmeni ažuriraj `types.ts`, mock API i `docs/entities.md`
- Jezik: kod, nazivi, komentari, commit poruke, `docs/entities.md` i tekst u interfejsu su na
  engleskom. Projektna dokumentacija (`SPEC.md`, `AGENTS.md`, `CLAUDE.md`, `DESIGN.md`) je na
  srpskom. Sa timom se može pričati na bilo kom jeziku

## Način rada
Jedna funkcionalnost ili jedan ekran po krugu, da diff ostane dovoljno mali da se pročita:

1. **Opis**: šta je ishod i kada je gotovo (iz SPEC.md)
2. **Plan**: prvo plan, pa čekaj odobrenje kad izmena dira više fajlova
3. **Kod**: komponente, rute i API
4. **Provere**: `pnpm typecheck`, `pnpm lint`, otvori stranicu na 375 px i 1440 px, bez grešaka u
   konzoli
5. **Pregled**: drugi pogled na diff (u Claude Code-u: `/check`, `/code-review`, agent
   `ui-reviewer`)
6. **Commit**: mala izmena sa jasnom porukom. Ne pushuj dok se ne traži

„Gotovo“ je tvrdnja; screenshot na obe širine je dokaz.
