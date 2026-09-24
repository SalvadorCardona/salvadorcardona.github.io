import { agency } from '../content/agency'

/**
 * Le logo de l'agence : un « C » ouvert suivi d'un point, comme une bulle qui
 * prend la parole, sur un carré orange. Même dessin que `public/favicon.svg`
 * et `public/logo.svg` (où le mot est vectorisé) : les modifier ensemble.
 */
export function LogoMark({ className = 'h-9 w-9' }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" className={className}>
      <rect width="48" height="48" rx="13" className="fill-brand-500" />
      <path
        d="M30.78 16.22A11 11 0 1 0 30.78 31.78"
        fill="none"
        stroke="#fff"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <circle cx="36.5" cy="24" r="3.75" fill="#fff" />
    </svg>
  )
}

/** Le symbole et le nom, tels qu'en tête et en pied de page. */
export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className="font-display text-2xl leading-none font-extrabold tracking-tight text-stone-900 lowercase">
        {agency.name}
      </span>
    </span>
  )
}
