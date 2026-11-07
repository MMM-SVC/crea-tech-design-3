# Crea Tech Design — site web

Site vitrine de Crea Tech Design en **HTML, CSS et JavaScript purs**.
Il n'y a rien à installer : pas de Node.js, pas de npm, pas de build.

- **En ligne** : https://mmm-svc.github.io/crea-tech-design-3/ (GitHub Pages, dépôt public)
- **En local** : double-cliquez sur `index.html`. Après chaque modification, rafraîchissez la page (`Cmd + R` sur Mac, `F5` sur Windows).

## Structure

```
crea-tech-design/
├── index.html              Accueil
├── services.html           Services & tarifs (offres détaillées, abonnement, comparatif, FAQ)
├── a-propos.html           Qui sommes-nous ? (histoire, équipe, valeurs, zone)
├── contact.html            Contact : formulaire simple, vos interlocuteurs, coordonnées
├── devis.html              Demander un devis : formulaire de devis complet + « Comment ça se passe ? »
├── mentions-legales.html   Mentions légales (LCEN)
├── cgv.html                Conditions générales de vente (clients professionnels)
├── cgu.html                Conditions générales d'utilisation du site + crédits photos
├── confidentialite.html    Politique de confidentialité (RGPD)
├── cookies.html            Politique de cookies (aucun cookie de suivi)
├── accessibilite.html      Déclaration d'accessibilité (RGAA 4.1)
├── 404.html                Page « introuvable » (utilisée automatiquement par GitHub Pages)
├── css/style.css           Tout le style (thème sombre : couleurs en variables en haut du fichier)
├── js/a11y-init.js         Applique les préférences d'accessibilité dès le <head> (sans flash)
├── js/a11y.js              Panneau « Accessibilité » (bouton en bas à gauche de chaque page)
├── js/main.js              Commun : anti-clickjacking, menu, apparitions, tilt, compteurs, cartes qui
│                           se retournent, infobulles, tarifs, FAQ, vidéo, formulaires + anti-spam
├── js/effects-3d.js        Effets 3D : chargement, titre mot par mot, scroll 3D, parallaxe, curseur
├── js/showcase.js          Accueil : vitrine des sites d'exemple + fenêtre d'aperçu
├── js/consent.js           Bandeau de consentement aux cookies — DÉSACTIVÉ (voir « Cookies »)
├── images/                 Logo, favicon, image de partage, aperçu de la vidéo
│   └── exemples/           Photos des 3 sites d'exemple (bistrot/, atelier/, boutique/) + CREDITS.md
├── videos/                 presentation.mp4 (vidéo de l'accueil) + hero.mp4 optionnel pour le hero
├── .github/workflows/      backup.yml : sauvegarde automatique hebdomadaire (voir « Sauvegardes »)
├── .htaccess               Pour un futur hébergeur Apache uniquement (ignoré par GitHub Pages)
├── .nojekyll               Demande à GitHub Pages de servir les fichiers tels quels
├── .gitignore              Fichiers à ne jamais publier (.DS_Store, .env…)
├── robots.txt / sitemap.xml  Référencement
└── README.md
```

> Sur Mac, les fichiers commençant par un point (`.htaccess`, `.gitignore`…) sont cachés dans le Finder (`Cmd + Shift + .` pour les afficher). Ils sont visibles dans VS Code.

## Modifier le contenu

