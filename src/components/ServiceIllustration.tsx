import type { ServiceIllustration as ServiceIllustrationName } from '../content/services'
import { AiIntegrationIllustration } from './illustrations/AiIntegrationIllustration'
import { AiTrainingIllustration } from './illustrations/AiTrainingIllustration'
import { SecurityAuditIllustration } from './illustrations/SecurityAuditIllustration'
import { WebDevelopmentIllustration } from './illustrations/WebDevelopmentIllustration'

/**
 * Le dessin d'une prestation, dans un cadre commun. SVG inline tracé en
 * 320 × 200, même ratio pour le cadre : la place est réservée avant le rendu,
 * rien ne bouge au chargement.
 */
const illustrations: Record<
  ServiceIllustrationName,
  (props: { className?: string }) => React.ReactNode
> = {
  'web-development': WebDevelopmentIllustration,
  'security-audit': SecurityAuditIllustration,
  'ai-integration': AiIntegrationIllustration,
  'ai-training': AiTrainingIllustration,
}

export function ServiceIllustration({
  name,
  className = '',
}: {
  name: ServiceIllustrationName
  className?: string
}) {
  const Illustration = illustrations[name]

  return (
    <div
      className={`aspect-[8/5] overflow-hidden rounded-xl bg-stone-50 ring-1 ring-stone-200 ${className}`}
    >
      <Illustration className="h-full w-full" />
    </div>
  )
}
