/**
 * Glossaire au survol — les définitions vivent ici, pas dans les articles.
 * Marque les sigles dans #main / footer, affiche #glos-pop.
 */
(function () {
  "use strict";

  var TERMS = {
    HIMEM: {
      fr: "Pilote HIMEM.SYS : mémoire au-delà de 1 Mo (XMS), ligne A20, HMA. Sans lui, DOS=HIGH laisse le noyau en bas.",
      en: "HIMEM.SYS driver: memory past 1 MB (XMS), A20 line, HMA. Without it, DOS=HIGH leaves the kernel low.",
      href: "himem.html"
    },
    SYSINIT: {
      fr: "Dernière phase de l’amorçage, dans IO.SYS : lit CONFIG.SYS et fabrique le DOS, avant COMMAND.COM.",
      en: "Last boot stage, in IO.SYS: reads CONFIG.SYS and builds DOS, before COMMAND.COM.",
      href: "boot.html"
    },
    SFT: {
      fr: "System File Table : table des fichiers ouverts. FILES= fixe sa taille.",
      en: "System File Table: the open-file table. FILES= sets its size.",
      href: "fichiers.html"
    },
    HMA: {
      fr: "High Memory Area : 64 Ko juste au-dessus de 1 Mo, visibles seulement si A20 est allumée.",
      en: "High Memory Area: 64 KB just above 1 MB, visible only when A20 is on.",
      href: "himem.html"
    },
    A20: {
      fr: "20e fil d’adresse. Éteint, le PC boucle à 1 Mo comme un 8086 ; allumé, on voit la HMA.",
      en: "20th address line. Off, the PC wraps at 1 MB like an 8086; on, the HMA appears.",
      href: "himem.html"
    },
    UMB: {
      fr: "Upper Memory Blocks : trous libres entre 640 Ko et 1 Mo, souvent créés par EMM386.",
      en: "Upper Memory Blocks: free holes between 640 KB and 1 MB, often created by EMM386.",
      href: "memoire.html"
    },
    XMS: {
      fr: "eXtended Memory Specification : API au-dessus de 1 Mo, fournie par HIMEM.",
      en: "eXtended Memory Specification: API above 1 MB, provided by HIMEM.",
      href: "himem.html"
    },
    EMS: {
      fr: "Expanded Memory Specification : pages de 16 Ko vues à travers une fenêtre, souvent via EMM386.",
      en: "Expanded Memory Specification: 16 KB pages through a window, often via EMM386.",
      href: "emm386.html"
    },
    CDS: {
      fr: "Current Directory Structure : une entrée par lettre de lecteur (chemin courant, SUBST, JOIN).",
      en: "Current Directory Structure: one entry per drive letter (cwd, SUBST, JOIN).",
      href: "chemins.html"
    },
    PSP: {
      fr: "Program Segment Prefix : 256 octets devant chaque programme (ligne de commande, handles, INT 22/23/24).",
      en: "Program Segment Prefix: 256 bytes in front of every program (command line, handles, INT 22/23/24).",
      href: "exec.html"
    },
    TSR: {
      fr: "Terminate and Stay Resident : le programme rend la main mais laisse du code en mémoire.",
      en: "Terminate and Stay Resident: the program returns but leaves code in memory.",
      href: "exec.html"
    },
    EXEC: {
      fr: "INT 21h AH=4Bh : charger et lancer un .COM / .EXE, ou un overlay (AL=3).",
      en: "INT 21h AH=4Bh: load and run a .COM / .EXE, or an overlay (AL=3).",
      href: "exec.html"
    },
    COMSPEC: {
      fr: "Variable d’environnement : chemin complet de COMMAND.COM.",
      en: "Environment variable: full path to COMMAND.COM."
    },
    MULTI_CONFIG: {
      fr: "Blocs [menu] / [common] : on choisit un CONFIG parmi plusieurs au boot.",
      en: "[menu] / [common] blocks: pick one CONFIG among several at boot."
    },
    IOCTL: {
      fr: "I/O Control, INT 21h AH=44h : parler à un pilote autrement que par lecture/écriture.",
      en: "I/O Control, INT 21h AH=44h: talk to a driver other than by read/write.",
      href: "ioctl.html"
    },
    FAT: {
      fr: "File Allocation Table : table qui enchaîne les clusters d’un fichier (ici FAT12/16, pas FAT32).",
      en: "File Allocation Table: chains a file’s clusters (here FAT12/16, not FAT32).",
      href: "fat.html"
    },
    FAT12: {
      fr: "FAT à entrées de 12 bits (disquettes, petites partitions).",
      en: "FAT with 12-bit entries (floppies, small partitions).",
      href: "fat.html"
    },
    FAT16: {
      fr: "FAT à entrées de 16 bits (disques durs DOS 6).",
      en: "FAT with 16-bit entries (DOS 6 hard disks).",
      href: "fat.html"
    },
    BPB: {
      fr: "BIOS Parameter Block : géométrie du volume dans le secteur boot (octets/secteur, clusters…).",
      en: "BIOS Parameter Block: volume geometry in the boot sector (bytes/sector, clusters…).",
      href: "fat.html"
    },
    DPB: {
      fr: "Drive Parameter Block : copie noyau du BPB, une par lecteur monté.",
      en: "Drive Parameter Block: kernel copy of the BPB, one per mounted drive.",
      href: "fat.html"
    },
    JFN: {
      fr: "Job File Number : le « handle » 0–n dans le PSP, qui pointe vers une SFT.",
      en: "Job File Number: the 0–n “handle” in the PSP, pointing at an SFT.",
      href: "fichiers.html"
    },
    MBR: {
      fr: "Master Boot Record : secteur 0 du disque, table de partitions et code d’amorçage.",
      en: "Master Boot Record: disk sector 0, partition table and boot strap.",
      href: "fdisk.html"
    },
    CHS: {
      fr: "Cylinder / Head / Sector : adressage disque du BIOS, avant le LBA.",
      en: "Cylinder / Head / Sector: BIOS disk addressing, before LBA.",
      href: "int13.html"
    },
    VCPI: {
      fr: "Virtual Control Program Interface : passerelle 386 entre EMM386 (V86) et les dos-extenders.",
      en: "Virtual Control Program Interface: 386 bridge between EMM386 (V86) and DOS extenders.",
      href: "emm386.html"
    },
    CVF: {
      fr: "Compressed Volume File : le gros fichier DoubleSpace qui contient le volume comprimé.",
      en: "Compressed Volume File: the big DoubleSpace file that holds the compressed volume.",
      href: "dblspace.html"
    },
    NLS: {
      fr: "National Language Support : clavier, pays, pages de codes, DBCS.",
      en: "National Language Support: keyboard, country, code pages, DBCS.",
      href: "nls.html"
    },
    DBCS: {
      fr: "Double-Byte Character Set : un caractère sur deux octets (japonais, chinois, coréen).",
      en: "Double-Byte Character Set: one character in two bytes (Japanese, Chinese, Korean).",
      href: "nls.html"
    },
    "INT 21h": {
      fr: "Porte d’entrée du DOS : AH choisit le service (ouvrir, lire, EXEC…).",
      en: "DOS front door: AH selects the service (open, read, EXEC…).",
      href: "int21.html"
    },
    "INT 13h": {
      fr: "Services disque du BIOS (CHS), interceptés par IO.SYS, SMARTDRV, etc.",
      en: "BIOS disk services (CHS), hooked by IO.SYS, SMARTDRV, etc.",
      href: "int13.html"
    },
    "INT 24h": {
      fr: "Erreur critique : Abort, Retry, Ignore, Fail (disque ouvert, imprimante…).",
      en: "Critical error: Abort, Retry, Ignore, Fail (open drive, printer…).",
      href: "int24.html"
    },
    "INT 2Fh": {
      fr: "Multiplex : HIMEM, APPEND, PRINT, DOSKEY, SHARE… s’y enregistrent.",
      en: "Multiplex: HIMEM, APPEND, PRINT, DOSKEY, SHARE… register here.",
      href: "int21.html"
    },
    "INT 28h": {
      fr: "Idle : DOS est en attente clavier ; PRINT et POWER s’en servent.",
      en: "Idle: DOS is waiting on the keyboard; PRINT and POWER use it.",
      href: "print.html"
    },
    "INT 12h": {
      fr: "BIOS : « combien de Ko de mémoire conventionnelle ? » Réponse dans AX, souvent 640.",
      en: "BIOS: “how many KB of conventional memory?” Answer in AX, often 640.",
      href: "memoire.html"
    },
    "INT 10h": {
      fr: "Services vidéo du BIOS (mode texte, curseur, défilement).",
      en: "BIOS video services (text mode, cursor, scroll).",
      href: "ansi.html"
    },
    BDS: {
      fr: "Boot Drive Structure : descripteur interne d’un lecteur dans IO.SYS.",
      en: "Boot Drive Structure: IO.SYS’s internal drive descriptor.",
      href: "int13.html"
    },
    FCB: {
      fr: "File Control Block : ancienne API fichiers DOS 1, encore utilisée par RECOVER.",
      en: "File Control Block: old DOS 1 file API, still used by RECOVER.",
      href: "fichiers.html"
    }
  };

  var ALIAS = {
    "HIMEM.SYS": "HIMEM",
    SFTs: "SFT",
    UMBs: "UMB",
    FAT32: "FAT",
    "INT 21H": "INT 21h",
    "INT 13H": "INT 13h",
    "INT 24H": "INT 24h",
    "INT 2FH": "INT 2Fh",
    "INT 28H": "INT 28h",
    "INT 12H": "INT 12h",
    "INT 10H": "INT 10h"
  };

  var SKIP = { PRE: 1, CODE: 1, KBD: 1, SCRIPT: 1, STYLE: 1, TEXTAREA: 1, SVG: 1, A: 0 };

  var names = Object.keys(TERMS).concat(Object.keys(ALIAS)).sort(function (a, b) {
    return b.length - a.length;
  });

  var rx = new RegExp("\\b(" + names.map(function (n) {
    return n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/ /g, "\\s*");
  }).join("|") + ")\\b", "g");

  function lang() {
    return document.documentElement.lang === "en" ? "en" : "fr";
  }

  function inSite() {
    return /\/site(\/|$)/.test(location.pathname);
  }

  function hrefFor(entry) {
    if (!entry.href) return "";
    return (inSite() ? "" : "site/") + entry.href;
  }

  function canonical(raw) {
    var compact = raw.replace(/\s+/g, " ");
    if (TERMS[compact]) return compact;
    if (ALIAS[compact]) return ALIAS[compact];
    var up = compact.toUpperCase();
    if (ALIAS[up]) return ALIAS[up];
    if (TERMS[up]) return up;
    return compact;
  }

  function skipNode(el) {
    if (!el || el.nodeType !== 1) return false;
    var tag = el.tagName;
    if (tag === "PRE" || tag === "CODE" || tag === "KBD" || tag === "SCRIPT" || tag === "STYLE") return true;
    if (el.classList && (el.classList.contains("glos") || el.classList.contains("file-index") || el.classList.contains("kicker"))) return true;
    if (el.closest && el.closest("pre, code, kbd, .glos, nav, .nav, h1, h2")) return true;
    return false;
  }

  function wrapText(node) {
    var text = node.nodeValue;
    rx.lastIndex = 0;
    if (!rx.test(text)) return;
    rx.lastIndex = 0;
    var frag = document.createDocumentFragment();
    var last = 0;
    var m;
    while ((m = rx.exec(text))) {
      if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
      var span = document.createElement("span");
      span.className = "glos";
      span.setAttribute("data-glos", canonical(m[1]));
      span.setAttribute("tabindex", "0");
      span.textContent = m[1];
      frag.appendChild(span);
      last = m.index + m[1].length;
    }
    if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
    node.parentNode.replaceChild(frag, node);
  }

  function walk(node) {
    if (node.nodeType === 3) {
      if (node.nodeValue && node.nodeValue.length > 1) wrapText(node);
      return;
    }
    if (node.nodeType !== 1 || skipNode(node)) return;
    var kids = [];
    for (var i = 0; i < node.childNodes.length; i++) kids.push(node.childNodes[i]);
    for (i = 0; i < kids.length; i++) walk(kids[i]);
  }

  var pop;
  var hideTimer;
  var current;

  function ensurePop() {
    if (pop) return pop;
    pop = document.createElement("div");
    pop.id = "glos-pop";
    pop.hidden = true;
    pop.setAttribute("role", "tooltip");
    document.body.appendChild(pop);
    pop.addEventListener("mouseenter", function () { clearTimeout(hideTimer); });
    pop.addEventListener("mouseleave", scheduleHide);
    return pop;
  }

  function fill(key) {
    var entry = TERMS[key];
    if (!entry) return false;
    var L = lang();
    var html = "<strong>" + key + "</strong><p>" + entry[L] + "</p>";
    var href = hrefFor(entry);
    if (href) {
      html += "<a href=\"" + href + "\">" + (L === "en" ? "Read the page" : "Lire la page") + "</a>";
    }
    ensurePop().innerHTML = html;
    return true;
  }

  function place(anchor) {
    var box = anchor.getBoundingClientRect();
    var el = ensurePop();
    el.hidden = false;
    el.classList.remove("is-above");
    var pw = el.offsetWidth;
    var ph = el.offsetHeight;
    var gap = 10;
    var left = box.left + box.width / 2 - pw / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - pw - 8));
    var top = box.bottom + gap;
    if (top + ph > window.innerHeight - 8 && box.top - gap - ph > 8) {
      top = box.top - gap - ph;
      el.classList.add("is-above");
    }
    el.style.left = Math.round(left) + "px";
    el.style.top = Math.round(top) + "px";
    var arrow = box.left + box.width / 2 - left;
    el.style.setProperty("--arrow-x", Math.round(arrow) + "px");
  }

  function show(anchor) {
    var key = anchor.getAttribute("data-glos");
    if (!fill(key)) return;
    current = anchor;
    clearTimeout(hideTimer);
    place(anchor);
  }

  function hide() {
    if (!pop) return;
    pop.hidden = true;
    current = null;
  }

  function scheduleHide() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hide, 160);
  }

  function onOver(ev) {
    var el = ev.target.closest && ev.target.closest(".glos");
    if (!el) return;
    show(el);
  }

  function onOut(ev) {
    var el = ev.target.closest && ev.target.closest(".glos");
    if (!el) return;
    var to = ev.relatedTarget;
    if (to && (el.contains(to) || (pop && pop.contains(to)))) return;
    scheduleHide();
  }

  document.addEventListener("msdos-lang", function () {
    if (current) show(current);
  });

  document.addEventListener("scroll", function () {
    if (current && pop && !pop.hidden) place(current);
  }, true);

  window.addEventListener("resize", hide);

  function boot() {
    var roots = [];
    var main = document.getElementById("main");
    if (main) roots.push(main);
    var foot = document.querySelector(".site-footer");
    if (foot) roots.push(foot);
    if (!roots.length) return;
    roots.forEach(walk);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    document.addEventListener("focusin", onOver);
    document.addEventListener("focusout", onOut);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
