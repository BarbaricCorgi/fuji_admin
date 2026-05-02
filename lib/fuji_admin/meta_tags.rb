module FujiAdmin
  # Surfaces FujiAdmin.config to the browser by writing entries into each
  # ActiveAdmin namespace's built-in `meta_tags` hash. AA renders those
  # entries as <meta> tags inside <head> (lib/active_admin/views/pages/base.rb),
  # so the palette JavaScript can read them on page load.
  #
  # Subscribes to AA's namespace.register notification so each namespace
  # gets its tags the moment it's created — no boot-time iteration, no need
  # to force-load the host app's admin files.
  def self.install_meta_tags!
    return unless defined?(::ActiveAdmin)

    ActiveSupport::Notifications.subscribe(ActiveAdmin::Namespace::RegisterEvent) do |_name, _start, _finish, _id, payload|
      apply_meta_tags(payload[:active_admin_namespace])
    end

    ActiveAdmin.application.namespaces.each { |ns| apply_meta_tags(ns) }
  end

  def self.apply_meta_tags(namespace)
    namespace.meta_tags["fuji-palette-picker"]  = config.palette_picker.to_s
    namespace.meta_tags["fuji-default-palette"] = config.default_palette.to_s
  end
end
