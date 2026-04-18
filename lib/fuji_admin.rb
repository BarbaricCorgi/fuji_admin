require "fuji_admin/version"
require "fuji_admin/configuration"

module FujiAdmin
  class << self
    # Access the current configuration singleton.
    def config
      @config ||= Configuration.new
    end

    # Yield the configuration to a block, e.g. in an initializer.
    def configure
      yield config
    end
  end

  module Rails
    class Engine < ::Rails::Engine
      # Register meta tags after all initializers have run (so both
      # FujiAdmin.configure and ActiveAdmin.setup have populated their state)
      # and AA's namespaces are available to iterate.
      config.after_initialize do
        require "fuji_admin/active_admin_patch"
        FujiAdmin.install_meta_tags!
      end
    end
  end
end
