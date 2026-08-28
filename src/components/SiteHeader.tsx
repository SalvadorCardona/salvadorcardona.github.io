import { Link } from '@tanstack/react-router'

const nav = [
  { to: '/', label: 'Accueil' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
] as const

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-6 px-6 py-4">
        <Link
          to="/"
          className="font-semibold tracking-tight text-slate-900 transition-colors hover:text-sky-600 dark:text-slate-100 dark:hover:text-sky-400"
        >
          Salvador Cardona
        </Link>

        <nav aria-label="Navigation principale">
          <ul className="flex items-center gap-1 text-sm">
            {nav.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  activeOptions={{ exact: item.to === '/' }}
                  className="rounded-md px-3 py-1.5 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                  activeProps={{
                    className:
                      'rounded-md px-3 py-1.5 bg-slate-100 text-slate-900 font-medium dark:bg-slate-800 dark:text-slate-100',
                  }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
