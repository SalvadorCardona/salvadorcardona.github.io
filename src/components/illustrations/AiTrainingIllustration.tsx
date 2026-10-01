/**
 * Formation IA : un programme en modules, dont celui du moment passe en
 * exercice dans un terminal, devant trois participants ; dessous, la durée,
 * d'une demi-journée à trois jours.
 */
export function AiTrainingIllustration({
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
      {/* Le programme, module par module */}
      <rect x="16" y="20" width="180" height="128" rx="10" className="fill-white stroke-stone-300" />
      <text x="28" y="38" fontSize="9" fontWeight="600" className="fill-stone-700">
        Programme
      </text>
      <path d="M16 46h180" className="stroke-stone-200" />

      <g fontSize="9" fontWeight="500">
        <circle cx="34" cy="62" r="6" className="fill-brand-500" />
        <path d="m31 62 2 2 4-4" className="stroke-white" />
        <text x="48" y="65" className="fill-stone-500">
          Claude Code en équipe
        </text>

        <rect x="24" y="74" width="164" height="22" rx="6" className="fill-brand-50 stroke-brand-300" />
        <circle cx="34" cy="85" r="6" className="stroke-brand-500" />
        <circle cx="34" cy="85" r="2" className="fill-brand-500" />
        <text x="48" y="88" fontWeight="600" className="fill-stone-700">
          Agents et MCP
        </text>

        <circle cx="34" cy="108" r="6" className="stroke-stone-300" />
        <text x="48" y="111" className="fill-stone-500">
          RAG sur sa documentation
        </text>

        <circle cx="34" cy="130" r="6" className="stroke-stone-300" />
        <text x="48" y="133" className="fill-stone-500">
          Automatisations n8n
        </text>
      </g>

      {/* Le module en cours passe en exercice */}
      <path d="M188 85c12 0 10-33 24-33" strokeDasharray="3 4" className="stroke-brand-400" />
      <path d="m208 48 4 4-4 4" className="stroke-brand-500" />

      {/* Le terminal de l'exercice */}
      <rect x="212" y="20" width="92" height="64" rx="8" className="fill-stone-800 stroke-stone-800" />
      <circle cx="222" cy="30" r="2" className="fill-stone-500" />
      <circle cx="229" cy="30" r="2" className="fill-stone-500" />
      <circle cx="236" cy="30" r="2" className="fill-stone-500" />
      <text x="220" y="49" fontSize="8" fontFamily="monospace" className="fill-brand-300">
        $ claude
      </text>
      <rect x="220" y="56" width="62" height="3" rx="1.5" className="fill-stone-500" />
      <rect x="220" y="63" width="46" height="3" rx="1.5" className="fill-stone-600" />
      <rect x="220" y="72" width="24" height="5" rx="2.5" className="fill-brand-500" />

      {/* Les participants */}
      <g>
        <circle cx="228" cy="114" r="7" className="fill-stone-200" />
        <path d="M216 140c0-7 5.4-12 12-12s12 5 12 12" className="fill-stone-200" />
        <circle cx="258" cy="114" r="7" className="fill-brand-100" />
        <path d="M246 140c0-7 5.4-12 12-12s12 5 12 12" className="fill-brand-100" />
        <circle cx="288" cy="114" r="7" className="fill-stone-200" />
        <path d="M276 140c0-7 5.4-12 12-12s12 5 12 12" className="fill-stone-200" />
        <path d="M212 140h92" className="stroke-stone-300" />
        <circle cx="266" cy="108" r="4.5" className="fill-brand-500" />
        <path d="m264 108 1.5 1.5 2.5-3" strokeWidth="1" className="stroke-white" />
      </g>

      {/* La durée : d'une demi-journée à trois jours */}
      <g fontSize="8" fontWeight="500" textAnchor="middle">
        <path d="M28 172h264" className="stroke-stone-300" />
        <path d="M28 172h53" strokeWidth="3" className="stroke-brand-400" />
        <circle cx="28" cy="172" r="4" className="fill-brand-500" />
        <circle cx="81" cy="172" r="4" className="fill-white stroke-brand-500" />
        <circle cx="292" cy="172" r="4" className="fill-white stroke-stone-400" />
        <text x="28" y="188" className="fill-stone-600">
          ½ jour
        </text>
        <text x="81" y="188" className="fill-stone-600">
          1 jour
        </text>
        <text x="292" y="188" className="fill-stone-600">
          3 jours
        </text>
      </g>
    </svg>
  )
}
