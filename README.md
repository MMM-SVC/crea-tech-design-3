# Crea Tech Design — site web

Site vitrine de Crea Tech Design en **HTML, CSS et JavaScript purs**.
Il n'y a rien à installer : pas de Node.js, pas de npm, pas de build.

## Ouvrir le site

Double-cliquez sur `index.html` : le site s'ouvre dans votre navigateur.
Après chaque modification d'un fichier, rafraîchissez la page (`Cmd + R` sur Mac, `F5` sur Windows).

## Structure

```
crea-tech-design/
├── index.html              Accueil
├── services.html           Services & tarifs (offres détaillées, abonnement, FAQ)
├── a-propos.html           Qui sommes-nous ? (histoire, équipe, valeurs, zone)
├── contact.html            Formulaire de contact + coordonnées
├── mentions-legales.html   Mentions légales (obligatoires)
├── confidentialite.html    Politique de confidentialité RGPD
├── cgv.html                Conditions générales de vente (B2B, sommaire cliquable)
├── css/style.css           Tout le style (thème sombre : couleurs en variables en haut du fichier)
├── js/main.js              Commun : menu mobile, apparitions, tilt, compteurs, cartes qui se retournent,
│                           infobulles, cadre lumineux des tarifs, FAQ animée, formulaire
├── js/effects-3d.js        Effets 3D : chargement, titre mot par mot, scroll 3D, parallaxe, curseur
├── js/showcase.js          Accueil uniquement : vitrine des sites d'exemple + fenêtre d'aperçu
├── images/                 Logo, favicon, image de partage réseaux sociaux, aperçu de la vidéo (video-poster.jpg)
│   └── exemples/           Photos des 3 sites d'exemple (bistrot/, atelier/, boutique/) + CREDITS.md
├── videos/                 presentation.mp4 (vidéo de l'accueil) + hero.mp4 optionnel pour le hero
├── .htaccess               Sécurité et HTTPS (utile une fois en ligne)
├── robots.txt / sitemap.xml  Référencement
└── README.md
```

