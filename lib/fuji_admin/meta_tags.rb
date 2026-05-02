module FujiAdmin
  # Surfaces FujiAdmin.config and the responsive viewport hint to the browser
  # by writing into AA's head. We deliberately avoid `namespace.meta_tags`:
  # AA renders that hash inside Arbre as `text_node(meta(...))`, and the inner
  # `meta(...)` already auto-attaches to <head>, so each entry would render
  # twice. Using `namespace.head` (a raw, html_safe string AA inserts once)
  # sidesteps that.
  VIEWPORT = "width=device-width, initial-scale=1".freeze

  def self.install_meta_tags!
    return unless defined?(::ActiveAdmin)

    # Logged-out pages use a separate ERB layout that only renders
    # `application.meta_tags_for_logged_out_pages` (and ignores
    # `namespace.head`). We need viewport for mobile rendering and
    # `fuji-default-palette` so the login screen paints in the configured
    # brand colour. The picker UI itself is hidden for logged-out, so
    # `fuji-palette-picker` isn't needed there.
    ActiveAdmin.application.meta_tags_for_logged_out_pages =
      ActiveAdmin.application.meta_tags_for_logged_out_pages.merge(
        viewport: VIEWPORT,
        "fuji-default-palette" => config.default_palette.to_s
      )

    ActiveSupport::Notifications.subscribe(ActiveAdmin::Namespace::RegisterEvent) do |_name, _start, _finish, _id, payload|
      apply_to_namespace(payload[:active_admin_namespace])
    end

    ActiveAdmin.application.namespaces.each { |ns| apply_to_namespace(ns) }
  end

  def self.apply_to_namespace(namespace)
    namespace.head = head_markup
  end

  def self.head_markup
    <<~HTML.html_safe
      <meta name="viewport" content="#{VIEWPORT}">
      <meta name="fuji-palette-picker" content="#{config.palette_picker}">
      <meta name="fuji-default-palette" content="#{config.default_palette}">
    HTML
  end
end
