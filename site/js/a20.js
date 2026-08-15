(function () {
  "use strict";
  var box = document.getElementById("a20on");
  var out = document.getElementById("a20out");
  var lab = document.getElementById("a20lab");
  if (!box || !out) return;
  function run() {
    var on = box.checked;
    out.textContent = on ? "0010:0000  (HMA)" : "0000:0000  (wrap 8086)";
    if (lab) {
      lab.textContent = on
        ? (document.documentElement.lang === "en" ? "copy-protect fails" : "la copie protégée échoue")
        : (document.documentElement.lang === "en" ? "8086 wrap — apps happy" : "wrap 8086 — les applis sont contentes");
    }
  }
  box.addEventListener("change", run);
  document.addEventListener("msdos-lang", run);
  run();
})();
