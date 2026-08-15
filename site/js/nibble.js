(function () {
  "use strict";
  function hex(el) {
    var v = (el.value || "").replace(/[^0-9a-fA-F]/g, "").slice(0, 2);
    el.value = v.toUpperCase();
    return parseInt(v || "0", 16);
  }
  function run() {
    var b0 = hex(document.getElementById("nib0"));
    var b1 = hex(document.getElementById("nib1"));
    var b2 = hex(document.getElementById("nib2"));
    var even = ((b1 << 8) | b0) & 0x0fff;
    var odd = ((b2 << 8) | b1) >> 4;
    var out = document.getElementById("nib-out");
    if (out) {
      function p(n) { return ("000" + n.toString(16).toUpperCase()).slice(-4); }
      out.textContent = "pair 0" + p(even).slice(1) + " · impair 0" + p(odd).slice(1);
    }
  }
  ["nib0", "nib1", "nib2"].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener("input", run);
  });
  if (document.getElementById("nib-out")) run();
})();
