import { links, profile } from '../content/profile'

const social = [
  { href: links.github, label: 'GitHub' },
  { href: links.linkedin, label: 'LinkedIn' },
  { href: links.x, label: 'X' },
  { href: links.instagram, label: 'Instagram' },
]

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-slate-200 dark:border-slate-800">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between dark:text-slate-400">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <ul className="flex flex-wrap items-center gap-4">
          {social.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                target="_blank"
                rel="noreferrer me"
                className="transition-colors hover:text-sky-600 dark:hover:text-sky-400"
              >
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={`mailto:${links.email}`}
              className="transition-colors hover:text-sky-600 dark:hover:text-sky-400"
            >
              E-mail
            </a>
          </li>
        </ul>
      </div>
    </footer>
  )
}
