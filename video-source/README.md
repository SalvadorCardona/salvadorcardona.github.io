# Vidéo de présentation de l'agence Cardona

La vidéo publiée est `public/video/agence-cardona.mp4` (1 min 01, 1920×1080), avec son
image d'attente `agence-cardona-poster.jpg` (servie en `.webp`, le JPEG restant la vignette du
JSON-LD) et ses sous-titres `agence-cardona.fr.vtt`.
Ce dossier garde de quoi la refaire.

- `storyboard/build.py` : les sept plans (accroche, services, abonnements, Vitrine,
  Application, garanties, rendez-vous), écrits en HTML aux couleurs du site. Les prix sont
  écrits en dur : **si un tarif change dans `src/content/agency.ts`, le changer ici aussi**
  et régénérer la vidéo.
- `voix/voix-off.mp3` : la voix off, Google Gemini TTS (voix Leda) via OpenRouter,
  générée phrase par phrase avec des indications de jeu puis assemblée.
- `voix/timing.json` : le début et la fin de chaque phrase dans la voix off, et le début
  mesuré de chaque ligne de sous-titre (`lines`).
- `render.py` : monte la vidéo. Chaque plan apparaît, et chaque élément entre au moment
  où la voix en parle ; les sous-titres sont incrustés.

## Régénérer

Depuis la racine du dépôt, après `npm install` (pour la police) :

```sh
pip install playwright && python3 -m playwright install chromium
cd video-source && python3 render.py ../public/video/agence-cardona.mp4
```

Il faut `ffmpeg` dans le `PATH` (ou la variable `FFMPEG`). Le rendu prend environ trois
minutes. Changer le texte de la voix veut dire régénérer `voix-off.mp3` et remesurer
`timing.json` ; changer seulement un plan ne demande que `render.py`.
