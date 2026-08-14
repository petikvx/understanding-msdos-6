/**
 * Trace DIR | SORT — command.html (#shell)
 */
(function () {
  "use strict";

  var root = document.getElementById("shell");
  if (!root) return;

  var STEPS = [
    {
      mem: [
        { n: "résident", s: 8, k: "dos" },
        { n: "TPA", s: 28, k: "free" },
        { n: "transient", s: 16, k: "used" }
      ],
      io: { in: "CON", out: "CON", pipe: "—" },
      line: "C&gt;",
      fr: "COMMAND.COM au repos. Le résident tient INT 23/24/2E. Le transient est en haut de la RAM, checksum intact. Prompt si ECHO et pas de BATCH/FOR/PIPE.",
      en: "COMMAND.COM at rest. The resident owns INT 23/24/2E. The transient sits at the top of RAM, checksum intact. Prompt if ECHO and no BATCH/FOR/PIPE."
    },
    {
      mem: [
        { n: "résident", s: 8, k: "dos" },
        { n: "TPA", s: 28, k: "free" },
        { n: "transient", s: 16, k: "used" }
      ],
      io: { in: "CON", out: "CON", pipe: "—" },
      line: "DIR | SORT",
      fr: "La ligne est dans COMBUF. PIPEFLAG a la plus haute priorité dans tcode.asm — avant FOR, avant BATCH, avant le prompt.",
      en: "The line is in COMBUF. PIPEFLAG has the highest precedence in tcode.asm — before FOR, before BATCH, before the prompt."
    },
    {
      mem: [
        { n: "résident", s: 8, k: "dos" },
        { n: "TPA", s: 28, k: "free" },
        { n: "transient", s: 16, k: "used" }
      ],
      io: { in: "CON", out: "PIPE1", pipe: "TEMP= ou ." },
      line: "DIR",
      fr: "CreateTempFile (AH=5Ah) : deux fichiers, dans TEMP= s’il est un vrai répertoire, sinon le répertoire courant (plus la racine : nombre d’entrées limité). Handle refermé tout de suite.",
      en: "CreateTempFile (AH=5Ah): two files, in TEMP= if it is a real directory, otherwise the current directory (no longer the root: fixed entry count). Handle closed at once."
    },
    {
      mem: [
        { n: "résident", s: 8, k: "dos" },
        { n: "TPA", s: 20, k: "free" },
        { n: "DIR", s: 8, k: "new" },
        { n: "transient?", s: 16, k: "used" }
      ],
      io: { in: "CON", out: "PIPE1", pipe: "PIPE1" },
      line: "DIR → fichier",
      fr: "Premier élément : stdout rebranché sur PIPE1 (comme &gt;). DIR est interne (COMTAB). ECHO forcé à off pendant le pipe. Le listing va dans le fichier temporaire, pas à l’écran.",
      en: "First element: stdout aimed at PIPE1 (like &gt;). DIR is internal (COMTAB). ECHO forced off during the pipe. The listing goes into the temp file, not the screen."
    },
    {
      mem: [
        { n: "résident", s: 8, k: "dos" },
        { n: "TPA", s: 12, k: "free" },
        { n: "SORT", s: 16, k: "new" },
        { n: "écrasé", s: 16, k: "free" }
      ],
      io: { in: "PIPE1", out: "CON", pipe: "swap" },
      line: "SORT < PIPE1",
      fr: "XCHG des pointeurs PIPE1/PIPE2. SORT est externe : Path_Search, puis $EXEC. Le transient peut être écrasé — c’est pour ça qu’il est en haut de la mémoire.",
      en: "XCHG of PIPE1/PIPE2 pointers. SORT is external: Path_Search, then $EXEC. The transient may be overwritten — that is why it lives at the top of memory."
    },
    {
      mem: [
        { n: "résident", s: 8, k: "dos" },
        { n: "TPA", s: 28, k: "free" },
        { n: "transient", s: 16, k: "new" }
      ],
      io: { in: "CON", out: "CON", pipe: "PIPEDEL" },
      line: "C&gt;",
      fr: "SORT terminé. ChkSum (mots de 100h à TranDataEnd) : si le transient a été écrasé, LoadCom le relit depuis COMSPEC. PIPEDEL efface les temporaires. Handle 0/1 restaurés.",
      en: "SORT finished. ChkSum (words from 100h to TranDataEnd): if the transient was smashed, LoadCom rereads it from COMSPEC. PIPEDEL deletes the temps. Handles 0/1 restored."
    }
  ];

  var i = 0;
  var timer = null;

  function lang() {
    return document.documentElement.lang === "en" ? "en" : "fr";
  }

  function draw() {
    var s = STEPS[i];
    var bar = root.querySelector("[data-arena]");
    bar.innerHTML = s.mem.map(function (b) {
      var n = b.n;
      if (lang() === "en") {
        if (n === "résident") n = "resident";
        if (n === "écrasé") n = "smashed";
      }
      return "<span class=\"" + b.k + "\" style=\"flex:" + b.s + "\"><b>" + n + "</b></span>";
    }).join("");
    var io = s.io;
    root.querySelector("[data-io]").innerHTML =
      "<dt>stdin</dt><dd>" + io.in + "</dd>" +
      "<dt>stdout</dt><dd>" + io.out + "</dd>" +
      "<dt>pipe</dt><dd>" + io.pipe + "</dd>";
    root.querySelector("[data-line]").innerHTML = s.line;
    root.querySelector("[data-say]").textContent = s[lang()];
    var dots = "";
    var k;
    for (k = 0; k < STEPS.length; k++) {
      dots += "<li><button type=\"button\" data-goto=\"" + k + "\"" +
        (k === i ? " aria-current=\"true\"" : "") + "></button></li>";
    }
    root.querySelector("[data-dots]").innerHTML = dots;
  }

  function go(n) {
    i = (n + STEPS.length) % STEPS.length;
    draw();
  }

  function stop() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  root.addEventListener("click", function (ev) {
    var t = ev.target.closest("[data-cmd], [data-goto]");
    if (!t) return;
    if (t.hasAttribute("data-goto")) { stop(); go(+t.getAttribute("data-goto")); return; }
    var c = t.getAttribute("data-cmd");
    if (c === "prev") { stop(); go(i - 1); }
    if (c === "next") { stop(); go(i + 1); }
    if (c === "reset") { stop(); go(0); }
    if (c === "play") {
      if (timer) { stop(); return; }
      if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        go(i + 1); return;
      }
      timer = setInterval(function () {
        if (i >= STEPS.length - 1) { stop(); return; }
        go(i + 1);
      }, 2500);
    }
  });

  document.addEventListener("click", function (ev) {
    if (ev.target.closest("[data-set='lang']")) setTimeout(draw, 0);
  });

  draw();
})();
