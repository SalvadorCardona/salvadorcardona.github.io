"""Monte la vidéo de l'agence Cardona : plans du storyboard + voix off.

1. Reprend les plans générés par storyboard/build.py.
2. Construit une page où chaque plan entre, s'anime et sort aux temps de la voix.
3. Capture chaque image dans Chromium et l'envoie à ffmpeg avec la voix.
"""
import json, os, re, shutil, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
SB = os.path.join(HERE, "storyboard")
sys.path.insert(0, SB)
import build  # noqa: E402  (écrit les plans dans storyboard/project/)

FPS = 25
FF = os.environ.get("FFMPEG") or shutil.which("ffmpeg") or "ffmpeg"
# La voix off (Google Gemini TTS, voix Leda, via OpenRouter) et le début mesuré de chaque phrase.
AUDIO = os.path.join(HERE, "voix", "voix-off.mp3")
TIMING = json.load(open(os.path.join(HERE, "voix", "timing.json")))
FONTS = os.path.join(HERE, "..", "node_modules", "@fontsource-variable", "bricolage-grotesque", "files")
FONT = os.path.join(FONTS, "bricolage-grotesque-latin-wght-normal.woff2")
FONT_EXT = os.path.join(FONTS, "bricolage-grotesque-latin-ext-wght-normal.woff2")

# Texte dit par la voix, phrase par phrase, pour les sous-titres synchronisés.
SPOKEN = {
    "01": ["Votre activité tient encore dans des tableurs ?", "Votre site date d'une autre époque ?", "Bon. L'agence Cardona a une proposition, toute simple."],
    "02": ["On développe vos applications web sur mesure."],
    "03": ["On audite la sécurité de celles que vous avez déjà."],
    "04": ["Et on branche l'intelligence artificielle dans vos outils,", "là où elle vous fait gagner du temps."],
    "05": ["Et pour votre présence en ligne, deux abonnements.", "Deux prix, affichés, hors taxes."],
    "06": ["La Vitrine : trente euros par mois.", "Votre site, écrit, hébergé, tenu à jour.", "En ligne en deux semaines."],
    "07": ["L'Application : cent euros par mois.", "Un outil taillé pour votre métier,", "qui évolue avec vous, chaque mois."],
    "08": ["Zéro euro pour démarrer.", "Et votre code, vos données, restent à vous."],
    "09": ["Alors, on en parle ?", "Une heure d'échange, offerte, sans engagement.", "Prenez rendez-vous sur cardona.digital"],
}


def captions():
    """Une ligne par morceau de phrase. Son début vient de la voix mesurée (`lines`) quand
    on l'a, sinon d'une part de la phrase proportionnelle à sa longueur."""
    out = []
    for ph in TIMING:
        lines = SPOKEN[ph["phrase"]]
        total = sum(len(l) for l in lines)
        span = ph["end"] - ph["start"]
        starts = ph.get("lines") or [ph["start"] + span * sum(len(x) for x in lines[:i]) / total
                                     for i in range(len(lines))]
        ends = list(starts[1:]) + [ph["end"]]
        for j, (l, a, b) in enumerate(zip(lines, starts, ends)):
            out.append({"text": l, "start": round(a, 2), "end": round(b + (0.25 if j == len(lines) - 1 else 0), 2)})
    return out


def _line(phrase, i):
    return next(c["start"] for c in captions_by_phrase()[phrase][i:i + 1])


def captions_by_phrase():
    by, k = {}, 0
    caps = captions()
    for ph in TIMING:
        n = len(SPOKEN[ph["phrase"]])
        by[ph["phrase"]] = caps[k:k + n]
        k += n
    return by


def timeline():
    """Plans et entrées de leurs éléments, déduits des temps de la voix."""
    P = {ph["phrase"]: ph for ph in TIMING}
    L = _line
    duration = round(TIMING[-1]["end"] + 1.2, 2)
    starts = [0.0, P["02"]["start"] - 0.45, P["05"]["start"] - 0.45, P["06"]["start"] - 0.3,
              P["07"]["start"] - 0.3, P["08"]["start"] - 0.45, P["09"]["start"] - 0.45]
    names = ["Main.dc.html", "Services.dc.html", "Abonnements.dc.html", "Vitrine.dc.html",
             "Application.dc.html", "Garanties.dc.html", "RendezVous.dc.html"]
    ends = starts[1:] + [duration]
    scenes = list(zip(names, [round(s, 2) for s in starts], [round(e, 2) for e in ends]))
    # Moment absolu de chaque entrée, dans l'ordre des éléments du plan.
    abs_ = [
        [0.1, L("01", 0), L("01", 1), L("01", 2)],                        # logo, tableurs, autre époque, proposition
        [starts[1] + 0.2, P["02"]["start"], P["03"]["start"], P["04"]["start"]],  # sur-titre, une carte par phrase
        [starts[2] + 0.3, L("05", 0), L("05", 1)],                        # sur-titre, titre, « hors taxes »
        [starts[3] + 0.3, L("06", 1)],                                    # prix, puis ce qui est compris
        [starts[4] + 0.3, L("07", 1)],
        [L("08", 0), L("08", 1)],                                         # 0 €, puis code et données
        [starts[6] + 0.2, L("09", 0), L("09", 1), L("09", 2)],            # logo, question, heure offerte, bouton
    ]
    delays = [[round(max(a - s, 0.05), 2) for a in row] for row, s in zip(abs_, starts)]
    return scenes, delays, duration


SCENES, DELAYS, DURATION = timeline()


