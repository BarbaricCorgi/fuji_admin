module FujiAdmin
  # Runtime configuration for the Fuji Admin theme.
  #
  # Set in a Rails initializer, e.g.
  #
  #   # config/initializers/fuji_admin.rb
  #   FujiAdmin.configure do |config|
  #     config.palette_picker  = true             # show the floating picker UI
  #     config.default_palette = "forest-meadow"  # initial palette before any user selection
  #   end
  #
  # These values are exposed to the browser via <meta> tags injected into
  # ActiveAdmin's <head> (see fuji_admin/active_admin_patch.rb). The palette
  # JavaScript reads them on page load.
  class Configuration
    # Boolean — whether to render the floating palette-picker UI. When false,
    # the default_palette is still applied but users can't change it.
    attr_accessor :palette_picker

    # String — id of the palette to apply when no user preference is stored.
    # Must match an id in app/assets/javascripts/fuji_admin/palettes.js.
    attr_accessor :default_palette

    def initialize
      @palette_picker  = false
      @default_palette = "forest-meadow"
    end
  end
end
