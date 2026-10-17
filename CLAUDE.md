# LevelUp

Online prodavnica novih video igara, pravljena mobile first za gejmere od 15 do 30 godina:
pregled kataloga, pretraga i filtriranje igara po platformi i žanru, otvaranje igre i dodavanje
u korpu.

MVP: pronađi igru → otvori je → dodaj u korpu. Ekrani i „gotovo kada“ za svaki su u @SPEC.md,
izgled u @frontend/DESIGN.md; funkcionalnosti pod „Kasnije“ čekaju dok MVP ne proradi od početka
do kraja. `AGENTS.md` sadrži ista pravila za druge AI agente; ova dva fajla drži usklađenim.

Ovo je monorepo: jedan repozitorijum za celu aplikaciju.
- `frontend/`: React aplikacija (Radionica 3). Detalji u @frontend/CLAUDE.md
- `backend/`: API, baza i autentifikacija (sledeća radionica)
- `docs/entities.md`: entiteti i API ugovor koji dele frontend i backend

## Jezik
Kod, nazivi, komentari, commit poruke, `docs/entities.md` i tekst u interfejsu su na engleskom.
Projektna dokumentacija (`SPEC.md`, `AGENTS.md`, `CLAUDE.md`, `DESIGN.md`) je na srpskom.
Sa mnom možeš da pričaš na bilo kom jeziku.

## Komande (pokreću se iz korena repoa)
- `pnpm install`: instalira zavisnosti za sve pakete u workspace-u
- `pnpm dev`: frontend dev server na http://localhost:5173
- `pnpm typecheck`: TypeScript provera
- `pnpm lint`: oxlint i provera granica između feature-a
- `pnpm build`: produkcijski build
- `pnpm format`: Prettier formatira `frontend/src/`

## Rad u monorepou
- Jedna izmena koja dira i frontend i backend ide u jedan commit ili pull request
- Kad se entitet promeni, ažuriraj `docs/entities.md` u istoj izmeni
- Komande se pokreću iz korena; skripte se prosleđuju sa `pnpm --filter <package>`
