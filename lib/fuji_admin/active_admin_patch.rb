module FujiAdmin
  # Injects <meta> tags into ActiveAdmin's <head> so the palette JavaScript
  # can read the FujiAdmin config at runtime without requiring the host app
  # to touch its layout.
  #
  # Applied by prepending onto ActiveAdmin::Views::Pages::Base once AA is
  # loaded. If AA isn't present the prepend silently no-ops.
  module ActiveAdminPatch
    def build_active_admin_head
      super
      within @head do
        meta(name: "fuji-palette-picker",  content: FujiAdmin.config.palette_picker.to_s)
        meta(name: "fuji-default-palette", content: FujiAdmin.config.default_palette.to_s)
      end
    end
  end
end

ActiveAdmin::Views::Pages::Base.prepend(FujiAdmin::ActiveAdminPatch) if defined?(::ActiveAdmin)