> Sur Mac, `.htaccess` est caché dans le Finder (`Cmd + Shift + .` pour l'afficher). Il est visible dans VS Code.

## Modifier le contenu

| Je veux changer… | Où ? |
|---|---|
| **Les prix** (toujours **HT**) | Cherchez `<!-- PRIX -->` dans **`index.html`** (aperçu) **et** **`services.html`** (détail, y compris le tableau comparatif). Pensez à modifier aussi la liste déroulante de `contact.html`, l'article 3 de **`cgv.html`** et `priceRange` dans le bloc JSON-LD en haut d'`index.html`. |
| Le contenu d'une offre | `services.html`, section `id="offres"` |
| Les couleurs du thème sombre | `css/style.css`, bloc `:root` tout en haut (`--c-bg` fond, `--c-violet…` violets, `--c-cyan` / `--c-pink` touches réservées aux dégradés et halos) |
| Le menu / le footer | Ils sont répétés dans **chaque** page HTML : modifiez-les partout de la même façon (`Cmd + Shift + H` dans VS Code pour rechercher/remplacer dans tous les fichiers) |
| Les textes de la FAQ | `services.html`, réponses marquées `<!-- À VALIDER -->` |
| **Les noms des fondateurs** | `a-propos.html`, cherchez `<!-- Nom fictif : à remplacer -->` (4 endroits : recto et verso de chaque carte) **et** le texte caché du bouton « Retourner » (`la carte de Hugo Lefèvre` / `la carte de Maxime Durand`). Changez aussi les initiales (`HL`, `MD`) et le prénom dans la bio. |
| Une photo à la place des initiales | `a-propos.html` : remplacez `<span class="avatar__initials">HL</span>` par `<img class="avatar__photo" src="images/photo-hugo.jpg" alt="">` (photo carrée, 300 × 300 px suffit) |
| Bio, citation et points forts | `a-propos.html`, verso de chaque carte (`flip__face--back`) |
| Les textes des infobulles (UI / UX, RGPD…) | `a-propos.html`, balises `<span class="tooltip" role="tooltip">` juste après chaque compétence |
| Les sites d'exemple | Voir la rubrique « Sites d'exemple » ci-dessous |
| Le tableau comparatif | `services.html`, section `id="comparatif"` (une ligne `<tr>` par fonctionnalité) |
| La frise « Notre histoire » | `a-propos.html`, liste `<ol class="timeline">` (une étape = un `<li>`) |
| Les CGV | `cgv.html` : un article = un `<h2 id="article-N">` ; si vous en ajoutez un, ajoutez aussi son lien dans le sommaire (`legal-toc`) |
| Les informations légales (SIRET, capital…) | Cherchez `Numéros FICTIFS` : `mentions-legales.html`, `cgv.html` (article 2) et le bas du footer de **chaque** page |

> **Compteurs animés** : les prix et les statistiques marqués `data-count` défilent jusqu'à leur valeur. Gardez simplement le format habituel (`1 900 €`, `+45 €`, `100 %`).

Astuce : dans VS Code, `Cmd + Shift + F` (Mac) ou `Ctrl + Shift + F` (Windows) cherche un texte dans tout le projet.

## À compléter avant la mise en ligne

> ⚠️ **Maquette interne.** Les informations légales (SIREN 924 581 376, SIRET 924 581 376 00018, RCS Paris, TVA FR40924581376, SARL au capital de 10 000 €) sont **fictives**. Elles sont signalées par le commentaire `<!-- Numéros FICTIFS (maquette interne) : à remplacer par les vrais avant toute publication -->` et par un encadré jaune sur `mentions-legales.html` et `cgv.html`.

- [ ] Remplacer les numéros fictifs par les vrais (cherchez `Numéros FICTIFS` : mentions légales, CGV article 2, bas du footer de chaque page), puis retirer les encadrés « Maquette interne » (`legal-notice`)
- [ ] Indiquer l'**hébergeur** réel (nom, adresse, téléphone) dans `mentions-legales.html`
- [ ] Faire relire les **CGV** (`cgv.html`) par un professionnel du droit
- [ ] Noms des deux associés : **Hugo Lefèvre et Maxime Durand sont des noms fictifs** à remplacer dans `a-propos.html` (+ photos si souhaité, voir le tableau ci-dessus)
- [ ] Bios, citations et points forts des fondateurs (verso des cartes) à relire
- [ ] Réponses de la FAQ (`<!-- À VALIDER -->`)
- [ ] Tableau comparatif (`services.html`) : vérifier les lignes « Formulaire de contact et SEO de base » pour la Refonte et « Nom de domaine personnalisé » pour le Site marchand, déduites des cartes d'offres (`<!-- À VALIDER -->`)
- [ ] Remplacer le domaine `https://www.createchdesign.fr` (balises `canonical` / `og:` de chaque page, JSON-LD, `robots.txt`, `sitemap.xml`, champ caché `redirect` de `contact.html`) par votre vrai nom de domaine

## Sites d'exemple (accueil)

Les trois sites fictifs (Le Bistrot Parisien, Atelier Bois & Co, Maison Lumière) apparaissent à trois endroits de `index.html` :

| Où ? | Ce que c'est | Classe / repère |
|---|---|---|
| Vitrine du hero | Mockups 3D cliquables + sélecteurs sous la vitrine | `<div class="showcase__item" data-site="…">` et `<button class="showcase-tab" data-site="…">` |
| Section « Exemples de réalisations » | Cartes avec bouton « Voir l'aperçu » | `<button class="work-card__open" data-site="…">` |
| Fenêtre d'aperçu (modale) | Version détaillée : hero, services / produits, avis, contact | `<template data-site="…">` tout en bas de la page |

- **Texte de la version détaillée** : modifiez le contenu du `<template>` correspondant.
- **Nom, adresse, secteur et offre** : attributs du `<template>` (`data-name`, `data-url`, `data-sector`, `data-offer-label`). `data-offer` est l'offre présélectionnée dans le formulaire quand on clique sur « Je veux un site comme celui-ci » (`refonte`, `vitrine`, `premium` ou `ecommerce`).
- **Ordre et identifiants** : la valeur `data-site` (`bistrot`, `bois`, `lumiere`) doit être identique dans la vitrine, les sélecteurs, les cartes et le `<template>`.
- **Couleurs et typographies** : `css/style.css`, section 18 (mockups du hero) et section 21 (sites détaillés : variables `--s-…` en tête de `.site--bistrot`, `.site--bois`, `.site--lumiere`).
- **Interactions dans l'aperçu** (menu burger, filtres de l'atelier, chiffres animés, panier) : `js/showcase.js`, partie 5.

### Photos des sites d'exemple

Elles se trouvent dans **`images/exemples/`** : `bistrot/`, `atelier/` et `boutique/`. Ce sont des photos Pexels libres de droits (usage commercial autorisé) ; les crédits sont dans `images/exemples/CREDITS.md`.

