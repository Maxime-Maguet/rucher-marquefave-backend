# 🍯 Le Rucher de Marquefave - API Backend (NestJS)

API REST dédiée à la gestion du e-commerce et de la vitrine pour la miellerie artisanale **Le Rucher de Marquefave** (Saint-Sulpice-la-Pointe).

---

## 🎯 Vision du Projet & Périmètre (V1)

Développement d'un backend robuste, fortement typé et sécurisé pour alimenter l'interface client Next.js.

- **Vente V1 :** Click & Collect uniquement (retrait au rucher & marchés locaux).
- **Paiements :** Intégration sécurisée via Stripe Checkout API & Webhooks.
- **Gestion des données :** Produits, stocks et état des commandes.

---

## 🛠️ Stack Technique

- **Framework :** NestJS (TypeScript)
- **Base de données :** PostgreSQL
- **ORM :** Prisma
- **Paiement :** Stripe SDK
- **Sécurité :** JWT Guards, DTOs (`class-validator`)

---

## 📋 Roadmap / Kanban V1

### 🟢 Phase 1 : Infrastructure & Data

- [x] Initialisation du projet NestJS & TypeScript
- [x] Installation & configuration de Prisma
- [x] Modélisation du schéma BDD (`schema.prisma`)
- [x] Exécution de la première migration PostgreSQL

### 🟡 Phase 2 : Module Produits (Catalogue)

- [ ] Module `Products` (Controller, Service)
- [ ] Endpoint `GET /products` (Catalogue des miels)
- [ ] Endpoint `GET /products/:slug` (Fiche produit)
- [ ] Script de Seed (jeu de données de test avec les vrais miels)

### 🟠 Phase 3 : Commandes & Stripe Checkout

- [ ] Module `Orders` & validation DTO
- [ ] Endpoint `POST /orders/checkout` (Création session Stripe)
- [ ] Endpoint `POST /webhooks/stripe` (Validation auto des paiements)
- [ ] Mise à jour automatique des stocks

### 🔴 Phase 4 : Espace Admin & Sécurité

- [ ] Authentification Admin (Login + JWT Guard)
- [ ] Endpoint `GET /admin/orders` (Suivi du Click & Collect)
- [ ] Endpoint `PATCH /admin/orders/:id/status` (Mise à jour des statuts)

---

## 🚀 Installation & Démarrage

### Configuration

```bash
# 1. Installer les dépendances
$ npm install

# 2. Configurer les variables d'environnement
# Créer un fichier .env à la racine (voir .env.example)
```
