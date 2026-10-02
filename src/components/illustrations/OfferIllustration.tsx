import type { CSSProperties } from 'react'

/**
 * Les dessins animés des deux abonnements, en tête de leur carte : la
 * Vitrine se construit sous les yeux (titre, textes, horaires, épingle de la
 * carte) et s'insère en tête des recherches ; l'Application reçoit une
 * nouvelle ligne, ses barres montent et l'enregistrement se valide.
 *
 * SVG inline en 320 × 150, animé en CSS (`styles.css`, `offer-*`) sur une
 * boucle de 6 s. `motion-reduce` fige chaque élément dans son état final.
 * Deux tons : `brand` sur la carte orange, `light` sur la carte blanche.
 */

type Tone = 'brand' | 'light'

const palettes = {
  brand: {
    frame: 'fill-white/10 stroke-white/35',
    surface: 'fill-white',
    bar: 'fill-white/25',
    line: 'fill-stone-200',
    lineStrong: 'fill-stone-300',
    accent: 'fill-brand-500',
    accentSoft: 'fill-brand-100',
    accentStroke: 'stroke-brand-500',
    dot: 'fill-white/60',
  },
  light: {
    frame: 'fill-stone-50 stroke-stone-200',
    surface: 'fill-white stroke-stone-200',
    bar: 'fill-stone-200',
    line: 'fill-stone-200',
    lineStrong: 'fill-stone-300',
    accent: 'fill-brand-500',
    accentSoft: 'fill-brand-100',
    accentStroke: 'stroke-brand-500',
    dot: 'fill-stone-300',
  },
} as const

/** Classes communes : une animation SVG se transforme autour de sa propre boîte. */
const box = '[transform-box:fill-box] motion-reduce:animate-none'
const delay = (seconds: number): CSSProperties => ({
  animationDelay: `${seconds}s`,
})

function Frame({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  const p = palettes[tone]
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 320 150"
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-full w-full"
    >
      {/* La fenêtre du navigateur */}
      <rect x="20" y="14" width="280" height="150" rx="12" className={p.frame} />
      <circle cx="36" cy="28" r="3" className={p.dot} />
      <circle cx="46" cy="28" r="3" className={p.dot} />
      <circle cx="56" cy="28" r="3" className={p.dot} />
      <rect x="72" y="24" width="120" height="8" rx="4" className={p.bar} />
      {children}
    </svg>
  )
}

export function VitrineIllustration({ tone }: { tone: Tone }) {
  const p = palettes[tone]
  return (
    <Frame tone={tone}>
      {/* La page qui se construit */}
      <rect x="32" y="42" width="168" height="120" rx="8" className={p.surface} />
      <rect x="44" y="54" width="36" height="6" rx="3" className={p.accent} />
      <rect x="152" y="54" width="36" height="6" rx="3" className={p.line} />

      <rect
        x="44"
        y="72"
        width="120"
        height="10"
        rx="3"
        className={`${p.lineStrong} ${box} origin-left animate-offer-type`}
      />
      <rect
        x="44"
        y="90"
        width="140"
        height="5"
        rx="2.5"
        className={`${p.line} ${box} origin-left animate-offer-type`}
        style={delay(0.35)}
      />
      <rect
        x="44"
        y="100"
        width="104"
        height="5"
        rx="2.5"
        className={`${p.line} ${box} origin-left animate-offer-type`}
        style={delay(0.6)}
      />
      <rect
        x="44"
        y="116"
        width="48"
        height="14"
        rx="7"
        className={`${p.accent} ${box} origin-center animate-offer-pop`}
        style={delay(1)}
      />

      {/* La carte et son épingle */}
      <rect x="112" y="114" width="76" height="40" rx="6" className={p.accentSoft} />
      <path d="M118 140c14-6 30 6 44-2s18-4 22-6" className={`${p.accentStroke} opacity-40`} />
      <g className={`${box} origin-bottom animate-offer-bob`}>
        <path
          d="M150 116a8 8 0 0 0-8 8c0 6 8 13 8 13s8-7 8-13a8 8 0 0 0-8-8Z"
          className={p.accent}
        />
        <circle cx="150" cy="124" r="3" className="fill-white" />
      </g>

      {/* Les résultats de recherche : le site s'insère en tête, les autres descendent */}
      <g className={`${box} animate-offer-row`} style={delay(1.4)}>
        <rect x="212" y="58" width="80" height="34" rx="8" className={p.surface} />
        <rect x="222" y="67" width="38" height="5" rx="2.5" className={p.accent} />
        <rect x="222" y="77" width="56" height="4" rx="2" className={p.line} />
        <path
          d="m280 62 1.6 3.3 3.6.5-2.6 2.5.6 3.6-3.2-1.7-3.2 1.7.6-3.6-2.6-2.5 3.6-.5Z"
          className={`${p.accent} ${box} origin-center animate-offer-pop`}
          style={delay(2.2)}
        />
      </g>
      <g className={`${box} animate-offer-make-room`} style={delay(1.4)}>
        <rect x="212" y="102" width="80" height="22" rx="8" className={`${p.surface} opacity-60`} />
        <rect x="222" y="110" width="44" height="4" rx="2" className={p.line} />
        <rect x="212" y="132" width="80" height="22" rx="8" className={`${p.surface} opacity-40`} />
        <rect x="222" y="140" width="32" height="4" rx="2" className={p.line} />
      </g>
    </Frame>
  )
}

