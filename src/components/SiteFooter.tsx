import { Link } from '@tanstack/react-router'

import { links, profile } from '../content/profile'
import { servicePath, services } from '../content/services'

const social = [
  { href: links.github, label: 'GitHub' },
  { href: links.linkedin, label: 'LinkedIn' },
  { href: links.x, label: 'X' },
  { href: links.instagram, label: 'Instagram' },
]

const linkClass =
  'transition-colors hover:text-sky-600 dark:hover:text-sky-400'

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-slate-200 dark:border-slate-800">
      <div className="mx-auto grid max-w-5xl gap-10 px-6 py-12 text-sm text-slate-500 sm:grid-cols-3 dark:text-slate-400">
        <div>
          <p className="font-semibold text-slate-900 dark:text-slate-100">
            {profile.name}
          </p>
          <p className="mt-2 leading-relaxed">
            {profile.role}. {profile.location}, et à distance.
          </p>
          <a href={`mailto:${links.email}`} className={`mt-3 block ${linkClass}`}>
            {links.email}
          </a>
        </div>

        <nav aria-label="Services">
          <p className="font-semibold text-slate-900 dark:text-slate-100">
            Services
          </p>
          <ul className="mt-2 space-y-1.5">
            {services.map((service) => (
              <li key={service.slug}>
                <Link to={servicePath(service.slug)} className={linkClass}>
                  {service.name}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/services" className={linkClass}>
                Tous les services
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Ailleurs">
          <p className="font-semibold text-slate-900 dark:text-slate-100">
            Ailleurs
          </p>
          <ul className="mt-2 space-y-1.5">
            {social.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer me"
                  className={linkClass}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <Link to="/blog" className={linkClass}>
                Blog
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="mx-auto max-w-5xl px-6 pb-8 text-xs text-slate-500 dark:text-slate-500">
        © {new Date().getFullYear()} {profile.name}
      </div>
    </footer>
  )
}
