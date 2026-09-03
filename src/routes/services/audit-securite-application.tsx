import { createFileRoute } from '@tanstack/react-router'

import { ServicePage, serviceHead } from '../../components/ServicePage'

/** Le contenu vit dans `content/services.ts`, le gabarit dans `ServicePage`. */
const SLUG = 'audit-securite-application'

export const Route = createFileRoute('/services/audit-securite-application')({
  head: () => serviceHead(SLUG),
  component: () => <ServicePage slug={SLUG} />,
})
