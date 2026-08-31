import { Link, createFileRoute, notFound } from '@tanstack/react-router'

import { formatDate, getPost, sortedPosts } from '../../content/posts'
import { links } from '../../content/profile'
import { SITE_URL, seo } from '../../lib/seo'

/**
 * Les routes paramétrées ne sont pas découvertes automatiquement par le
 * prérendu : c'est le crawler (`crawlLinks`) qui trouve ces URL en suivant les
 * liens de `/blog`. Tout article listé sur l'index est donc prérendu.
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
        })
      : {},
  component: PostPage,
})

function PostPage() {
  const { slug } = Route.useParams()
  const post = getPost(slug)

  if (!post) return null

  const index = sortedPosts.findIndex((item) => item.slug === slug)
  const newer = index > 0 ? sortedPosts[index - 1] : undefined
  const older =
    index >= 0 && index < sortedPosts.length - 1
      ? sortedPosts[index + 1]
      : undefined

  const shareUrl = `https://x.com/intent/post?text=${encodeURIComponent(
    post.title,
  )}&url=${encodeURIComponent(`${SITE_URL}/blog/${post.slug}`)}`

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm">
        <Link
          to="/blog"
          className="text-slate-500 transition-colors hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400"
        >
          ← Tous les articles
        </Link>
      </p>

      <article className="mt-8">
        <header>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-500">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden="true">·</span>
            <span>{post.readingTime} min de lecture</span>
          </div>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {post.title}
          </h1>

          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="prose prose-slate dark:prose-invert mt-10 max-w-none">
          {post.body}
        </div>
      </article>

      <div className="mt-12 flex flex-wrap gap-4 border-t border-slate-200 pt-6 text-sm dark:border-slate-800">
        <a
          href={shareUrl}
          target="_blank"
          rel="noreferrer"
          className="text-sky-600 hover:underline dark:text-sky-400"
        >
          Partager sur X
        </a>
        <a
          href={`mailto:${links.email}?subject=${encodeURIComponent(post.title)}`}
          className="text-sky-600 hover:underline dark:text-sky-400"
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
      className="rounded-xl border border-slate-200 p-4 transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:hover:border-slate-700 dark:hover:bg-slate-900"
    >
      <span className="text-xs text-slate-500 dark:text-slate-500">{label}</span>
      <span className="mt-1 block text-sm font-medium text-slate-900 dark:text-slate-100">
        {post.title}
      </span>
    </Link>
  )
}