**Pour remplacer une photo** : enregistrez la nouvelle image **sous le même nom de fichier** (par exemple `images/exemples/bistrot/salle.jpg`). Conseils :

- format JPEG, 1600 px de large maximum pour les grandes photos (hero), 1200 px pour les autres, 800 px pour les vignettes produits de la boutique ;
- 200 Ko maximum par photo. Sur Mac : `sips --resampleWidth 1200 photo.jpg --out photo-1200.jpg` puis `sips -s format jpeg -s formatOptions 75 photo-1200.jpg --out salle.jpg` ;
- si les proportions changent beaucoup, mettez à jour `width` / `height` des balises `<img>` correspondantes dans `index.html` (recherchez le nom du fichier) et modifiez l'attribut `alt` pour décrire la nouvelle image ;
- pensez à mettre à jour `CREDITS.md`.

La même photo est parfois utilisée à plusieurs endroits (mockup du hero, carte « Exemples de réalisations », aperçu détaillé) : un seul fichier à remplacer.

## Effets visuels

Tous les effets sont en CSS et JavaScript « maison » (aucune bibliothèque externe) et compatibles avec la CSP stricte.

| Effet | Où ? |
|---|---|
| Thème sombre : halos (« blobs ») qui dérivent, fine grille et étoiles en fond, cartes en verre, mots-clés en dégradé animé | Toutes les pages (`body::before` / `body::after`, classe `text-gradient`) |
| Écran de chargement (logo qui s'assemble, < 1 s, purement CSS) | Accueil, bloc `<div class="loader">` |
| Hero en couches 3D (étoiles, halos, particules, vitrine, badges) qui réagissent à la souris et au scroll ; titre mot par mot | Accueil (`data-parallax`, `data-progress="exit"`) |
| Vitrine interactive : clic sur un site en arrière-plan, sélecteurs, flèches ← →, swipe, rotation auto qui s'arrête dès qu'on interagit | Accueil, `js/showcase.js` |
| Fenêtre d'aperçu : défilement du site, ordinateur / tablette / mobile, site précédent / suivant, Échap ou clic à l'extérieur pour fermer, focus piégé | Accueil, `js/showcase.js` |
| Sections qui entrent en 3D au scroll | Attribut `data-scroll3d` sur une `<section>` |
| Cartes en cascade depuis la profondeur | Classe `grid--depth` sur la grille |
| Double casquette : les cartes fusionnent autour du × | Accueil, bloc `duo-wrap` |
| Ligne lumineuse des 5 étapes et frise chronologique | `data-progress="line"` (les étapes s'allument au passage) |
| Tarifs en éventail 3D (accueil) | Classe `pricing--fan` |
| Cadre lumineux qui suit l'offre survolée ou focalisée (et la carte centrée sur mobile), retour sur Premium ensuite ; reflet qui suit la souris | Toutes les grilles `.pricing` (`js/main.js`) |
| Inclinaison 3D + reflet au survol | Tout élément avec l'attribut `data-tilt` (`data-tilt="4"` pour régler l'intensité, 5 par défaut) |
| Visuels 3D des en-têtes (cartes de prix flottantes, logo 3D avec reflet), bouclier 3D, encart Sérénité à bordure tournante, carte de France qui pulse depuis Paris | `services.html`, `a-propos.html` |
| Curseur personnalisé (ordinateur uniquement) | Toutes les pages (`js/effects-3d.js`) |
| Cartes de l'équipe qui se retournent, infobulles des compétences | `a-propos.html` |

Les effets qui suivent la souris et le curseur sont désactivés sur écran tactile. Les animations continues se mettent en pause hors écran et quand l'onglet est caché. Si le visiteur a activé « Réduire les animations » dans son système, tout est figé dans sa position finale : pas d'écran de chargement, pas de 3D au scroll, vitrine fixe, chiffres affichés directement.

### Si le site paraît lent

Par ordre d'efficacité :

1. **Flou des cartes en verre** : dans `:root`, remplacez `--blur: blur(14px) saturate(140%);` par `--blur: none;` (le plus coûteux pour la carte graphique).
2. **Halos animés du fond** : dans `css/style.css`, supprimez la ligne `animation: bg-drift …` de `body::before`.
3. **Réseau de particules du hero** : supprimez la balise `<canvas class="hero__canvas" data-particles>` dans `index.html`.
4. **Scroll 3D** : retirez l'attribut `data-scroll3d` des sections concernées.

## Vidéo de présentation (accueil)

La section « En vidéo » se trouve juste après le bandeau « SITES WEB | E-COMMERCE | REFONTE » (`id="video"` dans `index.html`).

- **Changer de vidéo** : remplacez `videos/presentation.mp4` par votre nouveau fichier, en gardant le même nom (format MP4/H.264, idéalement moins de 20 Mo). Sur Mac, un `.mov` se convertit via `Control` + clic → **Encode Selected Video Files** ; renommez alors le fichier obtenu en `presentation.mp4`.
- **Changer l'image d'aperçu** (affichée avant la lecture) : remplacez `images/video-poster.jpg` (format 16:9, 1280 × 720 conseillé).
- **Durée affichée** sur le bouton : modifiez `<small>0:10</small>` dans `index.html`.

La vidéo ne démarre jamais seule : elle se lance avec le son au clic sur le bouton, affiche les contrôles du navigateur, se met en pause quand on fait défiler la page et qu'elle sort de l'écran, et le bouton réapparaît à la fin pour la relancer.

## Vidéo dans le hero (optionnel)

Vous pouvez remplacer la vitrine 3D par une vidéo :

1. Créez un dossier `videos/` à côté d'`index.html` et placez-y votre fichier sous le nom **`hero.mp4`** (format MP4/H.264, idéalement moins de 5 Mo, sans son).
2. Dans `index.html`, cherchez `VIDÉO OPTIONNELLE` : retirez les marqueurs de commentaire `<!--` et `-->` autour de la balise `<video>`.
3. Supprimez le bloc `<div class="showcase" data-showcase> … </div>` qui suit ainsi que les sélecteurs `<div class="showcase-tabs">` et la phrase `showcase-hint` (ou entourez-les de `<!--` et `-->`). Les cartes « Exemples de réalisations » continuent d'ouvrir la fenêtre d'aperçu.

La vidéo démarre seule, sans son, en boucle, et fonctionne aussi sur iPhone (`playsinline`). Les badges « Site sécurisé » et « Rapide » restent affichés par-dessus. Aucun réglage de sécurité à modifier : la CSP autorise déjà les vidéos du site.

## Formulaire de contact (Web3Forms)

Le formulaire de `contact.html` est **opérationnel** : les demandes arrivent sur **createch.design75@outlook.fr** (l'adresse liée à la clé Web3Forms).

- **Clé** : champ caché `access_key` dans `contact.html`. Cette clé n'est pas secrète : Web3Forms est conçu pour qu'elle figure dans la page. Pour changer d'adresse de réception, créez une nouvelle clé sur https://web3forms.com et remplacez la valeur.
- **Email reçu** : sujet « Nouvelle demande de contact — [offre choisie] — [nom] », expéditeur « Site Crea Tech Design ». Le champ `replyto` contient l'email du visiteur : cliquez sur « Répondre » dans Outlook pour lui écrire directement.
- **Envoi** : `js/main.js` envoie le formulaire en arrière-plan (fetch) et affiche un message de succès sans quitter la page. Cela fonctionne aussi en local (`file://` ou Live Server). Si l'envoi en arrière-plan est impossible, le formulaire est envoyé de façon classique, puis Web3Forms renvoie vers `contact.html?envoi=ok` (champ caché `redirect`, à adapter à votre domaine).
- **Protection** : validation des champs, honeypot anti-spam (`botcheck`) et case de consentement RGPD obligatoire.

## Mettre le site en ligne (plus tard)

- **Netlify Drop** (le plus simple, gratuit) : allez sur https://app.netlify.com/drop et glissez-déposez le dossier `crea-tech-design`. Le site est en ligne en quelques secondes. Le `.htaccess` n'est pas utilisé par Netlify : il faudra transposer les en-têtes de sécurité dans un fichier `_headers`.
- **OVH, o2switch, Hostinger…** (hébergement Apache) : envoyez tous les fichiers dans le dossier `www` ou `public_html` par FTP (FileZilla) ou via le gestionnaire de fichiers. Le `.htaccess` y applique automatiquement le HTTPS et les en-têtes de sécurité.

## Sécurité

- Aucun script ni police externe, aucun cookie, aucun tracking (seul le formulaire contacte api.web3forms.com).
- Pas de JavaScript ni de style inline : compatible avec une CSP stricte (voir `.htaccess`).
- Formulaire : validation, honeypot anti-spam, consentement RGPD.
- Liens externes en `rel="noopener noreferrer"`.
