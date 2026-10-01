import type { PostCover } from '../content/posts/post'

/**
 * L'illustration d'un article, en AVIF avec repli WebP, sur `/blog` comme en
 * tête de l'article : les deux pages la posent dans la même colonne
 * (`max-w-3xl`, `px-6`), 720 px au plus.
 */
export function PostCoverImage({
  cover,
  priority,
  className,
}: {
  cover: PostCover
  /** La couverture de l'article est l'élément LCP : chargée tout de suite. */
  priority: boolean
  className: string
}) {
  const sizes = '(min-width: 768px) 720px, calc(100vw - 3rem)'
  return (
    <picture>
      <source type="image/avif" srcSet={cover.srcSet.avif} sizes={sizes} />
      <source type="image/webp" srcSet={cover.srcSet.webp} sizes={sizes} />
      <img
        src={cover.fallback}
        alt={cover.alt}
        width={cover.width}
        height={cover.height}
        loading={priority ? undefined : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding="async"
        className={className}
      />
    </picture>
  )
}
