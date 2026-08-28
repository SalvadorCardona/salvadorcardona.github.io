import { Link, createFileRoute } from '@tanstack/react-router'

import { allTags, formatDate, sortedPosts } from '../../content/posts'
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
      <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        Blog
      </h1>
      <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
        Ce que j’apprends en construisant : architecture front, contrats d’API,
        agents et outillage. {sortedPosts.length} article
        {sortedPosts.length > 1 ? 's' : ''}.
      </p>

      <ul className="mt-6 flex flex-wrap gap-2">
        {allTags.map((tag) => (
          <li
            key={tag}
            className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400"
          >
            {tag}
          </li>
        ))}
      </ul>

      <ol className="mt-12 space-y-10">
        {sortedPosts.map((post) => (
          <li
            key={post.slug}
            className="border-b border-slate-200 pb-10 last:border-0 dark:border-slate-800"
          >
            <article>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-500">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span aria-hidden="true">·</span>
                <span>{post.readingTime} min de lecture</span>
              </div>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                <Link
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="transition-colors hover:text-sky-600 dark:hover:text-sky-400"
                >
                  {post.title}
                </Link>
              </h2>

              <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-400">
                {post.excerpt}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <p className="mt-4 text-sm">
                <Link
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="font-medium text-sky-600 hover:underline dark:text-sky-400"
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
