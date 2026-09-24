import { Link, createFileRoute } from '@tanstack/react-router'

import type { Post } from '../../content/posts'
import { allTags, formatDate, getCover, sortedPosts } from '../../content/posts'
import { seo } from '../../lib/seo'

export const Route = createFileRoute('/blog/')({
  head: () =>
    seo({
      title: 'Blog',
      description:
        'Notes de développement web : TanStack Start, JSON-LD, React, agents LLM et outillage.',
      path: '/blog',
    }),
  component: BlogIndex,
})

function BlogIndex() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight text-stone-900">
        Blog
      </h1>
      <p className="mt-4 text-lg text-stone-600">
        Ce que j’apprends en construisant : architecture front, contrats d’API,
        agents et outillage. {sortedPosts.length} article
        {sortedPosts.length > 1 ? 's' : ''}.
      </p>

      <ul className="mt-6 flex flex-wrap gap-2">
        {allTags.map((tag) => (
          <li
            key={tag}
            className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-600"
          >
            {tag}
          </li>
        ))}
      </ul>

      <ol className="mt-12 space-y-10">
        {sortedPosts.map((post) => (
          <li
            key={post.slug}
            className="border-b border-stone-200 pb-10 last:border-0"
          >
            <article>
              <Cover post={post} />

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-500">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span aria-hidden="true">·</span>
                <span>{post.readingTime} min de lecture</span>
              </div>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-900">
                <Link
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="transition-colors hover:text-brand-600"
                >
                  {post.title}
                </Link>
              </h2>

              <p className="mt-3 leading-relaxed text-stone-600">
                {post.excerpt}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs text-stone-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <p className="mt-4 text-sm">
                <Link
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="font-medium text-brand-600 hover:underline"
                >
                  Lire l’article →
                </Link>
              </p>
            </article>
          </li>
        ))}
      </ol>
    </div>
  )
}

/** La vignette d'un article, absente tant que son image n'a pas été générée. */
function Cover({ post }: { post: Post }) {
  const cover = getCover(post.slug)

  if (!cover) return null

  return (
    <img
      src={cover.src}
      alt={cover.alt}
      width={cover.width}
      height={cover.height}
      loading="lazy"
      className="mb-5 aspect-video w-full rounded-xl border border-stone-200 object-cover"
    />
  )
}