| Je veux changer… | Où ? |
|---|---|
| **Les prix** (toujours **HT**, TVA 20 % en sus) | Cherchez `<!-- PRIX -->` dans **`index.html`** (aperçu) **et** **`services.html`** (cartes, tableau comparatif, visuel du haut de page). Pensez aussi à la liste déroulante de `devis.html`, à l'article 3 de **`cgv.html`** et à `priceRange` dans le bloc JSON-LD en haut d'`index.html`. Le **Site marchand** est **sur devis, à partir de 3 000 € HT** (classe `price--from`). |
| Le contenu d'une offre | `services.html`, section `id="offres"` |
| Les couleurs du thème sombre | `css/style.css`, bloc `:root` tout en haut. Après un changement, revérifiez les contrastes (au moins 4,5:1 pour le texte). |
| Le menu / le footer | Ils sont répétés dans **chaque** page HTML (12 pages, 404 comprise) : modifiez-les partout de la même façon (`Cmd + Shift + H` dans VS Code pour rechercher/remplacer dans tous les fichiers). |
| Le bouton principal « Demander un devis » | C'est le **seul** bouton plein violet (`btn btn--primary`) : header, hero et bloc final de chaque page. Il mène à **`devis.html`** ; les boutons des offres ajoutent `?offre=refonte|vitrine|premium|ecommerce` et « Ajouter l'abonnement » ajoute `?abonnement=1`. Le lien « Contact » du menu et du footer mène à `contact.html`. Les autres actions sont des liens secondaires (`link-arrow`) ou des boutons discrets (`btn--ghost`). |
| Les textes de la FAQ | `services.html`, bloc `class="faq"` |
| **Les noms des fondateurs** | `a-propos.html` : nom au recto et au verso de chaque carte, texte caché du bouton « Retourner » (`la carte de Hugo Lefèvre`…), initiales (`HL`, `MD`) et prénom dans la bio. Sur `contact.html` (« Vos interlocuteurs ») : prénom, initiales, rôle et âge. La page `devis.html` ne contient volontairement aucun prénom. |
| Une photo à la place des initiales | Remplacez `<span class="avatar__initials">HL</span>` par `<img class="avatar__photo" src="images/photo-hugo.jpg" alt="">` (photo carrée, 300 × 300 px suffit) |
| Bio, citation et points forts | `a-propos.html`, verso de chaque carte (`flip__face--back`) |
| Les textes des infobulles (UI / UX, RGPD…) | `a-propos.html`, balises `<span class="tooltip" role="tooltip">` juste après chaque compétence |
| Le téléphone, l'email | Footer de chaque page, `contact.html`, `devis.html`, `mentions-legales.html`, `confidentialite.html`, `accessibilite.html` et JSON-LD d'`index.html` (`telephone`, `email`) |
| Les CGV / CGU | `cgv.html`, `cgu.html` : un article = un `<h2 id="…">` ; si vous en ajoutez un, ajoutez son lien dans le sommaire (`legal-toc`) |
| Les informations légales (SIRET, capital…) | Cherchez `Numéros FICTIFS` : `mentions-legales.html`, `cgv.html` (article 2) et le bas du footer de **chaque** page |
| La description de la vidéo | `index.html`, paragraphe `id="video-desc"` (à mettre à jour si la vidéo change) |

> **Compteurs animés** : les prix et les statistiques marqués `data-count` défilent jusqu'à leur valeur. Gardez simplement le format habituel (`1 900 €`, `+45 €`, `100 %`).

## ⚠️ À compléter de votre côté

> Les numéros d'immatriculation (SIREN 924 581 376, SIRET 924 581 376 00018, RCS Paris, TVA FR40924581376) sont **fictifs** alors que le site est **public**. Un encadré jaune le signale sur les mentions légales. Des numéros inventés peuvent correspondre à une vraie entreprise : remplacez-les au plus vite.

