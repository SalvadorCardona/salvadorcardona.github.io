/**
 * Développement web : une interface (liste et formulaire) dans une fenêtre de
 * navigateur, branchée sur deux appels d'API qui répondent en JSON.
 */
export function WebDevelopmentIllustration({
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
      {/* La fenêtre du navigateur */}
      <rect x="16" y="24" width="184" height="152" rx="10" className="fill-white stroke-stone-300" />
      <path d="M16 46h184" className="stroke-stone-200" />
      <circle cx="30" cy="35" r="2.5" className="fill-stone-300" />
      <circle cx="39" cy="35" r="2.5" className="fill-stone-300" />
      <circle cx="48" cy="35" r="2.5" className="fill-stone-300" />
      <rect x="62" y="30" width="124" height="10" rx="5" className="fill-stone-100" />

      {/* Une liste, la première ligne sélectionnée */}
      <rect x="28" y="56" width="160" height="22" rx="6" className="fill-brand-50 stroke-brand-300" />
      <rect x="34" y="61" width="12" height="12" rx="3" className="fill-brand-500" />
      <rect x="52" y="62" width="64" height="4" rx="2" className="fill-stone-700" />
      <rect x="52" y="69" width="40" height="3" rx="1.5" className="fill-stone-300" />
      <rect x="164" y="63" width="18" height="8" rx="4" className="fill-brand-200" />

      <rect x="34" y="85" width="12" height="12" rx="3" className="fill-stone-200" />
      <rect x="52" y="86" width="56" height="4" rx="2" className="fill-stone-400" />
      <rect x="52" y="93" width="34" height="3" rx="1.5" className="fill-stone-200" />
      <rect x="164" y="87" width="18" height="8" rx="4" className="fill-stone-100" />

      {/* Un formulaire */}
      <path d="M28 108h160" className="stroke-stone-200" />
      <rect x="28" y="116" width="24" height="3" rx="1.5" className="fill-stone-400" />
      <rect x="28" y="123" width="160" height="14" rx="4" className="fill-white stroke-stone-300" />
      <path d="M34 130h28" className="stroke-stone-300" />
      <rect x="28" y="143" width="76" height="14" rx="4" className="fill-white stroke-stone-300" />
      <rect x="112" y="143" width="76" height="14" rx="4" className="fill-white stroke-stone-300" />
      <rect x="132" y="162" width="56" height="8" rx="4" className="fill-brand-500" />

      {/* Les appels d'API */}
      <path d="M200 67c10 0 10-16 20-16" strokeDasharray="3 4" className="stroke-brand-400" />
      <path d="M200 150c10 0 10-14 20-14" strokeDasharray="3 4" className="stroke-brand-400" />
      <circle cx="200" cy="67" r="3" className="fill-brand-500" />
      <circle cx="200" cy="150" r="3" className="fill-brand-500" />

      <g className="font-mono" fontSize="8">
        <rect x="220" y="24" width="88" height="62" rx="8" className="fill-white stroke-stone-300" />
        <text x="228" y="39" fontWeight="600" className="fill-brand-600">
          GET /api/orders
        </text>
        <path d="M228 46h72" className="stroke-stone-200" />
        <text x="228" y="59" className="fill-stone-500">
          {'{ "id": 42,'}
        </text>
        <text x="234" y="70" className="fill-stone-500">
          {'"total": 89 }'}
        </text>

        <rect x="220" y="104" width="88" height="62" rx="8" className="fill-white stroke-stone-300" />
        <text x="228" y="119" fontWeight="600" className="fill-brand-600">
          POST /api/orders
        </text>
        <path d="M228 126h72" className="stroke-stone-200" />
        <text x="228" y="139" className="fill-stone-500">
          {'{ "status":'}
        </text>
        <text x="234" y="150" className="fill-stone-500">
          {'"created" }'}
        </text>
      </g>
    </svg>
  )
}
