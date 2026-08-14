/**
 * Trace interactive : TYPE AUTOEXEC.BAT vu du noyau.
 * Présent uniquement sur fichiers.html (#trace).
 */
(function () {
  "use strict";

  var root = document.getElementById("trace");
  if (!root) return;

  var FF = 255;
  var closed = [0, 1, 2, 3, 4, FF, FF, FF, FF, FF, FF, FF, FF, FF, FF, FF, FF, FF, FF, FF];
  var opened = [0, 1, 2, 3, 4, 5, FF, FF, FF, FF, FF, FF, FF, FF, FF, FF, FF, FF, FF, FF];

  var STEPS = [
    {
      jfn: closed,
      busy: -1,
      sft: { ref: "—", mode: "—", name: "—", fir: "—", lst: "—", pos: "—", size: "—" },
      regs: { ax: "—", bx: "—", cx: "—", dx: "—" },
      fat: [false, false, false],
      fr: "PSP de COMMAND.COM au repos. Les handles 0–4 sont déjà pris (CON, CON, CON, AUX, PRN). Le reste du JFN vaut FFh : case libre. Aucune SFT n’est encore « busy ».",
      en: "COMMAND.COM’s PSP at rest. Handles 0–4 are taken (CON, CON, CON, AUX, PRN). The rest of the JFN table is FFh: free. No SFT is “busy” yet."
    },
    {
      jfn: closed,
      busy: -1,
      sft: { ref: "—", mode: "—", name: "—", fir: "—", lst: "—", pos: "—", size: "—" },
      regs: { ax: "3D00", bx: "—", cx: "—", dx: "AUTOEXEC.BAT" },
      fat: [false, false, false],
      fr: "Le programme appelle INT 21h AH=3Dh. AL=00 = lecture seule (open_for_read). DS:DX pointe le nom ASCIIZ. $Open dans file.asm prend la main.",
      en: "The program calls INT 21h AH=3Dh. AL=00 = read-only (open_for_read). DS:DX points at the ASCIIZ name. $Open in file.asm takes over."
    },
    {
      jfn: closed,
      busy: 5,
      sft: { ref: "−1", mode: "0000", name: "…", fir: "—", lst: "—", pos: "—", size: "—" },
      regs: { ax: "3D00", bx: "SFN=5", cx: "—", dx: "AUTOEXEC.BAT" },
      fat: [false, false, false],
      fr: "SFNFree trouve la première SFT libre et la marque sf_ref_count = −1 (occupée, pas encore ouverte). Si un INT 24 interrompt l’open, cette entrée « orpheline » pourra être récupérée : elle appartient encore à ce PID.",
      en: "SFNFree finds the first free SFT and marks sf_ref_count = −1 (busy, not yet open). If INT 24 aborts the open, that orphaned slot can be reclaimed: it still belongs to this PID."
    },
    {
      jfn: opened,
      busy: 5,
      sft: { ref: "−1", mode: "0000", name: "…", fir: "—", lst: "—", pos: "—", size: "—" },
      regs: { ax: "3D00", bx: "JFN=5", cx: "—", dx: "AUTOEXEC.BAT" },
      fat: [false, false, false],
      fr: "JFNFree balaie PDB_JFN_Table jusqu’au premier FFh : ici l’index 5. On y écrit le SFN. Le handle que verra le programme est cet index — un octet, pas un pointeur.",
      en: "JFNFree walks PDB_JFN_Table to the first FFh: index 5. The SFN is written there. The handle the program will see is that index — one byte, not a pointer."
    },
    {
      jfn: opened,
      busy: 5,
      sft: { ref: "1", mode: "0000", name: "AUTOEXECBAT", fir: "000C", lst: "000C", pos: "00000000", size: "000001A4" },
      regs: { ax: "0005", bx: "5", cx: "—", dx: "—" },
      fat: [true, false, false],
      fr: "TransPath canonise le chemin, DOS_Open remplit la SFT depuis DIR_ENTRY : sf_firclus = 000Ch, sf_size, sf_name. Puis sf_ref_count passe à 1. $Open rend AX = 5. Le fichier est ouvert.",
      en: "TransPath canonicalises the path, DOS_Open fills the SFT from the DIR_ENTRY: sf_firclus = 000Ch, sf_size, sf_name. Then sf_ref_count becomes 1. $Open returns AX = 5. The file is open."
    },
    {
      jfn: opened,
      busy: 5,
      sft: { ref: "1", mode: "0000", name: "AUTOEXECBAT", fir: "000C", lst: "000C", pos: "00000000", size: "000001A4" },
      regs: { ax: "3F00", bx: "0005", cx: "0200", dx: "buffer" },
      fat: [true, false, false],
      fr: "Lecture : AH=3Fh, BX=handle 5, CX=512, DS:DX = tampon. $READ appelle pJFNFromHandle puis CheckOwner, pose ThisSFT, et saute à DOS_Read.",
      en: "Read: AH=3Fh, BX=handle 5, CX=512, DS:DX = buffer. $READ calls pJFNFromHandle then CheckOwner, sets ThisSFT, and jumps to DOS_Read."
    },
    {
      jfn: opened,
      busy: 5,
      sft: { ref: "1", mode: "0000", name: "AUTOEXECBAT", fir: "000C", lst: "000C", pos: "00000000", size: "000001A4" },
      regs: { ax: "3F00", bx: "clus 12", cx: "reste", dx: "cluspos" },
      fat: [true, true, false],
      fr: "FNDCLUS part de sf_lstclus (cache). Ici on est au début : sf_firclus = 12. UNPACK(12) → 13, pas encore EOF. C’est la même routine que sur la page FAT.",
      en: "FNDCLUS starts from sf_lstclus (a cache). Here we are at the start: sf_firclus = 12. UNPACK(12) → 13, not EOF yet. Same routine as on the FAT page."
    },
    {
      jfn: opened,
      busy: 5,
      sft: { ref: "1", mode: "0000", name: "AUTOEXECBAT", fir: "000C", lst: "000C", pos: "00000200", size: "000001A4" },
      regs: { ax: "01A4", bx: "5", cx: "01A4", dx: "buffer" },
      fat: [true, true, false],
      fr: "FIGREC convertit le cluster 12 en secteur. 420 octets (1A4h) suffisent : AX = octets réellement lus, sf_position avance. Le fichier tient dans un cluster.",
      en: "FIGREC turns cluster 12 into a sector. 420 bytes (1A4h) is enough: AX = bytes actually read, sf_position advances. The file fits in one cluster."
    },
    {
      jfn: closed,
      busy: -1,
      sft: { ref: "0", mode: "—", name: "AUTOEXECBAT", fir: "000C", lst: "—", pos: "—", size: "000001A4" },
      regs: { ax: "3E00", bx: "0005", cx: "—", dx: "—" },
      fat: [false, false, false],
      fr: "$Close : JFN[5] ← FFh d’abord, puis DOS_CLOSE décrémente la SFT, met à jour date/taille dans le répertoire, FLUSHBUF. Même si DOS_CLOSE échoue, le handle est déjà rendu. Multiplan compte encore sur AH=3Eh au retour.",
      en: "$Close: JFN[5] ← FFh first, then DOS_CLOSE decrements the SFT, updates date/size in the directory, FLUSHBUF. Even if DOS_CLOSE fails, the handle is already gone. Multiplan still depends on AH=3Eh on return."
    }
  ];

  var i = 0;
  var timer = null;
  var jfnEl = root.querySelector("[data-jfn]");
  var sftEl = root.querySelector("[data-sft]");
  var regsEl = root.querySelector("[data-regs]");
  var fatEl = root.querySelector("[data-fat]");
  var sayEl = root.querySelector("[data-say]");
  var dotsEl = root.querySelector("[data-dots]");

  function lang() {
    return document.documentElement.lang === "en" ? "en" : "fr";
  }

  function hexByte(n) {
    if (n === 255) return "FF";
    return (n < 16 ? "0" : "") + n.toString(16).toUpperCase();
  }

  function renderJfn(step) {
    var labels = ["CON", "CON", "CON", "AUX", "PRN"];
    var html = "";
    var k;
    for (k = 0; k < 20; k++) {
      var v = step.jfn[k];
      var cls = " ";
      if (v === 255) cls += "free";
      if (k === 5 && step.jfn[5] !== 255) cls += " on";
      if (k === 5 && (i === 3 || i === 4 || i === 8)) cls += " busy";
      var lab = k < 5 ? labels[k] : (v === 255 ? "·" : "SFN");
      html += "<span class=\"" + cls + "\"><b>" + hexByte(v) + "</b><i>" + k + " " + lab + "</i></span>";
    }
    jfnEl.innerHTML = html;
  }

  function renderSft(step) {
    var s = step.sft;
    var flash = function (key) {
      if (i === 2 && key === "ref") return " flash";
      if (i === 4 && (key === "fir" || key === "name" || key === "ref")) return " flash";
      if (i === 7 && key === "pos") return " flash";
      if (i === 8 && key === "ref") return " flash";
      return "";
    };
    sftEl.innerHTML =
      "<dt>sf_ref_count</dt><dd class=\"" + flash("ref") + "\">" + s.ref + "</dd>" +
      "<dt>sf_mode</dt><dd>" + s.mode + "</dd>" +
      "<dt>sf_name</dt><dd class=\"" + flash("name") + "\">" + s.name + "</dd>" +
      "<dt>sf_firclus</dt><dd class=\"" + flash("fir") + "\">" + s.fir + "</dd>" +
      "<dt>sf_lstclus</dt><dd>" + s.lst + "</dd>" +
      "<dt>sf_position</dt><dd class=\"" + flash("pos") + "\">" + s.pos + "</dd>" +
      "<dt>sf_size</dt><dd>" + s.size + "</dd>";
  }

  function renderRegs(step) {
    var r = step.regs;
    regsEl.innerHTML =
      "<div><em>AX</em>" + r.ax + "</div>" +
      "<div><em>BX</em>" + r.bx + "</div>" +
      "<div><em>CX</em>" + r.cx + "</div>" +
      "<div><em>DX</em>" + r.dx + "</div>";
  }

  function renderFat(step) {
    var on = step.fat;
    fatEl.innerHTML =
      "<b" + (on[0] ? " class=\"on\"" : "") + ">12</b>" +
      "<span>→</span>" +
      "<b" + (on[1] ? " class=\"on\"" : "") + ">13</b>" +
      "<span>→</span>" +
      "<b" + (on[2] ? " class=\"on\"" : "") + ">EOF</b>";
  }

  function renderDots() {
    var html = "";
    var k;
    for (k = 0; k < STEPS.length; k++) {
      html += "<li><button type=\"button\" data-goto=\"" + k + "\"" +
        (k === i ? " aria-current=\"true\"" : "") +
        " aria-label=\"step " + (k + 1) + "\"></button></li>";
    }
    dotsEl.innerHTML = html;
  }

  function draw() {
    var step = STEPS[i];
    renderJfn(step);
    renderSft(step);
    renderRegs(step);
    renderFat(step);
    sayEl.textContent = step[lang()];
    renderDots();
    root.setAttribute("data-step", String(i));
  }

  function go(n) {
    i = (n + STEPS.length) % STEPS.length;
    draw();
  }

  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  root.addEventListener("click", function (ev) {
    var t = ev.target.closest("[data-trace], [data-goto]");
    if (!t) return;
    if (t.hasAttribute("data-goto")) {
      stop();
      go(parseInt(t.getAttribute("data-goto"), 10));
      return;
    }
    var cmd = t.getAttribute("data-trace");
    if (cmd === "prev") { stop(); go(i - 1); }
    if (cmd === "next") { stop(); go(i + 1); }
    if (cmd === "reset") { stop(); go(0); }
    if (cmd === "play") {
      if (timer) { stop(); return; }
      if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        go(i + 1);
        return;
      }
      timer = setInterval(function () {
        if (i >= STEPS.length - 1) { stop(); return; }
        go(i + 1);
      }, 2200);
    }
  });

  document.addEventListener("click", function (ev) {
    if (ev.target.closest("[data-set='lang']")) {
      setTimeout(draw, 0);
    }
  });

  draw();
})();