def scene_body(html):
    body = html.split("<x-dc>")[1].split("</x-dc>")[0]
    body = re.sub(r"<helmet>.*?</helmet>", "", body, flags=re.S)
    body = body.replace("{{accent}}", "#e46212")
    # Retire les sous-titres statiques du storyboard : la vidéo a les siens.
    body = re.sub(r'<p style="position: absolute; left: 0; right: 0; bottom: 36px.*?</p>', "", body, flags=re.S)
    return body.strip()


def player_html():
    scenes = []
    for name, start, end in SCENES:
        html = open(os.path.join(SB, "project", name)).read()
        scenes.append(f'<section class="scene" data-start="{start}" data-end="{end}">{scene_body(html)}</section>')
    return f"""<!doctype html><html lang="fr"><head><meta charset="utf-8">
<style>
@font-face{{font-family:'Bricolage Grotesque';font-weight:200 800;src:url('file://{FONT}') format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}}
@font-face{{font-family:'Bricolage Grotesque';font-weight:200 800;src:url('file://{FONT_EXT}') format('woff2')}}
html,body{{margin:0;background:#1c1917}}
#stage{{position:relative;width:1280px;height:720px;overflow:hidden;transform:scale(1.5);transform-origin:0 0}}
.scene{{position:absolute;inset:0;opacity:0}}
.scene > div{{font-family:'Bricolage Grotesque',system-ui,sans-serif}}
#cap{{position:absolute;left:0;right:0;bottom:28px;display:flex;justify-content:center;pointer-events:none}}
#cap span{{font-family:'Bricolage Grotesque',system-ui,sans-serif;font-size:26px;font-weight:600;line-height:1.3;color:#fff;background:rgba(28,25,23,.82);padding:8px 18px;border-radius:12px;max-width:1000px;text-align:center}}
</style></head><body><div id="stage">{''.join(scenes)}<div id="cap"><span></span></div></div>
<script>
const CAPS = {json.dumps(captions(), ensure_ascii=False)};
const ease = x => 1 - Math.pow(1 - Math.min(Math.max(x, 0), 1), 3);
const scenes = [...document.querySelectorAll('.scene')].map(el => {{
  const root = el.firstElementChild;
  // Ce qui entre : on descend dans les colonnes et les grilles, dans l'ordre du document.
  const items = [];
  const collect = (node) => [...node.children].forEach(c => {{
    const s = c.getAttribute('style') || '';
    if (/display: grid/.test(s)) items.push(...c.children);
    else if (/flex-direction: column/.test(s) && c.children.length > 1 && c.children.length < 6) collect(c);
    else items.push(c);
  }});
  collect(root);
  return {{el, root, items, start: +el.dataset.start, end: +el.dataset.end}};
}});
// Moment d'entrée de chaque élément, en secondes après le début du plan : calé sur la voix.
const DELAYS = {json.dumps(DELAYS)};
scenes.forEach((s, i) => s.delays = DELAYS[i] || []);
// Les prix montent au lieu d'apparaître d'un bloc.
const counters = [...document.querySelectorAll('span, div')].filter(n => n.children.length === 0 && /^\\d+\\u00a0€$/.test(n.textContent)).map(n => ({{n, v: parseInt(n.textContent)}}));
window.renderAt = (t) => {{
  for (const s of scenes) {{
    // Fondu enchaîné : le plan suivant (plus haut dans la pile) apparaît par-dessus celui-ci.
    const fadeIn = s.start === 0 ? 1 : ease((t - s.start) / 0.45);
    const on = t >= s.start - 0.01 && t < s.end + 0.5;
    s.el.style.opacity = on ? fadeIn : 0;
    const zoom = 1 + 0.025 * Math.min(Math.max((t - s.start) / (s.end - s.start), 0), 1);
    s.root.style.transform = `scale(${{zoom}})`;
    s.items.forEach((it, i) => {{
      const d = s.delays[i] ?? (0.25 + i * 0.22);
      const k = ease((t - s.start - d) / 0.6);
      it.style.opacity = k; it.style.transform = `translateY(${{(1 - k) * 28}}px)`;
    }});
  }}
  for (const c of counters) {{
    const sc = scenes.find(s => s.el.contains(c.n));
    const k = ease((t - sc.start - 0.9) / 1.2);
    c.n.textContent = Math.round(c.v * k) + '\\u00a0€';
  }}
  const cap = CAPS.find(c => t >= c.start && t < c.end);
  const span = document.querySelector('#cap span');
  span.textContent = cap ? cap.text : '';
  span.style.display = cap ? 'inline-block' : 'none';
}};
</script></body></html>"""


def main(out_name="agence-cardona.mp4", seconds=None):
    from playwright.sync_api import sync_playwright
    page_path = os.path.join(HERE, "player.html")
    open(page_path, "w").write(player_html())
    n = int((seconds or DURATION) * FPS)
    out = os.path.join(HERE, out_name)
    ff = subprocess.Popen([FF, "-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", str(FPS), "-i", "-",
                           "-i", AUDIO, "-map", "0:v", "-map", "1:a", "-c:v", "libx264", "-preset", "medium",
                           "-crf", "20", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k", "-shortest",
                           "-movflags", "+faststart", out], stdin=subprocess.PIPE)
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={"width": 1920, "height": 1080})
        pg.goto("file://" + page_path)
        pg.evaluate("document.fonts.ready")
        for i in range(n):
            pg.evaluate(f"renderAt({i / FPS})")
            ff.stdin.write(pg.screenshot(type="jpeg", quality=92))
        b.close()
    ff.stdin.close()
    ff.wait()
    print(out)


if __name__ == "__main__":
    main(*sys.argv[1:2], seconds=float(sys.argv[2]) if len(sys.argv) > 2 else None)
