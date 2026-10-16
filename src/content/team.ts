/**
 * L'équipe de l'agence Hermez, affichée sur `/notre-equipe`.
 *
 * Une entrée par membre : ajouter un membre, c'est ajouter un objet ici, la
 * page et son JSON-LD suivent. Les textes sont à la troisième personne.
 */

export type TeamMember = {
  /** Clé de liste et ancre de la carte. Ne plus la changer une fois publiée. */
  id: string
  firstName: string
  role: string
  /** Deux ou trois phrases, à la troisième personne. */
  bio: string
  /** Chemin d'une photo dans `public/`. Sans photo, la carte affiche l'initiale. */
  photo?: string
  /** Les domaines d'intervention, en quelques mots chacun. */
  domains: Array<string>
}

export const team: Array<TeamMember> = [
  {
    id: 'salvador',
    firstName: 'Salvador',
    role: 'Lead Dev IA',
    bio:
      'Salvador intervient sur l’IA appliquée (RAG, OCR, Whisper), le développement web avec React et Symfony / API Platform, et le DevOps. Il a conçu et livré des applications pour de grands comptes comme EDF, Carrefour, OVH, M6 et TF1.',
    domains: [
      'IA appliquée : RAG, OCR, Whisper',
      'React, Symfony / API Platform',
      'DevOps',
    ],
  },
]
