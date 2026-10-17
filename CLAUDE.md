# LevelUp

An online shop for new video games, built mobile first for gamers aged 15–30: browse the
catalog, search and filter games by platform and genre, open a game and add it to the cart.

MVP: find a game → open it → add it to the cart. Screens and "done when" for each are in
@SPEC.md, the look in @frontend/DESIGN.md; features under "Later" wait until the MVP works end
to end. `AGENTS.md` holds the same rules for other coding agents; keep the two in sync.

This is a monorepo: one repository for the whole app.
- `frontend/`: React app (Workshop 3). Details in @frontend/CLAUDE.md
- `backend/`: API, database and auth (next workshop)
- `docs/entities.md`: entities and the API contract shared by frontend and backend

## Language
All code, identifiers, comments, commit messages, docs and UI copy are in English.
You may talk to me in any language.

## Commands (run from the repo root)
- `pnpm install`: installs dependencies for every package in the workspace
- `pnpm dev`: frontend dev server at http://localhost:5173
- `pnpm typecheck`: TypeScript check
- `pnpm lint`: oxlint and the boundary check between features
- `pnpm build`: production build
- `pnpm format`: Prettier formats `frontend/src/`

## Working in the monorepo
- One change that touches frontend and backend goes in one commit or pull request
- When an entity changes, update `docs/entities.md` in the same change
- Run commands from the root; scripts are forwarded with `pnpm --filter <package>`
