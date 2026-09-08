/**
 * SEED — Le Rucher de Marquefave
 *
 * ⚠️  DONNÉES PROVISOIRES — à valider avec Pierre Guet avant la mise en production.
 *     Noms, descriptions et stocks sont estimatifs. Prix confirmés : 4€/250g, 8€/500g, 16€/kg, 24€/1.5kg.
 *
 * Commande : npx prisma db seed
 */

import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import slugify from 'slugify';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

function slug(name: string) {
  return slugify(name, { lower: true, strict: true });
}

// Variantes standard 4 tailles (prix au kilo : 16€)
function variantesStandard(
  prefix: string,
  stocks: [number, number, number, number],
) {
  return [
    { poidsGramme: 250, prix: 4.0, stock: stocks[0], sku: `${prefix}-250` },
    { poidsGramme: 500, prix: 8.0, stock: stocks[1], sku: `${prefix}-500` },
    { poidsGramme: 1000, prix: 16.0, stock: stocks[2], sku: `${prefix}-1000` },
    { poidsGramme: 1500, prix: 24.0, stock: stocks[3], sku: `${prefix}-1500` },
  ];
}

async function main() {
  console.log('🌱 Démarrage du seed...');

  // ─── Nettoyage (ordre FK : enfants avant parents) ─────────────────────────
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  console.log('🗑️  Tables vidées');

  // ─── Catégories ──────────────────────────────────────────────────────────
  const catMiels = await prisma.category.create({
    data: {
      nom: 'Miels',
      slug: slug('Miels'),
      description:
        'Miels artisanaux récoltés mois par mois au fil des saisons. Chaque mois, sa floraison.',
    },
  });

  const catProduits = await prisma.category.create({
    data: {
      nom: 'Produits de la ruche',
      slug: slug('Produits de la ruche'),
      description:
        "Pain d'épices et autres produits artisanaux issus du rucher.",
    },
  });

  console.log('📂 Catégories créées');

  // ─── Miels ────────────────────────────────────────────────────────────────
  const miels: {
    nom: string;
    resume: string;
    description: string;
    fleuraison: string;
    typeMiel: string;
    misEnAvant: boolean;
    estDisponible: boolean;
    sku: string;
    stocks: [number, number, number, number];
  }[] = [
    {
      nom: 'Miel de Printemps',
      resume: 'Doux et floral — premier miel de la saison.',
      description:
        "Récolté dès les premières floraisons d'avril. Vergers en fleurs, prairies et cultures environnantes donnent à ce miel une saveur délicate et légèrement fruitée. Texture liquide, couleur ambrée claire. Le miel du réveil de la ruche.",
      fleuraison: 'Arbres fruitiers, pissenlit, prairies de printemps',
      typeMiel: 'Liquide',
      misEnAvant: true,
      estDisponible: true,
      sku: 'PRIN',
      stocks: [30, 25, 15, 8],
    },
    {
      nom: "Miel d'Acacia",
      resume: "Le plus délicat — liquide, transparent, notes d'oranger.",
      description:
        "Récolté en mai lors de la floraison du robinier, avec une légère note d'oranger apportée par les agrumes en fleurs. Quasi transparent, il cristallise très lentement. Saveur douce, vanillée et subtilement florale. Idéal pour sucrer sans masquer.",
      fleuraison: "Robinier (acacia), agrumes (note d'oranger)",
      typeMiel: 'Liquide',
      misEnAvant: true,
      estDisponible: true,
      sku: 'ACAC',
      stocks: [20, 18, 10, 5],
    },
    {
      nom: 'Miel de Tilleul',
      resume: 'Mentholé et frais — la signature de juin.',
      description:
        'Récolté en juin lors de la grande floraison du tilleul. Couleur dorée, légèrement verdâtre. Saveur caractéristique mentholée et boisée, avec une légère fraîcheur en bouche. Cristallise en une texture fine et crémeuse. Reconnu pour ses vertus apaisantes.',
      fleuraison: 'Tilleul, trèfle',
      typeMiel: 'Crémeux',
      misEnAvant: true,
      estDisponible: true,
      sku: 'TILL',
      stocks: [25, 20, 12, 6],
    },
    {
      nom: 'Miel de Tournesol',
      resume: 'Crémeux et doux — le classique de juillet.',
      description:
        'Récolté en juillet lors de la grande miellée de tournesol. Cristallise très rapidement en une texture crémeuse fine, de couleur jaune pâle. Goût doux et sucré, légèrement fruité. Facile à tartiner, apprécié des enfants.',
      fleuraison: 'Tournesol, fleurs de courgette',
      typeMiel: 'Crémeux',
      misEnAvant: false,
      estDisponible: true,
      sku: 'TOUR',
      stocks: [35, 30, 20, 10],
    },
    {
      nom: 'Miel de Menthe Sauvage',
      resume: 'Rare et surprenant — notes mentholées intenses.',
      description:
        'Récolté en plein été (juillet-août) sur les zones humides bordant les ruchers où pousse la menthe sauvage. Miel rare à la personnalité affirmée. Couleur ambrée foncée, arômes puissants et frais. Une découverte pour les amateurs de miels atypiques.',
      fleuraison: 'Menthe sauvage, fleurs sauvages estivales',
      typeMiel: 'Liquide',
      misEnAvant: true,
      estDisponible: true,
      sku: 'MENT',
      stocks: [10, 8, 5, 2],
    },
    {
      nom: "Miel d'Été",
      resume: "Polyfloral d'été — onctueux et équilibré.",
      description:
        'Récolté en août sur une grande diversité de fleurs sauvages et cultivées. Texture crémeuse naturelle, couleur dorée. Goût équilibré, ni trop sucré ni trop marqué. Le miel de tous les jours du Rucher de Marquefave.',
      fleuraison: "Toutes fleurs d'été, fleurs de courgette",
      typeMiel: 'Crémeux',
      misEnAvant: false,
      estDisponible: true,
      sku: 'ETE',
      stocks: [20, 18, 10, 5],
    },
    {
      nom: 'Miel de Bignone',
      resume: 'Floral et exotique — fin de saison août-septembre.',
      description:
        'Récolté en fin de saison (août-septembre) sur la bignone, plante grimpante aux grandes fleurs orangées très mellifères. Miel rare et original, couleur ambrée chaude, saveur florale et légèrement sucrée. Production limitée chaque année.',
      fleuraison: 'Bignone (Campsis), fleurs de fin de saison',
      typeMiel: 'Liquide',
      misEnAvant: false,
      estDisponible: false, // hors saison — pour tester le filtre vitrine
      sku: 'BIGN',
      stocks: [0, 0, 0, 0],
    },
  ];

  for (const miel of miels) {
    const { sku, stocks, ...data } = miel;
    await prisma.product.create({
      data: {
        ...data,
        nom: data.nom,
        slug: slug(data.nom),
        origine: 'France — Tarn (Saint-Sulpice-la-Pointe)',
        anneeRecolte: 2025,
        categoryId: catMiels.id,
        variantes: {
          create: variantesStandard(sku, stocks),
        },
      },
    });
    console.log(`✅ ${data.nom}`);
  }

  // ─── Produits de la ruche ─────────────────────────────────────────────────
  await prisma.product.create({
    data: {
      nom: "Pain d'Épices de Marie-Laure",
      slug: slug("Pain d'Épices de Marie-Laure"),
      resume: 'Fait maison avec le miel de printemps du rucher.',
      description:
        "Pain d'épices artisanal préparé par Marie-Laure avec le miel de printemps du rucher. Recette familiale transmise depuis des générations, moelleux et parfumé à la cannelle et à l'anis. Vendu à la coupe ou en demi-pain.",
      origine: 'France — Tarn (Saint-Sulpice-la-Pointe)',
      misEnAvant: true,
      estDisponible: true,
      categoryId: catProduits.id,
      variantes: {
        create: [
          { poidsGramme: 250, prix: 6.0, stock: 20, sku: 'PAIN-250' },
          { poidsGramme: 500, prix: 11.0, stock: 15, sku: 'PAIN-500' },
        ],
      },
    },
  });
  console.log("✅ Pain d'Épices de Marie-Laure");

  console.log('\n🌱 Seed terminé avec succès !');
  console.log('⚠️  Rappel : données provisoires à valider avec Pierre Guet.');
}

main()
  .catch((e) => {
    console.error('❌ Erreur seed :', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
