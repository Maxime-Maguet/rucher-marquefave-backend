import { Prisma } from '../generated/prisma/client';

/**
 * Champs communs retournés pour chaque produit (liste vitrine & fiche détail).
 */
const productBaseFields = {
  id: true,
  nom: true,
  slug: true,
  resume: true,
  typeMiel: true,
  misEnAvant: true,
  estDisponible: true,
  categorie: {
    select: { nom: true, slug: true },
  },
  images: {
    orderBy: { ordre: 'asc' as const },
    select: { id: true, url: true, altText: true },
  },
} satisfies Prisma.ProductSelect;

/**
 * SELECT pour la liste vitrine — léger, pas de description longue.
 * Variantes sans `id` (le panier n'est pas accessible depuis la liste).
 */
export const productCardSelect = {
  ...productBaseFields,
  variantes: {
    orderBy: { poidsGramme: 'asc' as const },
    select: { poidsGramme: true, prix: true, stock: true },
  },
} satisfies Prisma.ProductSelect;

/**
 * SELECT pour la fiche produit — complet.
 * Variantes avec `id` (nécessaire pour POST /orders).
 */
export const productDetailSelect = {
  ...productBaseFields,
  description: true,
  origine: true,
  fleuraison: true,
  anneeRecolte: true,
  variantes: {
    orderBy: { poidsGramme: 'asc' as const },
    select: { id: true, poidsGramme: true, prix: true, stock: true, sku: true },
  },
} satisfies Prisma.ProductSelect;
