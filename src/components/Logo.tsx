/**
 * Le logo de l'agence vient de `SalvadorCardona/brand-assets` (variante 4D
 * « contour »). Les fichiers sont recopiés tels quels dans `public/` : ne pas
 * les redessiner ici, les recopier de là-bas.
 */

/** Le symbole seul, version sombre : il ne sert que sur les fonds foncés. */
export function LogoMark({ className = 'h-9 w-9' }: { className?: string }) {
  return <img src="/logo-symbol-dark.svg" alt="" aria-hidden="true" className={className} />
}

/** Le logo complet (symbole + « hermez »), tel qu'en tête et en pied de page. */
export function Logo() {
  return <img src="/logo.svg" alt="Hermez" width={158} height={36} className="h-9 w-auto" />
}
