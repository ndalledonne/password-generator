# Générateur de mot de passe

🇫🇷 Français | [🇬🇧 English](README.en.md)

[![Tests](https://github.com/ndalledonne/password-generator/actions/workflows/tests.yml/badge.svg)](https://github.com/ndalledonne/password-generator/actions/workflows/tests.yml)
[![Licence : MIT](https://img.shields.io/badge/licence-MIT-blue.svg)](LICENSE)

Petite application web qui génère des mots de passe aléatoires et sécurisés, directement dans le navigateur.
HTML, CSS et JavaScript, sans framework, sans dépendance, sans serveur.

## Fonctionnalités

- Génération d'un mot de passe en un clic.
- Copie dans le presse-papier en un clic.
- Choix de la longueur :
  - boutons rapides : 8, 12, 16 (par défaut), 20, 24, 32 ;
  - liste déroulante avec plus de valeurs : de 6 à 128 caractères.
- Choix des types de caractères (tous cochés par défaut) :
  - minuscules `a-z`
  - majuscules `A-Z`
  - chiffres `0-9`
  - caractères spéciaux `!@#$%^&*()-_=+[]{};:,.?/`
- Au moins un caractère de chaque type coché est garanti.
- Option « Exclure les caractères similaires » (cochée par défaut) : retire `I`, `l`, `1`, `O`, `0`, `o`, faciles à confondre à la lecture.
- Options regroupées dans un panneau repliable, fermé par défaut, avec un résumé des réglages.
- Thème clair / sombre selon le réglage du système.
- Utilisable au clavier et compatible lecteurs d'écran (étiquettes ARIA, zone de statut).

## Sécurité

- Les mots de passe sont générés avec l'API **Web Crypto** (`crypto.getRandomValues`), le générateur aléatoire cryptographique du navigateur. `Math.random()` n'est jamais utilisé.
- Le tirage est **sans biais** (échantillonnage par rejet), puis les caractères sont mélangés (Fisher–Yates).
- **Aucune donnée ne quitte le navigateur** : pas de serveur, pas de cookie, pas de statistiques, pas de ressource externe (aucune police ni bibliothèque chargée depuis un autre site).
- Une politique de sécurité du contenu (CSP) limite la page à ses propres fichiers.

Voir aussi [SECURITY.md](SECURITY.md).

## Démo

Démo en ligne : *à compléter (URL de votre site ou de GitHub Pages)*.

## Installation et utilisation

Aucune installation n'est nécessaire.

```bash
git clone https://github.com/ndalledonne/password-generator.git
cd password-generator
```

Ouvrez ensuite `index.html` dans un navigateur.

### Mise en ligne sur votre site

Copiez sur votre hébergement le fichier `index.html` et le dossier `assets/`, en gardant la même arborescence. Les autres fichiers (documentation, tests) ne sont pas nécessaires au fonctionnement.

> La copie dans le presse-papier par l'API moderne nécessite une page servie en **HTTPS** (ou en local). En HTTP simple, une méthode de secours est utilisée.
>
> Pour empêcher l'intégration de la page dans un site tiers (*clickjacking*), configurez sur votre serveur l'en-tête HTTP `Content-Security-Policy: frame-ancestors 'self'`. Cette règle ne peut pas être placée dans le HTML.

### GitHub Pages

Dans le dépôt GitHub : **Settings → Pages → Source : Deploy from a branch**, branche `main`, dossier `/ (root)`.

## Structure du projet

```
password-generator/
├── index.html                 Page principale
├── assets/
│   ├── css/style.css          Styles
│   ├── js/generator.js        Logique de génération (testable, sans interface)
│   ├── js/app.js              Interface utilisateur
│   └── favicon.svg
├── tests/generator.test.js    Tests unitaires (Node.js)
├── .github/workflows/tests.yml  Intégration continue
├── CHANGELOG.md               Historique des versions (en anglais)
├── CONTRIBUTING.md
├── SECURITY.md
└── LICENSE
```

## Utiliser la logique dans un autre code

`assets/js/generator.js` peut être réutilisé seul.

Dans le navigateur, il expose `window.PasswordGenerator` :

```html
<script src="assets/js/generator.js"></script>
<script>
  const pwd = PasswordGenerator.generate({ length: 20, symbols: false });
</script>
```

Dans Node.js (20 ou plus) :

```js
const { generate } = require('./assets/js/generator.js');
generate(); // 16 caractères, tous les types
```

| Option      | Type    | Défaut | Description                     |
|-------------|---------|--------|---------------------------------|
| `length`    | entier  | `16`   | Longueur, de 4 à 128            |
| `lowercase` | booléen | `true` | Inclure les minuscules          |
| `uppercase` | booléen | `true` | Inclure les majuscules          |
| `digits`    | booléen | `true` | Inclure les chiffres            |
| `symbols`   | booléen | `true` | Inclure les caractères spéciaux |
| `excludeSimilar` | booléen | `false` | Retirer `I l 1 O 0 o` |

Une option absente ou `undefined` prend sa valeur par défaut. `generate()` lève :
- une `Error` si aucun type n'est sélectionné ;
- une `RangeError` si la longueur est invalide ;
- une `TypeError` si une option est inconnue ou si une case n'est pas un booléen.

Dans l'interface, « Exclure les caractères similaires » est cochée par défaut ; dans l'API, `excludeSimilar` vaut `false` par défaut.

## Tests

Les tests utilisent le module de test intégré de Node.js. Aucune dépendance à installer.

```bash
npm test
```

Ils sont aussi lancés automatiquement par GitHub Actions à chaque envoi de code et à chaque pull request.

## Compatibilité

Navigateurs actuels : Chrome, Edge, Firefox, Safari (versions sorties depuis 2020).

## Contribuer

Voir [CONTRIBUTING.md](CONTRIBUTING.md).

## Historique des versions

Voir [CHANGELOG.md](CHANGELOG.md) (rédigé en anglais).

## Licence

Distribué sous licence MIT. Voir [LICENSE](LICENSE).

© 2026 Nicolas DALLEDONNE
