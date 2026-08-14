/**
 * Simulateur first / best / last fit — memoire.html (#arena)
 * Tailles en paragraphes (comme arena_size). En-tête 4Dh/5Ah non compté dans la barre.
 */
(function () {
  "use strict";

  var root = document.getElementById("arena");
  if (!root) return;

  function seed() {
    return [
      { sig: "4D", owner: "DOS", size: 16, kind: "dos" },
      { sig: "4D", owner: "COMMAND", size: 24, kind: "used" },
      { sig: "4D", owner: "", size: 12, kind: "free" },
      { sig: "4D", owner: "EDIT", size: 6, kind: "used" },
      { sig: "4D", owner: "", size: 20, kind: "free" },
      { sig: "5A", owner: "", size: 8, kind: "free" }
    ];
  }

  var blocks = seed();
  var pick = -1;
  var bar = root.querySelector("[data-arena]");
  var say = root.querySelector("[data-say]");
  var sizeIn = root.querySelector("[data-size]");

  function lang() {
    return document.documentElement.lang === "en" ? "en" : "fr";
  }

  function draw() {
    var html = "";
    var i;
    for (i = 0; i < blocks.length; i++) {
      var b = blocks[i];
      var cls = b.kind;
      if (i === pick) cls += " pick";
      if (b.fresh) cls += " new";
      var name = b.owner || (lang() === "en" ? "free" : "libre");
      html += "<span class=\"" + cls + "\" style=\"flex:" + b.size +
        "\"><b>" + String.fromCharCode(parseInt(b.sig, 16)) + " " + name +
        "</b><i>" + b.size + "p</i></span>";
    }
    bar.innerHTML = html;
  }

  function candidates(need) {
    var out = [];
    var i;
    for (i = 0; i < blocks.length; i++) {
      if (blocks[i].kind === "free" && blocks[i].size >= need) out.push(i);
    }
    return out;
  }

  function choose(need, strat) {
    var c = candidates(need);
    if (!c.length) return -1;
    if (strat === "first") return c[0];
    if (strat === "last") return c[c.length - 1];
    var best = c[0];
    var i;
    for (i = 1; i < c.length; i++) {
      if (blocks[c[i]].size < blocks[best].size) best = c[i];
    }
    return best;
  }

  function split(idx, need, strat) {
    var b = blocks[idx];
    var left = b.size - need;
    blocks.forEach(function (x) { x.fresh = false; });
    if (left === 0) {
      b.owner = "APP";
      b.kind = "used";
      b.fresh = true;
      if (idx === blocks.length - 1) b.sig = "5A";
      else b.sig = "4D";
      return;
    }
    var used = { sig: "4D", owner: "APP", size: need, kind: "used", fresh: true };
    var rest = { sig: b.sig, owner: "", size: left, kind: "free", fresh: false };
    if (strat === "last") {
      /* LAST_FIT : la partie demandée est en haut (fin du bloc) */
      rest.sig = "4D";
      used.sig = b.sig;
      blocks.splice(idx, 1, rest, used);
      pick = idx + 1;
    } else {
      blocks.splice(idx, 1, used, rest);
      pick = idx;
    }
  }

  function explain(need, strat, idx) {
    var L = lang();
    if (idx < 0) {
      return L === "en"
        ? "No free block ≥ " + need + " paragraphs. $ALLOC would return CF=1, AX=8, BX=max."
        : "Aucun bloc libre ≥ " + need + " paragraphes. $ALLOC rendrait CF=1, AX=8, BX=max.";
    }
    var names = { first: "FirstArena", best: "BestArena", last: "LastArena" };
    var how = {
      first: L === "en" ? "first free block that fits" : "premier trou assez grand",
      best: L === "en" ? "smallest free block that fits" : "plus petit trou assez grand",
      last: L === "en" ? "last free block that fits, split high" : "dernier trou assez grand, scindé par le haut"
    };
    return (L === "en" ? "Strategy " : "Stratégie ") + names[strat] +
      " — " + how[strat] +
      (L === "en"
        ? ". Owner = CurrentPDB, returned AX = header+1."
        : ". Owner = CurrentPDB, AX rendu = en-tête+1.");
  }

  function alloc(strat) {
    var need = parseInt(sizeIn.value, 10);
    if (!(need > 0)) need = 8;
    var idx = choose(need, strat);
    pick = idx;
    if (idx >= 0) split(idx, need, strat);
    say.textContent = explain(need, strat, idx);
    draw();
  }

  root.addEventListener("click", function (ev) {
    var t = ev.target.closest("[data-mem]");
    if (!t) return;
    var cmd = t.getAttribute("data-mem");
    if (cmd === "reset") {
      blocks = seed();
      pick = -1;
      say.textContent = lang() === "en"
        ? "Conventional chain as MEM would sketch it. Pick a strategy."
        : "Chaîne conventionnelle, telle que MEM la croquerait. Choisissez une stratégie.";
      draw();
      return;
    }
    alloc(cmd);
  });

  document.addEventListener("click", function (ev) {
    if (ev.target.closest("[data-set='lang']")) setTimeout(draw, 0);
  });

  say.textContent = lang() === "en"
    ? "Conventional chain as MEM would sketch it. Pick a strategy."
    : "Chaîne conventionnelle, telle que MEM la croquerait. Choisissez une stratégie.";
  draw();
})();
