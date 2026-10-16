import { createFileRoute } from '@tanstack/react-router'

import { LegalPage } from '../components/LegalPage'
import { confidentialite } from '../content/legal'
import { seo } from '../lib/seo'

export const Route = createFileRoute('/confidentialite')({
  head: () =>
    seo({
      title: confidentialite.title,
      description: confidentialite.description,
      path: confidentialite.path,
    }),
  component: () => <LegalPage page={confidentialite} />,
})
