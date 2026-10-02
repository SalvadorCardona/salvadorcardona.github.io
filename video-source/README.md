# Vidéo de présentation de l'agence Cardona

La vidéo publiée est `public/video/agence-cardona.mp4` (56 s, 1920×1080), avec son
image d'attente `agence-cardona-poster.jpg` (servie en `.webp`, le JPEG restant la vignette du
JSON-LD) et ses sous-titres `agence-cardona.fr.vtt`.
Ce dossier garde de quoi la refaire.

- `storyboard/build.py` : les huit plans (du tableur à l'application, présence en ligne,
  services, abonnements, Vitrine, Application, garanties, rendez-vous), écrits en HTML aux
  couleurs du site. Les trois premiers, illustrés et animés en CSS, sont dans
  `storyboard/scenes/` tels qu'on les retouche dans le canevas Design ; `render.py` cale
  leurs animations sur l'horloge de la vidéo. Les prix sont
  écrits en dur : **si un tarif change dans `src/content/agency.ts`, le changer ici aussi**
  et régénérer la vidéo.
- `voix/voix-off.mp3` : la voix off, Google Gemini TTS (voix Leda) via OpenRouter,
  générée phrase par phrase puis assemblée. Les deux premières phrases (oct. 2026) viennent de
  `google/gemini-3.8-flash-tts`, en PCM 24 kHz, sans indication de jeu dans le texte : le
  modèle la lirait à voix haute.
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
