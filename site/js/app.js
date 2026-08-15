/**
 * Comprendre MS-DOS 6 — comportement partagé
 *
 * Langue : html.lang + classe lang-fr | lang-en, nœuds [data-lang]
 * Niveau : html[data-level], blocs .level-block[data-level]
 *
 * Préférences conservées dans localStorage (msdos-lang, msdos-level).
 */
(function () {
  "use strict";

  var LANG_KEY = "msdos-lang";
  var LEVEL_KEY = "msdos-level";
  var LANGS = { fr: true, en: true };
  var LEVELS = { discovery: true, intermediate: true, technical: true, all: true };

  function stored(key, fallback) {
    try {
      return localStorage.getItem(key) || fallback;
    } catch (e) {
      return fallback;
    }
  }

  function persist(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) { /* navigation privée */ }
  }

  function setPressed(group, value) {
    document.querySelectorAll('[data-set="' + group + '"]').forEach(function (btn) {
      btn.setAttribute("aria-pressed", btn.getAttribute("data-value") === value ? "true" : "false");
    });
  }

  function applyLang(lang) {
    if (!LANGS[lang]) lang = "fr";
    document.documentElement.lang = lang;
    document.documentElement.classList.remove("lang-fr", "lang-en");
    document.documentElement.classList.add("lang-" + lang);
    persist(LANG_KEY, lang);
    setPressed("lang", lang);
    try {
      document.dispatchEvent(new CustomEvent("msdos-lang", { detail: lang }));
    } catch (e) { /* IE oublié */ }
  }

  function applyLevel(level) {
    if (!LEVELS[level]) level = "discovery";
    document.documentElement.setAttribute("data-level", level);
    persist(LEVEL_KEY, level);
    setPressed("level", level);

    document.querySelectorAll(".level-block").forEach(function (el) {
      var lv = el.getAttribute("data-level");
      if (level === "all") {
        el.open = true;
      } else {
        el.open = lv === level;
      }
    });
  }

  function initialLang() {
    var saved = stored(LANG_KEY, "");
    if (LANGS[saved]) return saved;
    var nav = (navigator.language || "fr").toLowerCase();
    return nav.indexOf("en") === 0 ? "en" : "fr";
  }

  applyLang(initialLang());
  applyLevel(stored(LEVEL_KEY, "discovery"));

  (function loadGlossary() {
    var here = document.querySelector('script[src*="app.js"]');
    var src = here && here.getAttribute("src");
    if (!src) return;
    var s = document.createElement("script");
    s.src = src.replace(/app\.js(\?.*)?$/, "glossary.js");
    document.head.appendChild(s);
    var s2 = document.createElement("script");
    s2.src = src.replace(/app\.js(\?.*)?$/, "source-links.js");
    document.head.appendChild(s2);
    var s3 = document.createElement("script");
    s3.src = src.replace(/app\.js(\?.*)?$/, "search.js");
    document.head.appendChild(s3);
    var s4 = document.createElement("script");
    s4.src = src.replace(/app\.js(\?.*)?$/, "nav.js");
    document.head.appendChild(s4);
  })();

  document.addEventListener("click", function (ev) {
    var btn = ev.target.closest("[data-set]");
    if (!btn) return;
    var group = btn.getAttribute("data-set");
    var value = btn.getAttribute("data-value");
    if (group === "lang") applyLang(value);
    if (group === "level") applyLevel(value);
  });
})();
