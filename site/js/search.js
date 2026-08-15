/**
 * Recherche dans le guide — index statique search-index.json
 */
(function () {
  "use strict";

  function inSite() {
    return /\/site(\/|$)/.test(location.pathname) || /site\/[^/]+\.html$/.test(location.pathname);
  }

  function prefix() {
    return inSite() ? "" : "site/";
  }

  function boot() {
    var host = document.querySelector(".header-controls");
    if (!host) return;
    var box = document.createElement("div");
    box.className = "site-search";
    box.innerHTML = "<input type=\"search\" id=\"site-q\" autocomplete=\"off\" placeholder=\"FAT, HIMEM…\">" +
      "<div class=\"site-search-hits\" id=\"site-hits\" hidden></div>";
    host.insertBefore(box, host.firstChild);
    var input = box.querySelector("input");
    var hitsEl = box.querySelector("#site-hits");
    var data = [];
    var on = -1;

    fetch(prefix() + "js/search-index.json").then(function (r) { return r.json(); }).then(function (d) {
      data = d;
    }).catch(function () { /* */ });

    function close() {
      hitsEl.classList.remove("is-open");
      hitsEl.hidden = true;
      on = -1;
    }

    function render(list) {
      hitsEl.innerHTML = "";
      if (!list.length) {
        close();
        return;
      }
      list.slice(0, 8).forEach(function (it, i) {
        var a = document.createElement("a");
        a.href = prefix() + it.f;
        a.className = i === 0 ? "is-on" : "";
        a.innerHTML = "<strong></strong><small></small>";
        a.querySelector("strong").textContent = it.t;
        a.querySelector("small").textContent = it.s.slice(0, 140);
        hitsEl.appendChild(a);
      });
      hitsEl.hidden = false;
      hitsEl.classList.add("is-open");
      on = 0;
    }

    function filter(q) {
      q = q.trim().toLowerCase();
      if (q.length < 2) { close(); return; }
      var words = q.split(/\s+/);
      render(data.filter(function (it) {
        var hay = (it.t + " " + it.s + " " + it.f).toLowerCase();
        return words.every(function (w) { return hay.indexOf(w) !== -1; });
      }));
    }

    input.addEventListener("input", function () { filter(input.value); });
    input.addEventListener("keydown", function (ev) {
      var links = hitsEl.querySelectorAll("a");
      if (ev.key === "Escape") { close(); input.blur(); return; }
      if (ev.key === "ArrowDown" && links.length) {
        ev.preventDefault();
        on = (on + 1) % links.length;
      } else if (ev.key === "ArrowUp" && links.length) {
        ev.preventDefault();
        on = (on - 1 + links.length) % links.length;
      } else if (ev.key === "Enter" && links[on]) {
        ev.preventDefault();
        location.href = links[on].href;
        return;
      } else {
        return;
      }
      links.forEach(function (a, i) { a.classList.toggle("is-on", i === on); });
    });
    document.addEventListener("click", function (ev) {
      if (!box.contains(ev.target)) close();
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
