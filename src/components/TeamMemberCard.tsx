import type { TeamMember } from '../content/team'

/** La carte d'un membre de l'équipe : photo ou initiale, rôle, présentation. */
export function TeamMemberCard({ member }: { member: TeamMember }) {
  return (
    <article
      id={member.id}
      className="scroll-mt-24 flex w-full flex-col rounded-2xl border border-stone-200 p-6 transition-colors hover:border-stone-300"
    >
      <div className="flex items-center gap-4">
        {member.photo ? (
          <img
            src={member.photo}
            alt={`Portrait de ${member.firstName}`}
            width={64}
            height={64}
            loading="lazy"
            className="h-16 w-16 shrink-0 rounded-full object-cover ring-1 ring-stone-200"
          />
        ) : (
          <span
            aria-hidden="true"
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xl font-semibold text-brand-600 ring-1 ring-brand-100"
          >
            {member.firstName.charAt(0)}
          </span>
        )}
        <div>
          <h3 className="text-lg font-semibold text-stone-900">
            {member.firstName}
          </h3>
          <p className="text-sm font-medium text-brand-600">{member.role}</p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-pretty text-stone-600">
        {member.bio}
      </p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {member.domains.map((domain) => (
          <li
            key={domain}
            className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-700"
          >
            {domain}
          </li>
        ))}
      </ul>
    </article>
  )
}
