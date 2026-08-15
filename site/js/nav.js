/**
 * Nav courte + panneau Sagas + précédent / suivant
 */
(function () {
  "use strict";

  var SAGAS = [
    {
      fr: "1 · Du courant à l’invite",
      en: "1 · From power-on to the prompt",
      items: [
        { href: "boot.html", fr: "Amorçage", en: "Boot" },
        { href: "config.html", fr: "CONFIG.SYS", en: "CONFIG.SYS" },
        { href: "himem.html", fr: "HIMEM", en: "HIMEM" },
        { href: "command.html", fr: "COMMAND", en: "COMMAND" }
      ]
    },
    {
      fr: "2 · Noyau au quotidien",
      en: "2 · Everyday kernel",
      items: [
        { href: "fat.html", fr: "FAT", en: "FAT" },
        { href: "fichiers.html", fr: "Fichiers ouverts", en: "Open files" },
        { href: "memoire.html", fr: "Mémoire", en: "Memory" },
        { href: "int21.html", fr: "INT 21h", en: "INT 21h" },
        { href: "exec.html", fr: "EXEC · PSP", en: "EXEC · PSP" }
      ]
    },
    {
      fr: "3 · Outils disque",
      en: "3 · Disk tools",
      items: [
        { href: "fdisk.html", fr: "FDISK", en: "FDISK" },
        { href: "format.html", fr: "FORMAT", en: "FORMAT" },
        { href: "chkdsk.html", fr: "CHKDSK", en: "CHKDSK" },
        { href: "diskcopy.html", fr: "DISKCOPY", en: "DISKCOPY" }
      ]
    },
    {
      fr: "4 · Autour du noyau",
      en: "4 · Around the kernel",
      items: [
        { href: "emm386.html", fr: "EMM386", en: "EMM386" },
        { href: "smartdrv.html", fr: "SMARTDRV", en: "SMARTDRV" },
        { href: "dblspace.html", fr: "DoubleSpace", en: "DoubleSpace" },
        { href: "int13.html", fr: "INT 13h", en: "INT 13h" }
      ]
    },
    {
      fr: "5 · Services",
      en: "5 · Services",
      items: [
        { href: "int24.html", fr: "INT 24h", en: "INT 24h" },
        { href: "ioctl.html", fr: "IOCTL", en: "IOCTL" },
        { href: "mode.html", fr: "MODE", en: "MODE" },
        { href: "share.html", fr: "SHARE", en: "SHARE" },
        { href: "print.html", fr: "PRINT", en: "PRINT" },
        { href: "nls.html", fr: "NLS", en: "NLS" },
        { href: "setver.html", fr: "SETVER", en: "SETVER" }
      ]
    },
    {
      fr: "6 · Utilitaires",
      en: "6 · Utilities",
      items: [
        { href: "ansi.html", fr: "ANSI.SYS", en: "ANSI.SYS" },
        { href: "ramdrive.html", fr: "RAMDRIVE", en: "RAMDRIVE" },
        { href: "power.html", fr: "POWER", en: "POWER" },
        { href: "fastopen.html", fr: "FASTOPEN", en: "FASTOPEN" },
        { href: "recover.html", fr: "RECOVER", en: "RECOVER" },
        { href: "debug.html", fr: "DEBUG", en: "DEBUG" },
        { href: "mem.html", fr: "MEM", en: "MEM" },
        { href: "interlnk.html", fr: "Interlnk", en: "Interlnk" },
        { href: "chemins.html", fr: "SUBST · JOIN", en: "SUBST · JOIN" },
        { href: "dosshell.html", fr: "DOSSHELL", en: "DOSSHELL" }
      ]
    },
    {
      fr: "7 · La boîte cmd/",
      en: "7 · The cmd/ box",
      items: [
        { href: "xcopy.html", fr: "XCOPY", en: "XCOPY" },
        { href: "backup.html", fr: "BACKUP", en: "BACKUP" },
        { href: "filtres.html", fr: "Filtres", en: "Filters" },
        { href: "doskey.html", fr: "DOSKEY", en: "DOSKEY" },
        { href: "edlin.html", fr: "EDLIN", en: "EDLIN" },
        { href: "attrib.html", fr: "ATTRIB", en: "ATTRIB" },
        { href: "graph.html", fr: "GRAPHICS", en: "GRAPHICS" },
        { href: "aide.html", fr: "HELP · CHOICE", en: "HELP · CHOICE" },
        { href: "loadfix.html", fr: "LOADFIX", en: "LOADFIX" },
        { href: "restes.html", fr: "ADDDRV · MIRROR", en: "ADDDRV · MIRROR" }
      ]
    },
    {
      fr: "8 · QBasic",
      en: "8 · QBasic",
      items: [
        { href: "qbasic.html", fr: "QBasic", en: "QBasic" },
        { href: "qbedit.html", fr: "EDIT · HELP", en: "EDIT · HELP" },
        { href: "qbrt.html", fr: "BQB50 · COW", en: "BQB50 · COW" }
      ]
    }
  ];

  function inSite() {
    return /\/site(\/|$)/.test(location.pathname) || /site\/[^/]+\.html$/.test(location.pathname);
  }

  function prefix() {
    return inSite() ? "" : "site/";
  }

  function pageName() {
    var p = location.pathname.split("/").pop() || "index.html";
    return p === "" ? "index.html" : p;
  }

  function lang() {
    return document.documentElement.lang === "en" ? "en" : "fr";
  }

  function flat() {
    var out = [];
    SAGAS.forEach(function (s) {
      s.items.forEach(function (it) { out.push(it); });
    });
    return out;
  }

  function currentIndex() {
    var name = pageName();
    var list = flat();
    for (var i = 0; i < list.length; i++) {
      if (list[i].href === name) return i;
    }
    return -1;
  }

  function el(tag, cls) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    return n;
  }

  function spanLang(fr, en) {
    var wrap = document.createDocumentFragment();
    var a = el("span");
    a.setAttribute("data-lang", "fr");
    a.textContent = fr;
    var b = el("span");
    b.setAttribute("data-lang", "en");
    b.textContent = en;
    wrap.appendChild(a);
    wrap.appendChild(b);
    return wrap;
  }

  function buildBar(nav) {
    var pre = prefix();
    var here = pageName();
    nav.setAttribute("aria-label", "Principal");
    nav.innerHTML = "";

    var home = el("a");
    home.href = pre + "index.html";
    if (here === "index.html") home.setAttribute("aria-current", "page");
    home.appendChild(spanLang("Accueil", "Home"));
    nav.appendChild(home);

    var src = el("a");
    src.href = pre + "source.html";
    if (here === "source.html") src.setAttribute("aria-current", "page");
    src.appendChild(spanLang("Sources", "Sources"));
    nav.appendChild(src);

    var btn = el("button", "nav-toggle");
    btn.type = "button";
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-controls", "nav-panel");
    btn.appendChild(spanLang("Sagas", "Sagas"));
    nav.appendChild(btn);

    var panel = el("div", "nav-panel");
    panel.id = "nav-panel";
    panel.hidden = true;

    SAGAS.forEach(function (saga) {
      var sec = el("section");
      var h = el("h3");
      h.appendChild(spanLang(saga.fr, saga.en));
      sec.appendChild(h);
      var ul = el("ul");
      saga.items.forEach(function (it) {
        var li = el("li");
        var a = el("a");
        a.href = pre + it.href;
        if (it.href === here) a.setAttribute("aria-current", "page");
        a.appendChild(spanLang(it.fr, it.en));
        li.appendChild(a);
        ul.appendChild(li);
      });
      sec.appendChild(ul);
      panel.appendChild(sec);
    });

    var backdrop = el("div", "nav-backdrop");
    backdrop.hidden = true;

    function close() {
      btn.setAttribute("aria-expanded", "false");
      panel.hidden = true;
      backdrop.hidden = true;
      document.body.classList.remove("nav-open");
    }

    function open() {
      btn.setAttribute("aria-expanded", "true");
      panel.hidden = false;
      backdrop.hidden = false;
      document.body.classList.add("nav-open");
    }

    btn.addEventListener("click", function (ev) {
      ev.stopPropagation();
      if (panel.hidden) open();
      else close();
    });
    backdrop.addEventListener("click", close);
    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape") close();
    });

    var header = nav.closest(".site-header") || document.body;
    header.appendChild(backdrop);
    header.appendChild(panel);
  }

  function buildPager() {
    if (pageName() === "index.html" || pageName() === "source.html") return;
    var list = flat();
    var i = currentIndex();
    if (i < 0) return;
    var pre = prefix();
    var L = lang();
    var nav = el("nav", "article-nav");
    nav.setAttribute("aria-label", L === "en" ? "Article" : "Article");

    if (i > 0) {
      var prev = el("a", "article-nav__prev");
      prev.href = pre + list[i - 1].href;
      prev.innerHTML = "<span></span><strong></strong>";
      prev.querySelector("span").appendChild(spanLang("Précédent", "Previous"));
      prev.querySelector("strong").textContent = list[i - 1][L];
      nav.appendChild(prev);
    } else {
      nav.appendChild(el("span"));
    }

    if (i < list.length - 1) {
      var next = el("a", "article-nav__next");
      next.href = pre + list[i + 1].href;
      next.innerHTML = "<span></span><strong></strong>";
      next.querySelector("span").appendChild(spanLang("Suivant", "Next"));
      next.querySelector("strong").textContent = list[i + 1][L];
      nav.appendChild(next);
    }

    var foot = document.querySelector(".site-footer");
    if (foot) foot.parentNode.insertBefore(nav, foot);
    else document.body.appendChild(nav);
  }

  function syncHeaderH() {
    var h = document.querySelector(".site-header");
    if (h) {
      document.documentElement.style.setProperty("--header-h", h.offsetHeight + "px");
    }
  }

  function boot() {
    var nav = document.querySelector("header .nav");
    if (nav) buildBar(nav);
    buildPager();
    syncHeaderH();
    window.addEventListener("resize", syncHeaderH);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
