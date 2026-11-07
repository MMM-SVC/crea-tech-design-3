/* ==========================================================================
   Crea Tech Design — panneau « Accessibilité » (toutes les pages)
   Bouton en bas à gauche, utilisable à la souris, au doigt et au clavier :
   - taille du texte : normale / grande / très grande
   - contraste renforcé
   - réduire les animations (effets 3D, particules, défilement automatique)
   Les choix sont mémorisés dans le navigateur (localStorage « ctd-a11y ») ;
   ils sont appliqués au chargement par js/a11y-init.js.
   ========================================================================== */
(function () {
  "use strict";

  var KEY = "ctd-a11y";
  var root = document.documentElement;
  var prefs = { text: "normal", contrast: false, motion: false };

  try {
    var saved = JSON.parse(window.localStorage.getItem(KEY) || "{}");
    if (saved.text === "lg" || saved.text === "xl") prefs.text = saved.text;
    prefs.contrast = saved.contrast === true;
    prefs.motion = saved.motion === true;
  } catch (e) { /* stockage indisponible */ }

  function save() {
    try {
      // Rien n'est conservé tant que les réglages sont ceux par défaut
      if (prefs.text === "normal" && !prefs.contrast && !prefs.motion) window.localStorage.removeItem(KEY);
      else window.localStorage.setItem(KEY, JSON.stringify(prefs));
    } catch (e) { /* stockage indisponible : le réglage vaut pour cette page */ }
  }

  function apply() {
    root.classList.toggle("a11y-text-lg", prefs.text === "lg");
    root.classList.toggle("a11y-text-xl", prefs.text === "xl");
    root.classList.toggle("a11y-contrast", prefs.contrast);
    root.classList.toggle("a11y-reduce-motion", prefs.motion);
  }

  /* ---- Construction du bouton et du panneau ---- */
  var wrap = document.createElement("div");
  wrap.className = "a11y";
  wrap.innerHTML =
    '<button class="a11y__toggle" type="button" aria-expanded="false" aria-controls="a11y-panel">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="4.5" r="2"/><path d="M4 8.5c2.6.9 5.3 1.3 8 1.3s5.4-.4 8-1.3"/><path d="M12 9.8V14m0 0-3 7m3-7 3 7"/></svg>' +
      '<span class="a11y__label">Accessibilité</span>' +
    '</button>' +
    '<div class="a11y__panel" id="a11y-panel" role="dialog" aria-modal="false" aria-labelledby="a11y-title" hidden>' +
      '<div class="a11y__head">' +
        '<p class="a11y__title" id="a11y-title">Accessibilité</p>' +
        '<button class="a11y__close" type="button" aria-label="Fermer le panneau d\'accessibilité">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
        '</button>' +
      '</div>' +
      '<fieldset class="a11y__group">' +
        '<legend>Taille du texte</legend>' +
        '<div class="a11y__sizes">' +
          '<label><input type="radio" name="a11y-text" value="normal"><span>Normale</span></label>' +
          '<label><input type="radio" name="a11y-text" value="lg"><span>Grande</span></label>' +
          '<label><input type="radio" name="a11y-text" value="xl"><span>Très grande</span></label>' +
        '</div>' +
      '</fieldset>' +
      '<label class="a11y__switch"><input type="checkbox" role="switch" data-a11y="contrast"><span>Contraste renforcé<small>Textes plus clairs, bordures plus marquées, sans dégradé sur le texte.</small></span></label>' +
      '<label class="a11y__switch"><input type="checkbox" role="switch" data-a11y="motion"><span>Réduire les animations<small>Coupe les effets 3D, les particules et le défilement automatique. La page se recharge.</small></span></label>' +
      '<button class="a11y__reset" type="button">Réinitialiser</button>' +
      '<p class="a11y__note">Vos choix sont mémorisés sur cet appareil uniquement. <a href="cookies.html">En savoir plus sur ce stockage</a></p>' +
    '</div>';
  document.body.appendChild(wrap);

  var toggle = wrap.querySelector(".a11y__toggle");
  var panel = wrap.querySelector(".a11y__panel");
  var closeBtn = wrap.querySelector(".a11y__close");
  var radios = wrap.querySelectorAll('input[name="a11y-text"]');
  var contrast = wrap.querySelector('[data-a11y="contrast"]');
  var motion = wrap.querySelector('[data-a11y="motion"]');

  function sync() {
    Array.prototype.forEach.call(radios, function (r) { r.checked = r.value === prefs.text; });
    contrast.checked = prefs.contrast;
    motion.checked = prefs.motion;
  }

  function setOpen(open, focusToggle) {
    panel.hidden = !open;
    toggle.setAttribute("aria-expanded", String(open));
    if (open) {
      var first = wrap.querySelector('input[name="a11y-text"]:checked') || radios[0];
      first.focus();
    } else if (focusToggle) {
      toggle.focus();
    }
  }

  toggle.addEventListener("click", function () { setOpen(panel.hidden); });
  closeBtn.addEventListener("click", function () { setOpen(false, true); });

  Array.prototype.forEach.call(radios, function (r) {
    r.addEventListener("change", function () {
      prefs.text = r.value;
      save();
      apply();
    });
  });
  contrast.addEventListener("change", function () {
    prefs.contrast = contrast.checked;
    save();
    apply();
  });
  // Les animations sont lancées au chargement : on recharge la page pour tout couper (ou tout relancer)
  motion.addEventListener("change", function () {
    prefs.motion = motion.checked;
    save();
    apply();
    window.location.reload();
  });
  wrap.querySelector(".a11y__reset").addEventListener("click", function () {
    var reload = prefs.motion;
    prefs = { text: "normal", contrast: false, motion: false };
    save();
    apply();
    sync();
    if (reload) window.location.reload();
  });

  // Échap ou clic à l'extérieur : le panneau se ferme
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !panel.hidden) setOpen(false, true);
  });
  document.addEventListener("pointerdown", function (e) {
    if (!panel.hidden && !wrap.contains(e.target)) setOpen(false);
  });

  sync();
})();
