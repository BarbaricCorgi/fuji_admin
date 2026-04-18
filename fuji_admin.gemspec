# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'fuji_admin/version'

Gem::Specification.new do |s|
  s.name        = 'fuji_admin'
  s.version     = FujiAdmin::VERSION
  s.summary     = 'A modern, responsive ActiveAdmin theme with a live palette switcher'
  s.description = <<~DESC
    Fuji Admin is a drop-in theme for ActiveAdmin that upgrades every default
    surface — tables, forms, filters, panels, pagination, scopes, batch
    actions — into a cohesive, modern design system without requiring any
    changes to your app/admin files. Ships with a card-based responsive
    layout, slide-in filter drawer with active-filter chips, animated
    floating labels on text inputs and textareas, row-action dropdowns, and
    a runtime palette switcher with 30 built-in palettes (8 curated full
    themes) that repaint surfaces, text, borders, and primary accents live.
    Mobile posture is first-class: panels flatten into sections, index
    tables get compact padding with opt-in column wrapping, and wide tables
    scroll horizontally. Every design token (color, shadow, radius, space,
    font) is an overridable SCSS variable so brands can customize without
    forking.
  DESC
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

  s.add_dependency 'activeadmin', '>= 3.0'
end
