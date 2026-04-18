# Fuji Admin

A responsive [ActiveAdmin](https://github.com/activeadmin/activeadmin) theme.
Clean card-based layout, slide-in filter drawer, float-label inputs,
row-action dropdowns, and a live palette switcher with 30 built-in palettes.

## Features

- **Responsive layout** — fixed header + sidebar nav at `lg+`, auto-injected
  hamburger drawer below, edge-to-edge content on mobile.
- **Filter drawer** — AA's `#sidebar` is turned into a right-side slide-in
  panel with a "Filters" toggle in the title bar. Includes a chip strip
  above the table showing each active Ransack filter (click × to remove).
- **Float labels** on text inputs, matching the Verona feel.
- **Row-action dropdown** — 2+ row actions collapse into a single `⋯`
  menu per row, rendered above any clipping parents via `position: fixed`.
- **Palette switcher** — 30 palettes (Coolors-trending), 8 of them curated
  full themes that repaint surfaces + text + borders. Non-themed palettes
  auto-derive tinted surfaces from the primary via `color-mix()`.
- **Refactored form chrome** — fieldset legends rendered as proper card
  headers, not floating `<legend>` text over borders.
- **Full component set** — buttons, inputs, selects, Select2, jQuery UI
  date picker, tables (index / attributes / summary / `table_for`),
  pagination, status tags, flash banners, scopes, dropdown menus, comments,
  watchlist bar.

## Requirements

- Ruby `>= 3.1.0`
- ActiveAdmin `>= 3.0`, `< 4.0`

## Installation

In your host app's `Gemfile`:

```ruby
gem "fuji_admin", "~> 0.1"
```

Then:

```bash
bundle install
```

### Asset imports

In `app/assets/stylesheets/active_admin.scss`:

```scss
@import "fuji_admin/base";
```

In `app/assets/javascripts/active_admin.js`:

```javascript
//= require fuji_admin/base
```

## Configuration

Add a Rails initializer — all attributes are optional.

```ruby
# config/initializers/fuji_admin.rb
FujiAdmin.configure do |config|
  # Id of the palette to apply before any user selection is stored.
  # Must match one of the ids in app/assets/javascripts/fuji_admin/palettes.js.
  config.default_palette = "forest-meadow"

  # Render the floating palette-picker UI. Defaults to false. Flip on in
  # development to audition palettes live.
  config.palette_picker = Rails.env.development?
end
```

Configuration is surfaced to the browser via `<meta>` tags injected into
ActiveAdmin's `<head>` — no host-layout changes required.

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

## Customising palettes

The 30 bundled palettes live in
`app/assets/javascripts/fuji_admin/palettes.js`. Each has:

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

## License

MIT — see [LICENSE.txt](LICENSE.txt).
