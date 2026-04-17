// Fuji Admin — float labels for text-like form inputs.
//
// Scans `fieldset.inputs > ol > li` wrappers with formtastic's type classes
// (.string, .email, .password, .numeric, .url, .tel, .search, .text) and
// adds:
//
//   .fuji-float          — always present when eligible
//   .fuji-float-focused  — when the inner input has focus
//   .fuji-float-filled   — when the inner input has a non-empty value
//
// CSS in components/_float_labels.scss reads these state classes to animate
// the label from inside the input (resting) to sitting on the top border
// (active/filled).
//
// Idempotent — wiring is guarded by a data attribute so turbo re-navigations
// don't stack listeners.

(function () {
  "use strict";

  var SELECTOR = [
    "fieldset.inputs > ol > li.string",
    "fieldset.inputs > ol > li.email",
    "fieldset.inputs > ol > li.password",
    "fieldset.inputs > ol > li.numeric",
    "fieldset.inputs > ol > li.url",
    "fieldset.inputs > ol > li.tel",
    "fieldset.inputs > ol > li.search",
    "fieldset.inputs > ol > li.text",
  ].join(",");

  function fieldOf(li) {
    return li.querySelector(":scope > input, :scope > textarea");
  }

  function labelOf(li) {
    return li.querySelector(":scope > label");
  }

  function sync(li, input) {
    li.classList.toggle("fuji-float-filled", input.value !== "" && input.value != null);
    li.classList.toggle("fuji-float-focused", document.activeElement === input);
  }

  function wire(li) {
    if (li.dataset.fujiFloatWired === "1") return;
    var input = fieldOf(li);
    var label = labelOf(li);
    if (!input || !label) return;

    li.classList.add("fuji-float");
    sync(li, input);

    var handler = function () { sync(li, input); };
    input.addEventListener("focus", handler);
    input.addEventListener("blur", handler);
    input.addEventListener("input", handler);
    input.addEventListener("change", handler);

    li.dataset.fujiFloatWired = "1";
  }

  function bind() {
    // Logged-out pages (login, password reset) usually carry host-supplied
    // custom templates with their own label treatment — leave them alone.
    if (document.body.classList.contains("logged_out")) return;
    document.querySelectorAll(SELECTOR).forEach(wire);
  }

  document.addEventListener("DOMContentLoaded", bind);
  document.addEventListener("turbo:load", bind);
  document.addEventListener("turbolinks:load", bind);
})();
