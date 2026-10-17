# AGENTS.md

Instructions for any AI coding agent working in this repository (Claude Code, Codex, Cursor,
Copilot…). Claude Code also reads `CLAUDE.md` and `.claude/`; the rules there and here are the
same.

## Project
**LevelUp**: an online shop for new video games, mobile first, for gamers aged 15–30.
pnpm monorepo: `frontend/` (React app), `backend/` (next workshop), `docs/`.

Read before you change anything:

| File | What it decides |
|---|---|
| [SPEC.md](SPEC.md) | screens, MVP, what "done" means for each screen |
| [frontend/DESIGN.md](frontend/DESIGN.md) | look and feel, colors, fonts, the game box, interactions |
| [docs/entities.md](docs/entities.md) | entities, fields, rules, and the API the frontend expects |
| [frontend/CLAUDE.md](frontend/CLAUDE.md) | frontend structure and coding rules |

If a request conflicts with one of these files, say so and ask; do not silently pick one.

## Stack
React 19, TypeScript, Vite, Tailwind CSS v4, shadcn/ui, React Router 8, TanStack Query 5,
react-hook-form + zod, lucide-react. Node 22, pnpm. Do not add a library without asking.

## Commands (from the repo root)
```
pnpm install     # dependencies
pnpm dev         # http://localhost:5173
pnpm typecheck   # TypeScript
pnpm lint        # oxlint + feature boundary check
pnpm build       # production build
```

## Structure (frontend/src)
- `features/<name>/`: `types.ts`, `api/<name>-api.ts` (the only place that touches data, mock
  for now), `api/use-<name>.ts` (TanStack Query hooks), `components/`
- Features today: `games`, `cart`, `users`
- `app/routes/`: one file per route, only combines features and layout
- `components/ui/`: shadcn/ui, added with `pnpm dlx shadcn@latest add <name>` inside `frontend/`;
  never edited by hand
- `components/layout/`, `lib/`: shared code

## Rules
- A feature never imports another feature; shared code goes to `components/` or `lib/` only once
  two features need it. Direction: shared → features → app
- Components get data only through hooks from `use-<name>.ts`, never by calling `*-api.ts`
- Colors, fonts and radius only from tokens in `frontend/src/index.css`; no hex values in
  components. Yellow (`primary`) is only for actions and sale prices
- Mobile first: base classes for 375 px, `md:` / `lg:` for larger screens
- Every list and data page has loading, empty and error states
- No `any`, no `!` non-null assertion, no barrel `index.ts`
- Icons only from `lucide-react`, never emoji
- When an entity changes, update `types.ts`, the mock API and `docs/entities.md` in the same change
- All code, comments, commit messages, docs and UI copy are in English. You may talk to the team
  in any language

## Workflow
One feature or one screen per round, so the diff stays small enough to read:

1. **Describe** the outcome and when it is done (from SPEC.md)
2. **Plan** first and wait for approval when the change touches several files
3. **Code** the components, routes and API
4. **Check**: `pnpm typecheck`, `pnpm lint`, open the page at 375 px and 1440 px, no console errors
5. **Review**: a second look at the diff (in Claude Code: `/check`, `/code-review`, the
   `ui-reviewer` agent)
6. **Commit** a small change with a clear message. Do not push without being asked

"Done" is a claim; a screenshot at both widths is the proof.
