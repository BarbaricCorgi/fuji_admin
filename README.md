# Fuji Admin

A modern ActiveAdmin theme, currently an empty MVP scaffold inspired by
[arctic_admin](https://github.com/cprodhomme/arctic_admin) (structure) and
[PrimeReact Verona](https://verona.primereact.org/) (visual language).

## Status

Empty skeleton. Only a peach body background and title suffix are applied,
as visible markers to confirm the gem is loaded in a host app.

## Usage

In your host app's `Gemfile`:

```ruby
gem 'fuji_admin', path: '../fuji_admin'
```

In `app/assets/stylesheets/active_admin.scss`:

```scss
@import "fuji_admin/base";
```

In `app/assets/javascripts/active_admin.js`:

```javascript
//= require fuji_admin/base
```

## License

MIT
