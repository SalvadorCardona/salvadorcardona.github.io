/**
 * Les deux pages légales, `/mentions-legales` et `/confidentialite`, rendues
 * par le même gabarit (`components/LegalPage.tsx`).
 *
 * Les faits viennent du code et de l'infrastructure : le formulaire de
 * contact (`lib/contact.ts`), l'envoi par Brevo, Turnstile, Umami
 * auto-hébergé et le VPS Hostinger qui porte Dokploy (`DEPLOY.md`). Un
 * nouveau prestataire qui voit passer des données s'ajoute ici.
 */

import { links } from './profile'

export type LegalSection = {
  title: string
  paragraphs: Array<string>
}

export type LegalPage = {
  path: '/mentions-legales' | '/confidentialite'
  name: string
  title: string
  description: string
  updated: string
  sections: Array<LegalSection>
}

export const mentionsLegales: LegalPage = {
  path: '/mentions-legales',
  name: 'Mentions légales',
  title: 'Mentions légales',
  description:
    'Mentions légales du site hermez.dev : éditeur, directeur de la publication, hébergeur et propriété intellectuelle.',
  updated: '16 octobre 2026',
  sections: [
    {
      title: 'Éditeur',
      paragraphs: [
        'Le site hermez.dev est édité par l’agence Hermez, agence digitale basée à Lyon (France).',
        `Contact : ${links.email}.`,
        'Directeur de la publication : Salvador Cardona.',
      ],
    },
    {
      title: 'Hébergeur',
      paragraphs: [
        'Le site est hébergé sur un serveur privé virtuel de Hostinger International Ltd, 61 Lordou Vironos Street, 6023 Larnaca, Chypre — www.hostinger.fr.',
      ],
    },
    {
      title: 'Propriété intellectuelle',
      paragraphs: [
        'Les textes, illustrations, vidéos et le code de ce site appartiennent à l’agence Hermez, sauf mention contraire. Toute reproduction sans autorisation est interdite.',
        'Les logos et marques des clients cités appartiennent à leurs titulaires respectifs et ne sont reproduits que pour présenter les missions menées pour eux. Les captures de sites clients illustrent des réalisations réelles.',
      ],
    },
    {
      title: 'Données personnelles',
      paragraphs: [
        'Le traitement des informations envoyées par le formulaire de contact est décrit dans la politique de confidentialité.',
      ],
    },
  ],
}

export const confidentialite: LegalPage = {
  path: '/confidentialite',
  name: 'Politique de confidentialité',
  title: 'Politique de confidentialité',
  description:
    'Ce que l’agence Hermez fait des informations du formulaire de contact, ses prestataires, la durée de conservation et vos droits. Statistiques sans cookie.',
  updated: '16 octobre 2026',
  sections: [
    {
      title: 'Responsable du traitement',
      paragraphs: [
        `L’agence Hermez, à Lyon, joignable à ${links.email}.`,
      ],
    },
    {
      title: 'Les données collectées',
      paragraphs: [
        'Le formulaire de contact recueille votre nom, votre adresse e-mail, et si vous les indiquez votre entreprise, le type de projet, un budget indicatif, votre message et vos disponibilités pour un appel. Votre adresse IP est transmise au service anti-robot au moment de l’envoi.',
        'Ces informations servent uniquement à répondre à votre demande et, le cas échéant, à préparer une proposition. La base légale est l’exécution de mesures précontractuelles prises à votre demande.',
      ],
    },
    {
      title: 'Les destinataires',
      paragraphs: [
        'Les informations sont lues par l’agence seule. Elles ne sont ni revendues, ni cédées.',
        'Elles transitent par trois prestataires techniques : Brevo (Sendinblue SAS, France), qui envoie l’e-mail de notification à l’agence et l’accusé de réception ; Hostinger, qui héberge le site et la boîte de réception de l’agence ; Cloudflare, dont le service Turnstile vérifie que le formulaire est envoyé par un humain.',
      ],
    },
    {
      title: 'Durée de conservation',
      paragraphs: [
        'Les échanges sont conservés au plus trois ans après le dernier contact, puis supprimés.',
      ],
    },
    {
      title: 'Statistiques de fréquentation',
      paragraphs: [
        'La fréquentation est mesurée avec Umami, hébergé par l’agence. Il ne dépose aucun cookie, ne suit pas les visiteurs d’un site à l’autre et ne conserve aucune donnée permettant de vous identifier. Aucun traceur publicitaire n’est utilisé.',
      ],
    },
    {
      title: 'Vos droits',
      paragraphs: [
        `Vous pouvez accéder à vos données, les faire corriger ou effacer, vous opposer à leur traitement ou en demander la limitation, en écrivant à ${links.email}. Une réponse vous est apportée sous un mois.`,
        'Si vous estimez que vos droits ne sont pas respectés, vous pouvez adresser une réclamation à la CNIL (www.cnil.fr).',
      ],
    },
  ],
}
