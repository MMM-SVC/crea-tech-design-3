/* ==========================================================================
   Crea Tech Design — scripts du site
   Sommaire :
   1. Réglages communs
   2. Header, barre de progression, menu burger
   3. Apparitions au scroll
   4. Pause des animations hors écran
   5. Réseau de particules du hero
   6. Inclinaison 3D [data-tilt], boutons magnétiques, halo
   7. Compteurs animés [data-count]
   8. Cartes de l'équipe qui se retournent [data-flip]
   9. Infobulles des compétences
   10. Tarifs : cadre lumineux qui suit l'offre survolée
   11. FAQ : ouverture animée
   11 bis. Vidéo de présentation (accueil)
   12. Formulaire de contact
   (La vitrine du hero et sa modale sont dans js/showcase.js,
    les effets 3D de scroll, le curseur et le chargement dans js/effects-3d.js)
   ========================================================================== */
(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");

  /* ---- 1. Réglages communs ---- */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Souris précise (ordinateur) : active les effets qui suivent le curseur
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var raf = window.requestAnimationFrame.bind(window);

  function onVisibility(el, callback, options) {
    if (!("IntersectionObserver" in window)) { callback(true); return; }
    new IntersectionObserver(function (entries) {
      callback(entries[entries.length - 1].isIntersecting);
    }, options).observe(el);
  }

  /* ---- Année dynamique du footer ---- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---- 2. Ombre du header + barre de progression de lecture ---- */
  var header = document.querySelector(".site-header");
  var progress = document.createElement("div");
  progress.className = "read-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.insertBefore(progress, document.body.firstChild);

  var scrollTicking = false;
  var onScroll = function () {
    scrollTicking = false;
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 8);
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    progress.style.transform = "scaleX(" + ratio.toFixed(4) + ")";
  };
  onScroll();
  window.addEventListener("scroll", function () {
    if (!scrollTicking) { scrollTicking = true; raf(onScroll); }
  }, { passive: true });
  window.addEventListener("resize", onScroll);

  /* ---- Menu burger (mobile) ---- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("nav");
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
      nav.classList.toggle("is-open", open);
    };
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { setOpen(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
  }

  /* ---- 3. Apparition des éléments au scroll ---- */
  // Les cartes d'une même grille qui apparaissent ensemble sont décalées (stagger).
  var STAGGER_GROUPS = ".grid, .pricing, .steps, .faq, .team, .contact";
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      var batch = 0;
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        if (!reduceMotion && el.parentElement && el.parentElement.matches(STAGGER_GROUPS)) {
          el.style.transitionDelay = Math.min(batch * 90, 450) + "ms";
          batch++;
          // On retire le délai ensuite pour ne pas ralentir les effets de survol
          setTimeout(function () { el.style.transitionDelay = ""; }, 1400);
        }
        el.classList.add("is-visible");
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---- 4. Pause des animations CSS quand le bloc est hors écran ---- */
  function initPauseOffscreen() {
    if (reduceMotion || !("IntersectionObserver" in window)) return;
    var els = document.querySelectorAll(".hero, .page-hero, .subscription, .avatar, .team__x, .duo__x, .shield3d, .zone__map, .cta");
    var pauseIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { entry.target.classList.toggle("is-paused", !entry.isIntersecting); });
    }, { rootMargin: "80px 0px" });
    els.forEach(function (el) { pauseIo.observe(el); });
  }

  /* ---- 5. Réseau de particules du hero ---- */
  function initParticles() {
    var canvas = document.querySelector("[data-particles]");
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext("2d");
    var zone = canvas.parentElement;
    var MAX = 60, LINK = 130, MOUSE_RADIUS = 150;
    var points = [], w = 0, h = 0;
    var mouse = { x: 0, y: 0, active: false };
    var running = false, onScreen = true, frame = 0;

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = zone.clientWidth;
      h = zone.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.min(MAX, Math.round((w * h) / 15000));
      while (points.length < count) {
        points.push({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
          ox: 0, oy: 0, r: 1 + Math.random() * 1.6
        });
      }
      points.length = count;
      draw();
    }

    function step() {
      points.forEach(function (p) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) { p.x = 0; p.vx = Math.abs(p.vx); }
        if (p.x > w) { p.x = w; p.vx = -Math.abs(p.vx); }
        if (p.y < 0) { p.y = 0; p.vy = Math.abs(p.vy); }
        if (p.y > h) { p.y = h; p.vy = -Math.abs(p.vy); }
        // Les points s'écartent doucement du curseur puis reviennent
        var tx = 0, ty = 0;
        if (mouse.active) {
          var dx = p.x - mouse.x, dy = p.y - mouse.y;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d > 0 && d < MOUSE_RADIUS) {
            var force = (1 - d / MOUSE_RADIUS) * 22;
            tx = (dx / d) * force;
            ty = (dy / d) * force;
          }
        }
        p.ox += (tx - p.ox) * 0.08;
        p.oy += (ty - p.oy) * 0.08;
      });
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;
      for (var i = 0; i < points.length; i++) {
        var a = points[i], ax = a.x + a.ox, ay = a.y + a.oy;
        for (var j = i + 1; j < points.length; j++) {
          var b = points[j], bx = b.x + b.ox, by = b.y + b.oy;
          var dx = ax - bx, dy = ay - by, d2 = dx * dx + dy * dy;
          if (d2 < LINK * LINK) {
            ctx.strokeStyle = "rgba(139, 108, 255, " + (0.22 * (1 - Math.sqrt(d2) / LINK)).toFixed(3) + ")";
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(bx, by);
            ctx.stroke();
          }
        }
        if (mouse.active) {
          var mx = ax - mouse.x, my = ay - mouse.y, md = Math.sqrt(mx * mx + my * my);
          if (md < MOUSE_RADIUS + 20) {
            ctx.strokeStyle = "rgba(34, 211, 238, " + (0.3 * (1 - md / (MOUSE_RADIUS + 20))).toFixed(3) + ")";
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }
      ctx.fillStyle = "rgba(196, 181, 253, .75)";
      points.forEach(function (p) {
        ctx.beginPath();
        ctx.arc(p.x + p.ox, p.y + p.oy, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    function loop() {
      step();
      draw();
      frame = raf(loop);
    }

    // En pause si l'onglet est caché ou si le hero n'est plus visible
    function update() {
      var shouldRun = onScreen && !document.hidden && !reduceMotion;
      if (shouldRun && !running) { running = true; frame = raf(loop); }
      else if (!shouldRun && running) { running = false; cancelAnimationFrame(frame); }
    }

    if (finePointer) {
      zone.addEventListener("pointermove", function (e) {
        var r = canvas.getBoundingClientRect();
        mouse.x = e.clientX - r.left;
        mouse.y = e.clientY - r.top;
        mouse.active = true;
      });
      zone.addEventListener("pointerleave", function () { mouse.active = false; });
    }

    var resizeFrame = 0;
    var queueResize = function () {
      if (!resizeFrame) resizeFrame = raf(function () { resizeFrame = 0; resize(); });
    };
    if ("ResizeObserver" in window) new ResizeObserver(queueResize).observe(zone);
    else window.addEventListener("resize", queueResize);

    resize();
    document.addEventListener("visibilitychange", update);
    onVisibility(zone, function (visible) { onScreen = visible; update(); });
  }

  /* ---- 6. Inclinaison 3D des cartes : <article data-tilt> (ou data-tilt="4" pour l'intensité) ---- */
  function initTilt() {
    if (!finePointer || reduceMotion) return;
    document.querySelectorAll("[data-tilt]").forEach(function (el) {
      var max = parseFloat(el.getAttribute("data-tilt")) || 5;
      var glare = document.createElement("span");
      glare.className = "tilt-glare";
      glare.setAttribute("aria-hidden", "true");
      el.appendChild(glare);

      var x = 0.5, y = 0.5, frame = 0;
      function reset() {
        el.classList.remove("is-tilting");
        el.style.transform = "";
      }
      function render() {
        frame = 0;
        // Une carte retournée ne s'incline pas
        if (el.classList.contains("is-flipped")) { reset(); return; }
        el.classList.add("is-tilting");
        el.style.transform = "perspective(1000px) rotateX(" + ((0.5 - y) * 2 * max).toFixed(2) + "deg) rotateY(" + ((x - 0.5) * 2 * max).toFixed(2) + "deg) translateY(-4px)";
        el.style.setProperty("--mx", (x * 100).toFixed(1) + "%");
        el.style.setProperty("--my", (y * 100).toFixed(1) + "%");
      }
      el.addEventListener("pointermove", function (e) {
        if (e.pointerType !== "mouse") return;
        var r = el.getBoundingClientRect();
        x = Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1);
        y = Math.min(Math.max((e.clientY - r.top) / r.height, 0), 1);
        if (!frame) frame = raf(render);
      });
      el.addEventListener("pointerleave", function () {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        reset();
      });
    });
  }

  /* ---- Boutons principaux « magnétiques » ---- */
  function initMagnetic() {
    if (!finePointer || reduceMotion) return;
    document.querySelectorAll(".btn--primary:not(.btn--block)").forEach(function (btn) {
      var dx = 0, dy = 0, frame = 0;
      btn.addEventListener("pointermove", function (e) {
        var r = btn.getBoundingClientRect();
        dx = Math.max(-10, Math.min(10, (e.clientX - (r.left + r.width / 2)) * 0.22));
        dy = Math.max(-8, Math.min(8, (e.clientY - (r.top + r.height / 2)) * 0.35));
        if (!frame) frame = raf(function () {
          frame = 0;
          btn.style.transform = "translate(" + dx.toFixed(1) + "px, " + (dy - 2).toFixed(1) + "px)";
        });
      });
      btn.addEventListener("pointerleave", function () {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        btn.style.transform = "";
      });
    });
  }

  /* ---- Halo lumineux qui suit le curseur dans les blocs sombres ---- */
  function initHalo() {
    if (!finePointer || reduceMotion) return;
    document.querySelectorAll(".section--dark, .cta, .subscription").forEach(function (zone) {
      var halo = document.createElement("span");
      halo.className = "halo";
      halo.setAttribute("aria-hidden", "true");
      zone.insertBefore(halo, zone.firstChild);
      var x = 0, y = 0, frame = 0;
      zone.addEventListener("pointermove", function (e) {
        var r = zone.getBoundingClientRect();
        x = e.clientX - r.left;
        y = e.clientY - r.top;
        zone.classList.add("is-lit");
        if (!frame) frame = raf(function () {
          frame = 0;
          halo.style.transform = "translate3d(" + x.toFixed(0) + "px, " + y.toFixed(0) + "px, 0)";
        });
      });
      zone.addEventListener("pointerleave", function () { zone.classList.remove("is-lit"); });
    });
  }

  /* ---- 7. Compteurs animés : <span data-count>1 900 €</span> ---- */
  function initCounters() {
    if (reduceMotion || !("IntersectionObserver" in window)) return;
    var els = document.querySelectorAll("[data-count]");
    // "+45 €" -> préfixe "+", nombre 45, suffixe " €" (gère les espaces des milliers)
    var pattern = /^(\D*?)(\d+(?:[\s  ]\d{3})*)(.*)$/;

    function format(n, sep) {
      return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, sep);
    }
    function run(el, d) {
      var start = null, duration = 1400;
      function tick(t) {
        if (start === null) start = t;
        var p = Math.min((t - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = d.prefix + format(Math.round(d.value * eased), d.sep) + d.suffix;
        if (p < 1) raf(tick);
      }
      raf(tick);
    }

    els.forEach(function (el) {
      var m = el.textContent.trim().match(pattern);
      if (!m) return;
      var d = {
        prefix: m[1],
        value: parseInt(m[2].replace(/\D/g, ""), 10),
        suffix: m[3],
        sep: (m[2].match(/[\s  ]/) || [" "])[0]
      };
      el.textContent = d.prefix + "0" + d.suffix;
      var counterIo = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        counterIo.disconnect();
        run(el, d);
      }, { threshold: 0.6 });
      counterIo.observe(el);
    });
  }

  /* ---- 8. Cartes de l'équipe qui se retournent ---- */
  // Survol à la souris, tap sur mobile, bouton « Retourner » (Entrée / Espace) au clavier.
  function initFlipCards() {
    document.querySelectorAll("[data-flip]").forEach(function (card) {
      var area = card.querySelector(".flip");
      var button = card.querySelector(".flip__toggle");
      var front = card.querySelector(".flip__face--front");
      var back = card.querySelector(".flip__face--back");
      if (!area || !button || !front || !back) return;
      var hoverTimer = 0, lastPointer = "mouse";

      function isFlipped() { return card.classList.contains("is-flipped"); }
      function setFlipped(flipped) {
        card.classList.toggle("is-flipped", flipped);
        button.setAttribute("aria-pressed", String(flipped));
        // Une carte retournée perd son inclinaison 3D (voir initTilt)
        if (flipped) {
          card.classList.remove("is-tilting");
          card.style.transform = "";
        }
        // La face cachée n'est ni focusable ni lue par les lecteurs d'écran
        var hidden = flipped ? front : back;
        var shown = flipped ? back : front;
        hidden.setAttribute("inert", "");
        hidden.setAttribute("aria-hidden", "true");
        shown.removeAttribute("inert");
        shown.removeAttribute("aria-hidden");
      }
      setFlipped(false);

      button.addEventListener("click", function () { setFlipped(!isFlipped()); });

      area.addEventListener("pointerdown", function (e) { lastPointer = e.pointerType; });
      area.addEventListener("click", function (e) {
        if (e.target.closest("a, button")) return;
        if (finePointer && lastPointer === "mouse") return; // à la souris, le survol suffit
        setFlipped(!isFlipped());
      });

      if (finePointer) {
        area.addEventListener("pointerenter", function (e) {
          if (e.pointerType !== "mouse") return;
          clearTimeout(hoverTimer);
          hoverTimer = setTimeout(function () { setFlipped(true); }, 120);
        });
        area.addEventListener("pointerleave", function (e) {
          if (e.pointerType !== "mouse") return;
          clearTimeout(hoverTimer);
          if (back.contains(document.activeElement)) return; // ne pas perdre le focus clavier
          setFlipped(false);
        });
      }
    });
  }

  /* ---- 9. Infobulles des compétences ---- */
  // Survol, focus clavier ou tap ; Échap ou tap ailleurs pour fermer.
  function initTooltips() {
    var triggers = document.querySelectorAll(".skill[aria-describedby]");
    if (!triggers.length) return;
    var current = null, hideTimer = 0, shownAt = 0, MARGIN = 12, GAP = 12;

    function place(trigger, tip) {
      var r = trigger.getBoundingClientRect();
      var tw = tip.offsetWidth, th = tip.offsetHeight;
      var vw = document.documentElement.clientWidth;
      var center = r.left + r.width / 2;
      var left = Math.max(MARGIN, Math.min(center - tw / 2, vw - tw - MARGIN));
      var top = r.top - th - GAP, placement = "top";
      if (top < MARGIN) { top = r.bottom + GAP; placement = "bottom"; }
      tip.style.left = Math.round(left) + "px";
      tip.style.top = Math.round(top) + "px";
      tip.style.setProperty("--arrow-x", Math.round(Math.max(14, Math.min(center - left, tw - 14))) + "px");
      tip.setAttribute("data-placement", placement);
    }
    function hideNow() {
      clearTimeout(hideTimer);
      if (!current) return;
      current.tip.classList.remove("is-visible");
      current.trigger.classList.remove("is-active");
      current = null;
    }
    function hideSoon() {
      clearTimeout(hideTimer);
      hideTimer = setTimeout(hideNow, 150);
    }
    function show(trigger, tip) {
      clearTimeout(hideTimer);
      if (current && current.trigger === trigger) return;
      hideNow();
      current = { trigger: trigger, tip: tip };
      shownAt = Date.now();
      place(trigger, tip);
      tip.classList.add("is-visible");
      trigger.classList.add("is-active");
    }

    triggers.forEach(function (trigger) {
      var tip = document.getElementById(trigger.getAttribute("aria-describedby"));
      if (!tip) return;
      // Placée à la fin de la page : position: fixed fiable, même dans une carte inclinée
      document.body.appendChild(tip);
      trigger.addEventListener("mouseenter", function () { show(trigger, tip); });
      trigger.addEventListener("mouseleave", hideSoon);
      trigger.addEventListener("focus", function () { show(trigger, tip); });
      trigger.addEventListener("blur", hideSoon);
      trigger.addEventListener("click", function () {
        // Un tap ouvre, un second tap ferme (le focus vient souvent juste de l'ouvrir)
        if (current && current.trigger === trigger && Date.now() - shownAt > 400) hideNow();
        else show(trigger, tip);
      });
      tip.addEventListener("mouseenter", function () { clearTimeout(hideTimer); });
      tip.addEventListener("mouseleave", hideSoon);
    });

    document.addEventListener("pointerdown", function (e) {
      if (current && !current.trigger.contains(e.target) && !current.tip.contains(e.target)) hideNow();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") hideNow();
    });
    var reposition = function () { if (current) place(current.trigger, current.tip); };
    window.addEventListener("scroll", reposition, { passive: true });
    window.addEventListener("resize", reposition);
  }

  /* ---- 10. Tarifs : un seul cadre lumineux glisse vers l'offre survolée ---- */
  // Souris, focus clavier (Tab) ou, sur mobile, carte centrée à l'écran. Retour sur Premium ensuite.
  function initPricingSpot() {
    document.querySelectorAll(".pricing").forEach(function (grid) {
      var cards = Array.prototype.slice.call(grid.querySelectorAll(".price-card"));
      if (!cards.length) return;
      var home = grid.querySelector(".price-card--featured") || cards[0];
      var active = null;
      var spot = document.createElement("span");
      spot.className = "pricing__spot";
      spot.setAttribute("aria-hidden", "true");
      grid.appendChild(spot);
      grid.classList.add("has-spot");

      function place() {
        if (!active) return;
        // 2px de marge autour de la carte ; -8px : la carte active est surélevée (voir style.css)
        spot.style.width = (active.offsetWidth + 4) + "px";
        spot.style.height = (active.offsetHeight + 4) + "px";
        spot.style.transform = "translate3d(" + (active.offsetLeft - 2) + "px, " + (active.offsetTop - 10) + "px, 0)";
      }
      function setActive(card) {
        if (card !== active) {
          cards.forEach(function (c) { c.classList.toggle("is-active", c === card); });
          active = card;
        }
        place();
      }
      setActive(home);

      cards.forEach(function (card) {
        card.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") setActive(card); });
        card.addEventListener("focusin", function () { setActive(card); });
        // Reflet qui suit la souris dans la carte (--mx / --my), aussi sans effet tilt
        card.addEventListener("pointermove", function (e) {
          if (e.pointerType !== "mouse" || card.classList.contains("is-tilting")) return;
          var r = card.getBoundingClientRect();
          card.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100).toFixed(1) + "%");
          card.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100).toFixed(1) + "%");
        });
      });
      grid.addEventListener("pointerleave", function (e) { if (e.pointerType === "mouse") setActive(home); });
      grid.addEventListener("focusout", function (e) {
        if (!grid.contains(e.relatedTarget)) setActive(home);
      });

      if ("IntersectionObserver" in window) {
        // Mobile : la carte qui croise le milieu de l'écran est mise en avant
        if (!finePointer) {
          var centerIo = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) { if (entry.isIntersecting) setActive(entry.target); });
          }, { rootMargin: "-50% 0px -50% 0px" });
          cards.forEach(function (card) { centerIo.observe(card); });
        }
        // Le cadre apparaît une fois les cartes arrivées
        var readyIo = new IntersectionObserver(function (entries) {
          if (!entries[0].isIntersecting) return;
          readyIo.disconnect();
          setTimeout(function () { place(); grid.classList.add("is-ready"); }, reduceMotion ? 0 : 1100);
        }, { threshold: 0.15 });
        readyIo.observe(grid);
      } else {
        grid.classList.add("is-ready");
      }

      var queued = 0;
      var queuePlace = function () {
        if (!queued) queued = raf(function () { queued = 0; place(); });
      };
      if ("ResizeObserver" in window) new ResizeObserver(queuePlace).observe(grid);
      window.addEventListener("resize", queuePlace);
    });
  }

  /* ---- 11. FAQ : ouverture animée (hauteur + fondu) ---- */
  function initFaq() {
    document.querySelectorAll(".faq details").forEach(function (details) {
      var summary = details.querySelector("summary");
      if (!summary) return;
      var body = document.createElement("div");
      body.className = "faq__body";
      while (summary.nextSibling) body.appendChild(summary.nextSibling);
      details.appendChild(body);
      if (reduceMotion || !body.animate) return;

      var anim = null, opening = details.open;
      summary.addEventListener("click", function (e) {
        e.preventDefault();
        var from = body.getBoundingClientRect().height;
        if (anim) anim.cancel();
        opening = !opening;
        if (opening) {
          details.open = true;
          var to = body.scrollHeight;
          anim = body.animate([{ height: from + "px", opacity: from ? 1 : 0 }, { height: to + "px", opacity: 1 }], { duration: 420, easing: "cubic-bezier(.2, .8, .2, 1)" });
        } else {
          anim = body.animate([{ height: from + "px", opacity: 1 }, { height: "0px", opacity: 0 }], { duration: 320, easing: "ease" });
        }
        anim.onfinish = function () {
          anim = null;
          if (!opening) details.open = false;
        };
      });
    });
  }

  /* ---- 11 bis. Vidéo de présentation : lecture au clic, pause hors écran ---- */
  function initVideo() {
    document.querySelectorAll("[data-video]").forEach(function (frame) {
      var video = frame.querySelector("video");
      var playBtn = frame.querySelector(".video-frame__play");
      if (!video || !playBtn) return;

      playBtn.addEventListener("click", function () {
        frame.classList.add("is-started");
        video.controls = true;
        var playing = video.play();
        if (playing && playing.catch) playing.catch(function () { /* lecture refusée : les contrôles restent disponibles */ });
        video.focus();
      });

      // En fin de lecture, on réaffiche le bouton pour pouvoir relancer
      video.addEventListener("ended", function () {
        frame.classList.remove("is-started");
        video.controls = false;
        video.currentTime = 0;
        playBtn.focus();
      });

      // Pause automatique quand la vidéo sort de l'écran
      onVisibility(frame, function (visible) {
        if (!visible && !video.paused) video.pause();
      });
    });
  }

  initPauseOffscreen();
  initParticles();
  initTilt();
  initMagnetic();
  initHalo();
  initCounters();
  initFlipCards();
  initTooltips();
  initPricingSpot();
  initFaq();
  initVideo();

  /* ---- 12. Formulaire de contact ---- */
  var form = document.getElementById("contact-form");
  if (!form) return;

  // Présélection de l'offre depuis l'URL : contact.html?offre=premium
  var params = new URLSearchParams(window.location.search);
  var offre = params.get("offre");
  var select = form.querySelector("#offre");
  if (offre && select && select.querySelector('option[value="' + offre + '"]')) {
    select.value = offre;
  }
  if (params.get("abonnement") === "1") {
    var abo = form.querySelector("#abonnement");
    if (abo) abo.checked = true;
  }

  var status = document.getElementById("form-status");
  var submitBtn = form.querySelector('button[type="submit"]');
  var CONTACT_EMAIL = "createch.design75@outlook.fr";
  var SUCCESS_TEXT = "Merci ! Votre demande a bien été envoyée. Nous vous répondons sous 24 à 48 h ouvrées.";
  var fallbackUsed = false;
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  var validators = {
    nom: function (v) { return v.trim().length >= 2 || "Merci d'indiquer votre nom."; },
    email: function (v) { return emailPattern.test(v.trim()) || "Merci d'indiquer une adresse email valide."; },
    message: function (v) { return v.trim().length >= 10 || "Votre message doit contenir au moins 10 caractères."; },
    rgpd: function (v, el) { return el.checked || "Merci d'accepter l'utilisation de vos données pour être recontacté."; }
  };

  function validateField(el) {
    var rule = validators[el.name];
    if (!rule) return true;
    var result = rule(el.value, el);
    var field = el.closest(".field");
    var errorEl = field && field.querySelector(".field__error");
    var ok = result === true;
    if (field) field.classList.toggle("has-error", !ok);
    el.setAttribute("aria-invalid", String(!ok));
    if (errorEl) errorEl.textContent = ok ? "" : result;
    return ok;
  }

  Object.keys(validators).forEach(function (name) {
    var el = form.elements[name];
    if (!el) return;
    el.addEventListener(el.type === "checkbox" ? "change" : "blur", function () { validateField(el); });
  });

  function showStatus(type, text) {
    status.className = "form-status is-" + type;
    status.textContent = text;
  }

  // Retour après un envoi classique (repli) : contact.html?envoi=ok
  if (params.get("envoi") === "ok") showStatus("success", SUCCESS_TEXT);

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Honeypot : si ce champ invisible est rempli, c'est un robot.
    if (form.elements.botcheck && form.elements.botcheck.checked) return;

    var firstInvalid = null;
    Object.keys(validators).forEach(function (name) {
      var el = form.elements[name];
      if (el && !validateField(el) && !firstInvalid) firstInvalid = el;
    });
    if (firstInvalid) {
      firstInvalid.focus();
      showStatus("error", "Certains champs sont à corriger.");
      return;
    }

    var key = form.elements.access_key && form.elements.access_key.value.trim();
    if (!key) {
      showStatus("error", "Le formulaire n'est pas configuré (clé Web3Forms manquante). Écrivez-nous directement à " + CONTACT_EMAIL + ".");
      return;
    }

    // Sujet de l'email reçu et adresse de réponse (champs cachés : utilisés aussi par l'envoi classique)
    var offreLabel = select ? select.options[select.selectedIndex].text.replace(/\s*\(.*\)$/, "") : "Site";
    form.elements.subject.value = "Nouvelle demande de contact — " + offreLabel + " — " + form.elements.nom.value.trim();
    form.elements.replyto.value = form.elements.email.value.trim();

    var data = new FormData(form);
    data.delete("redirect");
    data.set("abonnement", form.elements.abonnement && form.elements.abonnement.checked ? form.elements.abonnement.value : "Non");

    submitBtn.disabled = true;
    submitBtn.textContent = "Envoi en cours…";

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: data
    })
      .then(function (res) {
        return res.json().then(function (json) {
          if (!json.success) {
            var err = new Error(json.message || "Erreur");
            err.answered = true;
            throw err;
          }
        });
      })
      .then(function () {
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = "Envoyer ma demande";
        showStatus("success", SUCCESS_TEXT);
      })
      .catch(function (err) {
        // Pas de réponse (réseau, CORS en local…) : repli sur l'envoi classique du formulaire
        if (!err.answered && !fallbackUsed) {
          fallbackUsed = true;
          if (/^https?:$/.test(location.protocol)) {
            form.elements.redirect.value = location.href.split(/[?#]/)[0] + "?envoi=ok";
          }
          HTMLFormElement.prototype.submit.call(form);
          return;
        }
        submitBtn.disabled = false;
        submitBtn.textContent = "Envoyer ma demande";
        showStatus("error", "Oups, l'envoi a échoué. Réessayez ou écrivez-nous directement à " + CONTACT_EMAIL + ".");
      });
  });
})();
