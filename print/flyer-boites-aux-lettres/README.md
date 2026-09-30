# Flyer boîtes aux lettres de l'agence Cardona

Flyer recto verso distribué dans les boîtes aux lettres pour faire connaître
l'agence Cardona. Ce dossier garde les PDF prêts à imprimer et de quoi le
retravailler. Il ne fait pas partie du site : rien ici n'est servi par
`cardona.digital` ni copié dans l'image Docker.

- **Format** : A5 portrait, recto verso, 148 × 210 mm (559 × 794 px), sans
  fonds perdus.
- **Charte** : police Bricolage Grotesque, orange de la marque `#E46212`.

## Télécharger

- [`flyer-cardona-recto-verso.pdf`](pdf/flyer-cardona-recto-verso.pdf) — les
  deux faces dans un seul PDF, à envoyer à l'imprimeur.
- [`flyer-cardona-recto.pdf`](pdf/flyer-cardona-recto.pdf) — le recto seul.
- [`flyer-cardona-verso.pdf`](pdf/flyer-cardona-verso.pdf) — le verso seul.

## Origine

- Session Claude où le flyer a été conçu :
  <https://claude.ai/code/session_01YGbRp1or1tY9ibG5vaq3wM>
- Canevas Design du flyer (éditable) :
  <https://claude.ai/code/artifact/e022933c-b798-4432-8903-19ad93cc0083>

## Sources

`source/` contient l'export du canevas Design : `canvas.json` (la disposition
des deux planches), `Main.dc.html` (le recto) et `Verso.dc.html` (le verso).
Les `.dc.html` chargent le `support.js` de l'éditeur Design, qui n'est pas
dans l'export.

## Pour le retravailler

- Rouvrir le canevas depuis son lien ci-dessus, le modifier, puis réexporter
  les PDF.
- Ou reprendre les `.dc.html` de `source/` dans une nouvelle session Claude
  Design.
