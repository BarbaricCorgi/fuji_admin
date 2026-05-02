require "fuji_admin/version"
require "fuji_admin/configuration"
require "fuji_admin/meta_tags"

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
      # Subscribe to AA's namespace-creation notification so each namespace
      # picks up our meta tags the moment it's born. Safe to register at
      # `after_initialize` — the subscription fires later, when namespaces
      # actually load (lazily, on first request).
      config.after_initialize do
        FujiAdmin.install_meta_tags!
      end
    end
  end
end
