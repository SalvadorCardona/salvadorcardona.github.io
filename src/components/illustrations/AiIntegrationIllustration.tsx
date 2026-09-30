/**
 * Intégration IA : un agent branché sur une API, une base de données et un
 * document, dont le travail aboutit à une action (un ticket, un e-mail).
 */
export function AiIntegrationIllustration({
  className,
}: {
  className?: string
}) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 320 200"
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Les sources : API, base de données, document */}
      <g fontSize="9" fontWeight="500">
        <rect x="16" y="24" width="84" height="32" rx="8" className="fill-white stroke-stone-300" />
        <path d="m31 35-4 5 4 5M37 35l4 5-4 5" className="stroke-stone-500" />
        <text x="50" y="43" className="fill-stone-700">
          API
        </text>

        <rect x="16" y="84" width="84" height="32" rx="8" className="fill-white stroke-stone-300" />
        <ellipse cx="34" cy="94" rx="7" ry="2.5" className="stroke-stone-500" />
        <path
          d="M27 94v12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V94M27 100c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5"
          className="stroke-stone-500"
        />
        <text x="50" y="103" className="fill-stone-700">
          Données
        </text>

        <rect x="16" y="144" width="84" height="32" rx="8" className="fill-white stroke-stone-300" />
        <path d="M29 151h7l5 5v13H29v-18Z" className="stroke-stone-500" />
        <path d="M32 160h6M32 164h6" className="stroke-stone-400" />
        <text x="50" y="163" className="fill-stone-700">
          Document
        </text>
      </g>

      {/* Ce qui remonte vers l'agent */}
      <path d="M100 40c22 0 18 52 36 56" className="stroke-stone-300" />
      <path d="M100 100h36" className="stroke-stone-300" />
      <path d="M100 160c22 0 18-52 36-56" className="stroke-stone-300" />
      <circle cx="119.5" cy="66.5" r="2.5" className="fill-brand-400" />
      <circle cx="118" cy="100" r="2.5" className="fill-brand-400" />
      <circle cx="119.5" cy="133.5" r="2.5" className="fill-brand-400" />

      {/* L'agent */}
      <circle cx="160" cy="100" r="32" strokeDasharray="3 4" className="stroke-brand-300" />
      <circle cx="160" cy="100" r="24" className="fill-brand-500" />
      <g transform="translate(160 100) scale(1.5) translate(-12 -12)" strokeWidth="1" className="stroke-white">
        <path d="M10 4c.6 3.6 2.4 5.4 6 6-3.6.6-5.4 2.4-6 6-.6-3.6-2.4-5.4-6-6 3.6-.6 5.4-2.4 6-6Z" />
        <path d="M18 14c.3 1.6 1.1 2.4 2.7 2.7-1.6.3-2.4 1.1-2.7 2.7-.3-1.6-1.1-2.4-2.7-2.7 1.6-.3 2.4-1.1 2.7-2.7Z" />
      </g>
      <text x="160" y="150" fontSize="9" fontWeight="600" textAnchor="middle" className="fill-stone-700">
        Agent
      </text>

      {/* Les actions produites */}
      <path d="M192 100c14 0 12-36 26-36" strokeDasharray="3 4" className="stroke-brand-400" />
      <path d="M192 100c14 0 12 40 26 40" strokeDasharray="3 4" className="stroke-brand-400" />
      <path d="m214 60 4 4-4 4M214 136l4 4-4 4" className="stroke-brand-500" />

      <rect x="220" y="32" width="88" height="64" rx="8" className="fill-white stroke-stone-300" />
      <circle cx="234" cy="48" r="6" className="fill-brand-500" />
      <path d="m231 48 2 2 4-4" className="stroke-white" />
      <text x="245" y="51" fontSize="8" fontWeight="600" className="fill-stone-700">
        Ticket #128
      </text>
      <rect x="230" y="62" width="68" height="4" rx="2" className="fill-stone-300" />
      <rect x="230" y="70" width="48" height="3" rx="1.5" className="fill-stone-200" />
      <rect x="230" y="80" width="32" height="8" rx="4" className="fill-brand-100" />

      <rect x="220" y="116" width="88" height="48" rx="8" className="fill-white stroke-stone-300" />
      <rect x="230" y="127" width="18" height="13" rx="2" className="fill-brand-50 stroke-brand-500" />
      <path d="m230.5 129 8.5 6 8.5-6" className="stroke-brand-500" />
      <rect x="254" y="128" width="44" height="4" rx="2" className="fill-stone-400" />
      <rect x="254" y="136" width="30" height="3" rx="1.5" className="fill-stone-200" />
      <rect x="230" y="150" width="68" height="3" rx="1.5" className="fill-stone-200" />
    </svg>
  )
}
