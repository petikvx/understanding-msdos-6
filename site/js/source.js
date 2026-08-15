/**
 * Explorateur du dépôt ms-dos-6-source-code/
 * ?f=bios/sysconf.asm   fichier
 * ?d=cmd/mode           dossier
 * #L42                  ligne
 */
(function () {
  "use strict";

  var ROOT = "../ms-dos-6-source-code/";
  var treeEl = document.getElementById("src-tree");
  var crumbEl = document.getElementById("src-crumb");
  var metaEl = document.getElementById("src-meta");
  var emptyEl = document.getElementById("src-empty");
  var viewEl = document.getElementById("src-view");
  var gutterEl = document.getElementById("src-gutter");
  var codeEl = document.getElementById("src-code");
  var errEl = document.getElementById("src-err");
  var filterEl = document.getElementById("src-filter");
  var toggleEl = document.getElementById("src-toggle");
  var sideEl = document.getElementById("src-side");

  var paths = [];
  var tree = {};
  var openDirs = {};
  var currentFile = "";

  function lang() {
    return document.documentElement.lang === "en" ? "en" : "fr";
  }

  function t(fr, en) {
    return lang() === "en" ? en : fr;
  }

  function safePath(p) {
    if (!p) return "";
    p = decodeURIComponent(p).replace(/\\/g, "/").replace(/^\/+/, "");
    if (p.indexOf("..") !== -1) return "";
    return p;
  }

  function extOf(p) {
    var m = /\.([A-Za-z0-9]+)$/.exec(p);
    return m ? m[1].toLowerCase() : "";
  }

  function buildTree(list) {
    var root = {};
    list.forEach(function (rel) {
      var parts = rel.split("/");
      var node = root;
      for (var i = 0; i < parts.length; i++) {
        var part = parts[i];
        var last = i === parts.length - 1;
        if (last) {
          node[part] = rel;
        } else {
          if (!node[part] || typeof node[part] === "string") node[part] = {};
          node = node[part];
        }
      }
    });
    return root;
  }

  function childrenOf(node) {
    var dirs = [];
    var files = [];
    Object.keys(node).sort(function (a, b) {
      return a.toLowerCase() < b.toLowerCase() ? -1 : 1;
    }).forEach(function (k) {
      if (typeof node[k] === "string") files.push(k);
      else dirs.push(k);
    });
    return { dirs: dirs, files: files };
  }

  function renderTree(filter) {
    treeEl.textContent = "";
    var q = (filter || "").trim().toLowerCase();
    if (q) {
      var hits = paths.filter(function (p) { return p.toLowerCase().indexOf(q) !== -1; }).slice(0, 200);
      var ul = document.createElement("ul");
      hits.forEach(function (p) {
        ul.appendChild(fileItem(p, p));
      });
      if (!hits.length) {
        var li = document.createElement("li");
        li.className = "src-empty-hit";
        li.textContent = t("Aucun fichier", "No files");
        ul.appendChild(li);
      }
      treeEl.appendChild(ul);
      return;
    }
    treeEl.appendChild(renderDir(tree, "", 0));
  }

  function renderDir(node, prefix, depth) {
    var ul = document.createElement("ul");
    var ch = childrenOf(node);
    ch.dirs.forEach(function (name) {
      var path = prefix ? prefix + "/" + name : name;
      var li = document.createElement("li");
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "src-dir" + (openDirs[path] ? " is-open" : "");
      btn.setAttribute("aria-expanded", openDirs[path] ? "true" : "false");
      btn.innerHTML = "<span class=\"ico\" aria-hidden=\"true\"></span>" + escapeHtml(name);
      btn.addEventListener("click", function () {
        openDirs[path] = !openDirs[path];
        if (openDirs[path]) history.replaceState(null, "", "source.html?d=" + encodeURIComponent(path) + location.hash);
        renderTree(filterEl.value);
      });
      li.appendChild(btn);
      if (openDirs[path]) li.appendChild(renderDir(node[name], path, depth + 1));
      ul.appendChild(li);
    });
    ch.files.forEach(function (name) {
      var rel = typeof node[name] === "string" ? node[name] : (prefix ? prefix + "/" + name : name);
      ul.appendChild(fileItem(name, rel));
    });
    return ul;
  }

  function fileItem(label, rel) {
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.className = "src-file" + (rel === currentFile ? " is-current" : "");
    a.href = "source.html?f=" + encodeURIComponent(rel);
    a.textContent = label;
    a.addEventListener("click", function (ev) {
      ev.preventDefault();
      openFile(rel, true);
    });
    li.appendChild(a);
    return li;
  }

  function setCrumb(rel, isFile) {
    crumbEl.textContent = "";
    var home = document.createElement("li");
    var ha = document.createElement("a");
    ha.href = "source.html";
    ha.textContent = "ms-dos-6-source-code";
    ha.addEventListener("click", function (ev) {
      ev.preventDefault();
      currentFile = "";
      history.pushState(null, "", "source.html");
      showEmpty();
    });
    home.appendChild(ha);
    crumbEl.appendChild(home);
    if (!rel) return;
    var parts = rel.split("/");
    var acc = [];
    parts.forEach(function (part, i) {
      acc.push(part);
      var path = acc.join("/");
      var li = document.createElement("li");
      var last = i === parts.length - 1;
      if (last && isFile) {
        li.textContent = part;
      } else {
        var a = document.createElement("a");
        a.href = "source.html?d=" + encodeURIComponent(path);
        a.textContent = part;
        a.addEventListener("click", function (ev) {
          ev.preventDefault();
          revealDir(path);
          history.pushState(null, "", "source.html?d=" + encodeURIComponent(path));
        });
        li.appendChild(a);
      }
      crumbEl.appendChild(li);
    });
  }

  function revealDir(dir) {
    var acc = [];
    dir.split("/").forEach(function (p) {
      acc.push(p);
      openDirs[acc.join("/")] = true;
    });
    renderTree(filterEl.value);
  }

  function showEmpty() {
    emptyEl.hidden = false;
    viewEl.hidden = true;
    errEl.hidden = true;
    metaEl.textContent = "";
    setCrumb("", false);
    document.title = t("Sources — Comprendre MS-DOS 6", "Sources — Understanding MS-DOS 6");
  }

  function showErr(msg) {
    emptyEl.hidden = true;
    viewEl.hidden = true;
    errEl.hidden = false;
    errEl.textContent = msg;
  }

  function openFile(rel, push) {
    rel = safePath(rel);
    if (!rel) return;
    currentFile = rel;
    var parts = rel.split("/");
    parts.pop();
    if (parts.length) revealDir(parts.join("/"));
    else renderTree(filterEl.value);
    setCrumb(rel, true);
    emptyEl.hidden = true;
    errEl.hidden = true;
    viewEl.hidden = false;
    metaEl.textContent = t("Chargement…", "Loading…");
    codeEl.textContent = "";
    gutterEl.textContent = "";
    if (push) history.pushState({ f: rel }, "", "source.html?f=" + encodeURIComponent(rel) + location.hash);
    document.title = rel + " — MS-DOS 6";

    fetch(ROOT + rel).then(function (res) {
      if (!res.ok) throw new Error(res.status);
      return res.arrayBuffer();
    }).then(function (buf) {
      var bytes = new Uint8Array(buf);
      if (bytes.length && bytes.indexOf(0) !== -1) {
        throw new Error("binary");
      }
      var text = decodeText(bytes);
      renderCode(text, rel);
      var lines = text.split(/\r?\n/).length;
      metaEl.textContent = lines + " " + t("lignes", "lines") + " · " + bytes.length + " o";
      scrollToHash();
    }).catch(function (e) {
      if (e.message === "binary") {
        showErr(t("Fichier binaire, non affiché.", "Binary file, not shown."));
      } else {
        showErr(t("Impossible de charger ce fichier.", "Could not load this file."));
      }
      metaEl.textContent = "";
    });
  }

  function decodeText(bytes) {
    try {
      return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    } catch (e) {
      return new TextDecoder("iso-8859-1").decode(bytes);
    }
  }

  function renderCode(text, rel) {
    var ext = extOf(rel);
    var kind = kindOf(ext, rel);
    var lines = text.replace(/\t/g, "    ").split(/\r?\n/);
    var gutter = [];
    var html = [];
    var w = String(lines.length).length;
    for (var i = 0; i < lines.length; i++) {
      var n = i + 1;
      var pad = String(n);
      while (pad.length < w) pad = " " + pad;
      gutter.push("<a id=\"L" + n + "\" href=\"#L" + n + "\">" + pad + "</a>");
      html.push(colorLine(lines[i], kind));
    }
    gutterEl.innerHTML = gutter.join("\n");
    codeEl.innerHTML = html.join("\n") + "\n";
  }

  function kindOf(ext, rel) {
    if (/^(c|h|cpp|hpp|cc)$/.test(ext)) return "c";
    if (/^(asm|inc|equ|mac|skl)$/.test(ext)) return "asm";
    if (/^(bat|cmd)$/.test(ext)) return "bat";
    if (rel.toLowerCase().indexOf("makefile") !== -1) return "make";
    if (/^(lnk|def|pro)$/.test(ext)) return "asm";
    return "txt";
  }

  var ASM_KW = wordSet("assume segment ends proc endp macro endm include extrn extern public db dw dd dt equ org offset ptr near far byte word dword qword para page title .model .code .data .stack .386 .286 if ifdef ifndef if1 if2 else elseif endif repeat rept irp irpc exitm local call jmp jz jnz je jne ja jb jc jnc jl jg jle jge jae jbe js jns jo jno jp jnp loop loope loopne ret retn retf iret int into mov movsb movsw movzx movsx push pop pusha popa pushf popf lea les lds lfs lgs lss xor and or not neg cmp test add adc sub sbb inc dec shl shr sal sar rol ror rcl rcr xchg stosb stosw lodsb lodsw scasb cmpsb rep repe repne repz repnz clc stc cmc cld std cli sti nop hlt cbw cwd cdq mul imul div idiv in out insb outsb bound arpl enter leave xlat lahf sahf");
  var ASM_REG = wordSet("ax bx cx dx si di bp sp al ah bl bh cl ch dl dh eax ebx ecx edx esi edi ebp esp cs ds es ss fs gs ip eip flags cr0 cr2 cr3 tr6 tr7 st");
  var C_KW = wordSet("auto break case char const continue default do double else enum extern float for goto if inline int long register restrict return short signed sizeof static struct switch typedef union unsigned void volatile while _asm __asm near far pascal cdecl fortran interrupt huge");
  var C_TYPE = wordSet("BYTE WORD DWORD BOOL VOID CHAR UCHAR UINT ULONG LPSTR LPCSTR HANDLE FILE NULL TRUE FALSE");

  function wordSet(s) {
    var o = {};
    s.split(/\s+/).forEach(function (w) { o[w] = true; });
    return o;
  }

  function escapeHtml(s) {
    return s.replace(/[&<>]/g, function (c) {
      return c === "&" ? "&amp;" : c === "<" ? "&lt;" : "&gt;";
    });
  }

  function span(cls, s) {
    return "<span class=\"sy-" + cls + "\">" + escapeHtml(s) + "</span>";
  }

  function colorLine(line, kind) {
    if (kind === "txt") return escapeHtml(line);
    if (kind === "bat") return colorBat(line);
    if (kind === "c") return colorC(line);
    return colorAsm(line);
  }

  function colorAsm(line) {
    var out = "";
    var i = 0;
    var n = line.length;
    function peek() { return line.charAt(i); }
    while (i < n) {
      var c = peek();
      if (c === ";" || (c === "/" && line.charAt(i + 1) === "/")) {
        out += span("com", line.slice(i));
        break;
      }
      if (c === '"' || c === "'") {
        var q = c;
        var j = i + 1;
        while (j < n && line.charAt(j) !== q) j++;
        if (j < n) j++;
        out += span("str", line.slice(i, j));
        i = j;
        continue;
      }
      if (/[0-9]/.test(c) || (c === "0" && /[xX]/.test(line.charAt(i + 1)))) {
        var k = i;
        while (k < n && /[0-9A-Fa-fxhHoOqQ]/.test(line.charAt(k))) k++;
        out += span("num", line.slice(i, k));
        i = k;
        continue;
      }
      if (/[A-Za-z_$.?]/.test(c)) {
        var m = i;
        while (m < n && /[A-Za-z0-9_$@.?]/.test(line.charAt(m))) m++;
        var word = line.slice(i, m);
        var rest = line.slice(m).replace(/^\s+/, "");
        var low = word.toLowerCase();
        if (rest.charAt(0) === ":" && i === line.search(/\S/)) {
          out += span("lab", word);
        } else if (ASM_KW[low] || word.charAt(0) === ".") {
          out += span("kw", word);
        } else if (ASM_REG[low]) {
          out += span("reg", word);
        } else if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(word) && /^[A-Z0-9_]+$/.test(word) && word.length > 2) {
          out += span("id", word);
        } else {
          out += escapeHtml(word);
        }
        i = m;
        continue;
      }
      out += escapeHtml(c);
      i++;
    }
    return out || " ";
  }

  function colorC(line) {
    var out = "";
    var i = 0;
    var n = line.length;
    var trimmed = line.replace(/^\s+/, "");
    if (trimmed.charAt(0) === "#") {
      return span("pp", line);
    }
    while (i < n) {
      var c = line.charAt(i);
      if (c === "/" && line.charAt(i + 1) === "/") {
        out += span("com", line.slice(i));
        break;
      }
      if (c === "/" && line.charAt(i + 1) === "*") {
        var end = line.indexOf("*/", i + 2);
        if (end === -1) {
          out += span("com", line.slice(i));
          break;
        }
        out += span("com", line.slice(i, end + 2));
        i = end + 2;
        continue;
      }
      if (c === '"' || c === "'") {
        var q = c, j = i + 1;
        while (j < n) {
          if (line.charAt(j) === "\\") { j += 2; continue; }
          if (line.charAt(j) === q) { j++; break; }
          j++;
        }
        out += span("str", line.slice(i, j));
        i = j;
        continue;
      }
      if (/[0-9]/.test(c)) {
        var k = i;
        while (k < n && /[0-9A-Fa-fxXuUlL.]/.test(line.charAt(k))) k++;
        out += span("num", line.slice(i, k));
        i = k;
        continue;
      }
      if (/[A-Za-z_]/.test(c)) {
        var m = i;
        while (m < n && /[A-Za-z0-9_]/.test(line.charAt(m))) m++;
        var word = line.slice(i, m);
        if (C_KW[word]) out += span("kw", word);
        else if (C_TYPE[word]) out += span("id", word);
        else out += escapeHtml(word);
        i = m;
        continue;
      }
      out += escapeHtml(c);
      i++;
    }
    return out || " ";
  }

  function colorBat(line) {
    if (/^\s*(rem\b|::)/i.test(line)) return span("com", line);
    return escapeHtml(line).replace(/^(\s*)(@?echo|set|if|goto|call|exist|not|equ|neq)\b/i, function (_, sp, kw) {
      return sp + "<span class=\"sy-kw\">" + kw + "</span>";
    });
  }

  function scrollToHash() {
    var m = /^#L(\d+)$/.exec(location.hash);
    if (!m) return;
    var el = document.getElementById("L" + m[1]);
    if (el) {
      el.classList.add("is-target");
      el.scrollIntoView({ block: "center" });
    }
  }

  function parseQuery() {
    var q = location.search.replace(/^\?/, "");
    var out = {};
    q.split("&").forEach(function (part) {
      if (!part) return;
      var kv = part.split("=");
      out[decodeURIComponent(kv[0])] = decodeURIComponent(kv.slice(1).join("=") || "");
    });
    return out;
  }

  function applyQuery() {
    var q = parseQuery();
    var f = safePath(q.f || "");
    var d = safePath(q.d || "");
    if (f) openFile(f, false);
    else if (d) {
      currentFile = "";
      revealDir(d);
      setCrumb(d, false);
      showEmpty();
      emptyEl.querySelector("[data-lang=fr]").textContent =
        "Dossier " + d + " — choisis un fichier à gauche.";
      emptyEl.querySelector("[data-lang=en]").textContent =
        "Folder " + d + " — pick a file on the left.";
    } else {
      showEmpty();
      renderTree(filterEl.value);
    }
  }

  filterEl.addEventListener("input", function () {
    renderTree(filterEl.value);
  });

  toggleEl.addEventListener("click", function () {
    var open = !document.body.classList.contains("src-tree-collapsed");
    document.body.classList.toggle("src-tree-collapsed", open);
    toggleEl.setAttribute("aria-expanded", open ? "false" : "true");
  });

  window.addEventListener("popstate", applyQuery);
  window.addEventListener("hashchange", scrollToHash);
  document.addEventListener("msdos-lang", function () {
    if (!currentFile) showEmpty();
  });

  fetch("js/sourcetree.json").then(function (r) { return r.json(); }).then(function (list) {
    paths = list;
    tree = buildTree(list);
    applyQuery();
  }).catch(function () {
    showErr(t("Index de l’arbre introuvable (sourcetree.json).", "Tree index missing (sourcetree.json)."));
  });
})();
