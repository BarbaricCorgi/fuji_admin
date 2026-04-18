# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'fuji_admin/version'

Gem::Specification.new do |s|
  s.name        = 'fuji_admin'
  s.version     = FujiAdmin::VERSION
  s.summary     = 'A responsive ActiveAdmin theme'
  s.description = 'A responsive ActiveAdmin theme'
  s.authors     = ['barbariccorgi']
  s.files       = Dir['{app,lib}/**/*'] + ['README.md', 'LICENSE.txt']
  s.homepage    = 'https://github.com/BarbaricCorgi/fuji_admin'
  s.license     = 'MIT'
  s.metadata    = {
    'source_code_uri' => 'https://github.com/BarbaricCorgi/fuji_admin',
    'changelog_uri'   => 'https://github.com/BarbaricCorgi/fuji_admin/releases',
    'bug_tracker_uri' => 'https://github.com/BarbaricCorgi/fuji_admin/issues'
  }
  s.require_paths = ['lib']
  s.required_ruby_version = '>= 3.1.0'

  s.add_dependency 'activeadmin', ['>= 3.0', '< 4.0']
end
