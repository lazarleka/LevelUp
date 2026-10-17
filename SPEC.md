# LevelUp: product spec

What we are building and when it counts as done. Design lives in
[frontend/DESIGN.md](frontend/DESIGN.md), data and API in [docs/entities.md](docs/entities.md),
rules for coding agents in [AGENTS.md](AGENTS.md).

## Goal
LevelUp is an online shop for **new** video games. A gamer (15–30, mostly on a phone) finds a
game quickly, sees the price and platforms, and puts it in the cart.

## MVP
One main flow that must work end to end before anything else:

> **Find a game → open it → add it to the cart.**

"Works end to end" means: real mock data through `api/`, loading, empty and error states, and
it looks right at 375 px and 1440 px.

## Screens

| # | Screen | Route | MVP |
|---|---|---|---|
| 1 | Home | `/` | yes |
| 2 | Catalog (list + filter) | `/games` | yes |
| 3 | Game detail | `/games/:id` | yes |
| 4 | Cart | `/cart` | yes |
| 5 | Sign in | `/sign-in` | yes |
| 6 | Game form (create / edit, admin) | `/admin/games/new`, `/admin/games/:id/edit` | yes, required by the workshop |
| – | Not found | `*` | exists |

Every screen shares the header: dark green bar with the LevelUp logo, a search field (icon on
phone, field on desktop), the cart icon with the item count, and sign in / the user's name.

### 1. Home
- Three carousels: **New** (newest release date), **Best sellers** (by `soldCount`),
  **On sale** (`discountPercent > 0`), 10 games each
- Each carousel has a title, a "See all" link to the catalog with the matching sort or filter,
  and ← → buttons
- Arrows scroll by the number of visible boxes; the left arrow is disabled at the start, the
  right one at the end. Touch swipe also scrolls
- 2 boxes visible at 375 px, 5–6 at 1440 px

**Done when:** all three rows load from `useGames`, arrows and swipe work, each row has its own
loading skeleton and error message, and "See all" opens the catalog already filtered.

### 2. Catalog
- Grid of game boxes: 2 columns on phone, 3 on tablet, 5 on desktop
- **Search** by name, with suggestions while typing (up to 5 games with a thumbnail, Enter or
  click opens the game)
- **Filters:** platform, genre, price range (min / max), max PEGI, on sale only, coming soon
- **Sort:** newest (default), price ↑, price ↓, best rated, best selling
- Active filters as chips above the grid, each with ✕, plus "Clear all"
- Filters, search and sort live in the URL (`/games?platform=ps5&sort=price-asc`), so the page
  can be shared and the back button works
- Filters apply instantly; on phone they open in a bottom sheet, on desktop they sit in a sidebar
- Result count ("12 games")

**Done when:** every filter and sort changes the grid, filters combine, the URL updates and
restores the state on reload, empty result shows "No games match" with a "Clear filters" button.

### 3. Game detail
- Large box art, title, publisher, genre, PEGI, release date, rating (stars + number)
- **Platform picker** (only the game's platforms) and **edition picker** (Standard; Deluxe only
  if `deluxePrice` exists)
- Price for the chosen edition, old price struck through when on sale, "−20%" badge
- "In stock" / "Out of stock"; coming soon games show "Pre-order · releases 19 Nov 2026"
- **Add to cart** button (yellow, the main action), with a quantity of 1
- Description

**Done when:** changing edition changes the price, adding works and the header counter bounces,
an unknown id shows a not found message, out of stock disables the button.

### 4. Cart
- One row per item: thumbnail, title, platform, edition, unit price, quantity stepper (1–10),
  line total, remove button
- Order total at the bottom; on phone the total and the "Checkout" button stick to the bottom
- Empty cart: message and a "Browse games" button
- "Checkout" is visible but leads to a "coming soon" note (checkout is not in the MVP)

**Done when:** quantity and remove update the total immediately, the header counter matches,
the empty state shows after removing the last item.

### 5. Sign in
- Email and password, validated with zod (valid email, password at least 6 characters)
- Mock: any email from the users mock signs in, the password is not checked
- Wrong email shows "No account with that email" under the form
- After sign in the user returns to the page they came from

**Done when:** sign in and sign out work, the header shows the user's name, and protected
actions redirect to sign in and back.

### 6. Game form (admin)
- Fields of `NewGame` from `docs/entities.md`, validated with zod and react-hook-form
- Same form for create and edit; edit is pre-filled
- Only visible to a signed-in `admin`; others are redirected to sign in
- On save: back to the game detail page

**Done when:** a created game appears in the catalog, an edit is visible on the detail page,
validation messages are shown next to the fields.

## Rules across the app
- Adding to the cart requires sign in. A signed-out user who clicks "Add to cart" goes to
  `/sign-in` and comes back to the same game
- Prices are shown as `€59.49`; the discount is applied before the price is shown
- All UI copy is in English
- Every image has `alt`, every control works with the keyboard, focus is visible

## Later (not before the MVP works)
Ratings and reviews, "You might also like", wishlist, pre-order details, checkout and
"My orders", sign up.

## Out of scope
Used games, payments, real shipping, multiple currencies, a dark theme.

## Open questions
Decided by Claude for now; change them here if the team disagrees.
- Should a signed-out user be able to fill a cart (guest cart)? Currently: no, sign in first
- Should checkout create a mock order in the MVP? Currently: no, "coming soon"
