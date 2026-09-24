import { Link } from '@tanstack/react-router'

import { Logo } from './Logo'

const nav = [
  { to: '/', label: 'Agence' },
  { to: '/services', label: 'Services' },
  { to: '/projets', label: 'Projets' },
  { to: '/blog', label: 'Blog' },
  { to: '/qui-suis-je', label: 'Qui suis-je' },
] as const

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-3">
        <Link to="/" aria-label="Agence Cardona, accueil" className="py-1">
          <Logo />
        </Link>

        {/* Sous le logo sur téléphone, défilant si besoin ; à côté ailleurs. */}
        <nav
          aria-label="Navigation principale"
          className="order-last -mx-6 w-[calc(100%+3rem)] overflow-x-auto px-6 md:order-none md:mx-0 md:w-auto md:px-0"
        >
          <ul className="flex items-center gap-1 text-sm">
            {nav.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  activeOptions={{ exact: item.to === '/' }}
                  className="block rounded-full px-3 py-1.5 whitespace-nowrap transition-colors"
                  activeProps={{
                    className: 'bg-brand-50 font-semibold text-brand-700',
                  }}
                  inactiveProps={{
                    className:
                      'text-stone-600 hover:bg-stone-100 hover:text-stone-900',
                  }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link
          to="/contact"
          className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
          activeProps={{ className: 'ring-2 ring-brand-200' }}
        >
          Contact
        </Link>
      </div>
    </header>
  )
}