export function ApplicationIllustration({ tone }: { tone: Tone }) {
  const p = palettes[tone]
  return (
    <Frame tone={tone}>
      {/* Le menu de l'application */}
      <rect x="32" y="42" width="52" height="120" rx="8" className={p.surface} />
      <rect x="42" y="54" width="32" height="6" rx="3" className={p.accent} />
      <rect x="42" y="68" width="26" height="4" rx="2" className={p.line} />
      <rect x="42" y="78" width="30" height="4" rx="2" className={p.line} />
      <rect x="42" y="88" width="22" height="4" rx="2" className={p.line} />

      {/* Le tableau : une nouvelle ligne arrive en tête */}
      <rect x="92" y="42" width="128" height="120" rx="8" className={p.surface} />
      <rect x="102" y="52" width="40" height="5" rx="2.5" className={p.lineStrong} />
      <g className={`${box} animate-offer-row`}>
        <rect x="100" y="64" width="112" height="16" rx="4" className={p.accentSoft} />
        <circle cx="109" cy="72" r="3" className={p.accent} />
        <rect x="117" y="70" width="44" height="4" rx="2" className={p.accent} />
        <rect x="186" y="69" width="20" height="6" rx="3" className={p.accent} />
      </g>
      {[86, 102, 118, 134].map((y, index) => (
        <g key={y} className={`${box} animate-offer-shift`}>
          <circle cx="109" cy={y + 8} r="3" className={p.line} />
          <rect x="117" y={y + 6} width={[52, 38, 46, 30][index]} height="4" rx="2" className={p.line} />
          <rect x="186" y={y + 5} width="20" height="6" rx="3" className={p.line} />
        </g>
      ))}

      {/* Les chiffres qui montent */}
      <rect x="228" y="42" width="64" height="70" rx="8" className={p.surface} />
      {[
        { x: 238, h: 22 },
        { x: 252, h: 34 },
        { x: 266, h: 28 },
        { x: 280, h: 44 },
      ].map((bar, index) => (
        <rect
          key={bar.x}
          x={bar.x - 2}
          y={102 - bar.h}
          width="8"
          height={bar.h}
          rx="2"
          className={`${index === 3 ? p.accent : p.lineStrong} ${box} origin-bottom animate-offer-grow`}
          style={delay(0.2 * index)}
        />
      ))}

      {/* L'enregistrement validé */}
      <rect x="228" y="120" width="64" height="42" rx="8" className={p.surface} />
      <g
        className={`${box} origin-center animate-offer-pop`}
        style={delay(1.6)}
      >
        <circle cx="246" cy="141" r="9" className={p.accent} />
        <path d="m242 141 3 3 5-6" className="stroke-white" strokeWidth="2" />
      </g>
      <rect x="260" y="136" width="24" height="4" rx="2" className={p.lineStrong} />
      <rect x="260" y="144" width="16" height="3" rx="1.5" className={p.line} />
    </Frame>
  )
}
