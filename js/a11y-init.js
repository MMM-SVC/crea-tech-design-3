/* ==========================================================================
   Crea Tech Design — préférences d'accessibilité appliquées dès le <head>
   (avant l'affichage : pas de « flash » de la mise en page par défaut).
   Les choix sont faits dans le panneau « Accessibilité » (js/a11y.js) et
   mémorisés dans le navigateur (localStorage « ctd-a11y », voir cookies.html).
   ========================================================================== */
(function () {
  "use strict";

  var root = document.documentElement;
  try {
    var prefs = JSON.parse(window.localStorage.getItem("ctd-a11y") || "{}");
    if (prefs.text === "lg" || prefs.text === "xl") root.classList.add("a11y-text-" + prefs.text);
    if (prefs.contrast === true) root.classList.add("a11y-contrast");
    if (prefs.motion === true) root.classList.add("a11y-reduce-motion");
  } catch (e) {
    /* Stockage indisponible (navigation privée…) : réglages par défaut */
  }
})();
