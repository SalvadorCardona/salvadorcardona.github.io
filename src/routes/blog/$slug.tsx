import { Link, createFileRoute, notFound } from '@tanstack/react-router'

import { PostCoverImage } from '../../components/PostCoverImage'
import { agency } from '../../content/agency'
import { formatDate, getCover, getPost, sortedPosts } from '../../content/posts'
import { links } from '../../content/profile'
import {
  AGENCY_ID,
  AUTHOR_NAME,
  PERSON_ID,
  SITE_URL,
  seo,
} from '../../lib/seo'

/**
 * Un article est rendu à la requête depuis `content/posts` ; un slug inconnu
 * tombe sur `NotFound` (`__root.tsx`), avec le statut 404. Le sitemap liste
 * chaque article.
 */
export const Route = createFileRoute('/blog/$slug')({
  loader: ({ params }) => {
    const post = getPost(params.slug)
    if (!post) throw notFound()
    return {
      slug: post.slug,
      title: post.title,
      date: post.date,
      excerpt: post.excerpt,
      tags: post.tags,
      readingTime: post.readingTime,
      cover: getCover(post.slug),
    }
  },
  head: ({ loaderData }) =>
    loaderData
      ? seo({
          title: loaderData.title,
          description: loaderData.excerpt,
          path: `/blog/${loaderData.slug}`,
          type: 'article',
          publishedTime: loaderData.date,
          image: loaderData.cover,
          signature: AUTHOR_NAME,
          jsonLd: [
            {
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              headline: loaderData.title,
              description: loaderData.excerpt,
              image: `${SITE_URL}${loaderData.cover?.src ?? '/og/cardona.png'}`,
              datePublished: loaderData.date,
              inLanguage: 'fr-FR',
              keywords: loaderData.tags,
              mainEntityOfPage: `${SITE_URL}/blog/${loaderData.slug}`,
              // Nom et adresse repris à côté de l'`@id` : l'auteur et l'agence
              // ne sont décrits en entier que sur l'accueil.
              author: {
                '@type': 'Person',
                '@id': PERSON_ID,
                name: AUTHOR_NAME,
                url: SITE_URL,
              },
              publisher: {
                '@type': 'ProfessionalService',
                '@id': AGENCY_ID,
                name: `Agence ${agency.name}`,
                url: SITE_URL,
                logo: `${SITE_URL}/logo.png`,
              },
            },
          ],
        })
      : {},
  component: PostPage,
})

function PostPage() {
  const { slug } = Route.useParams()
  const post = getPost(slug)

  if (!post) return null

  const cover = getCover(slug)

  const index = sortedPosts.findIndex((item) => item.slug === slug)
  const newer = index > 0 ? sortedPosts[index - 1] : undefined
  const older =
    index >= 0 && index < sortedPosts.length - 1
      ? sortedPosts[index + 1]
      : undefined

  const postUrl = encodeURIComponent(`${SITE_URL}/blog/${post.slug}`)
  const shareOnX = `https://x.com/intent/post?text=${encodeURIComponent(
    post.title,
  )}&url=${postUrl}`
  const shareOnLinkedIn = `https://www.linkedin.com/sharing/share-offsite/?url=${postUrl}`

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm">
        <Link
          to="/blog"
          className="text-stone-500 transition-colors hover:text-brand-600"
        >
          ← Tous les articles
        </Link>
      </p>

      <article className="mt-8">
        <header>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-500">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden="true">·</span>
            <span>{post.readingTime} min de lecture</span>
          </div>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-stone-900">
            {post.title}
          </h1>

          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs text-stone-600"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        {cover && (
          <PostCoverImage
            cover={cover}
            priority
            className="mt-8 aspect-video w-full rounded-xl border border-stone-200 object-cover"
          />
        )}

        <div className="prose prose-stone mt-10 prose-a:text-brand-700 max-w-none">
          {post.body}
        </div>
      </article>

      <div className="mt-12 flex flex-wrap gap-4 border-t border-stone-200 pt-6 text-sm">
        <a
          href={shareOnLinkedIn}
          target="_blank"
          rel="noreferrer"
          className="text-brand-600 hover:underline"
        >
          Partager sur LinkedIn
        </a>
        <a
          href={shareOnX}
          target="_blank"
          rel="noreferrer"
          className="text-brand-600 hover:underline"
        >
          Partager sur X
        </a>
        <a
          href={`mailto:${links.email}?subject=${encodeURIComponent(post.title)}`}
          className="text-brand-600 hover:underline"
        >
          Réagir par e-mail
        </a>
      </div>

      {(newer || older) && (
        <nav
          aria-label="Articles voisins"
          className="mt-8 grid gap-4 sm:grid-cols-2"
        >
          {older && <NeighbourLink label="Article précédent" post={older} />}
          {newer && <NeighbourLink label="Article suivant" post={newer} />}
        </nav>
      )}
    </div>
  )
}

function NeighbourLink({
  label,
  post,
}: {
  label: string
  post: { slug: string; title: string }
}) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className="rounded-xl border border-stone-200 p-4 transition-colors hover:border-stone-300 hover:bg-stone-50"
    >
      <span className="text-xs text-stone-500">{label}</span>
      <span className="mt-1 block text-sm font-medium text-stone-900">
        {post.title}
      </span>
    </Link>
  )
}
