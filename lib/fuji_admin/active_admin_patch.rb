module FujiAdmin
  # Surfaces FujiAdmin.config to the browser by registering entries in each
  # ActiveAdmin namespace's built-in `meta_tags` hash. AA renders those
  # entries as <meta> tags inside <head> (lib/active_admin/views/pages/base.rb),
  # so the palette JavaScript can read them on page load without any
  # monkey-patching of arbre's view builders.
  def self.install_meta_tags!
    return unless defined?(::ActiveAdmin)

    ActiveAdmin.application.namespaces.each do |namespace|
      namespace.meta_tags["fuji-palette-picker"]  = config.palette_picker.to_s
      namespace.meta_tags["fuji-default-palette"] = config.default_palette.to_s
    end
  end
end