- [ ] **Numéros d'immatriculation réels** (cherchez `Numéros FICTIFS` : mentions légales, CGV article 2, bas du footer de chaque page), puis retirez l'encadré `legal-notice` de `mentions-legales.html` et `cgv.html`
- [ ] **Adresse du siège social** : `[Adresse du siège À COMPLÉTER]` dans `mentions-legales.html` (obligatoire)
- [ ] **Nom du gérant** (directeur de la publication) : `[Prénom Nom du gérant À COMPLÉTER]` dans `mentions-legales.html` (obligatoire)
- [ ] **GitHub** : Settings > Pages > cocher **« Enforce HTTPS »**
- [ ] **Web3Forms** : dans le tableau de bord, activer les protections disponibles (filtre anti-spam, restriction au domaine `mmm-svc.github.io` si votre offre le permet)
- [ ] Faire relire **CGV, CGU et politique de confidentialité** par un professionnel du droit
- [ ] Noms des deux associés : **Hugo Lefèvre et Maxime Durand sont des noms fictifs** (`a-propos.html`, prénoms aussi sur `contact.html`)
- [ ] Relire les bios, citations et points forts des fondateurs, ainsi que les réponses de la FAQ
- [ ] Tableau comparatif (`services.html`) : vérifier les lignes « Formulaire de contact et référencement (SEO) de base » pour la Refonte et « Nom de domaine personnalisé » pour le Site marchand
- [ ] Vidéo : si la bande-son contient des paroles, ajouter des sous-titres (fichier `.vtt` avec une balise `<track>`) et mettre à jour `accessibilite.html`
- [ ] Domaine personnalisé (plus tard) : remplacer `https://mmm-svc.github.io/crea-tech-design-3/` dans les balises `canonical` / `og:` de chaque page, le JSON-LD, `robots.txt`, `sitemap.xml` et les champs cachés `redirect` de `contact.html` et `devis.html` ; adapter aussi la balise `<base>` de `404.html` (voir « Page 404 »)

## Sites d'exemple (accueil)

Les trois sites fictifs (Le Bistrot Parisien, Atelier Bois & Co, Maison Lumière) apparaissent à trois endroits de `index.html` :

| Où ? | Ce que c'est | Classe / repère |
|---|---|---|
| Vitrine du hero | Mockups 3D cliquables + sélecteurs + bouton Pause du défilement | `<div class="showcase__item" data-site="…">`, `<button class="showcase-tab" data-site="…">`, `data-showcase-pause` |
| Section « Exemples de réalisations » | Cartes avec bouton « Voir l'aperçu » | `<button class="work-card__open" data-site="…">` |
| Fenêtre d'aperçu (modale) | Site complet, avec ordinateur / tablette / mobile | `<template data-site="…">` tout en bas de la page |

- **Texte de la version détaillée** : modifiez le contenu du `<template>` correspondant.
- **Nom, adresse, secteur et offre** : attributs du `<template>` (`data-name`, `data-url`, `data-sector`, `data-offer-label`). `data-offer` est l'offre présélectionnée dans le formulaire quand on clique sur « Demander un devis pour ce type de site » (lien vers `devis.html?offre=…`) (`refonte`, `vitrine`, `premium` ou `ecommerce`).
- **Ordre et identifiants** : la valeur `data-site` (`bistrot`, `bois`, `lumiere`) doit être identique dans la vitrine, les sélecteurs, les cartes et le `<template>`.
- **Couleurs et typographies** : `css/style.css`, section 18 (mockups du hero) et section 21 (sites détaillés : variables `--s-…` en tête de `.site--bistrot`, `.site--bois`, `.site--lumiere`).
- **Interactions dans l'aperçu** (menu burger, filtres de l'atelier, chiffres animés, panier) : `js/showcase.js`, partie 5.

### Photos des sites d'exemple

Elles se trouvent dans **`images/exemples/`** : `bistrot/`, `atelier/` et `boutique/`. Ce sont des photos Pexels libres de droits (usage commercial autorisé) ; les crédits sont dans `images/exemples/CREDITS.md` **et** sur la page `cgu.html` (rubrique « Crédits photos »).

**Pour remplacer une photo** : enregistrez la nouvelle image **sous le même nom de fichier** (par exemple `images/exemples/bistrot/salle.jpg`). Conseils :

- format JPEG, 1600 px de large maximum pour les grandes photos (hero), 1200 px pour les autres, 800 px pour les vignettes produits de la boutique ;
- 200 Ko maximum par photo. Sur Mac : `sips --resampleWidth 1200 photo.jpg --out photo-1200.jpg` puis `sips -s format jpeg -s formatOptions 75 photo-1200.jpg --out salle.jpg` ;
- si les proportions changent beaucoup, mettez à jour `width` / `height` des balises `<img>` correspondantes dans `index.html` et modifiez l'attribut `alt` pour décrire la nouvelle image ;
- mettez à jour `CREDITS.md` et la rubrique « Crédits photos » de `cgu.html`.

## Effets visuels

