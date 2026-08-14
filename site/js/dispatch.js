/**
 * Sélecteur INT 21h — int21.html (#dispatch)
 * Données calées sur dos/mstable.asm DISPATCH + piles de msdisp.asm.
 */
(function () {
  "use strict";

  var root = document.getElementById("dispatch");
  if (!root) return;

  var CALLS = [
    { ah: "00", name: "$ABORT", stack: "Dsk", file: "msproc.asm", page: "", fr: "Termine le processus (INT 20h aussi). Toujours sur DskStack : il peut fermer des fichiers.", en: "Terminate the process (also INT 20h). Always on DskStack: it may close files." },
    { ah: "01", name: "$STD_CON_INPUT", stack: "Io", file: "cpmio.asm", page: "", fr: "AH=01–0Ch : ancien groupe CP/M. Pile IoStack, sauf pendant INT 24 (AuxStack).", en: "AH=01–0Ch: old CP/M group. IoStack, except during INT 24 (AuxStack)." },
    { ah: "09", name: "$STD_CON_STRING_OUTPUT", stack: "Io", file: "cpmio.asm", page: "", fr: "DS:DX → chaîne terminée par $. Toujours le groupe 1–12.", en: "DS:DX → $-terminated string. Still the 1–12 group." },
    { ah: "0F", name: "$FCB_OPEN", stack: "Dsk", file: "fcbio.asm", page: "fichiers.html#fcb", fr: "API FCB. À partir de AH=0Dh, on bascule sur DskStack.", en: "FCB API. From AH=0Dh onward, the dispatcher switches to DskStack." },
    { ah: "25", name: "$SET_INTERRUPT_VECTOR", stack: "Dsk", file: "getset.asm", page: "", fr: "Pose un vecteur. Première « extended function » après MaxCall.", en: "Sets a vector. First “extended function” after MaxCall." },
    { ah: "30", name: "$GET_VERSION", stack: "Dsk", file: "getset.asm", page: "", fr: "AL=majeur, AH=mineur. SETVER peut mentir à un exécutable nommé.", en: "AL=major, AH=minor. SETVER can lie to a named executable." },
    { ah: "31", name: "$Keep_Process", stack: "Dsk", file: "msproc.asm", page: "memoire.html", fr: "TSR : laisse le PSP et ses arènes. Lien direct avec la page Mémoire.", en: "TSR: leaves the PSP and its arenas. Direct link to the Memory page." },
    { ah: "33", name: "SET_CTRL_C_TRAPPING", stack: "user", file: "msdisp.asm", page: "", fr: "Chemin court : pas de SaveAllRegs. Exécuté sur la pile de l’appelant, CLI.", en: "Fast path: no SaveAllRegs. Runs on the caller’s stack, interrupts off." },
    { ah: "3C", name: "$CREAT", stack: "Dsk", file: "file.asm", page: "fichiers.html#open", fr: "Crée / tronque. Même AccessFile que $OPEN.", en: "Create / truncate. Same AccessFile as $OPEN." },
    { ah: "3D", name: "$OPEN", stack: "Dsk", file: "file.asm", page: "fichiers.html#open", fr: "La machine de la page Fichiers commence ici.", en: "The Files-page machine starts here." },
    { ah: "3E", name: "$CLOSE", stack: "Dsk", file: "handle.asm", page: "fichiers.html#close", fr: "JFN ← FFh puis DOS_CLOSE. Correctif Multiplan sur AH.", en: "JFN ← FFh then DOS_CLOSE. Multiplan fix on AH." },
    { ah: "3F", name: "$READ", stack: "Dsk", file: "handle.asm", page: "fichiers.html#lire", fr: "Handle → FNDCLUS → UNPACK → FIGREC.", en: "Handle → FNDCLUS → UNPACK → FIGREC." },
    { ah: "40", name: "$WRITE", stack: "Dsk", file: "handle.asm", page: "fichiers.html#lire", fr: "Même squelette que $READ, SI = DOS_Write.", en: "Same skeleton as $READ, SI = DOS_Write." },
    { ah: "42", name: "$LSEEK", stack: "Dsk", file: "handle.asm", page: "fichiers.html#lire", fr: "Ne touche que sf_position.", en: "Only touches sf_position." },
    { ah: "48", name: "$ALLOC", stack: "Dsk", file: "alloc.asm", page: "memoire.html", fr: "First / best / last fit. critMem.", en: "First / best / last fit. critMem." },
    { ah: "49", name: "$DEALLOC", stack: "Dsk", file: "alloc.asm", page: "memoire.html", fr: "ES = bloc, owner ← 0. Peut armer A20OFF_COUNT.", en: "ES = block, owner ← 0. May arm A20OFF_COUNT." },
    { ah: "4A", name: "$SETBLOCK", stack: "Dsk", file: "alloc.asm", page: "memoire.html", fr: "Coalesce puis coupe. BUGBUG : en cas d’échec, le coalesce reste.", en: "Coalesce then trim. BUGBUG: on failure the coalesce stays." },
    { ah: "4B", name: "$EXEC", stack: "Dsk", file: "msproc.asm", page: "", fr: "Charge un .COM/.EXE. Pose EXECA20OFF pour le prochain INT 21h.", en: "Loads a .COM/.EXE. Sets EXECA20OFF for the next INT 21h." },
    { ah: "4C", name: "$EXIT", stack: "Dsk", file: "msproc.asm", page: "memoire.html", fr: "arena_free_process(CurrentPDB) puis retour au parent.", en: "arena_free_process(CurrentPDB) then return to the parent." },
    { ah: "50", name: "$SET_CURRENT_PDB", stack: "user", file: "msdisp.asm", page: "", fr: "Autre chemin court : Set PSP, pile utilisateur, pas d’InDos++.", en: "Another fast path: Set PSP, user stack, no InDos++." },
    { ah: "51", name: "$GET_CURRENT_PDB", stack: "user", file: "msdisp.asm", page: "", fr: "Get PSP (aussi 62h). CROSSTALK / serveurs l’appellent n’importe quand.", en: "Get PSP (also 62h). CROSSTALK / servers call it at arbitrary times." },
    { ah: "58", name: "$AllocOper", stack: "Dsk", file: "alloc.asm", page: "memoire.html", fr: "Get/set stratégie et lien UMB (AL=0..3).", en: "Get/set strategy and UMB link (AL=0..3)." },
    { ah: "59", name: "$GetExtendedError", stack: "Aux", file: "misc.asm", page: "", fr: "Doit rester sur AuxStack : PRINT l’appelle depuis INT 24 / INT 28.", en: "Must stay on AuxStack: PRINT calls it from INT 24 / INT 28." },
    { ah: "67", name: "$ExtHandle", stack: "Dsk", file: "handle.asm", page: "fichiers.html#dup", fr: "Agrandit PDB_JFN_Table. Minimum 20.", en: "Grows PDB_JFN_Table. Minimum 20." }
  ];

  var grid = root.querySelector("[data-grid]");
  var card = root.querySelector("[data-card]");
  var say = root.querySelector("[data-say]");
  var current = "3D";

  function lang() {
    return document.documentElement.lang === "en" ? "en" : "fr";
  }

  function find(ah) {
    var i;
    for (i = 0; i < CALLS.length; i++) if (CALLS[i].ah === ah) return CALLS[i];
    return CALLS[0];
  }

  function stackName(s) {
    if (lang() === "en") {
      return { Dsk: "DskStack (disk / “the rest”)", Io: "IoStack (AH=01–0Ch)", Aux: "AuxStack (INT 24 / 59h)", user: "caller stack, CLI" }[s];
    }
    return { Dsk: "DskStack (disque / « le reste »)", Io: "IoStack (AH=01–0Ch)", Aux: "AuxStack (INT 24 / 59h)", user: "pile de l’appelant, CLI" }[s];
  }

  function renderGrid() {
    grid.innerHTML = CALLS.map(function (c) {
      return "<button type=\"button\" data-ah=\"" + c.ah + "\"" +
        (c.ah === current ? " aria-current=\"true\"" : "") +
        "><strong>" + c.ah + "h</strong>" + c.name.replace("$", "") + "</button>";
    }).join("");
  }

  function renderCard() {
    var c = find(current);
    var link = c.page
      ? "<a href=\"" + c.page + "\">" + c.page.split("#")[0] + "</a>"
      : "—";
    card.innerHTML =
      "<dt>AH</dt><dd>" + c.ah + "h</dd>" +
      "<dt>" + (lang() === "en" ? "Routine" : "Routine") + "</dt><dd>" + c.name + "</dd>" +
      "<dt>" + (lang() === "en" ? "Stack" : "Pile") + "</dt><dd>" + stackName(c.stack) + "</dd>" +
      "<dt>" + (lang() === "en" ? "Source" : "Source") + "</dt><dd>dos/" + c.file + "</dd>" +
      "<dt>" + (lang() === "en" ? "On this site" : "Sur ce site") + "</dt><dd>" + link + "</dd>";
    say.textContent = c[lang()];
  }

  function show(ah) {
    current = ah;
    renderGrid();
    renderCard();
  }

  root.addEventListener("click", function (ev) {
    var t = ev.target.closest("[data-ah]");
    if (t) show(t.getAttribute("data-ah"));
  });

  document.addEventListener("click", function (ev) {
    if (ev.target.closest("[data-set='lang']")) setTimeout(renderCard, 0);
  });

  show(current);
})();
