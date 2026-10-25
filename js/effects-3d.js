/* ==========================================================================
   Crea Tech Design — effets 3D et mouvements
   Sommaire :
   1. Réglages communs
   2. Écran de chargement (accueil)
   3. Titre du hero qui apparaît mot par mot
   4. Progression au scroll : --progress de 0 à 1
      - [data-scroll3d]            section qui entre en 3D
      - [data-progress="enter"]    0 quand le bloc entre en bas de l'écran, 1 aux 2/5 de la hauteur
      - [data-progress="line"]     ligne lumineuse (étapes, frise) qui allume ses enfants au passage
      - [data-progress="exit"]     0 → 1 pendant que le bloc sort par le haut (hero)
      Les enfants [data-at="0.9"] reçoivent .is-on quand --progress atteint leur seuil.
   5. Profondeur à la souris : [data-parallax] reçoit --px / --py (-0.5 → 0.5)
   6. Curseur personnalisé (ordinateur uniquement)
   Tout est désactivé si « Réduire les animations » est actif : le contenu reste
   affiché dans sa position finale.
   ========================================================================== */
(function () {
  "use strict";

  /* ---- 1. Réglages communs ---- */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var raf = window.requestAnimationFrame.bind(window);
  var root = document.documentElement;

  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

  if (!reduceMotion) root.classList.add("js-3d");

  /* ---- 2. Écran de chargement : animé en CSS, il disparaît seul (< 1 s) ---- */
  var loader = document.querySelector(".loader");
  if (loader) {
    var removeLoader = function () { if (loader.parentNode) loader.parentNode.removeChild(loader); };
    if (reduceMotion) removeLoader();
    loader.addEventListener("animationend", function (e) {
      if (e.target === loader && e.animationName === "loader-out") removeLoader();
    });
    setTimeout(removeLoader, 1500); // sécurité
  }

  if (reduceMotion) return;

  /* ---- 3. Titre du hero : chaque mot monte et sort du flou ---- */
  function splitWords(title) {
    var index = 0;
    title.setAttribute("aria-label", title.textContent.replace(/\s+/g, " ").trim());
    Array.prototype.slice.call(title.childNodes).forEach(function (node) {
      if (node.nodeType === 3) {
        var frag = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
          var word = document.createElement("span");
          word.className = "word";
          word.textContent = part;
          word.setAttribute("aria-hidden", "true");
          word.style.setProperty("--i", index++);
          frag.appendChild(word);
        });
        node.parentNode.replaceChild(frag, node);
      } else if (node.nodeType === 1) {
        // Un mot-clé en dégradé reste d'un seul bloc
        node.classList.add("word");
        node.setAttribute("aria-hidden", "true");
        node.style.setProperty("--i", index++);
      }
    });
  }
  var heroTitle = document.querySelector(".hero h1");
  if (heroTitle) splitWords(heroTitle);

  /* ---- 4. Progression au scroll ---- */
  var tracked = [];
  document.querySelectorAll("[data-scroll3d], [data-progress]").forEach(function (el) {
    tracked.push({ el: el, mode: el.getAttribute("data-progress") || "enter", visible: true, last: -1, marks: [] });
  });

  // Seuils des enfants : explicites (data-at) ou calculés pour les lignes lumineuses
  function computeMarks(t) {
    if (t.mode === "line") {
      var kids = Array.prototype.slice.call(t.el.children);
      var vertical = getComputedStyle(t.el).getPropertyValue("--axis").trim() === "y";
      var height = t.el.offsetHeight || 1;
      t.marks = kids.map(function (kid, i) {
        var at = vertical
          ? (kid.offsetTop + Math.min(40, kid.offsetHeight * 0.3)) / height
          : (kids.length > 1 ? i / (kids.length - 1) : 0);
        return { el: kid, at: Math.max(0.02, at) };
      });
    } else {
      t.marks = Array.prototype.map.call(t.el.querySelectorAll("[data-at]"), function (kid) {
        return { el: kid, at: parseFloat(kid.getAttribute("data-at")) || 1 };
      });
    }
    t.last = -1;
  }

  function measure(t, vh) {
    var r = t.el.getBoundingClientRect();
    var p;
    if (t.mode === "exit") p = -r.top / (r.height || 1);
    else if (t.mode === "line") p = (vh * 0.72 - r.top) / Math.max(r.height, vh * 0.35);
    else p = (vh - r.top) / (vh * 0.6);
    p = clamp01(p);
    if (Math.abs(p - t.last) < 0.001) return;
    t.last = p;
    t.el.style.setProperty("--progress", p.toFixed(3));
    t.el.classList.toggle("is-done", p >= 0.999);
    for (var i = 0; i < t.marks.length; i++) {
      t.marks[i].el.classList.toggle("is-on", p >= t.marks[i].at - 0.001);
    }
  }

  var scrollQueued = false;
  function update(all) {
    scrollQueued = false;
    var vh = window.innerHeight;
    for (var i = 0; i < tracked.length; i++) {
      if (all || tracked[i].visible) measure(tracked[i], vh);
    }
  }
  function refresh() {
    tracked.forEach(computeMarks);
    update(true);
  }

  if (tracked.length) {
    refresh();
    // Seuls les blocs proches de l'écran sont recalculés pendant le scroll
    if ("IntersectionObserver" in window) {
      var progressIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          tracked.forEach(function (t) {
            if (t.el !== entry.target) return;
            t.visible = entry.isIntersecting;
            if (!t.visible) measure(t, window.innerHeight); // fige l'état final en sortant
          });
        });
      }, { rootMargin: "15% 0px 15% 0px" });
      tracked.forEach(function (t) { progressIo.observe(t.el); });
    }
    window.addEventListener("scroll", function () {
      if (!scrollQueued) { scrollQueued = true; raf(function () { update(false); }); }
    }, { passive: true });
    var resizeQueued = 0;
    window.addEventListener("resize", function () {
      if (!resizeQueued) resizeQueued = raf(function () { resizeQueued = 0; refresh(); });
    });
    window.addEventListener("load", refresh);
  }

  /* ---- 5. Profondeur à la souris ---- */
  if (finePointer) {
    document.querySelectorAll("[data-parallax]").forEach(function (zone) {
      var cur = { x: 0, y: 0 }, target = { x: 0, y: 0 }, frame = 0;
      function render() {
        cur.x += (target.x - cur.x) * 0.08;
        cur.y += (target.y - cur.y) * 0.08;
        zone.style.setProperty("--px", cur.x.toFixed(4));
        zone.style.setProperty("--py", cur.y.toFixed(4));
        var moving = Math.abs(target.x - cur.x) > 0.0005 || Math.abs(target.y - cur.y) > 0.0005;
        frame = moving ? raf(render) : 0;
      }
      zone.addEventListener("pointermove", function (e) {
        if (e.pointerType !== "mouse") return;
        var r = zone.getBoundingClientRect();
        target.x = clamp01((e.clientX - r.left) / r.width) - 0.5;
        target.y = clamp01((e.clientY - r.top) / r.height) - 0.5;
        if (!frame) frame = raf(render);
      });
      zone.addEventListener("pointerleave", function () {
        target.x = 0;
        target.y = 0;
        if (!frame) frame = raf(render);
      });
    });
  }

  /* ---- 6. Curseur personnalisé : petit cercle qui suit la souris avec un léger retard ---- */
  if (finePointer) {
    var CLICKABLE = "a, button, summary, label, select, input, textarea, [role='button'], [data-tilt], .skill";
    var cursor = document.createElement("div");
    cursor.className = "cursor";
    cursor.setAttribute("aria-hidden", "true");
    cursor.innerHTML = '<span class="cursor__ring"></span>';
    document.body.appendChild(cursor);

    var pos = { x: -100, y: -100 }, aim = { x: -100, y: -100 }, cursorFrame = 0;
    function follow() {
      pos.x += (aim.x - pos.x) * 0.2;
      pos.y += (aim.y - pos.y) * 0.2;
      cursor.style.transform = "translate3d(" + pos.x.toFixed(1) + "px, " + pos.y.toFixed(1) + "px, 0)";
      var moving = Math.abs(aim.x - pos.x) > 0.1 || Math.abs(aim.y - pos.y) > 0.1;
      cursorFrame = moving ? raf(follow) : 0;
    }
    document.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      aim.x = e.clientX;
      aim.y = e.clientY;
      if (!cursor.classList.contains("is-visible")) {
        pos.x = aim.x;
        pos.y = aim.y;
        cursor.classList.add("is-visible");
      }
      if (!cursorFrame) cursorFrame = raf(follow);
    }, { passive: true });
    document.addEventListener("pointerover", function (e) {
      cursor.classList.toggle("is-hover", !!(e.target.closest && e.target.closest(CLICKABLE)));
    });
    document.addEventListener("pointerdown", function () { cursor.classList.add("is-down"); });
    document.addEventListener("pointerup", function () { cursor.classList.remove("is-down"); });
    document.documentElement.addEventListener("mouseleave", function () { cursor.classList.remove("is-visible"); });
  }
})();
