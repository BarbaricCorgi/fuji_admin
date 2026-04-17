// Fuji Admin — menu interactions.
//
// Responsibilities:
//   * Inject a hamburger toggle into the header when one isn't present.
//   * Toggle the mobile drawer (adds .tabs_open to #tabs and
//     .fuji-menu-open to <body> so we can style a backdrop).
//   * Close the drawer on outside click, ESC, or nav link click.
//   * Toggle ActiveAdmin nested menu items (li.has_nested).
//
// Idempotent — safe to re-run on turbo:load.

(function () {
  "use strict";

  var MENU_OPEN_CLASS = "tabs_open";
  var BODY_OPEN_CLASS = "fuji-menu-open";

  function header() {
    return document.querySelector("#header, .header");
  }

  function menu() {
    return document.querySelector("#tabs");
  }

  function toggle() {
    return document.querySelector(".fuji-menu-toggle");
  }

  function closeMenu() {
    var m = menu();
    if (m) m.classList.remove(MENU_OPEN_CLASS);
    document.body.classList.remove(BODY_OPEN_CLASS);
  }

  function openMenu() {
    var m = menu();
    if (m) m.classList.add(MENU_OPEN_CLASS);
    document.body.classList.add(BODY_OPEN_CLASS);
  }

  function ensureToggle() {
    var h = header();
    if (!h || toggle()) return;

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "fuji-menu-toggle";
    btn.setAttribute("aria-label", "Toggle navigation menu");
    btn.innerHTML =
      '<span class="fuji-menu-toggle__bar"></span>' +
      '<span class="fuji-menu-toggle__bar"></span>' +
      '<span class="fuji-menu-toggle__bar"></span>';
    h.insertBefore(btn, h.firstChild);
  }

  function onToggleClick(e) {
    e.stopPropagation();
    var m = menu();
    if (!m) return;
    if (m.classList.contains(MENU_OPEN_CLASS)) closeMenu();
    else openMenu();
  }

  function onDocumentClick(e) {
    var m = menu();
    if (!m || !m.classList.contains(MENU_OPEN_CLASS)) return;
    if (m.contains(e.target)) return;
    var t = toggle();
    if (t && t.contains(e.target)) return;
    closeMenu();
  }

  function onKey(e) {
    if (e.key === "Escape") closeMenu();
  }

  function onNestedClick(e) {
    // `this` is the <a>; the expandable wrapper is its parent <li>.
    var li = this.parentElement;
    if (!li || !li.classList.contains("has_nested")) return;
    e.preventDefault();   // parent anchors are `href="#"` in AA
    e.stopPropagation();  // don't let onDocumentClick close the drawer
    li.classList.toggle("open");
  }

  function bind() {
    ensureToggle();

    var t = toggle();
    if (t) {
      t.removeEventListener("click", onToggleClick);
      t.addEventListener("click", onToggleClick);
    }

    document.removeEventListener("click", onDocumentClick);
    document.addEventListener("click", onDocumentClick);

    document.removeEventListener("keydown", onKey);
    document.addEventListener("keydown", onKey);

    var nested = document.querySelectorAll("#tabs li.has_nested > a");
    nested.forEach(function (a) {
      a.removeEventListener("click", onNestedClick);
      a.addEventListener("click", onNestedClick);
    });
  }

  document.addEventListener("DOMContentLoaded", bind);
  document.addEventListener("turbo:load", bind);
  document.addEventListener("turbolinks:load", bind);
})();
