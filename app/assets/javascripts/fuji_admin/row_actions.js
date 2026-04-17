// Fuji Admin — row-action dropdown.
//
// Replaces ActiveAdmin's inline row-action links (View / Edit / Delete / …)
// with a single vertical-ellipsis trigger that opens a menu. Keeps the
// actions column compact regardless of how many actions a resource exposes.
//
// Activated on `table.index_table td.col-actions` when the cell contains
// 2+ links. A single-link cell keeps its outlined-button fallback from
// components/_tables.scss — no dropdown needed.
//
// Idempotent across Turbo navigations.

(function () {
  "use strict";

  function triggerSVG() {
    return (
      '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">' +
      '<circle cx="12" cy="5" r="1.6"></circle>' +
      '<circle cx="12" cy="12" r="1.6"></circle>' +
      '<circle cx="12" cy="19" r="1.6"></circle>' +
      "</svg>"
    );
  }

  function wrapCell(cell) {
    if (cell.dataset.fujiRowActionsWired === "1") return;
    cell.dataset.fujiRowActionsWired = "1";

    var links = cell.querySelectorAll(".table_actions > a, :scope > a");
    if (links.length < 2) return; // keep fallback pill styling

    var wrapper = document.createElement("div");
    wrapper.className = "fuji-row-actions";

    var trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "fuji-row-actions__trigger";
    trigger.setAttribute("aria-label", "Row actions");
    trigger.setAttribute("aria-haspopup", "menu");
    trigger.setAttribute("aria-expanded", "false");
    trigger.innerHTML = triggerSVG();

    var menu = document.createElement("div");
    menu.className = "fuji-row-actions__menu";
    menu.setAttribute("role", "menu");
    menu.hidden = true;

    Array.from(links).forEach(function (link) {
      link.classList.add("fuji-row-actions__item");
      link.setAttribute("role", "menuitem");
      if (
        link.classList.contains("delete_link") ||
        link.getAttribute("data-method") === "delete"
      ) {
        link.classList.add("fuji-row-actions__item--danger");
      }
      menu.appendChild(link);
    });

    // Clear the original actions container.
    cell.innerHTML = "";
    wrapper.appendChild(trigger);
    wrapper.appendChild(menu);
    cell.appendChild(wrapper);

    trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      var wasOpen = !menu.hidden;
      closeAll();
      if (!wasOpen) openMenu(trigger, menu);
    });
  }

  function openMenu(trigger, menu) {
    menu.hidden = false;
    trigger.setAttribute("aria-expanded", "true");

    // Position the (fixed) menu just below the trigger, right-aligned to it.
    var rect = trigger.getBoundingClientRect();
    menu.style.top = (rect.bottom + 4) + "px";
    menu.style.right = (window.innerWidth - rect.right) + "px";
    menu.style.left = "auto";
  }

  function closeAll() {
    document.querySelectorAll(".fuji-row-actions__menu").forEach(function (m) {
      m.hidden = true;
      m.style.top = "";
      m.style.right = "";
      m.style.left = "";
    });
    document.querySelectorAll(".fuji-row-actions__trigger").forEach(function (t) {
      t.setAttribute("aria-expanded", "false");
    });
  }

  function onDocumentClick(e) {
    if (e.target.closest(".fuji-row-actions")) return;
    closeAll();
  }

  function onKey(e) {
    if (e.key === "Escape") closeAll();
  }

  function bind() {
    document
      .querySelectorAll("table.index_table td.col-actions")
      .forEach(wrapCell);
  }

  document.addEventListener("DOMContentLoaded", function () {
    bind();
    document.addEventListener("click", onDocumentClick);
    document.addEventListener("keydown", onKey);
    // Fixed-positioned menu doesn't move with the page, so close on scroll/resize.
    window.addEventListener("scroll", closeAll, true);
    window.addEventListener("resize", closeAll);
  });
  document.addEventListener("turbo:load", bind);
  document.addEventListener("turbolinks:load", bind);
})();
