// Fuji Admin — filters drawer + active-filter chip strip.
//
// On any index page with ActiveAdmin filters (sidebar containing
// `form.filter_form`):
//
//   1. Injects a "Filters" button into #titlebar_right.
//   2. Turns #sidebar into a right drawer, hidden until the button is clicked.
//   3. Parses the current URL's Ransack query params (`q[...]`) and renders
//      a chip strip above the main content, with one-click removal per filter
//      and a "Clear all" link.

(function () {
  "use strict";

  var BODY_OPEN_CLASS = "fuji-filters-open";

  // --- DOM helpers --------------------------------------------------------

  // AA sometimes renders the #sidebar as a child of #active_admin_content
  // (resource index pages) and sometimes as a direct child of #wrapper
  // (custom register_page index pages). Match either.
  function filterForm() {
    return document.querySelector("#sidebar form.filter_form");
  }

  function sidebar() {
    var sb = document.querySelector("#sidebar");
    return sb && sb.querySelector("form.filter_form") ? sb : null;
  }

  function toggleBtn() {
    return document.querySelector(".fuji-filters-toggle");
  }

  // --- Drawer -------------------------------------------------------------

  function ensureToggle() {
    var rightCol = document.querySelector("#title_bar #titlebar_right");
    if (!rightCol || rightCol.querySelector(".fuji-filters-toggle")) return;

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "fuji-filters-toggle";
    btn.setAttribute("aria-label", "Open filters");
    btn.innerHTML =
      '<svg class="fuji-filters-toggle__icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<line x1="4" y1="6" x2="20" y2="6"></line>' +
      '<line x1="7" y1="12" x2="17" y2="12"></line>' +
      '<line x1="10" y1="18" x2="14" y2="18"></line>' +
      "</svg>" +
      "<span>Filters</span>" +
      '<span class="fuji-filters-toggle__count" hidden></span>';
    rightCol.insertBefore(btn, rightCol.firstChild);
  }

  function ensureDrawerHeader() {
    var sb = sidebar();
    if (!sb || sb.querySelector(".fuji-filters-drawer__header")) return;

    var header = document.createElement("div");
    header.className = "fuji-filters-drawer__header";
    header.innerHTML =
      '<h3 class="fuji-filters-drawer__title">Filters</h3>' +
      '<button type="button" class="fuji-filters-drawer__close" aria-label="Close filters">' +
      '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
      '<line x1="6" y1="6" x2="18" y2="18"></line>' +
      '<line x1="18" y1="6" x2="6" y2="18"></line>' +
      "</svg></button>";
    sb.insertBefore(header, sb.firstChild);
  }

  function openDrawer() {
    document.body.classList.add(BODY_OPEN_CLASS);
  }

  function closeDrawer() {
    document.body.classList.remove(BODY_OPEN_CLASS);
  }

  function onToggleClick(e) {
    e.stopPropagation();
    if (document.body.classList.contains(BODY_OPEN_CLASS)) closeDrawer();
    else openDrawer();
  }

  // Track where the mousedown happened so we can distinguish a real
  // outside-click from a text selection whose drag ends on the backdrop.
  // Without this, selecting text inside an input and releasing the mouse
  // over the greyed area fires a click on the backdrop and closes the
  // drawer mid-interaction.
  var mouseDownTarget = null;

  function onDocumentMouseDown(e) {
    mouseDownTarget = e.target;
  }

  function isInside(container, el) {
    return container && el && container.contains(el);
  }

  function onDocumentClick(e) {
    if (!document.body.classList.contains(BODY_OPEN_CLASS)) return;
    var sb = sidebar();
    if (isInside(sb, e.target) || isInside(sb, mouseDownTarget)) return;
    var t = toggleBtn();
    if (isInside(t, e.target) || isInside(t, mouseDownTarget)) return;
    closeDrawer();
  }

  function onKey(e) {
    if (e.key === "Escape") closeDrawer();
  }

  // --- Active filter chips ------------------------------------------------

  // Matchers Ransack commonly uses. Order matters — longer suffixes first so
  // we don't misparse `_not_eq` as `_eq`.
  var MATCHERS = [
    { suffix: "_not_eq",  op: " ≠ "      },
    { suffix: "_not_in",  op: " not in " },
    { suffix: "_gteq",    op: " ≥ "      },
    { suffix: "_lteq",    op: " ≤ "      },
    { suffix: "_gt",      op: " > "      },
    { suffix: "_lt",      op: " < "      },
    { suffix: "_cont",    op: ": "       },
    { suffix: "_start",   op: " starts " },
    { suffix: "_end",     op: " ends "   },
    { suffix: "_in",      op: ": "       },
    { suffix: "_eq",      op: ": "       },
  ];

  function humanize(field) {
    return field
      .replace(/_id$/, "")
      .replace(/_/g, " ")
      .replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }

  function prettyValue(raw) {
    if (raw === "1" || raw === "true")  return "Yes";
    if (raw === "0" || raw === "false") return "No";
    return raw;
  }

  function parseChipKey(key) {
    // Matches `q[field_suffix]` or `q[field_suffix][]`.
    var m = key.match(/^q\[([^\]]+)\](?:\[\])?$/);
    if (!m) return null;
    var inner = m[1];
    for (var i = 0; i < MATCHERS.length; i++) {
      var suffix = MATCHERS[i].suffix;
      if (inner.length > suffix.length && inner.slice(-suffix.length) === suffix) {
        return {
          field: inner.slice(0, -suffix.length),
          op: MATCHERS[i].op,
        };
      }
    }
    return { field: inner, op: ": " };
  }

  function readChips() {
    var params = new URLSearchParams(window.location.search);
    var byKey = {};

    params.forEach(function (value, key) {
      if (!key.startsWith("q[") || value === "") return;
      if (!byKey[key]) byKey[key] = [];
      byKey[key].push(value);
    });

    var chips = [];
    Object.keys(byKey).forEach(function (key) {
      var parsed = parseChipKey(key);
      if (!parsed) return;
      var values = byKey[key].map(prettyValue).join(", ");
      chips.push({
        key: key,
        label: humanize(parsed.field) + parsed.op + values,
      });
    });
    return chips;
  }

  function buildRemoveHref(key) {
    var url = new URL(window.location.href);
    // Remove every entry matching this key (handles [] arrays too).
    var remaining = new URLSearchParams();
    url.searchParams.forEach(function (v, k) {
      if (k !== key) remaining.append(k, v);
    });
    // Drop pagination so removing a filter doesn't land you on page 7 of 2.
    remaining.delete("page");
    url.search = remaining.toString();
    return url.toString();
  }

  function buildClearAllHref() {
    var url = new URL(window.location.href);
    var remaining = new URLSearchParams();
    url.searchParams.forEach(function (v, k) {
      if (!k.startsWith("q[")) remaining.append(k, v);
    });
    remaining.delete("page");
    url.search = remaining.toString();
    return url.toString();
  }

  function escapeHtml(s) {
    var d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function renderChips(chips) {
    var main = document.querySelector("#main_content");
    if (!main) return;

    var existing = main.querySelector(".fuji-filter-chips");
    if (existing) existing.remove();
    if (!chips.length) return;

    var strip = document.createElement("div");
    strip.className = "fuji-filter-chips";

    chips.forEach(function (chip) {
      var pill = document.createElement("a");
      pill.className = "fuji-filter-chips__pill";
      pill.href = buildRemoveHref(chip.key);
      pill.setAttribute("aria-label", "Remove filter: " + chip.label);
      pill.innerHTML =
        '<span class="fuji-filter-chips__label">' + escapeHtml(chip.label) + "</span>" +
        '<span class="fuji-filter-chips__remove" aria-hidden="true">×</span>';
      strip.appendChild(pill);
    });

    if (chips.length > 1) {
      var clear = document.createElement("a");
      clear.className = "fuji-filter-chips__clear";
      clear.href = buildClearAllHref();
      clear.textContent = "Clear all";
      strip.appendChild(clear);
    }

    main.insertBefore(strip, main.firstChild);
  }

  function updateToggleCount(chips) {
    var t = toggleBtn();
    if (!t) return;
    var badge = t.querySelector(".fuji-filters-toggle__count");
    if (!badge) return;
    if (chips.length) {
      badge.textContent = String(chips.length);
      badge.hidden = false;
      t.classList.add("fuji-filters-toggle--active");
    } else {
      badge.hidden = true;
      t.classList.remove("fuji-filters-toggle--active");
    }
  }

  // --- Bind ---------------------------------------------------------------

  function bind() {
    closeDrawer(); // reset state across turbo navigations
    if (!filterForm()) return;

    ensureToggle();
    ensureDrawerHeader();

    var t = toggleBtn();
    if (t) {
      t.removeEventListener("click", onToggleClick);
      t.addEventListener("click", onToggleClick);
    }

    var closeX = document.querySelector(".fuji-filters-drawer__close");
    if (closeX) {
      closeX.removeEventListener("click", closeDrawer);
      closeX.addEventListener("click", closeDrawer);
    }

    document.removeEventListener("mousedown", onDocumentMouseDown);
    document.addEventListener("mousedown", onDocumentMouseDown);
    document.removeEventListener("click", onDocumentClick);
    document.addEventListener("click", onDocumentClick);
    document.removeEventListener("keydown", onKey);
    document.addEventListener("keydown", onKey);

    var chips = readChips();
    renderChips(chips);
    updateToggleCount(chips);
  }

  document.addEventListener("DOMContentLoaded", bind);
  document.addEventListener("turbo:load", bind);
  document.addEventListener("turbolinks:load", bind);
})();