Tous les effets sont en CSS et JavaScript « maison » (aucune bibliothèque externe) et compatibles avec la CSP stricte.

| Effet | Où ? |
|---|---|
| Thème sombre : halos qui dérivent, fine grille et étoiles en fond, cartes en verre, mots-clés en dégradé animé | Toutes les pages (`body::before` / `body::after`, classe `text-gradient`) |
| Écran de chargement (logo qui s'assemble, < 1 s, purement CSS) | Accueil, bloc `<div class="loader">` |
| Hero en couches 3D (étoiles, halos, particules, vitrine, badges) ; titre mot par mot | Accueil (`data-parallax`, `data-progress="exit"`) |
| Vitrine interactive : clic, sélecteurs, flèches ← →, swipe, rotation auto avec bouton **Pause / Reprendre** | Accueil, `js/showcase.js` |
| Fenêtre d'aperçu : ordinateur / tablette / mobile, précédent / suivant, Échap pour fermer, focus piégé | Accueil, `js/showcase.js` |
| Sections qui entrent en 3D au scroll | Attribut `data-scroll3d` sur une `<section>` |
| Inclinaison 3D + reflet au survol | Attribut `data-tilt` (`data-tilt="4"` pour régler l'intensité) |
| Cartes de l'équipe qui se retournent, infobulles des compétences | `a-propos.html` |
| Curseur personnalisé (ordinateur uniquement) | Toutes les pages (`js/effects-3d.js`) |

Les effets qui suivent la souris sont désactivés sur écran tactile. Les animations continues se mettent en pause hors écran. Si le visiteur a activé « Réduire les animations » (dans son système **ou** dans le panneau Accessibilité), tout est figé dans sa position finale.

### Si le site paraît lent

1. **Flou des cartes en verre** : dans `:root`, remplacez `--blur: blur(14px) saturate(140%);` par `--blur: none;`.
2. **Halos animés du fond** : supprimez la ligne `animation: bg-drift …` de `body::before`.
3. **Réseau de particules du hero** : supprimez la balise `<canvas class="hero__canvas" data-particles>` dans `index.html`.
4. **Scroll 3D** : retirez l'attribut `data-scroll3d` des sections concernées.

## Vidéo de présentation (accueil)

Section « En vidéo » (`id="video"` dans `index.html`).

- **Changer de vidéo** : remplacez `videos/presentation.mp4` en gardant le même nom (MP4/H.264, idéalement moins de 20 Mo), puis mettez à jour la description textuelle (`id="video-desc"`).
- **Changer l'image d'aperçu** : remplacez `images/video-poster.jpg` (16:9, 1280 × 720 conseillé).
- **Durée affichée** sur le bouton : modifiez `<small>0:10</small>`.

La vidéo ne démarre jamais seule, affiche les contrôles du navigateur et se met en pause quand elle sort de l'écran.

## Formulaires de contact et de devis (Web3Forms)

Deux pages, deux formulaires, **une seule logique** (`js/main.js`, partie 12) : le comportement dépend de l'attribut `data-form` du formulaire (`contact` ou `devis`), qui choisit la configuration (`FORM_CONFIGS` : sujet de l'email et message de succès). Validation, anti-spam et envoi sont communs. Les deux utilisent la même clé Web3Forms : les messages arrivent sur **createch.design75@outlook.fr**.

| | `contact.html` (formulaire `data-form="contact"`) | `devis.html` (formulaire `data-form="devis"`) |
|---|---|---|
| Champs | nom, email, message (obligatoires), téléphone (facultatif), consentement RGPD | nom, email, description du projet (obligatoires), entreprise, téléphone, offre, abonnement Sérénité (facultatifs), consentement RGPD |
| Sujet de l'email | « Nouveau message de contact — [nom] » | « Nouvelle demande de devis — [offre] — [nom] » |
| Présélection | — | `devis.html?offre=premium`, `devis.html?abonnement=1` |
| Retour après envoi classique | `contact.html?envoi=ok` | `devis.html?envoi=ok` |

- **Email reçu** : expéditeur « Site Crea Tech Design ». Le champ `replyto` contient l'email du visiteur : « Répondre » dans Outlook lui écrit directement.
- **Longueurs maximales** : nom 100, entreprise 100, email 254, téléphone 20, message 3 000 caractères.
- **Envoi** : en arrière-plan (fetch), aussi en local (`file://`). Si c'est impossible, le formulaire est envoyé de façon classique et Web3Forms renvoie vers la page (champ caché `redirect`).
- **Anti-spam** (commun aux deux formulaires) :
  - honeypot `botcheck` (case invisible pour les humains) ;
  - piège temporel : envoi refusé moins de 3 secondes après l'affichage de la page ;
  - bouton désactivé pendant l'envoi, puis bloqué 60 secondes après un envoi réussi ;
  - 3 envois maximum par heure depuis un même navigateur, tous formulaires confondus (seules les heures d'envoi sont conservées, dans `localStorage`, clé `ctd-envois`) ;
  - nettoyage des espaces, validation stricte de l'email et du téléphone, refus des messages contenant plus de 3 liens ;
  - message clair si Web3Forms refuse l'envoi (trop de requêtes, service indisponible).
- **Ajouter un troisième formulaire** : copiez un formulaire existant, donnez-lui un `data-form` nouveau et ajoutez sa configuration dans `FORM_CONFIGS`.

## Accessibilité

Objectif : RGAA 4.1 / WCAG 2.1 niveau AA (déclaration : `accessibilite.html`, état « partiellement conforme », non audité).

- **Panneau « Accessibilité »** (bouton en bas à gauche, utilisable au clavier) : taille du texte (normale / grande / très grande), contraste renforcé, réduction des animations. Choix mémorisés dans `localStorage` (clé `ctd-a11y`) et appliqués dès le `<head>` par `js/a11y-init.js`, sans flash. Classes CSS : `a11y-text-lg`, `a11y-text-xl`, `a11y-contrast`, `a11y-reduce-motion` sur `<html>` (section 24 de `css/style.css`).
- **Contrastes** vérifiés (texte ≥ 4,5:1, éléments graphiques ≥ 3:1), y compris les deux extrémités des textes en dégradé et les couleurs des sites d'exemple.
- **Clavier** : lien « Aller au contenu » sur chaque page, focus visible, menu, vitrine, modale, cartes, FAQ, vidéo et formulaire utilisables au clavier.
- **Structure** : un seul `h1` par page, titres hiérarchisés, `header` / `nav` / `main` / `footer`, `aria-current` sur la page active (sur `devis.html`, c'est le bouton « Demander un devis » du header qui le porte), liens externes signalés « (nouvelle fenêtre) ».
- **Formulaire** : étiquettes associées, champs obligatoires indiqués en texte, erreurs annoncées (`role="alert"` + `aria-describedby`).
- **Zones tactiles** : au moins 44 × 44 px sur mobile.

## Cookies

Le site **ne dépose aucun cookie** et n'utilise aucun service tiers (pas de statistiques, de polices Google, de vidéo YouTube ni de pixel). Seuls deux éléments strictement nécessaires sont enregistrés dans le navigateur (déclarés dans `cookies.html`) : `ctd-a11y` (préférences d'accessibilité) et `ctd-envois` (anti-spam du formulaire). **Aucun bandeau** n'est donc affiché : la CNIL ne l'impose pas dans ce cas.

### Le jour où vous ajoutez un outil de statistiques

Le bandeau conforme CNIL est prêt dans **`js/consent.js`** (« Tout accepter » / « Tout refuser » au même niveau, « Personnaliser », choix mémorisé 6 mois, lien « Gérer mes cookies » ajouté au footer, aucun dépôt avant consentement). Pour l'activer :

1. Déclarez le service dans la liste `CATEGORIES` de `js/consent.js` et indiquez son script dans `scripts` (ce script ne doit **pas** être ajouté directement dans les pages : `consent.js` le charge seulement après acceptation).
2. Ajoutez `<script src="js/consent.js"></script>` juste après `js/a11y.js` dans **toutes** les pages.
3. Si l'outil est hébergé ailleurs, ajoutez son domaine à la balise `Content-Security-Policy` de chaque page (`script-src`, `connect-src`…).
4. Mettez à jour `cookies.html` (tableau des traceurs, durée, finalité) et `confidentialite.html` (nouveau sous-traitant), puis retirez la phrase « Ce site n'utilise aucun cookie de suivi » du footer.

## Sécurité

- **HTTPS** : GitHub Pages sert le site en HTTPS ; cochez **« Enforce HTTPS »** dans Settings > Pages. Tous les liens internes sont relatifs et tous les liens externes en `https://`.
- **En-têtes** : GitHub Pages ne permet pas d'en-têtes HTTP personnalisés. Chaque page contient donc une balise `<meta http-equiv="Content-Security-Policy">` (uniquement nos fichiers + l'API Web3Forms) et `<meta name="referrer" content="strict-origin-when-cross-origin">`. **Si vous modifiez la CSP, modifiez-la dans les 12 pages.**
- **Anti-clickjacking** : `frame-ancestors` ne fonctionne pas en balise meta ; `js/main.js` masque la page si elle est affichée dans un cadre (iframe) d'un autre site et propose d'ouvrir le site directement.
- **`.htaccess`** : conservé pour un futur hébergeur Apache (redirection HTTPS, HSTS, en-têtes de sécurité). Il n'est pas utilisé par GitHub Pages.
- **Pas de JavaScript ni de style inline**, aucun script tiers ; liens `target="_blank"` en `rel="noopener noreferrer"`.
- **Clé Web3Forms** (`access_key` dans `contact.html`) : elle est **publique par conception**. Elle permet seulement d'envoyer des messages vers notre adresse ; elle ne donne accès à rien d'autre. Recommandations : dans le tableau de bord Web3Forms, activez le filtre anti-spam et, si votre offre le permet, la restriction au domaine du site.
- **Clés secrètes** : le dépôt est public. Une clé **secrète** (paiement en ligne, API privée, mot de passe…) ne doit **jamais** être mise dans le site ni dans le dépôt : elle doit rester côté serveur (serveur ou fonction « serverless », par exemple Netlify Functions ou Cloudflare Workers), le site n'appelant que ce serveur. Le fichier `.gitignore` exclut déjà `.env` et les fichiers de clés.

## Sauvegardes

1. **Le dépôt GitHub** (avec tout son historique) est la sauvegarde principale : chaque modification poussée est conservée.
2. **Sauvegarde automatique** (`.github/workflows/backup.yml`) : chaque **lundi vers 3 h**, GitHub crée une archive ZIP du site et la publie dans l'onglet **Releases** du dépôt, sous le nom `sauvegarde-AAAA-MM-JJ`. Seules les **8 dernières** sont conservées. Pour en lancer une tout de suite : onglet **Actions** > « Sauvegarde du site » > **Run workflow**.

**Restaurer une sauvegarde** :

- *Tout le site, à partir d'une archive* : onglet **Releases** > choisissez la sauvegarde > téléchargez le fichier `.zip` > décompressez-le > remplacez le contenu du dossier du site par celui du dossier `crea-tech-design/` de l'archive > faites un commit et poussez.
- *Revenir à une version précédente avec l'historique Git* : sur GitHub, ouvrez l'historique (« Commits ») pour retrouver la bonne version ; dans un terminal : `git log` (repérez le commit), puis `git revert <commit>` pour annuler une modification précise, et `git push`.
- *Un seul fichier* : sur GitHub, ouvrez le fichier > « History » > choisissez la version > copiez son contenu.

## Page 404

`404.html` s'affiche automatiquement sur GitHub Pages pour toute adresse inexistante, même dans un sous-dossier (`/crea-tech-design-3/dossier/page`). Pour que le CSS, les images et les liens fonctionnent à n'importe quelle adresse, elle contient `<base href="/crea-tech-design-3/">` (nom du dépôt). **Si le dépôt est renommé ou si un domaine personnalisé est utilisé**, adaptez cette balise (`<base href="/">` avec un domaine personnalisé). Conséquence : en local (`file://`), la page 404 s'affiche sans mise en forme ; c'est normal.
