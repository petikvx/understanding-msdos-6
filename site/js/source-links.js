/**
 * Transforme les pastilles .file-index en liens vers source.html
 */
(function () {
  "use strict";

  function hasExt(s) {
    return /\.[A-Za-z0-9]{1,8}$/.test(s);
  }

  function dirOf(p) {
    var i = p.lastIndexOf("/");
    return i === -1 ? "" : p.slice(0, i);
  }

  function parseToken(token, ctx) {
    token = token.replace(/\s+/g, " ").trim();
    if (!token) return null;
    var dir = token.charAt(token.length - 1) === "/";
    if (dir) token = token.replace(/\/+$/, "");
    if (token.indexOf("/") !== -1) {
      return { type: hasExt(token) && !dir ? "f" : "d", path: token };
    }
    if (hasExt(token) && ctx.fileDir) {
      return { type: "f", path: ctx.fileDir + "/" + token };
    }
    if (ctx.dirParent) {
      return { type: "d", path: ctx.dirParent + "/" + token };
    }
    if (ctx.fileDir) {
      return { type: hasExt(token) ? "f" : "d", path: ctx.fileDir + "/" + token };
    }
    return { type: "d", path: token };
  }

  function hrefFor(item) {
    var q = item.type === "f" ? "f" : "d";
    return "source.html?" + q + "=" + encodeURIComponent(item.path);
  }

  function enhance(span) {
    if (span.querySelector("a")) return;
    var small = span.querySelector("small");
    var raw = "";
    var node = span.firstChild;
    while (node && node !== small) {
      if (node.nodeType === 3) raw += node.nodeValue;
      node = node.nextSibling;
    }
    raw = raw.trim();
    if (!raw) return;
    var parts = raw.split(/\s*·\s*/);
    var frag = document.createDocumentFragment();
    var ctx = { fileDir: "", dirParent: "" };
    parts.forEach(function (part, idx) {
      if (idx) frag.appendChild(document.createTextNode(" · "));
      var item = parseToken(part, ctx);
      if (!item) {
        frag.appendChild(document.createTextNode(part));
        return;
      }
      if (item.type === "f") {
        ctx.fileDir = dirOf(item.path);
        ctx.dirParent = ctx.fileDir;
      } else {
        ctx.dirParent = dirOf(item.path) || item.path;
        ctx.fileDir = item.path;
      }
      var a = document.createElement("a");
      a.href = hrefFor(item);
      a.textContent = part.trim();
      a.className = "src-ref";
      frag.appendChild(a);
    });
    var n = span.firstChild;
    while (n && n !== small) {
      var next = n.nextSibling;
      if (n.nodeType === 3) span.removeChild(n);
      n = next;
    }
    span.insertBefore(frag, small || null);
  }

  function boot() {
    document.querySelectorAll(".file-index span").forEach(enhance);
    document.querySelectorAll("h2").forEach(function (h) {
      if (h.id !== "sources" && !/^\s*Sources\s*$/i.test(h.textContent)) return;
      if (h.querySelector(".src-all")) return;
      var a = document.createElement("a");
      a.className = "src-all";
      a.href = "source.html";
      a.innerHTML = "<span data-lang=\"fr\">Tout l’arbre</span><span data-lang=\"en\">Full tree</span>";
      h.appendChild(a);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
