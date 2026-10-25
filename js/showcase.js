/* ==========================================================================
   Crea Tech Design — vitrine des sites d'exemple (accueil)
   Sommaire :
   1. Données des sites (lues dans les <template data-site> d'index.html)
   2. Vitrine 3D du hero : clic, sélecteurs, flèches du clavier, swipe, rotation auto
   3. Fenêtre d'aperçu (modale) : site détaillé, appareils, précédent / suivant
   4. Cartes « Exemples de réalisations »
   5. Interactions des sites d'exemple : menu burger, filtres, chiffres animés, panier
   ========================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- 1. Données des sites ---- */
  var sites = Array.prototype.map.call(document.querySelectorAll("template[data-site]"), function (tpl) {
    return {
      id: tpl.getAttribute("data-site"),
      name: tpl.getAttribute("data-name"),
      url: tpl.getAttribute("data-url"),
      sector: tpl.getAttribute("data-sector"),
      offer: tpl.getAttribute("data-offer"),
      offerLabel: tpl.getAttribute("data-offer-label"),
      tpl: tpl
    };
  });
  if (!sites.length) return;
  var count = sites.length;

  function indexOf(id) {
    for (var i = 0; i < count; i++) if (sites[i].id === id) return i;
    return 0;
  }
  function wrap(i) { return (i % count + count) % count; }

  /* ---- 2. Vitrine 3D du hero ---- */
  var showcase = document.querySelector("[data-showcase]");
  var visual = showcase && showcase.closest(".hero__visual");
  var items = showcase ? Array.prototype.slice.call(showcase.querySelectorAll(".showcase__item")) : [];
  var tabs = visual ? Array.prototype.slice.call(visual.querySelectorAll(".showcase-tab")) : [];
  var current = 0;
  var timer = 0, interacted = false, hovered = false, onScreen = true;

  function setActive(index, animate) {
    index = wrap(index);
    var changed = index !== current;
    current = index;
    items.forEach(function (item) {
      var i = indexOf(item.getAttribute("data-site"));
      var slot = wrap(i - current);
      var wasFront = item.getAttribute("data-slot") === "0";
      item.setAttribute("data-slot", String(slot));
      // Le site qui arrive au premier plan pivote dans l'espace
      if (slot === 0 && !wasFront && changed && animate !== false && !reduceMotion) {
        item.classList.remove("is-promoted");
        void item.offsetWidth;
        item.classList.add("is-promoted");
      }
      var hit = item.querySelector(".showcase__hit");
      if (hit) {
        hit.tabIndex = slot === 0 ? 0 : -1;
        hit.setAttribute("aria-label", slot === 0
          ? "Ouvrir l'aperçu détaillé du site " + sites[i].name
          : "Afficher le site " + sites[i].name);
      }
    });
    tabs.forEach(function (tab) {
      tab.setAttribute("aria-pressed", String(indexOf(tab.getAttribute("data-site")) === current));
    });
  }

  // Le défilement automatique s'arrête dès que l'utilisateur interagit
  function stopAuto() {
    interacted = true;
    schedule();
  }
  function schedule() {
    clearInterval(timer);
    timer = 0;
    if (!reduceMotion && !interacted && !hovered && onScreen && !document.hidden) {
      timer = setInterval(function () { setActive(current + 1); }, 4500);
    }
  }

  if (showcase && items.length) {
    setActive(0, false);

    items.forEach(function (item) {
      item.addEventListener("animationend", function () { item.classList.remove("is-promoted"); });
      var hit = item.querySelector(".showcase__hit");
      if (!hit) return;
      hit.addEventListener("click", function () {
        stopAuto();
        var i = indexOf(item.getAttribute("data-site"));
        if (item.getAttribute("data-slot") === "0") openModal(i, hit);
        else setActive(i);
      });
    });

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        stopAuto();
        setActive(indexOf(tab.getAttribute("data-site")));
      });
    });

    // Flèches gauche / droite quand le focus est dans la vitrine
    visual.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      stopAuto();
      setActive(current + (e.key === "ArrowRight" ? 1 : -1));
      var focusedTab = tabs.indexOf(document.activeElement) !== -1;
      if (focusedTab) {
        tabs.forEach(function (tab) { if (indexOf(tab.getAttribute("data-site")) === current) tab.focus(); });
      } else {
        var front = showcase.querySelector('.showcase__item[data-slot="0"] .showcase__hit');
        if (front) front.focus();
      }
    });

    // Swipe sur mobile
    var start = null;
    showcase.addEventListener("pointerdown", function (e) {
      stopAuto();
      if (e.pointerType === "mouse") return;
      start = { x: e.clientX, y: e.clientY };
    });
    showcase.addEventListener("pointerup", function (e) {
      if (!start) return;
      var dx = e.clientX - start.x, dy = e.clientY - start.y;
      start = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) setActive(current + (dx < 0 ? 1 : -1));
    });
    showcase.addEventListener("pointercancel", function () { start = null; });

    visual.addEventListener("mouseenter", function () { hovered = true; schedule(); });
    visual.addEventListener("mouseleave", function () { hovered = false; schedule(); });
    visual.addEventListener("focusin", stopAuto);
    document.addEventListener("visibilitychange", schedule);
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        onScreen = entries[entries.length - 1].isIntersecting;
        schedule();
      }).observe(showcase);
    }
    schedule();
  }

  /* ---- 3. Fenêtre d'aperçu (modale) ---- */
  var modal = document.getElementById("pv");
  if (!modal) return;
  var dialog = modal.querySelector(".pv__dialog");
  var stage = modal.querySelector(".pv__stage");
  var frame = modal.querySelector(".pv__frame");
  var screen = modal.querySelector(".pv__screen");
  var titleEl = modal.querySelector("[data-pv-title]");
  var sectorEl = modal.querySelector("[data-pv-sector]");
  var urlEl = modal.querySelector("[data-pv-url]");
  var countEl = modal.querySelector("[data-pv-count]");
  var offerEl = modal.querySelector("[data-pv-offer]");
  var ctaEl = modal.querySelector("[data-pv-cta]");
  var liveEl = modal.querySelector("[data-pv-live]");
  var deviceBtns = Array.prototype.slice.call(modal.querySelectorAll("[data-device]")).filter(function (el) { return el.tagName === "BUTTON"; });
  var outside = Array.prototype.filter.call(document.body.children, function (el) {
    return el !== modal && el.tagName !== "SCRIPT" && el.tagName !== "TEMPLATE";
  });
  var modalIndex = 0, isOpen = false, lastFocus = null, closeTimer = 0;

  function render(index) {
    modalIndex = wrap(index);
    var site = sites[modalIndex];
    screen.textContent = "";
    screen.appendChild(site.tpl.content.cloneNode(true));
    screen.scrollTop = 0;
    initSite();
    titleEl.textContent = site.name;
    sectorEl.textContent = site.sector;
    urlEl.textContent = site.url;
    countEl.textContent = (modalIndex + 1) + " / " + count;
    offerEl.textContent = site.offerLabel;
    ctaEl.href = "contact.html?offre=" + encodeURIComponent(site.offer);
    liveEl.textContent = "Site " + (modalIndex + 1) + " sur " + count + " : " + site.name;
    if (items.length) setActive(modalIndex, false);
  }

  function openModal(index, opener) {
    clearTimeout(closeTimer);
    lastFocus = opener || document.activeElement;
    render(index);
    liveEl.textContent = "";
    modal.hidden = false;
    // Le reste de la page devient inaccessible (focus piégé dans la modale)
    outside.forEach(function (el) { el.setAttribute("inert", ""); });
    document.documentElement.classList.add("pv-open");
    void modal.offsetWidth;
    modal.classList.add("is-open");
    isOpen = true;
    dialog.focus();
  }

  function closeModal() {
    if (!isOpen) return;
    isOpen = false;
    modal.classList.remove("is-open");
    outside.forEach(function (el) { el.removeAttribute("inert"); });
    document.documentElement.classList.remove("pv-open");
    closeTimer = setTimeout(function () {
      modal.hidden = true;
      resetSite();
      screen.textContent = "";
    }, reduceMotion ? 0 : 450);
    // Retour du focus : sur le site affiché au premier plan si l'aperçu venait de la vitrine
    var target = lastFocus;
    if (showcase && lastFocus && showcase.contains(lastFocus)) {
      target = showcase.querySelector('.showcase__item[data-slot="0"] .showcase__hit') || lastFocus;
    }
    if (target && target.focus) target.focus();
  }

  function focusables() {
    return Array.prototype.filter.call(
      dialog.querySelectorAll("a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])"),
      function (el) { return el.getClientRects().length > 0; }
    );
  }

  modal.addEventListener("click", function (e) {
    if (e.target.closest("[data-pv-close]")) closeModal();
    else if (e.target.closest("[data-pv-prev]")) render(modalIndex - 1);
    else if (e.target.closest("[data-pv-next]")) render(modalIndex + 1);
  });

  document.addEventListener("keydown", function (e) {
    if (!isOpen) return;
    if (e.key === "Escape") { e.preventDefault(); closeModal(); return; }
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      if (e.target.closest && e.target.closest("input, textarea, select")) return;
      e.preventDefault();
      render(modalIndex + (e.key === "ArrowRight" ? 1 : -1));
      return;
    }
    if (e.key !== "Tab") return;
    var list = focusables();
    if (!list.length) return;
    var first = list[0], last = list[list.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  // Sélecteur d'appareil : l'aperçu pivote puis se redimensionne
  deviceBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var device = btn.getAttribute("data-device");
      if (stage.getAttribute("data-device") === device) return;
      deviceBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
      if (reduceMotion) { stage.setAttribute("data-device", device); return; }
      frame.classList.remove("is-entering");
      frame.classList.add("is-switching");
      setTimeout(function () {
        stage.setAttribute("data-device", device);
        frame.classList.remove("is-switching");
        frame.classList.add("is-entering");
      }, 260);
    });
  });
  frame.addEventListener("animationend", function (e) {
    if (e.target === frame) frame.classList.remove("is-entering");
  });

  /* ---- 4. Cartes « Exemples de réalisations » : ouvrent la même modale ---- */
  document.querySelectorAll(".work-card__open[data-site]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      stopAuto();
      openModal(indexOf(btn.getAttribute("data-site")), btn);
    });
  });

  /* ---- 5. Interactions des sites d'exemple (contenu recréé à chaque affichage) ---- */
  var countObserver = null, toastTimer = 0, bumpTimer = 0;

  function resetSite() {
    if (countObserver) countObserver.disconnect();
    countObserver = null;
    clearTimeout(toastTimer);
    clearTimeout(bumpTimer);
  }

  // Chiffres clés : ils défilent quand ils apparaissent dans l'aperçu
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-site-count"), 10);
    var prefix = el.getAttribute("data-site-prefix") || "";
    var suffix = el.getAttribute("data-site-suffix") || "";
    var duration = 1400, startTime = null;
    function step(now) {
      if (startTime === null) startTime = now;
      var p = Math.min((now - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function initSite() {
    resetSite();
    var counters = screen.querySelectorAll("[data-site-count]");
    if (!counters.length || reduceMotion || !("IntersectionObserver" in window)) return;
    countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        countObserver.unobserve(entry.target);
        animateCount(entry.target);
      });
    }, { root: screen, threshold: 0.6 });
    Array.prototype.forEach.call(counters, function (el) {
      el.textContent = (el.getAttribute("data-site-prefix") || "") + "0" + (el.getAttribute("data-site-suffix") || "");
      countObserver.observe(el);
    });
  }

  function setMenu(siteEl, burger, open) {
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Fermer le menu du site" : "Ouvrir le menu du site");
    siteEl.classList.toggle("is-menu-open", open);
  }

  screen.addEventListener("click", function (e) {
    var siteEl = screen.querySelector(".site");
    if (!siteEl) return;

    // Menu burger (tablette / mobile)
    var burger = e.target.closest("[data-site-burger]");
    if (burger) {
      setMenu(siteEl, burger, burger.getAttribute("aria-expanded") !== "true");
      return;
    }
    var openBurger = siteEl.querySelector('[data-site-burger][aria-expanded="true"]');
    if (openBurger && !e.target.closest(".site__menu")) setMenu(siteEl, openBurger, false);

    // Filtres de la galerie de réalisations
    var filter = e.target.closest("[data-site-filter]");
    if (filter) {
      var cat = filter.getAttribute("data-site-filter");
      var shown = 0;
      siteEl.querySelectorAll("[data-site-filter]").forEach(function (b) { b.setAttribute("aria-pressed", String(b === filter)); });
      siteEl.querySelectorAll(".site__gallery [data-cat]").forEach(function (fig) {
        var match = cat === "all" || fig.getAttribute("data-cat") === cat;
        fig.hidden = !match;
        if (match) shown++;
      });
      var status = siteEl.querySelector("[data-site-filter-status]");
      if (status) status.textContent = shown + " réalisation" + (shown > 1 ? "s" : "") + " affichée" + (shown > 1 ? "s" : "");
      return;
    }

    // Ajout au panier : le compteur augmente, le panier rebondit et une notification s'affiche
    var add = e.target.closest("[data-site-add]");
    if (add) {
      var countEl = siteEl.querySelector("[data-site-cart-count]");
      var cart = siteEl.querySelector("[data-site-cart]");
      var toast = siteEl.querySelector("[data-site-toast]");
      if (countEl) countEl.textContent = String(parseInt(countEl.textContent, 10) + 1);
      if (cart && !reduceMotion) {
        cart.classList.remove("is-bump");
        void cart.offsetWidth;
        cart.classList.add("is-bump");
      }
      add.classList.add("is-added");
      add.textContent = "Ajouté ✓";
      clearTimeout(bumpTimer);
      bumpTimer = setTimeout(function () {
        siteEl.querySelectorAll(".site__add.is-added").forEach(function (b) {
          b.classList.remove("is-added");
          b.textContent = "Ajouter au panier";
        });
      }, 1600);
      if (toast) {
        toast.textContent = "Ajouté au panier : " + add.getAttribute("data-site-add");
        toast.classList.add("is-visible");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { toast.classList.remove("is-visible"); }, 2600);
      }
    }
  });

  screen.addEventListener("animationend", function (e) {
    if (e.target.classList.contains("is-bump")) e.target.classList.remove("is-bump");
  });
})();
