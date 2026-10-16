import type { LegalPage as LegalPageContent } from '../content/legal'

/** Le gabarit des pages légales : un titre, puis une section par rubrique. */
export function LegalPage({ page }: { page: LegalPageContent }) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 lg:py-20">
      <h1 className="text-4xl font-bold tracking-tight text-balance text-stone-900">
        {page.title}
      </h1>
      <p className="mt-4 text-sm text-stone-500">
        Mise à jour le {page.updated}.
      </p>
      {page.sections.map((section) => (
        <section key={section.title} className="mt-10">
          <h2 className="text-xl font-semibold tracking-tight text-stone-900">
            {section.title}
          </h2>
          <div className="mt-3 space-y-3 leading-relaxed text-pretty text-stone-600">
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
