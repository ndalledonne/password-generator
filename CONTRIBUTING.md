# Contribuer / Contributing

🇫🇷 [Français](#français) | 🇬🇧 [English](#english)

---

## Français

Merci de votre intérêt pour ce projet.

### Signaler un bug ou proposer une idée

Ouvrez une *issue* sur GitHub en précisant :
- ce que vous avez fait, ce que vous attendiez, ce qui s'est passé ;
- le navigateur et sa version.

Pour une faille de sécurité, **n'ouvrez pas d'issue publique** : suivez [SECURITY.md](SECURITY.md).

### Proposer une modification

1. Créez un *fork* puis une branche : `git checkout -b fix/description-courte`.
2. Faites vos modifications.
3. Lancez les tests : `npm test` (Node.js 20 ou plus).
4. Ajoutez une ligne, en anglais, dans la section `[Unreleased]` de `CHANGELOG.md`.
5. Ouvrez une *pull request* qui explique le changement.

### Règles du projet

- Pas de dépendance externe ni de ressource chargée depuis un autre site.
- Toujours utiliser `crypto.getRandomValues`, jamais `Math.random()`.
- La logique de génération reste dans `assets/js/generator.js` (sans accès au DOM) ; l'interface dans `assets/js/app.js`.
- Style : indentation de 2 espaces, voir `.editorconfig`.
- Messages de commit clairs, de préférence au format [Conventional Commits](https://www.conventionalcommits.org/fr/) (`feat:`, `fix:`, `docs:`…).

---

## English

Thank you for your interest in this project.

### Reporting a bug or suggesting an idea

Open a GitHub *issue* stating:
- what you did, what you expected, what happened;
- your browser and its version.

For a security vulnerability, **do not open a public issue**: follow [SECURITY.md](SECURITY.md).

### Submitting a change

1. Fork the repository and create a branch: `git checkout -b fix/short-description`.
2. Make your changes.
3. Run the tests: `npm test` (Node.js 20 or later).
4. Add a line under `[Unreleased]` in `CHANGELOG.md`.
5. Open a *pull request* explaining the change.

### Project rules

- No external dependency and no resource loaded from another site.
- Always use `crypto.getRandomValues`, never `Math.random()`.
- Generation logic stays in `assets/js/generator.js` (no DOM access); the UI in `assets/js/app.js`.
- Style: 2-space indentation, see `.editorconfig`.
- Clear commit messages, preferably following [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`…).
