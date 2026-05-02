# Fuji Admin

A responsive, modern theme for [ActiveAdmin](https://github.com/activeadmin/activeadmin).
Clean card-based layout, slide-in filter drawer, float-label inputs,
row-action dropdowns, and a live palette switcher with 30 built-in palettes.

## Screenshots

| Index page (Editorial Navy) | Filter drawer |
| --- | --- |
| ![Index page](https://raw.githubusercontent.com/BarbaricCorgi/fuji_admin/main/docs/screenshots/screenshot-001.png) | ![Filter drawer](https://raw.githubusercontent.com/BarbaricCorgi/fuji_admin/main/docs/screenshots/screenshot-002.png) |

| New record form with float labels & date picker | Show page |
| --- | --- |
| ![New record form](https://raw.githubusercontent.com/BarbaricCorgi/fuji_admin/main/docs/screenshots/screenshot-003.png) | ![Show page](https://raw.githubusercontent.com/BarbaricCorgi/fuji_admin/main/docs/screenshots/screenshot-004.png) |

| Live palette switcher | Login (editorial split) |
| --- | --- |
| ![Palette switcher](https://raw.githubusercontent.com/BarbaricCorgi/fuji_admin/main/docs/screenshots/screenshot-005.png) | ![Login page](https://raw.githubusercontent.com/BarbaricCorgi/fuji_admin/main/docs/screenshots/screenshot-006.png) |

### Mobile

| Index (hamburger nav, horizontal scroll) | Row-actions dropdown | Show page (flattened panel) | Login (stacked) |
| --- | --- | --- | --- |
| ![Mobile index](https://raw.githubusercontent.com/BarbaricCorgi/fuji_admin/main/docs/screenshots/mobile-001.png) | ![Mobile row actions](https://raw.githubusercontent.com/BarbaricCorgi/fuji_admin/main/docs/screenshots/mobile-002.png) | ![Mobile show](https://raw.githubusercontent.com/BarbaricCorgi/fuji_admin/main/docs/screenshots/mobile-003.png) | ![Mobile login](https://raw.githubusercontent.com/BarbaricCorgi/fuji_admin/main/docs/screenshots/mobile-004.png) |

## Why fuji_admin

Fuji Admin drops onto an existing ActiveAdmin app without touching a single
line of your `app/admin/` files — every existing resource, filter, form, and
table immediately looks a decade newer. It replaces AA's piecemeal defaults
with a cohesive design system — Saira typography, card-based layout, proper
elevation, and consistent spacing tokens — rather than painting over the
framework. A runtime palette switcher lets you (or your users) repaint every
primary surface, button, link, and chip live, with 30 curated palettes
available and derived tinted surfaces via `color-mix()` so no palette ever
feels "recolored". Forms get animated floating labels on text inputs and
textareas, refactored fieldset chrome, and clean button styling without
any Formtastic changes. Mobile posture is taken seriously: panels flatten
into sections, index tables switch to compact padding with opt-in
column-wrapping, and wide tables scroll horizontally instead of collapsing.
The filter sidebar is rethought as a right-side drawer with active-filter
chips above the table, reclaiming huge amounts of horizontal space for wide
index pages. Every design token (color, shadow, radius, space, font) is an
overridable SCSS variable, so one line in your `active_admin.scss` can rebrand
the whole app.

## Features

- **Responsive layout** — fixed header + sidebar nav at `lg+`, auto-injected
  hamburger drawer below, edge-to-edge content on mobile.
- **Filter drawer** — AA's `#sidebar` is turned into a right-side slide-in
  panel with a "Filters" toggle in the title bar. Includes a chip strip
  above the table showing each active Ransack filter (click × to remove).
- **Float labels** on text inputs and textareas.
- **Row-action dropdown** — 2+ row actions collapse into a single `⋯`
  menu per row, rendered above any clipping parents via `position: fixed`.
- **Palette switcher** — 30 palettes, 8 of them curated full themes that
  repaint surfaces + text + borders. Non-themed palettes auto-derive tinted
  surfaces from the primary via `color-mix()`.
- **Refactored form chrome** — fieldset legends rendered as proper card
  headers, not floating `<legend>` text over borders.
- **Full component set** — buttons, inputs, selects, Select2, jQuery UI
  date picker, tables (index / attributes / summary / `table_for`),
  pagination, status tags, flash banners, scopes, dropdown menus, comments,
  watchlist bar.

## Requirements

- Ruby `>= 3.1.0`
- ActiveAdmin `>= 3.0`, `< 4.0` (AA 4 ships its own Tailwind-based theme
  with a different asset pipeline — fuji_admin doesn't apply there yet)

## Install in an existing ActiveAdmin project

1. Add to your `Gemfile`:

   ```ruby
   gem "fuji_admin", "~> 1.0"
   ```

   ```bash
   bundle install
   ```

2. Import the stylesheet in `app/assets/stylesheets/active_admin.scss`:

   ```scss
   @import "fuji_admin/base";
   ```

3. Require the JavaScript in `app/assets/javascripts/active_admin.js`:

   ```javascript
   //= require fuji_admin/base
   ```

4. Restart the Rails server. That's it — your existing resources now render
   with the fuji theme.

No changes to your `app/admin/*.rb` files are required. If you were
previously using a different theme (e.g. `arctic_admin`), remove its gem and
asset imports to avoid conflicting styles.

### Optional configuration

All attributes are optional.

```ruby
# config/initializers/fuji_admin.rb
FujiAdmin.configure do |config|
  # Palette applied before any user selection is stored.
  config.default_palette = "forest-meadow"

  # Render the floating palette-picker UI. Defaults to false. Flip on in
  # development to audition palettes live.
  config.palette_picker = Rails.env.development?
end
```

Configuration is surfaced to the browser via `<meta>` tags injected into
ActiveAdmin's `<head>` — no host-layout changes required.

## Choosing a palette

You have three ways to apply a palette. Pick whichever fits your workflow.

### 1. Live-preview with the palette picker (development)

Flip `config.palette_picker = true` in the initializer and reload. A small
floating trigger appears in the bottom-right corner; opening it shows all 30
palettes with swatches. Click one and the entire UI repaints instantly — no
reload. Your selection is persisted to `localStorage` for that browser, so
you can use it to audition palettes when picking your default.

### 2. Set a project-wide default

Once you've chosen a palette, set its `id` in the initializer:

```ruby
FujiAdmin.configure do |config|
  config.default_palette = "coastal-sage"
end
```

This palette is applied for every user who hasn't picked their own via the
runtime picker. Leaving `palette_picker = false` in production means the
default is the *only* palette used, which is usually what you want for a
consistent brand.

### 3. Bundled palette IDs

Use any of these as `default_palette`:

| ID                | Tone                          |
| ----------------- | ----------------------------- |
| `fuji-default`    | Deep indigo (fuji base)       |
| `navy-amber`      | Teal + amber accents          |
| `warm-sunset`     | Terracotta + teal             |
| `forest-meadow`   | Olive & green earth tones     |
| `dusty-rose`      | Muted pink + maroon           |
| `ocean-blue`      | Ocean cyans                   |
| `terracotta`      | Warm terracotta + sage        |
| `coastal-sage`    | Sage-green neutral *(theme)*  |
| `royal-purple`    | Deep violet                   |
| `editorial-navy`  | Slate navy + off-white *(theme)* |
| `cheerful`        | Primary-bright multi          |
| `crimson-spice`   | Crimson + saffron             |
| `mint-ocean`      | Mint → deep-cyan ramp         |
| `burgundy-gold`   | Burgundy + gold *(theme)*     |
| `scarlet`         | Monochrome scarlet            |
| `teal-warmth`     | Teal + warm ochre             |
| `deep-cyan`       | Deep cyan + sand *(theme)*    |
| `tropical`        | Tropical aqua + coral *(theme)* |
| `spice-road`      | Magenta + orange              |
| `sunset-gradient` | Full spectrum sunset          |
| `coral-reef`      | Coral + seafoam               |
| `electric`        | Vivid cyberpunk               |
| `muted-taupe`     | Grey-purple taupe *(theme)*   |
| `warm-lilac`      | Lilac ramp                    |
| `rose-garden`     | Rose + pink                   |
| `forest-deep`     | Deep forest                   |
| `pink-sunset`     | Soft pinks                    |
| `twilight-purple` | Deep indigo-purple            |
| `olive-gold`      | Olive + mustard *(theme)*     |
| `sage-terracotta` | Sage + terracotta *(theme)*   |
| `indigo-glow`     | Vivid indigo + multi          |

Palettes marked *(theme)* are curated full themes with hand-picked surface,
text, and border colors. Un-marked palettes auto-derive tinted surfaces from
the primary at runtime.

## Customising palettes

The 30 bundled palettes live in
`app/assets/javascripts/fuji_admin/palettes.js`. Each entry has:

```javascript
{
  id:      "navy-amber",
  name:    "Navy & Amber",
  primary: "#219ebc",
  swatch:  ["#8ecae6","#219ebc","#023047","#ffb703","#fb8500"],
  theme:   {                        // optional — promotes to a full theme
    surface:     "#fdfcdc",
    surfaceAlt:  "#f0ebc5",
    text:        "#003844",
    textMuted:   "#00afb5",
    border:      "#e6e3b5"
  }
}
```

Palettes without a `theme` block get auto-derived surfaces + text by mixing
the `primary` with white / black at runtime via `color-mix()`, so every
palette reads as a coherent mini-theme.

To override the theme's design tokens wholesale (font, radii, spacing,
shadows, base colors), declare the SCSS variable *before* the fuji_admin
import:

```scss
// app/assets/stylesheets/active_admin.scss
$primary-color: #2bb673;
$font-family-body: "Inter", sans-serif;
$border-radius-card: 12px;

@import "fuji_admin/base";
```

Every variable in `fuji_admin/variables/*` is marked `!default`, so your
declaration wins.

## Development against a host app

Clone both repos side-by-side:

```
~/development/
  ├── fuji_admin/
  └── my_admin_app/
```

Bundler's `bundle config local.<gem>` override only works when the host's
Gemfile references a git source, not a published RubyGem. So for live local
editing, point the host's Gemfile at the GitHub source temporarily:

```ruby
# Host app Gemfile — during fuji_admin development
gem "fuji_admin", github: "BarbaricCorgi/fuji_admin"
```

Then tell Bundler to resolve it against your local checkout:

```bash
bundle config local.fuji_admin ~/development/fuji_admin
```

This is a per-machine setting stored in `~/.bundle/config` — CI / Docker /
Kamal never see it and fall back to the github source. Edits in
`~/development/fuji_admin` reflect in the host app immediately.

When you're ready to ship, flip the Gemfile back to
`gem "fuji_admin", "~> 0.1"`, publish a new version (`gem build && gem push`),
and run `bundle update fuji_admin` in the host.

## License

MIT — see [LICENSE.txt](LICENSE.txt).
