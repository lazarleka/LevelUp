# LevelUp: design

How LevelUp looks and feels. What each screen does and when it is done is in
[../SPEC.md](../SPEC.md); this file only decides the look.

## Product
LevelUp is an online shop for new video games: customers browse the catalog, find a game by
name, platform or genre, and add it to the cart.

## Users
Gamers aged 15–30. Most of them shop from a phone, so every screen is designed **mobile first**
(375 px) and then expanded to desktop (1440 px).

## Tone
Energetic, fast, reliable. It should feel like walking past a shelf of game boxes, not like
reading a spreadsheet.

## Colors
Light theme. Dark green takes the role of black: it is the brand and the text color. Yellow is
reserved for actions, so the "buy" button is always the most visible thing on a screen.

| Role | Color | Token | Used for |
|---|---|---|---|
| Background | `#FFFFFF` | `background`, `card`, `popover` | page, cards, menus |
| Text | `#164A41` | `foreground` | headings and body text |
| Brand | `#164A41` with white text | `brand`, `brand-foreground` | header bar, footer |
| Main action | `#F1B24A` with `#164A41` text | `primary`, `primary-foreground`, `ring` | "Add to cart", carousel arrows, sale badge, cart counter, focus ring |
| Secondary | `#4D774E` with white text | `secondary`, `secondary-foreground` | platform badges, active filter chips |
| Quiet text | `#4D774E` | `muted-foreground` | meta info, old price, helper text |
| Soft green | `#9DC88D` | `highlight`, `highlight-foreground` | "In stock" label |
| Soft green tints | from `#9DC88D` | `muted`, `accent` | skeletons, section backgrounds, hover on filters and menu items |
| Lines | light grey-green | `border`, `input` | borders, input outlines |
| Error | red, outside the palette | `destructive` | error messages and "Remove" only |

- Text on yellow is always dark green, never white (white on `#F1B24A` is not readable)
- All text/background pairs above pass WCAG AA (4.5:1 or more)
- Yellow is never decoration: no yellow headings, borders or backgrounds without an action

## Typography
- **Rajdhani** (600, 700): headings, prices, the logo, carousel titles
- **Inter** (400, 500, 600): everything else
- Sizes (phone → desktop):
  - Page title `text-3xl` → `md:text-4xl`, bold
  - Section / carousel title `text-xl` → `md:text-2xl`, bold
  - Game title in a box `text-base`, semibold, max 2 lines
  - Price in a box `text-lg`, Rajdhani bold; on the detail page `text-3xl`
  - Body `text-sm` → `md:text-base`; meta `text-xs`/`text-sm` in `muted-foreground`
- At most two heading sizes per screen; text lines up to ~70 characters

## Layout and spacing
- Content width `max-w-6xl`, side padding `px-4` (16 px) on phone, `md:px-6`
- Breakpoints: base = phone (375), `sm` 640, `md` 768, `lg` 1024 (desktop layout), 1440 checked
- Between sections `py-12` or more; inside groups `gap-2` to `gap-4`
- Spacing only from the scale 1, 2, 3, 4, 6, 8, 12, 16

## Shape
- Radius 6 px (`--radius: 0.375rem`); buttons, inputs, cards use `rounded-md`/`rounded-lg`
- Game boxes and the sale badge use `rounded-sm`, sharper like a real case
- Thin `border` lines instead of shadows. A shadow only on floating layers (menus, the filter
  sheet, sticky cart total)

## Header
- Full-width dark green bar (`bg-brand`), white logo "LevelUp" in Rajdhani bold
- Phone: logo left; search icon, cart icon with count, user icon right. Search opens as a
  full-width field under the bar
- Desktop: logo, Games link, search field in the middle (`max-w-md`), cart and sign in right
- Cart count: small yellow circle with dark green number; bounces once when an item is added

## Game box (the main UI element)
- Every game is shown as its full box: portrait cover art in a **3:4** ratio
- Under the box: title (max 2 lines), platform badges, price; old price struck through when on
  sale; "−20%" badge in the top left corner of the box
- Coming soon games get a "Pre-order" label instead of the sale badge
- Hover (desktop): the box lifts 4 px and its border turns yellow; the whole box is a link to the
  game
- Focus (keyboard): visible yellow ring
- Same component in carousels and the catalog grid

## Carousel
- Title left, "See all" link and ← → buttons right
- Arrow buttons: 40 px square, yellow (`primary`), disabled at the ends with 50% opacity
- 2 boxes visible on phone (with a peek of the third), 5–6 on desktop; scroll snaps to a box
- Swipe on touch, arrows on all sizes

## Catalog
- Phone: search field, then a row with "Filters (2)" button and the sort select; filters open in
  a bottom sheet; grid of 2 columns
- Desktop: filter sidebar (240 px) left, grid of 5 columns right; sort select above the grid
- Active filters as `secondary` chips with ✕, plus "Clear all" as a text button
- Result count above the grid in `muted-foreground`

## Game detail
- Phone: box art on top (max 60% of the screen width, centered), then info, pickers, price, the
  Add to cart button full width, description
- Desktop: two columns, box art left (sticky), everything else right
- Platform and edition pickers are toggle buttons (outlined; selected = `secondary`)
- Add to cart: large `primary` button with a cart icon

## Forms (sign in, game form)
- One column, labels above inputs, `max-w-md` on sign in, `max-w-2xl` on the game form
- Error text under the field in `destructive`, `text-sm`
- Main button is `primary`; cancel is a `ghost` button

## States
- **Loading:** skeletons with the same shape as the content (3:4 boxes, text lines), `bg-muted`
- **Empty:** short message and one action ("Clear filters", "Browse games"), centered, an icon
  from lucide in `muted-foreground`
- **Error:** message in `destructive` and a "Try again" button
- Buttons that are saving show a spinner and are disabled

## Interaction and motion
- Box hover: lift and yellow border, 200 ms
- Add to cart: counter bounce, 250 ms, plus a short toast "Added to cart"
- Filters and sorting update the list immediately and are kept in the URL
- All motion is 150–250 ms and turned off with `prefers-reduced-motion`

## Images
- Box art in 3:4, `object-cover`, lazy loaded, with `alt="<title> box art"`
- Placeholder images come from picsum for now; replace them with your own box art later

## Icons
`lucide-react` only: `ShoppingCart`, `Search`, `User`, `ChevronLeft`, `ChevronRight`,
`SlidersHorizontal`, `X`, `Star`, `Trash2`, `Minus`, `Plus`.

## References
- GameStop: search suggestions, filter sidebar, platform and edition picker on the product page
- Best Buy: yellow used only for the main action, clear price block with the old price struck
  through

## Don't
- Gradients without a reason, emoji instead of icons, a "Welcome to…" hero
- Everything in cards with shadows
- White text on yellow, or yellow used as decoration
- Landscape thumbnails for games: a game is always shown as its portrait box
- More than two fonts
