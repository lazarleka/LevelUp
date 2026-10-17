# LevelUp: design

## Product
LevelUp is an online shop for new video games: customers browse the catalog, find a game by
name, platform or genre, and add it to the cart.

## Users
Gamers aged 15–30. Most of them shop from a phone, so every screen is designed **mobile first**
(375 px) and then expanded to desktop (1440 px).

## Tone
Energetic, fast, reliable. It should feel like walking past a shelf of game boxes, not like
reading a spreadsheet.

## MVP (main flow)
Find a game → open it → add it to the cart. This flow must work end to end (loading, empty and
error states, phone and desktop) before anything from "Later" is started.

1. Search by name with suggestions while typing (top 5 games with a box thumbnail)
2. Catalog filters: platform (PS5, Xbox Series, Switch, PC), genre, price range, PEGI age,
   on sale only, coming soon (pre-order). Filters apply instantly, no "Apply" button
3. Sorting: newest, price low→high and high→low, best rated, best selling
4. Active filters shown as chips above the list, each with an ✕ to remove it
5. Game detail: large box art, platform and edition picker (Standard / Deluxe), price with the
   old price struck through when on sale
6. Cart: quantity per item and total price

## Later (after the MVP works)
- Ratings and customer reviews (stars)
- "You might also like" carousel on the game detail page
- Wishlist (heart on the box)
- Pre-order with release date
- Sign in and "My orders"

## Screens
- **Home:** several horizontal carousels: "New", "Best sellers", "On sale". Arrow buttons
  (← →) scroll the row. 2 boxes visible on phone, 5–6 on desktop. Swipe also works on touch.
- **Catalog:** all games in a grid of boxes with search, filters and sorting. No carousel here.
  2 columns on phone, 5 on desktop; filters open in a sheet on phone and sit in a sidebar on
  desktop.
- **Game detail, cart, sign in:** single column on phone, two columns on desktop.

## Game box (the main UI element)
- Every game is shown as its full box: portrait cover art in a **3:4** ratio
- The box has sharper corners than the rest of the UI (`rounded-sm`), like a real case
- Under the box: title (max 2 lines), platform badge, price
- Hover (desktop): the box lifts slightly and gets a yellow outline
- Focus (keyboard): the same yellow outline

## Visuals
Light theme. Dark green takes the role of black: it is the brand and the text color. Yellow is
reserved for actions, so the "buy" button is always the most visible thing on a screen.

| Role | Color | Token | Used for |
|---|---|---|---|
| Background | `#FFFFFF` | `background`, `card` | page, cards |
| Text, brand | `#164A41` | `foreground`, `brand` | headings, text, header bar with logo and cart |
| Main action | `#F1B24A` on `#164A41` text | `primary` | "Add to cart", carousel arrows, sale price, cart badge |
| Secondary | `#4D774E` with white text | `secondary` | platform badges, links, active filter chips |
| Soft green | `#9DC88D` and tints | `highlight`, `muted`, `accent` | "In stock", section backgrounds, filter hover |
| Error | red (outside the palette) | `destructive` | error messages only |

- Text on yellow is always dark green, never white (white on `#F1B24A` is not readable)
- All text/background pairs above pass WCAG AA (4.5:1 or more)
- Fonts: **Rajdhani** (600, 700) for headings, prices and the logo; **Inter** (400, 500, 600)
  for body text
- Shape: slightly rounded (6 px radius), thin borders, no shadows. Boxes use the smaller radius
- Icons: `lucide-react` only

## Interaction
- Box hover: slight lift and yellow outline
- Add to cart: the cart counter in the header does a short bounce
- Filters and sorting update the list immediately and are kept in the URL
- Motion is short (150–250 ms) and respects `prefers-reduced-motion`

## References
- GameStop: search suggestions, filter sidebar, platform and edition picker on the product page
- Best Buy: yellow used only for the main action, clear price block with the old price struck
  through

## Don't
- Gradients without a reason, emoji instead of icons, a "Welcome to…" hero
- Everything in cards with shadows
- White text on yellow
- Yellow for decoration: it is only for actions and sale prices
- Landscape thumbnails for games: a game is always shown as its portrait box
