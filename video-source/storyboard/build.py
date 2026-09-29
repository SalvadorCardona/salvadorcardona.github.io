"""Génère les artboards du storyboard de la vidéo de l'agence Cardona."""
import json, os

ROOT = os.path.dirname(os.path.abspath(__file__))
W, H = 1280, 720
ORANGE, INK, SAND, NIGHT, MUTED = "#e46212", "#1d1d1b", "#faf7f2", "#1c1917", "#57534e"

MARK = (
    '<svg width="{s}" height="{s}" viewBox="0 0 48 48" aria-hidden="true">'
    '<rect width="48" height="48" rx="13" fill="#e46212"></rect>'
    '<path d="M30.78 16.22A11 11 0 1 0 30.78 31.78" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"></path>'
    '<circle cx="36.5" cy="24" r="3.75" fill="#fff"></circle></svg>'
)


def logo(size=40, color=INK):
    return (
        f'<div style="display: flex; align-items: center; gap: {size // 3}px">{MARK.format(s=size)}'
        f'<span style="font-family: \'Bricolage Grotesque\', sans-serif; font-weight: 700; font-size: {int(size * 0.72)}px; color: {color}; letter-spacing: -0.02em">Cardona</span></div>'
    )


def icon(path, color=ORANGE, size=36):
    return (
        f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" '
        f'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{path}</svg>'
    )


ICONS = {
    "code": '<path d="M8 8l-4 4 4 4"></path><path d="M16 8l4 4-4 4"></path><path d="M13.5 5l-3 14"></path>',
    "shield": '<path d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6z"></path><path d="M9 12l2 2 4-4"></path>',
    "spark": '<path d="M12 3v4M12 17v4M3 12h4M17 12h4"></path><path d="M12 8l1.6 2.4L16 12l-2.4 1.6L12 16l-1.6-2.4L8 12l2.4-1.6z"></path>',
    "check": '<path d="M5 12.5l4.5 4.5L19 7.5"></path>',
    "calendar": '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"></rect><path d="M3.5 10h17M8 3v4M16 3v4"></path>',
}


def page(title, bg, body, accent=ORANGE):
    props = json.dumps({"accent": {"editor": "color", "default": accent,
                                   "options": ["#e46212", "#c2410c", "#1d1d1b"]},
                        "$preview": {"width": W, "height": H}})
    return f"""<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>{title}</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&amp;display=swap">
<style>
body{{margin:0;font-family:'Bricolage Grotesque',system-ui,sans-serif;background:{bg};color:{INK}}}
a{{color:{ORANGE}}}a:hover{{color:#c2410c}}
</style>
</helmet>
<div style="width: {W}px; height: {H}px; box-sizing: border-box; position: relative; overflow: hidden; background: {bg}; font-family: 'Bricolage Grotesque', system-ui, sans-serif">
{body}
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{props}'>
class Component extends DCLogic {{
  renderVals() {{
    return {{ accent: this.props.accent ?? '{accent}' }};
  }}
}}
</script>
</body>
</html>
"""


def subtitle(text, dark=False):
    color = "#e7e5e4" if dark else MUTED
    return (f'<p style="position: absolute; left: 0; right: 0; bottom: 36px; margin: 0; text-align: center; '
            f'font-size: 22px; line-height: 1.4; color: {color}; font-weight: 400">{text}</p>')


boards = {}

# 1 — Accroche
boards["Main.dc.html"] = ("1 · Accroche · 0:00–0:10", page("Accroche", NIGHT, f"""
<div style="position: absolute; left: 96px; top: 88px">{logo(44, "#fafaf9")}</div>
<div style="position: absolute; left: 96px; top: 200px; display: flex; flex-direction: column; gap: 18px">
<div style="display: inline-flex; align-self: flex-start; padding: 14px 26px; border: 2px dashed #57534e; border-radius: 14px; font-size: 44px; font-weight: 600; color: #a8a29e; text-decoration: line-through; text-decoration-color: {{{{accent}}}}">Vos tableurs ?</div>
<div style="display: inline-flex; align-self: flex-start; padding: 14px 26px; border: 2px dashed #57534e; border-radius: 14px; font-size: 44px; font-weight: 600; color: #a8a29e; text-decoration: line-through; text-decoration-color: {{{{accent}}}}">Un site d'une autre époque ?</div>
<h1 style="margin: 26px 0 0; font-size: 76px; line-height: 1.02; font-weight: 800; letter-spacing: -0.03em; color: #fafaf9">Une proposition<br><span style="color: {{{{accent}}}}">toute simple.</span></h1>
</div>
{subtitle("L'agence Cardona a une proposition, toute simple.", dark=True)}
"""))

