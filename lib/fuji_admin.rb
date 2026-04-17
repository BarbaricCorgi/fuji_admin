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
      initializer "fuji_admin.active_admin_patch", after: :load_config_initializers do
        require "fuji_admin/active_admin_patch" if defined?(::ActiveAdmin)
      end
    end
  end
end
