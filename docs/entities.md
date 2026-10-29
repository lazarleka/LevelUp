# Entities

> This file is the contract between the frontend and the backend (next workshop).
> For each entity: fields with types, relations, and who is allowed to do what.
> The entity type lives in `frontend/src/features/<name>/types.ts` and the mock API in
> `frontend/src/features/<name>/api/<name>-api.ts`.

LevelUp is a shop for new video games. Entities: **Game**, **CartItem**, **User** and **Favorite**.

```
User 1 ──── * CartItem * ──── 1 Game
User 1 ──── * Favorite * ──── 1 Game
```

Prices are in EUR with two decimals. Dates are ISO strings (`2026-10-17`).

---

## Game

A game in the shop catalog. Code: `frontend/src/features/games/` (`types.ts`, `api/games-api.ts`, `api/use-games.ts`).

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| id | number | yes | assigned by the backend |
| title | string, 2–100 characters | yes | |
| description | string, up to 2000 characters | yes | |
| genre | `action` \| `adventure` \| `rpg` \| `sports` \| `racing` \| `shooter` \| `strategy` \| `family` | yes | one genre per game |
| platforms | array of `ps5` \| `xbox-series` \| `switch` \| `pc`, at least 1, no duplicates | yes | |
| publisher | string | yes | |
| pegi | `3` \| `7` \| `12` \| `16` \| `18` | yes | age rating |
| price | number > 0 | yes | Standard edition, before discount |
| deluxePrice | number > price, or `null` | yes | `null` when there is no Deluxe edition |
| discountPercent | integer 0–90 | yes | above 0 means "on sale"; applies to both editions |
| releaseDate | date | yes | a date after today means "coming soon" (pre-order) |
| coverUrl | URL | yes | portrait box art, 3:4 ratio |
| rating | number 0–5, one decimal | yes | average customer rating, **computed by the backend** |
| soldCount | integer ≥ 0 | yes | **computed by the backend**, used for "best selling" |
| inStock | boolean | yes | |

**Final price** = `price × (100 − discountPercent) / 100`, rounded to cents. Filters and sorting by price use the final price.

**Relations:** a game appears in many cart items.

**Access rules:** everyone (also signed out) can list and view games; only an `admin` can create, edit or delete a game.

**API the frontend expects:**

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/games` | query parameters below, returns `Game[]` |
| GET | `/games/:id` | `404` if it does not exist |
| POST | `/games` | admin, body: game without `id`, `rating`, `soldCount` |
| PATCH | `/games/:id` | admin, body: any subset of the POST fields |
| DELETE | `/games/:id` | admin |

`GET /games` query parameters, all optional and combinable:

| Parameter | Example | Meaning |
| --- | --- | --- |
| search | `ring` | title contains the text, case insensitive |
| platform | `ps5` | game is available on this platform |
| genre | `rpg` | |
| minPrice, maxPrice | `10`, `50` | final price range, inclusive |
| maxPegi | `12` | PEGI rating at most this value |
| onSale | `true` | `discountPercent > 0` |
| comingSoon | `true` | `releaseDate` after today |
| sort | `newest` (default) \| `price-asc` \| `price-desc` \| `rating` \| `best-selling` | |

---

## CartItem

One line in the signed-in user's cart. Code: `frontend/src/features/cart/` (`types.ts`, `api/cart-api.ts`, `api/use-cart.ts`).

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| id | number | yes | assigned by the backend |
| gameId | number | yes | link to Game |
| title | string | yes | copied from the game when added |
| coverUrl | URL | yes | copied from the game when added |
| platform | `ps5` \| `xbox-series` \| `switch` \| `pc` | yes | must be one of the game's platforms |
| edition | `standard` \| `deluxe` | yes | `deluxe` only if the game has a `deluxePrice` |
| unitPrice | number | yes | final price at the moment of adding, **set by the backend** from the game, not trusted from the client |
| quantity | integer 1–10 | yes | |

**Rules:**
- Adding a game with the same `gameId`, `platform` and `edition` that is already in the cart increases its `quantity` instead of creating a new line.
- Quantity is clamped to 1–10.
- A game with `inStock: false` cannot be added (`409`).
- Cart total = sum of `unitPrice × quantity`.

**Relations:** a cart item belongs to one user and points to one game.

**Access rules:** only a signed-in user has a cart and sees only their own cart items.

**API the frontend expects:**

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/cart` | the current user's items, `CartItem[]` |
| GET | `/cart/:id` | `404` if it is not in the current user's cart |
| POST | `/cart` | body: `{ gameId, platform, edition, quantity }`; returns the new or updated item |
| PATCH | `/cart/:id` | body: `{ quantity }` |
| DELETE | `/cart/:id` | |

---

## User

A customer or a shop admin. Code: `frontend/src/features/users/` (`types.ts`, `api/users-api.ts`, `api/use-users.ts`).

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| id | number | yes | assigned by the backend |
| name | string, 2–60 characters | yes | |
| email | email, unique | yes | used to sign in |
| role | `customer` \| `admin` | yes | new accounts are `customer` |
| createdAt | date | yes | assigned by the backend |

The password is never part of the `User` object; the backend stores only its hash.

**Relations:** a user has many cart items.

**Access rules:** a user sees and edits only their own account; an `admin` can list all users and change roles. Signing up is open to everyone.

**API the frontend expects:**

| Method | Path | Notes |
| --- | --- | --- |
| POST | `/auth/sign-in` | body: `{ email, password }`, returns `{ user, token }`; `401` on wrong credentials |
| POST | `/auth/sign-out` | |
| GET | `/auth/me` | current user or `401` |
| GET | `/users` | admin |
| GET | `/users/:id` | self or admin |
| POST | `/users` | sign up, body: `{ name, email, password }` |
| PATCH | `/users/:id` | self (name, email) or admin (also role) |
| DELETE | `/users/:id` | self or admin |

In the frontend mock, sign in accepts any known email and does not check the password.

## Favorite

A saved game belonging to one signed-in user. Code: `frontend/src/features/favorites/`.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| gameId | positive integer | yes | references Game; unique within one user's list |
| savedAt | ISO timestamp | yes | time the game was first saved |

**Access rules:** a user may list, save and remove only their own favorites. The backend must derive
the user from the authenticated session. An explicit user id is used only in the browser mock.

**Rules:** saving an existing favorite is idempotent and preserves `savedAt`; removing a missing
favorite succeeds. Favorites do not reserve stock or add anything to the cart. Game details and
prices come from the games API; deleted games are omitted from the displayed list.

**Mock persistence:** `localStorage["levelup.favorites.<userId>"]` stores `Favorite[]` for each
account in the current browser. Invalid records are ignored. Storage failures surface to the UI;
a failed write does not update the displayed saved state. Storage events refresh other open tabs.
This does not provide cross-device persistence or server-side authorization.

**Expected future backend API:**

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/favorites` | current user's `Favorite[]` |
| PUT | `/favorites/:gameId` | idempotently save the game; reject unknown games |
| DELETE | `/favorites/:gameId` | idempotently remove the game |
