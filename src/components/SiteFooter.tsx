import { Link } from '@tanstack/react-router'

import { agency } from '../content/agency'
import { Logo } from './Logo'
import { links, profile } from '../content/profile'
import { servicePath, services } from '../content/services'

const social = [
  { href: links.github, label: 'GitHub' },
  { href: links.linkedin, label: 'LinkedIn' },
  { href: links.x, label: 'X' },
  { href: links.instagram, label: 'Instagram' },
]

const linkClass = 'transition-colors hover:text-brand-600'

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-stone-200 bg-stone-50">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 text-sm text-stone-500 sm:grid-cols-3">
        <div>
          <Link to="/" aria-label="Agence Cardona, accueil">
            <Logo />
          </Link>
          <p className="mt-4 leading-relaxed">
            {agency.tagline}. Fondée par{' '}
            <Link to="/qui-suis-je" className={`underline ${linkClass}`}>
              {profile.name}
            </Link>
            .
          </p>
          <a href={`mailto:${links.email}`} className={`mt-3 block ${linkClass}`}>
            {links.email}
          </a>
        </div>

        <nav aria-label="Services">
          <p className="font-semibold text-stone-900">
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
            <li>
              <Link to="/" hash="forfaits" className={linkClass}>
                Forfaits mensuels de l’agence
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Ailleurs">
          <p className="font-semibold text-stone-900">
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
      <div className="mx-auto max-w-6xl px-6 pb-8 text-xs text-stone-500">
        © {new Date().getFullYear()} Agence {agency.name} · {profile.name}
      </div>
    </footer>
  )
}