# 2 — Services
services = [("code", "Applications web", "sur mesure"),
            ("shield", "Audit de sécurité", "de l'existant"),
            ("spark", "Intelligence artificielle", "dans vos outils")]
cards = "".join(f"""<div style="display: flex; flex-direction: column; gap: 22px; padding: 40px 36px; background: #ffffff; border: 1px solid #e7e5e4; border-radius: 24px">
<div style="width: 68px; height: 68px; border-radius: 18px; background: #fdf1e8; display: flex; align-items: center; justify-content: center">{icon(ICONS[i])}</div>
<div style="display: flex; flex-direction: column; gap: 6px"><div style="font-size: 32px; font-weight: 700; letter-spacing: -0.02em; line-height: 1.1">{t}</div><div style="font-size: 24px; color: {MUTED}">{s}</div></div>
</div>""" for i, t, s in services)
boards["Services.dc.html"] = ("2 · Services · 0:10–0:22", page("Services", SAND, f"""
<div style="position: absolute; left: 96px; right: 96px; top: 0; bottom: 90px; display: flex; flex-direction: column; justify-content: center; gap: 44px">
<div style="font-size: 20px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: {{{{accent}}}}">Ce que fait l'agence</div>
<div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 28px">{cards}</div>
</div>
{subtitle("On développe · On audite · On branche l'IA là où elle vous fait gagner du temps.")}
"""))

# 3 — Deux abonnements
boards["Abonnements.dc.html"] = ("3 · Deux abonnements · 0:22–0:29", page("Deux abonnements", SAND, f"""
<div style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 30px; padding-bottom: 60px">
<div style="font-size: 20px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: {{{{accent}}}}">Votre présence en ligne</div>
<h2 style="margin: 0; font-size: 96px; line-height: 1; font-weight: 800; letter-spacing: -0.035em; text-align: center">Deux abonnements.<br>Deux prix affichés.</h2>
<div style="padding: 10px 20px; border-radius: 999px; background: {INK}; color: #fafaf9; font-size: 22px; font-weight: 500">Prix hors taxes, par mois</div>
</div>
{subtitle("Et pour votre présence en ligne, deux abonnements. Deux prix, affichés, hors taxes.")}
"""))


def offer(name, price, promise, items, badge):
    lis = "".join(f'<div style="display: flex; align-items: center; gap: 14px; font-size: 26px">{icon(ICONS["check"], size=28)}<span>{it}</span></div>' for it in items)
    return f"""
<div style="position: absolute; left: 96px; right: 96px; top: 80px; bottom: 120px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 56px; align-items: center">
<div style="display: flex; flex-direction: column; gap: 20px">
<div style="align-self: flex-start; padding: 8px 16px; border-radius: 999px; background: #fdf1e8; color: #b4480b; font-size: 20px; font-weight: 600">{badge}</div>
<div style="font-size: 64px; font-weight: 800; letter-spacing: -0.03em; line-height: 1">{name}</div>
<div style="display: flex; align-items: baseline; gap: 12px"><span style="font-size: 132px; font-weight: 800; letter-spacing: -0.045em; line-height: 0.9; color: {{{{accent}}}}">{price}&#160;€</span><span style="font-size: 26px; color: {MUTED}">HT / mois</span></div>
<div style="font-size: 26px; color: {MUTED}; line-height: 1.35">{promise}</div>
</div>
<div style="display: flex; flex-direction: column; gap: 22px; padding: 44px 40px; background: #ffffff; border: 1px solid #e7e5e4; border-radius: 28px">{lis}</div>
</div>"""


boards["Vitrine.dc.html"] = ("4 · Vitrine 30 € · 0:29–0:39", page("Offre Vitrine", SAND, offer(
    "Vitrine", "30", "Votre site, qui vous représente et que vos clients trouvent.",
    ["Écrit pour vous", "Hébergé", "Tenu à jour", "En ligne en deux semaines"], "Site vitrine")
    + subtitle("La Vitrine : trente euros par mois. Écrit, hébergé, tenu à jour.")))

