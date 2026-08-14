/**
 * Trace EXEC FOO.COM — exec.html (#exec)
 */
(function () {
  "use strict";

  var root = document.getElementById("exec");
  if (!root) return;

  var STEPS = [
    {
      arena: [
        { n: "DOS", s: 12, k: "dos" },
        { n: "COMMAND", s: 20, k: "used" },
        { n: "libre", s: 40, k: "free" }
      ],
      psp: { cur: "0B80", par: "—", ip: "—", sp: "—" },
      regs: { ax: "—", bx: "—", cx: "—", dx: "—" },
      fr: "COMMAND.COM tourne. CurrentPDB = 0B80h. Un grand trou d’arène attend. Aucun fils.",
      en: "COMMAND.COM is running. CurrentPDB = 0B80h. A large arena hole waits. No child yet."
    },
    {
      arena: [
        { n: "DOS", s: 12, k: "dos" },
        { n: "COMMAND", s: 20, k: "used" },
        { n: "libre", s: 40, k: "free" }
      ],
      psp: { cur: "0B80", par: "—", ip: "—", sp: "—" },
      regs: { ax: "4B00", bx: "execblk", cx: "—", dx: "FOO.COM" },
      fr: "INT 21h AX=4B00h : charger et exécuter. DS:DX = nom, ES:BX = EXEC0 (environnement, ligne 80h, FCB 5Ch et 6Ch).",
      en: "INT 21h AX=4B00h: load and run. DS:DX = name, ES:BX = EXEC0 (environment, 80h tail, FCBs at 5Ch and 6Ch)."
    },
    {
      arena: [
        { n: "DOS", s: 12, k: "dos" },
        { n: "COMMAND", s: 20, k: "used" },
        { n: "env", s: 4, k: "new" },
        { n: "libre", s: 36, k: "free" }
      ],
      psp: { cur: "0B80", par: "—", ip: "—", sp: "—" },
      regs: { ax: "0005", bx: "handle", cx: "—", dx: "FOO.COM" },
      fr: "$OPEN (drapeau EXECOPEN pour le redir). Pas un device. Copie de l’environnement + mot 0001h + chemin ASCIIZ — pour que le fils lise COMSPEC et son propre nom.",
      en: "$OPEN (EXECOPEN flag for the redirector). Not a device. Copy the environment + word 0001h + ASCIIZ path — so the child can read COMSPEC and its own name."
    },
    {
      arena: [
        { n: "DOS", s: 12, k: "dos" },
        { n: "COMMAND", s: 20, k: "used" },
        { n: "env", s: 4, k: "used" },
        { n: "libre", s: 36, k: "free" }
      ],
      psp: { cur: "0B80", par: "—", ip: "—", sp: "—" },
      regs: { ax: "4D5A?", bx: "—", cx: "header", dx: "buf" },
      fr: "Lecture de l’en-tête EXE. Ici trop court, ou signature ≠ 5A4Dh / 4D5Ah (« zibo arises! »). Donc ce n’est pas un MZ : on bascule vers Exec_Com_File.",
      en: "Read the EXE header. Here it is too short, or the signature is not 5A4Dh / 4D5Ah (“zibo arises!”). Not an MZ: jump to Exec_Com_File."
    },
    {
      arena: [
        { n: "DOS", s: 12, k: "dos" },
        { n: "COMMAND", s: 20, k: "used" },
        { n: "env", s: 4, k: "used" },
        { n: "FOO", s: 36, k: "new" }
      ],
      psp: { cur: "0B80", par: "—", ip: "—", sp: "—" },
      regs: { ax: "bloc", bx: "FFFFh", cx: "—", dx: "—" },
      fr: "COM : $ALLOC BX=FFFFh pour connaître le plus grand trou, puis on le prend tout. exec_dma = bloc+10h (le PSP occupe 16 paragraphes = 256 octets).",
      en: "COM: $ALLOC BX=FFFFh to learn the largest hole, then take it all. exec_dma = block+10h (the PSP occupies 16 paragraphs = 256 bytes)."
    },
    {
      arena: [
        { n: "DOS", s: 12, k: "dos" },
        { n: "COMMAND", s: 20, k: "used" },
        { n: "env", s: 4, k: "used" },
        { n: "FOO", s: 36, k: "used" }
      ],
      psp: { cur: "0D40", par: "0B80", ip: "0100", sp: "FFFE" },
      regs: { ax: "4B00", bx: "—", cx: "lus", dx: "0100" },
      fr: "CreatePDB : copie 256 octets, DUP des JFN héritables (sauf sf_no_inherit), Parent_PID = 0B80h, CurrentPDB = fils. Image lue à PSP:0100. CS=DS=SS=PSP, IP=100h, mot 0 sur la pile.",
      en: "CreatePDB: copy 256 bytes, DUP inheritable JFNs (except sf_no_inherit), Parent_PID = 0B80h, CurrentPDB = child. Image read at PSP:0100. CS=DS=SS=PSP, IP=100h, word 0 on the stack."
    },
    {
      arena: [
        { n: "DOS", s: 12, k: "dos" },
        { n: "COMMAND", s: 20, k: "used" },
        { n: "env", s: 4, k: "used" },
        { n: "FOO", s: 36, k: "used" }
      ],
      psp: { cur: "0D40", par: "0B80", ip: "0100", sp: "FFFE" },
      regs: { ax: "4C03", bx: "—", cx: "—", dx: "—" },
      fr: "FOO tourne, puis AH=4Ch AL=03. $EXIT : si DidCtrlC → type Ctrl-C, sinon EXIT_TERMINATE. Exit_inner pousse le PSP fils comme User_CS pour Abort_Inner.",
      en: "FOO runs, then AH=4Ch AL=03. $EXIT: if DidCtrlC → Ctrl-C type, else EXIT_TERMINATE. Exit_inner pushes the child PSP as User_CS for Abort_Inner."
    },
    {
      arena: [
        { n: "DOS", s: 12, k: "dos" },
        { n: "COMMAND", s: 20, k: "used" },
        { n: "libre", s: 40, k: "free" }
      ],
      psp: { cur: "0B80", par: "—", ip: "père", sp: "—" },
      regs: { ax: "0300", bx: "—", cx: "—", dx: "—" },
      fr: "Abort_Inner : Exit_Code = type<<8 | AL. Restaure INT 22/23/24 depuis le PSP. arena_free_process(FOO). CurrentPDB = parent. $WAIT fait XCHG AX, exit_code → 0300h.",
      en: "Abort_Inner: Exit_Code = type<<8 | AL. Restore INT 22/23/24 from the PSP. arena_free_process(FOO). CurrentPDB = parent. $WAIT does XCHG AX, exit_code → 0300h."
    }
  ];

  var i = 0;
  var timer = null;
  var bar = root.querySelector("[data-arena]");
  var psp = root.querySelector("[data-psp]");
  var regs = root.querySelector("[data-regs]");
  var say = root.querySelector("[data-say]");
  var dots = root.querySelector("[data-dots]");

  function lang() {
    return document.documentElement.lang === "en" ? "en" : "fr";
  }

  function drawArena(step) {
    bar.innerHTML = step.arena.map(function (b) {
      var n = b.n;
      if (n === "libre" && lang() === "en") n = "free";
      return "<span class=\"" + b.k + "\" style=\"flex:" + b.s + "\"><b>" + n + "</b><i>" + b.s + "p</i></span>";
    }).join("");
  }

  function drawPsp(step) {
    var p = step.psp;
    psp.innerHTML =
      "<dt>CurrentPDB</dt><dd>" + p.cur + "</dd>" +
      "<dt>PDB_Parent_PID</dt><dd>" + p.par + "</dd>" +
      "<dt>CS:IP</dt><dd>" + (p.ip === "—" ? "—" : p.cur + ":" + p.ip) + "</dd>" +
      "<dt>SP</dt><dd>" + p.sp + "</dd>";
  }

  function drawRegs(step) {
    var r = step.regs;
    regs.innerHTML =
      "<div><em>AX</em>" + r.ax + "</div>" +
      "<div><em>BX</em>" + r.bx + "</div>" +
      "<div><em>CX</em>" + r.cx + "</div>" +
      "<div><em>DX</em>" + r.dx + "</div>";
  }

  function drawDots() {
    var html = "";
    var k;
    for (k = 0; k < STEPS.length; k++) {
      html += "<li><button type=\"button\" data-goto=\"" + k + "\"" +
        (k === i ? " aria-current=\"true\"" : "") + "></button></li>";
    }
    dots.innerHTML = html;
  }

  function draw() {
    var s = STEPS[i];
    drawArena(s);
    drawPsp(s);
    drawRegs(s);
    say.textContent = s[lang()];
    drawDots();
  }

  function go(n) {
    i = (n + STEPS.length) % STEPS.length;
    draw();
  }

  function stop() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  root.addEventListener("click", function (ev) {
    var t = ev.target.closest("[data-exec], [data-goto]");
    if (!t) return;
    if (t.hasAttribute("data-goto")) { stop(); go(+t.getAttribute("data-goto")); return; }
    var cmd = t.getAttribute("data-exec");
    if (cmd === "prev") { stop(); go(i - 1); }
    if (cmd === "next") { stop(); go(i + 1); }
    if (cmd === "reset") { stop(); go(0); }
    if (cmd === "play") {
      if (timer) { stop(); return; }
      if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        go(i + 1); return;
      }
      timer = setInterval(function () {
        if (i >= STEPS.length - 1) { stop(); return; }
        go(i + 1);
      }, 2400);
    }
  });

  document.addEventListener("click", function (ev) {
    if (ev.target.closest("[data-set='lang']")) setTimeout(draw, 0);
  });

  draw();
})();
