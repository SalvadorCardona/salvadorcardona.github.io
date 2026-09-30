/**
 * Audit de sécurité et de qualité : un rapport court dont les constats sont
 * classés par urgence, à côté d'un bouclier.
 */
const findings = [
  { y: 76, label: 'Critique', dot: 'fill-brand-600', pill: 'fill-brand-100', text: 'fill-brand-700', width: 72 },
  { y: 102, label: 'Moyen', dot: 'fill-brand-300', pill: 'fill-brand-50', text: 'fill-brand-600', width: 60 },
  { y: 128, label: 'Moyen', dot: 'fill-brand-300', pill: 'fill-brand-50', text: 'fill-brand-600', width: 66 },
  { y: 154, label: 'Faible', dot: 'fill-stone-300', pill: 'fill-stone-100', text: 'fill-stone-500', width: 54 },
]

export function SecurityAuditIllustration({
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
      {/* Le rapport */}
      <rect x="32" y="16" width="184" height="168" rx="10" className="fill-white stroke-stone-300" />
      <rect x="48" y="32" width="84" height="6" rx="3" className="fill-stone-700" />
      <rect x="48" y="44" width="52" height="4" rx="2" className="fill-stone-300" />
      <path d="M48 60h152" className="stroke-stone-200" />

      {/* Les constats, du plus urgent au moins urgent */}
      {findings.map((item) => (
        <g key={item.y}>
          <circle cx="54" cy={item.y} r="5" className={item.dot} />
          <rect x="66" y={item.y - 6} width={item.width} height="4" rx="2" className="fill-stone-400" />
          <rect x="66" y={item.y + 2} width={item.width - 22} height="3" rx="1.5" className="fill-stone-200" />
          <rect x="156" y={item.y - 6} width="44" height="12" rx="6" className={item.pill} />
          <text
            x="178"
            y={item.y + 2.5}
            fontSize="7"
            fontWeight="600"
            textAnchor="middle"
            className={item.text}
          >
            {item.label}
          </text>
        </g>
      ))}

      {/* Le bouclier */}
      <path d="M216 100h14" strokeDasharray="3 4" className="stroke-brand-400" />
      <path
        d="M264 56 234 68v28c0 22 13 37 30 43 17-6 30-21 30-43V68l-30-12Z"
        className="fill-brand-50 stroke-brand-500"
      />
      <path
        d="M264 70 246 77v19c0 14 8 24 18 28 10-4 18-14 18-28V77l-18-7Z"
        className="fill-white stroke-brand-300"
      />
      <path d="m255 97 6 6 12-12" strokeWidth="2" className="stroke-brand-600" />
    </svg>
  )
}
