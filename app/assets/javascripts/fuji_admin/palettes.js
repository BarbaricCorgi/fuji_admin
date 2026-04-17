// Fuji Admin — live palette switcher.
//
// Injects a floating trigger (bottom-right) that opens a grid of 30 Coolors-
// trending palettes. Clicking one sets `--fuji-primary` on <html>, persists
// the choice in localStorage, and updates primary-coloured components via the
// overrides in components/_palette_switcher.scss.
//
// Hidden on `body.logged_out` (login / password-reset pages, which run
// host-supplied themed templates that shouldn't be repainted).

(function () {
  "use strict";

  var STORAGE_KEY = "fuji-palette-id";

  // --- Palettes (curated from coolors.co/palettes/trending) -----------------
  var PALETTES = [
    { id: "fuji-default",    name: "Fuji Default",    primary: "#41549b", swatch: ["#f2f5fc","#b2bce0","#41549b","#2a3664","#1f2849"] },
    { id: "navy-amber",      name: "Navy & Amber",    primary: "#219ebc", swatch: ["#8ecae6","#219ebc","#023047","#ffb703","#fb8500"] },
    { id: "warm-sunset",     name: "Warm Sunset",     primary: "#e76f51", swatch: ["#264653","#2a9d8f","#e9c46a","#f4a261","#e76f51"] },
    { id: "forest-meadow",   name: "Forest Meadow",   primary: "#4f772d", swatch: ["#132a13","#31572c","#4f772d","#90a955","#ecf39e"] },
    { id: "dusty-rose",      name: "Dusty Rose",      primary: "#da627d", swatch: ["#f9dbbd","#ffa5ab","#da627d","#a53860","#450920"] },
    { id: "ocean-blue",      name: "Ocean Blue",      primary: "#0077b6", swatch: ["#03045e","#023e8a","#0077b6","#00b4d8","#48cae4"] },
    { id: "terracotta",      name: "Terracotta",      primary: "#e07a5f", swatch: ["#f4f1de","#e07a5f","#3d405b","#81b29a","#f2cc8f"] },
    { id: "coastal-sage",    name: "Coastal Sage",    primary: "#588157", swatch: ["#dad7cd","#a3b18a","#588157","#3a5a40","#344e41"],
      theme: { surface: "#dad7cd", surfaceAlt: "#c2beb1", text: "#344e41", textMuted: "#a3b18a", border: "#b1ac9d" } },
    { id: "royal-purple",    name: "Royal Purple",    primary: "#7b2cbf", swatch: ["#3c096c","#5a189a","#7b2cbf","#9d4edd","#c77dff"] },
    { id: "editorial-navy",  name: "Editorial Navy",  primary: "#415a77", swatch: ["#0d1b2a","#1b263b","#415a77","#778da9","#e0e1dd"],
      theme: { surface: "#e0e1dd", surfaceAlt: "#d0d1cb", text: "#0d1b2a", textMuted: "#778da9", border: "#bcc0b9" } },
    { id: "cheerful",        name: "Cheerful",        primary: "#118ab2", swatch: ["#ef476f","#ffd166","#06d6a0","#118ab2","#073b4c"] },
    { id: "crimson-spice",   name: "Crimson Spice",   primary: "#d62828", swatch: ["#003049","#d62828","#f77f00","#fcbf49","#eae2b7"] },
    { id: "mint-ocean",      name: "Mint Ocean",      primary: "#168aad", swatch: ["#99d98c","#52b69a","#34a0a4","#168aad","#1e6091"] },
    { id: "burgundy-gold",   name: "Burgundy & Gold", primary: "#9e2a2b", swatch: ["#335c67","#fff3b0","#e09f3e","#9e2a2b","#540b0e"],
      theme: { surface: "#fff3b0", surfaceAlt: "#f5e58c", text: "#540b0e", textMuted: "#335c67", border: "#e8d47a" } },
    { id: "scarlet",         name: "Scarlet",         primary: "#ba181b", swatch: ["#0b090a","#660708","#a4161a","#ba181b","#e5383b"] },
    { id: "teal-warmth",     name: "Teal Warmth",     primary: "#2a9d8f", swatch: ["#264653","#2a9d8f","#e9c46a","#f4a261","#e76f51"] },
    { id: "deep-cyan",       name: "Deep Cyan",       primary: "#005f73", swatch: ["#001219","#005f73","#0a9396","#94d2bd","#e9d8a6"],
      theme: { surface: "#e9d8a6", surfaceAlt: "#d6c58b", text: "#001219", textMuted: "#0a9396", border: "#c9b77e" } },
    { id: "tropical",        name: "Tropical",        primary: "#0081a7", swatch: ["#0081a7","#00afb5","#fdfcdc","#fed9b7","#f07167"],
      theme: { surface: "#fdfcdc", surfaceAlt: "#f3f0c0", text: "#003844", textMuted: "#00afb5", border: "#e6e3b5" } },
    { id: "spice-road",      name: "Spice Road",      primary: "#fb8b24", swatch: ["#5f0f40","#9a031e","#fb8b24","#e36414","#0f4c5c"] },
    { id: "sunset-gradient", name: "Sunset Gradient", primary: "#f3722c", swatch: ["#f94144","#f8961e","#f9c74f","#43aa8b","#277da1"] },
    { id: "coral-reef",      name: "Coral Reef",      primary: "#006d77", swatch: ["#006d77","#83c5be","#edf6f9","#ffddd2","#e29578"] },
    { id: "electric",        name: "Electric",        primary: "#ff006e", swatch: ["#ffbe0b","#fb5607","#ff006e","#8338ec","#3a86ff"] },
    { id: "muted-taupe",     name: "Muted Taupe",     primary: "#4a4e69", swatch: ["#22223b","#4a4e69","#9a8c98","#c9ada7","#f2e9e4"],
      theme: { surface: "#f2e9e4", surfaceAlt: "#e0d6d0", text: "#22223b", textMuted: "#9a8c98", border: "#d2c4c0" } },
    { id: "warm-lilac",      name: "Warm Lilac",      primary: "#9d4edd", swatch: ["#240046","#5a189a","#7b2cbf","#9d4edd","#e0aaff"] },
    { id: "rose-garden",     name: "Rose Garden",     primary: "#dd2d4a", swatch: ["#880d1e","#dd2d4a","#f26a8d","#f49cbb","#cbeef3"] },
    { id: "forest-deep",     name: "Forest Deep",     primary: "#3a5a40", swatch: ["#dad7cd","#a3b18a","#588157","#3a5a40","#344e41"] },
    { id: "pink-sunset",     name: "Pink Sunset",     primary: "#fb6f92", swatch: ["#ffe5ec","#ffc2d1","#ffb3c6","#ff8fab","#fb6f92"] },
    { id: "twilight-purple", name: "Twilight Purple", primary: "#5a189a", swatch: ["#10002b","#240046","#3c096c","#5a189a","#7b2cbf"] },
    { id: "olive-gold",      name: "Olive & Gold",    primary: "#bc6c25", swatch: ["#606c38","#283618","#fefae0","#dda15e","#bc6c25"],
      theme: { surface: "#fefae0", surfaceAlt: "#f0ebc5", text: "#283618", textMuted: "#606c38", border: "#ded9a8" } },
    { id: "sage-terracotta", name: "Sage & Terracotta", primary: "#e07a5f", swatch: ["#f4f1de","#e07a5f","#3d405b","#81b29a","#f2cc8f"],
      theme: { surface: "#f4f1de", surfaceAlt: "#e7e2c6", text: "#3d405b", textMuted: "#81b29a", border: "#ddd8bc" } },
    { id: "indigo-glow",     name: "Indigo Glow",     primary: "#3a86ff", swatch: ["#8338ec","#3a86ff","#06d6a0","#ffbe0b","#fb5607"] },
  ];

  // --- Apply & persist ------------------------------------------------------

  function hexToRgb(hex) {
    hex = hex.replace("#", "");
    if (hex.length === 3) hex = hex.split("").map(function (c) { return c + c; }).join("");
    var n = parseInt(hex, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  var THEME_VARS = [
    "--fuji-surface",
    "--fuji-surface-alt",
    "--fuji-text",
    "--fuji-text-muted",
    "--fuji-border",
  ];

  function apply(palette) {
    var rgb = hexToRgb(palette.primary);
    var root = document.documentElement;
    root.style.setProperty("--fuji-primary", palette.primary);
    root.style.setProperty("--fuji-primary-rgb", rgb[0] + ", " + rgb[1] + ", " + rgb[2]);
    document.body.setAttribute("data-fuji-palette", palette.id);

    if (palette.theme) {
      root.style.setProperty("--fuji-surface",     palette.theme.surface);
      root.style.setProperty("--fuji-surface-alt", palette.theme.surfaceAlt);
      root.style.setProperty("--fuji-text",        palette.theme.text);
      root.style.setProperty("--fuji-text-muted",  palette.theme.textMuted);
      root.style.setProperty("--fuji-border",      palette.theme.border);
      document.body.setAttribute("data-fuji-theme", "on");
    } else {
      THEME_VARS.forEach(function (v) { root.style.removeProperty(v); });
      document.body.removeAttribute("data-fuji-theme");
    }
  }

  function save(id) {
    try { localStorage.setItem(STORAGE_KEY, id); } catch (e) {}
  }

  function load() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function getPalette(id) {
    for (var i = 0; i < PALETTES.length; i++) if (PALETTES[i].id === id) return PALETTES[i];
    return PALETTES[0];
  }

  // --- UI ------------------------------------------------------------------

  function buildUI() {
    if (document.querySelector(".fuji-palette-switcher")) return;

    var wrapper = document.createElement("div");
    wrapper.className = "fuji-palette-switcher";

    var trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "fuji-palette-switcher__trigger";
    trigger.setAttribute("aria-label", "Try a colour palette");
    trigger.innerHTML =
      '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle>' +
      '<circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle>' +
      '<circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle>' +
      '<circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle>' +
      '<path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.79 0 1.5-.71 1.5-1.5 0-.39-.15-.74-.39-1-.23-.27-.38-.62-.38-1 0-.79.71-1.5 1.5-1.5H16c3.31 0 6-2.69 6-6 0-5.5-4.5-10-10-10z"></path>' +
      "</svg>";

    var panel = document.createElement("div");
    panel.className = "fuji-palette-switcher__panel";
    panel.hidden = true;

    var header = document.createElement("div");
    header.className = "fuji-palette-switcher__header";
    header.innerHTML = '<span class="fuji-palette-switcher__title">Palettes</span>';
    panel.appendChild(header);

    var grid = document.createElement("div");
    grid.className = "fuji-palette-switcher__grid";

    PALETTES.forEach(function (p) {
      var item = document.createElement("button");
      item.type = "button";
      item.className = "fuji-palette-switcher__item";
      item.setAttribute("data-palette-id", p.id);
      item.setAttribute("title", p.name);
      if (p.theme) item.classList.add("fuji-palette-switcher__item--themed");

      var swatches = document.createElement("span");
      swatches.className = "fuji-palette-switcher__swatches";
      p.swatch.forEach(function (color) {
        var bar = document.createElement("span");
        bar.className = "fuji-palette-switcher__bar";
        bar.style.background = color;
        swatches.appendChild(bar);
      });
      item.appendChild(swatches);

      var label = document.createElement("span");
      label.className = "fuji-palette-switcher__label";
      label.textContent = p.name;
      if (p.theme) {
        var badge = document.createElement("span");
        badge.className = "fuji-palette-switcher__badge";
        badge.title = "Full theme (surfaces + text repaint)";
        badge.textContent = "◐";
        label.appendChild(badge);
      }
      item.appendChild(label);

      item.addEventListener("click", function (e) {
        e.stopPropagation();
        apply(p);
        save(p.id);
        markActive(p.id);
      });

      grid.appendChild(item);
    });

    panel.appendChild(grid);

    trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      panel.hidden = !panel.hidden;
    });

    document.addEventListener("click", function (e) {
      if (!wrapper.contains(e.target)) panel.hidden = true;
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") panel.hidden = true;
    });

    wrapper.appendChild(trigger);
    wrapper.appendChild(panel);
    document.body.appendChild(wrapper);
  }

  function markActive(id) {
    document.querySelectorAll(".fuji-palette-switcher__item").forEach(function (el) {
      el.classList.toggle(
        "fuji-palette-switcher__item--active",
        el.getAttribute("data-palette-id") === id
      );
    });
  }

  function readMeta(name) {
    var el = document.querySelector('meta[name="' + name + '"]');
    return el ? el.getAttribute("content") : null;
  }

  function init() {
    // Config comes from <meta> tags injected by fuji_admin/active_admin_patch.rb
    // (Rails initializer → FujiAdmin.configure). Fallbacks apply when the host
    // app hasn't wired the gem yet.
    var pickerEnabled = readMeta("fuji-palette-picker") === "true";
    var defaultId     = readMeta("fuji-default-palette") || "forest-meadow";

    var stored = pickerEnabled ? load() : null;
    var palette = getPalette(stored || defaultId);
    apply(palette);

    if (document.body.classList.contains("logged_out")) return;
    if (!pickerEnabled) return;

    buildUI();
    markActive(palette.id);
  }

  document.addEventListener("DOMContentLoaded", init);
  document.addEventListener("turbo:load", init);
  document.addEventListener("turbolinks:load", init);
})();
