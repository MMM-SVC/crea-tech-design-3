/* ==========================================================================
   Crea Tech Design — module de consentement aux cookies (DÉSACTIVÉ)

   ⚠ Ce fichier n'est inclus dans AUCUNE page : le site n'utilise aujourd'hui
   aucun cookie ni traceur soumis à consentement, un bandeau serait donc inutile
   (et trompeur). Il est prêt pour le jour où un outil de statistiques ou un
   service tiers sera ajouté. Mode d'emploi : README, rubrique « Cookies ».

   Conforme aux recommandations de la CNIL :
   - « Tout accepter » et « Tout refuser » au même niveau, de même apparence ;
   - « Personnaliser » pour choisir catégorie par catégorie ;
   - AUCUN dépôt de traceur avant le consentement (les scripts concernés ne sont
     chargés qu'après acceptation, via la fonction loadCategory ci-dessous) ;
   - choix mémorisé 6 mois, puis redemandé ;
   - lien « Gérer mes cookies » ajouté dans le footer pour changer d'avis à tout moment.

   Pour ajouter un service : déclarez-le dans CATEGORIES (nom, description, scripts).
   Les scripts doivent être des fichiers du site ou des domaines ajoutés à la CSP.
   ========================================================================== */
(function () {
  "use strict";

  var KEY = "ctd-consent";
  var MAX_AGE = 1000 * 60 * 60 * 24 * 182; // 6 mois

  // Catégories soumises à consentement (exemple : statistiques de visite)
  var CATEGORIES = [
    {
      id: "stats",
      name: "Mesure d'audience",
      description: "Nous aide à savoir quelles pages sont consultées, de façon anonyme, pour améliorer le site.",
      scripts: [/* "js/stats.js" */]
    }
  ];

  function readChoice() {
    try {
      var saved = JSON.parse(window.localStorage.getItem(KEY) || "null");
      if (!saved || typeof saved.date !== "number" || Date.now() - saved.date > MAX_AGE) return null;
      return saved;
    } catch (e) { return null; }
  }

  function saveChoice(accepted) {
    var choice = { date: Date.now(), accepted: accepted };
    try { window.localStorage.setItem(KEY, JSON.stringify(choice)); } catch (e) { /* stockage indisponible */ }
    return choice;
  }

  // Charge les scripts d'une catégorie acceptée (jamais avant le consentement)
  var loaded = {};
  function loadCategory(cat) {
    if (loaded[cat.id]) return;
    loaded[cat.id] = true;
    cat.scripts.forEach(function (src) {
      var s = document.createElement("script");
      s.src = src;
      s.defer = true;
      document.head.appendChild(s);
    });
  }

  function applyChoice(choice) {
    CATEGORIES.forEach(function (cat) {
      if (choice.accepted.indexOf(cat.id) !== -1) loadCategory(cat);
    });
    // Un consentement retiré ne peut pas « décharger » un script déjà lu : on recharge la page
  }

  /* ---- Bandeau ---- */
  var banner = null;

  function closeBanner() {
    if (banner && banner.parentNode) banner.parentNode.removeChild(banner);
    banner = null;
  }

  function decide(accepted, previous) {
    var choice = saveChoice(accepted);
    closeBanner();
    var withdrawn = previous && previous.accepted.some(function (id) { return accepted.indexOf(id) === -1; });
    if (withdrawn) window.location.reload();
    else applyChoice(choice);
  }

  function openBanner(previous) {
    closeBanner();
    banner = document.createElement("section");
    banner.className = "consent";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-modal", "false");
    banner.setAttribute("aria-labelledby", "consent-title");

    var title = document.createElement("h2");
    title.id = "consent-title";
    title.textContent = "Vos choix concernant les cookies";
    var text = document.createElement("p");
    text.textContent = "Avec votre accord, nous utilisons des cookies pour mesurer l'audience du site. Vous pouvez accepter, refuser ou choisir, et changer d'avis à tout moment via le lien « Gérer mes cookies » en bas de page.";
    var more = document.createElement("a");
    more.href = "cookies.html";
    more.textContent = "En savoir plus sur les cookies";

    var details = document.createElement("div");
    details.className = "consent__details";
    details.hidden = true;
    CATEGORIES.forEach(function (cat) {
      var label = document.createElement("label");
      var box = document.createElement("input");
      box.type = "checkbox";
      box.value = cat.id;
      box.checked = !!(previous && previous.accepted.indexOf(cat.id) !== -1);
      var span = document.createElement("span");
      span.textContent = cat.name + " : " + cat.description;
      label.appendChild(box);
      label.appendChild(span);
      details.appendChild(label);
    });

    var actions = document.createElement("div");
    actions.className = "consent__actions";
    function button(label, onClick) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "btn btn--ghost"; // même apparence pour « accepter » et « refuser »
      b.textContent = label;
      b.addEventListener("click", onClick);
      actions.appendChild(b);
      return b;
    }
    button("Tout refuser", function () { decide([], previous); });
    button("Tout accepter", function () { decide(CATEGORIES.map(function (c) { return c.id; }), previous); });
    var custom = button("Personnaliser", function () {
      if (details.hidden) {
        details.hidden = false;
        custom.textContent = "Enregistrer mes choix";
        var first = details.querySelector("input");
        if (first) first.focus();
      } else {
        var accepted = Array.prototype.filter.call(details.querySelectorAll("input"), function (i) { return i.checked; })
          .map(function (i) { return i.value; });
        decide(accepted, previous);
      }
    });

    banner.appendChild(title);
    banner.appendChild(text);
    banner.appendChild(more);
    banner.appendChild(details);
    banner.appendChild(actions);
    document.body.appendChild(banner);
    actions.querySelector("button").focus();
  }

  /* ---- Lien « Gérer mes cookies » dans le footer ---- */
  var legalList = document.querySelector('[aria-labelledby="footer-legal-title"] ul');
  if (legalList) {
    var li = document.createElement("li");
    var manage = document.createElement("button");
    manage.type = "button";
    manage.className = "footer__consent";
    manage.textContent = "Gérer mes cookies";
    manage.addEventListener("click", function () { openBanner(readChoice()); });
    li.appendChild(manage);
    legalList.appendChild(li);
  }

  var current = readChoice();
  if (current) applyChoice(current);
  else openBanner(null);
})();