boards["Application.dc.html"] = ("5 · Application 100 € · 0:39–0:48", page("Offre Application", SAND, offer(
    "Application", "100", "Un outil taillé pour votre métier, qui évolue avec vous.",
    ["Tout ce que comprend la Vitrine", "Vos écrans, votre vocabulaire", "Une journée d'évolutions par mois", "Sauvegardes et supervision"], "Application métier")
    + subtitle("L'Application : cent euros par mois. Un outil qui évolue avec vous, chaque mois.")))

# 6 — Garanties
boards["Garanties.dc.html"] = ("6 · Garanties · 0:48–0:55", page("Garanties", SAND, f"""
<div style="position: absolute; left: 96px; right: 96px; top: 0; bottom: 90px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); align-content: center; gap: 32px">
<div style="display: flex; flex-direction: column; gap: 14px; padding: 52px 48px; background: {INK}; border-radius: 28px">
<div style="font-size: 150px; font-weight: 800; letter-spacing: -0.05em; line-height: 0.9; color: {{{{accent}}}}">0&#160;€</div>
<div style="font-size: 34px; font-weight: 600; color: #fafaf9">pour démarrer</div>
</div>
<div style="display: flex; flex-direction: column; justify-content: flex-end; gap: 18px; padding: 52px 48px; background: #ffffff; border: 1px solid #e7e5e4; border-radius: 28px">
<div style="display: flex; gap: 12px">{icon(ICONS["code"], INK, 44)}{icon(ICONS["shield"], INK, 44)}</div>
<div style="font-size: 44px; font-weight: 700; letter-spacing: -0.02em; line-height: 1.1">Votre code, vos données&#160;: <span style="color: {{{{accent}}}}">à vous.</span></div>
</div>
</div>
{subtitle("Zéro euro pour démarrer. Et votre code, vos données, restent à vous.")}
"""))

# 7 — Appel à l'action
boards["RendezVous.dc.html"] = ("7 · Prendre rendez-vous · 0:55–1:04", page("Prendre rendez-vous", NIGHT, f"""
<div style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 34px; padding-bottom: 50px">
{logo(56, "#fafaf9")}
<h2 style="margin: 0; font-size: 88px; line-height: 1; font-weight: 800; letter-spacing: -0.035em; color: #fafaf9; text-align: center">Alors, on en parle&#160;?</h2>
<div style="font-size: 30px; color: #d6d3d1">Une heure d'échange, offerte, sans engagement.</div>
<a href="https://cardona.digital/contact" style="display: flex; align-items: center; gap: 14px; padding: 22px 38px; border-radius: 999px; background: {{{{accent}}}}; color: #ffffff; font-size: 34px; font-weight: 700; text-decoration: none">{icon(ICONS["calendar"], "#ffffff", 34)}<span>cardona.digital</span></a>
</div>
{subtitle("Prenez rendez-vous sur cardona point digital.", dark=True)}
"""))

# Index du canvas : deux rangées (4 puis 3), 80 px entre cadres, 120 entre rangées.
order = list(boards)
layout = {}
for n, name in enumerate(order):
    row, col = divmod(n, 4)
    layout[name] = {"x": col * (W + 80), "y": row * (H + 120), "w": W, "h": H, "title": boards[name][0]}
canvas = {
    "v": 3, "createdOnFiles": {"v": 1, "at": "2026-09-29T20:46:49Z"},
    "title": "Vidéo agence Cardona — storyboard", "launch": {"view": "canvas"}, "pages": [],
    "boards": layout, "order": order,
    "notes": {"titre": {"x": 0, "y": -300, "text": "Vidéo agence Cardona · 7 plans · 1 min 04", "kind": "title1", "maxW": 4*W + 3*80}},
    "designSystems": [],
}
os.makedirs(os.path.join(ROOT, "project"), exist_ok=True)
with open(os.path.join(ROOT, "project", "canvas.json"), "w") as f:
    json.dump(canvas, f, ensure_ascii=False, indent=1)
for name, (_, html) in boards.items():
    with open(os.path.join(ROOT, "project", name), "w") as f:
        f.write(html)
print("\n".join(order))
