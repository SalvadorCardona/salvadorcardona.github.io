import { createFileRoute } from '@tanstack/react-router'

import { LegalPage } from '../components/LegalPage'
import { mentionsLegales } from '../content/legal'
import { seo } from '../lib/seo'

export const Route = createFileRoute('/mentions-legales')({
  head: () =>
    seo({
      title: mentionsLegales.title,
      description: mentionsLegales.description,
      path: mentionsLegales.path,
    }),
  component: () => <LegalPage page={mentionsLegales} />,
})
