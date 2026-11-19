# Politique de sécurité / Security policy

🇫🇷 [Français](#français) | 🇬🇧 [English](#english)

---

## Français

### Fonctionnement

- Les mots de passe sont générés **uniquement dans le navigateur**, avec `crypto.getRandomValues` (générateur aléatoire cryptographique).
- Le tirage d'un caractère se fait par échantillonnage par rejet, ce qui évite le biais du modulo.
- Aucun mot de passe n'est envoyé, enregistré ou journalisé. La page ne charge aucune ressource externe et applique une politique CSP restrictive.

### Limites connues

- Une fois copié, le mot de passe reste dans le presse-papier du système jusqu'à ce qu'il soit remplacé. Certains systèmes conservent un historique du presse-papier.
- La sécurité dépend de l'appareil : une extension de navigateur ou un logiciel malveillant peut lire la page ou le presse-papier.

### Signaler une vulnérabilité

Merci de ne **pas** ouvrir d'issue publique. Utilisez l'onglet **Security → Report a vulnerability** du dépôt GitHub : le signalement reste privé entre vous et le mainteneur.

Indiquez la description du problème, les étapes pour le reproduire et son impact possible.

---

## English

### How it works

- Passwords are generated **only in the browser**, using `crypto.getRandomValues` (cryptographic random number generator).
- Each character is selected with rejection sampling, which avoids modulo bias.
- No password is sent, stored or logged. The page loads no external resource and enforces a strict CSP.

### Known limitations

- Once copied, the password stays in the system clipboard until replaced. Some systems keep a clipboard history.
- Security depends on the device: a browser extension or malware can read the page or the clipboard.

### Reporting a vulnerability

Please do **not** open a public issue. Use the GitHub repository's **Security → Report a vulnerability** tab: the report stays private between you and the maintainer.

Include a description of the issue, steps to reproduce it and its potential impact.
