import { createFileRoute } from '@tanstack/react-router'

import { ServicePage, serviceHead } from '../../components/ServicePage'

/** Le contenu vit dans `content/services.ts`, le gabarit dans `ServicePage`. */
const SLUG = 'integration-ia'

export const Route = createFileRoute('/services/integration-ia')({
  head: () => serviceHead(SLUG),
  component: () => <ServicePage slug={SLUG} />,
})
