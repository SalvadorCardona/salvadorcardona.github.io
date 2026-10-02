/**
 * Le découpage d'une page d'expérience en résumé et sections, sur des blocs
 * tels que l'API Notion les renvoie. Sans réseau : `npm test`.
 */

import assert from 'node:assert/strict'
import { test } from 'node:test'

import { parseBody, toJson } from './sync-experiences.mjs'

/** Un bloc Notion réduit à ce que lit le script. */
function block(type, ...parts) {
  return {
    type,
    [type]: {
      rich_text: parts.map((part) => {
        const [content, bold] =
          typeof part === 'string' ? [part, false] : [part.bold, true]
        return { plain_text: content, annotations: { bold } }
      }),
    },
  }
}

const paragraph = (...parts) => block('paragraph', ...parts)
const bullet = (...parts) => block('bulleted_list_item', ...parts)

test('un bloc Titre 1, 2 ou 3 ouvre une section, sans son émoji', () => {
  const { sections, orphans } = parseBody([
    block('heading_1', '⌨️ BACKEND — Symfony 6'),
    bullet('API REST'),
    block('heading_2', 'FRONTEND'),
    bullet('SPA React'),
    block('heading_3', '🤖 IA'),
    bullet('OCR de documents'),
  ])

  assert.deepEqual(sections, [
    { title: 'BACKEND — Symfony 6', items: ['API REST'] },
    { title: 'FRONTEND', items: ['SPA React'] },
    { title: 'IA', items: ['OCR de documents'] },
  ])
  assert.deepEqual(orphans, [])
})

test('un paragraphe à émoji suivi d’un intitulé connu ouvre une section', () => {
  const { summary, sections, orphans } = parseBody([
    paragraph('Marketplace du bio.'),
    paragraph('🛠 BACKEND — Symfony 6 / API Platform / Sylius'),
    bullet('Migration du socle e-commerce vers Sylius'),
    paragraph({ bold: '🖥️ FRONTEND' }, ' — Next.js / React'),
    bullet('Front SSR sous Next.js'),
    paragraph('📶 Infrastructure '),
    bullet('Travaux sur plusieurs services GCP'),
    paragraph('🧭 CONSEIL & MÉTHODE'),
    bullet('Participation aux rituels Scrum'),
  ])

  assert.equal(summary, 'Marketplace du bio.')
  assert.deepEqual(
    sections.map((section) => section.title),
    [
      'BACKEND — Symfony 6 / API Platform / Sylius',
      'FRONTEND — Next.js / React',
      'Infrastructure',
      'CONSEIL & MÉTHODE',
    ],
  )
  assert.deepEqual(
    sections.map((section) => section.items.length),
    [1, 1, 1, 1],
  )
  assert.deepEqual(orphans, [])
})

test('un paragraphe sans émoji ou sans intitulé connu reste du texte', () => {
  const { summary, sections } = parseBody([
    paragraph('Backend en Java avant tout.'),
    paragraph('🚀 Lancement en 2023.'),
    paragraph('🤖 IAgents maison.'),
  ])

  assert.equal(
    summary,
    'Backend en Java avant tout. 🚀 Lancement en 2023. 🤖 IAgents maison.',
  )
  assert.deepEqual(sections, [])
})

test('une puce sans titre au-dessus est rendue à part, pas perdue', () => {
  const { sections, orphans } = parseBody([
    paragraph('Tech lead d’une équipe de 3 personnes.'),
    bullet('Création de l’application web'),
    paragraph('⌨️ BACKEND'),
    bullet('Tests unitaires'),
  ])

  assert.deepEqual(orphans, ['Création de l’application web'])
  assert.deepEqual(sections, [{ title: 'BACKEND', items: ['Tests unitaires'] }])
})

test('le JSON garde sur une ligne les tableaux courts, comme le fichier versionné', () => {
  const long = 'Une puce assez longue pour que le tableau dépasse les 80 colonnes'
  const json = toJson({ stack: ['Symfony', 'PHP'], items: [long, long] })

  assert.equal(
    json,
    [
      '{',
      '  "stack": ["Symfony", "PHP"],',
      '  "items": [',
      `    "${long}",`,
      `    "${long}"`,
      '  ]',
      '}',
    ].join('\n'),
  )
})
