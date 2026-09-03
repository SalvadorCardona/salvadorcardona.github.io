import { createFileRoute } from '@tanstack/react-router'

import { ServicePage, serviceHead } from '../../components/ServicePage'

/** Le contenu vit dans `content/services.ts`, le gabarit dans `ServicePage`. */
const SLUG = 'developpement-web'

export const Route = createFileRoute('/services/developpement-web')({
  head: () => serviceHead(SLUG),
  component: () => <ServicePage slug={SLUG} />,
})
