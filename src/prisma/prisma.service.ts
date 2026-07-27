import {
  Logger,
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
// Import du client Prisma généré sur mesure dans notre dossier custom
import { PrismaClient } from '../generated/prisma/client';
// Adapter PostgreSQL natif pour Prisma (Driver JS optimisé)
import { PrismaPg } from '@prisma/adapter-pg';

/**
 * Service Prisma pour gérer la connexion à PostgreSQL.
 * Étend PrismaClient pour donner accès à toutes les méthodes d'accès aux données (findMany, create, etc.)
 * Implémente les hooks de cycle de vie NestJS (OnModuleInit, OnModuleDestroy).
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  // 'private'  = Accessible UNIQUEMENT à l'intérieur de cette classe
  // 'readonly' = Impossible de réassigner cette variable après son initialisation
  // 'PrismaService.name' = Renvoie la string "PrismaService" pour étiqueter les logs dans la console
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    // 1. Récupération et vérification de la variable d'environnement
    const connectionString = process.env.DATABASE_URL;
    // 2. Garde-fou : Si la variable est manquante, on stoppe net l'application au lieu de laisser passer un bug
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not defined');
    }
    // 3. Instanciation de l'adapter PostgreSQL
    const adapter = new PrismaPg({ connectionString });
    // 4. Détection du mode développement (renvoie un booléen true ou false)
    const isDev = process.env.NODE_ENV === 'development';

    // 5. Appel obligatoire du constructeur de la classe parente (PrismaClient)
    // - En dev  : Log des requêtes ('info'), avertissements ('warn') et erreurs ('error')
    // - En prod : Log uniquement des avertissements ('warn') et erreurs ('error')
    super({
      adapter,
      log: isDev ? ['info', 'warn', 'error'] : ['warn', 'error'],
    });
  }

  /**
   * Hook de cycle de vie NestJS : Exécuté AUTOMATIQUEMENT au démarrage du serveur.
   * Ouvre la connexion réseau vers la base de données PostgreSQL.
   */
  async onModuleInit() {
    try {
      await this.$connect(); // Attend que le pool de connexion BDD soit ouvert
      this.logger.log('✅ Prisma connected to PostgreSQL');
    } catch (error) {
      this.logger.error('❌ Prisma connection error:', error);
      throw error; // Empêche NestJS de démarrer si la base de données est inaccessible
    }
  }

  /**
   * Hook de cycle de vie NestJS : Exécuté AUTOMATIQUEMENT lors de l'arrêt du serveur (Ctrl + C).
   * Libère et ferme proprement le pool de connexions vers la base de données.
   */
  async onModuleDestroy() {
    await this.$disconnect(); // Attend la fermeture propre des sockets BDD
    this.logger.log('🔌 Prisma disconnected from PostgreSQL');
  }
}
