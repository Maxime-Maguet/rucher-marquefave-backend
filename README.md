# 🍯 Le Rucher de Marquefave — API Backend (NestJS)

API REST dédiée à la gestion du e-commerce et de la vitrine pour la miellerie artisanale **Le Rucher de Marquefave** (Saint-Sulpice-la-Pointe, Tarn).

---

## 🎯 Vision du projet (V1)

Backend robuste, fortement typé et sécurisé pour alimenter l'interface client Next.js.

- **Vente V1 :** Click & Collect uniquement (retrait au rucher & marchés locaux).
- **Paiements :** Intégration Stripe Checkout API & Webhooks.
- **Gestion :** Produits, stocks, commandes.

---

## 🛠️ Stack technique

| Brique | Outil |
|---|---|
| Framework | NestJS (TypeScript) |
| Base de données | PostgreSQL |
| ORM | Prisma 7 |
| Paiement | Stripe SDK |
| Sécurité | JWT Guards, `class-validator`, Helmet, Throttler |

---

## 📋 Roadmap V1

### ✅ Phase 1 — Infrastructure & Sécurité de base

- [x] Initialisation NestJS + TypeScript
- [x] Configuration Prisma + PostgreSQL
- [x] Modélisation complète du schéma (`schema.prisma`) : User, Category, Product, ProductVariant, ProductImage, Order, OrderItem
- [x] Migrations PostgreSQL
- [x] `ValidationPipe` global (`whitelist`, `forbidNonWhitelisted`, `transform`)
- [x] Filtre global `PrismaClientExceptionFilter` (P2002 unique, P2025 not found, P2003 FK conflict)
- [x] CORS configuré
- [x] Helmet (headers sécurité HTTP)
- [x] Seed provisoire (7 miels + 1 pain d'épices) — à valider avec Pierre Guet

---

### ✅ Phase 2 — Module Categories (CRUD complet)

- [x] `CategoriesModule` — Controller, Service, DTOs
- [x] `CreateCategoryDto` : `@Transform` trim, `@Length`, `@MaxLength`, `@IsOptional`
- [x] `UpdateCategoryDto` : `PartialType(CreateCategoryDto)`
- [x] `GET /categories` — public, select minimal (id, nom, slug, description)
- [x] `GET /categories/:id` — public, `ParseUUIDPipe`, `findUniqueOrThrow`
- [x] `POST /categories` — (à protéger Admin — Phase 5)
- [x] `PATCH /categories/:id` — (à protéger Admin — Phase 5)
- [x] `DELETE /categories/:id` — (à protéger Admin — Phase 5)

> ⚠️ Les routes de mutation (`POST`, `PATCH`, `DELETE`) existent mais **ne sont pas encore protégées par un guard JWT Admin**. Elles seront verrouillées en Phase 5.

---

### 🟡 Phase 3 — Module Products (en cours)

- [x] `CreateProductDto` : tous les champs + `@ValidateNested` pour `variantes` (min 1) et `images`
- [x] `CreateProductVariantDto` : `poidsGramme`, `prix`, `stock`, `sku`
- [x] `CreateProductImageDto` : `url`, `altText`, `ordre`
- [ ] `UpdateProductDto` : `PartialType(CreateProductDto)`
- [ ] `ProductsService.findAll()` : `estDisponible: true`, include catégorie + variantes + images
- [ ] `ProductsService.findOne(slug)` : `findUniqueOrThrow` par slug
- [ ] `ProductsService.create()` : nested create variantes + images, slug auto
- [ ] `ProductsService.update()` : slug recalculé si nom change
- [ ] `ProductsService.remove()` : suppression + cascade via Prisma
- [ ] `ProductsController` : `GET /products`, `GET /products/:slug` (public) — routes admin à protéger Phase 5
- [ ] Supprimer `entities/product.entity.ts` (inutile avec Prisma)

---

### ⬜ Phase 4 — Authentification Admin (JWT)

- [ ] `UsersModule` : service + repository Prisma
- [ ] `AuthModule` : `POST /auth/login` → retourne JWT
- [ ] `JwtAuthGuard` + `RolesGuard` (rôle `ADMIN`)
- [ ] Hash mot de passe avec `bcrypt` (seed admin avec vrai hash)
- [ ] Protection des routes d'écriture Categories et Products

---

### ⬜ Phase 5 — Module Orders & Stripe Checkout

- [ ] `OrdersModule` : Controller, Service, DTOs
- [ ] `CreateOrderDto` : tableau d'items (variantId + quantity)
- [ ] `POST /orders/checkout` : crée session Stripe, retourne `checkoutUrl`
- [ ] `POST /webhooks/stripe` : reçoit événement `checkout.session.completed`, valide paiement, met à jour stock et statut commande
- [ ] `GET /admin/orders` (Admin) : liste des commandes Click & Collect
- [ ] `PATCH /admin/orders/:id/status` (Admin) : mise à jour statut (PENDING → CONFIRMED → PICKED_UP)

---

### ⬜ Phase 6 — Qualité & Déploiement

- [ ] Tests unitaires services (Jest)
- [ ] Tests e2e endpoints critiques
- [ ] Rate limiting (Throttler) sur les routes publiques
- [ ] Variables d'environnement validées au démarrage (`@nestjs/config` + Joi)
- [ ] Docker Compose production-ready
- [ ] Documentation Swagger (`@nestjs/swagger`)

---

## 🚀 Installation & démarrage

```bash
# 1. Dépendances
npm install

# 2. Variables d'environnement
cp .env.example .env
# Remplir DATABASE_URL, JWT_SECRET, STRIPE_SECRET_KEY, etc.

# 3. Base de données
npx prisma migrate dev

# 4. Seed (données initiales)
npx prisma db seed

# 5. Démarrage dev
npm run start:dev
```

---

## 🗂️ Structure du projet

```
src/
├── app.module.ts
├── main.ts                         # Bootstrap : pipes, filtres, CORS, Helmet
├── common/
│   └── filters/
│       └── prisma-exception.filter.ts  # Gestion centralisée erreurs Prisma
├── categories/
│   ├── categories.controller.ts
│   ├── categories.service.ts
│   ├── categories.module.ts
│   └── dto/
│       ├── create-category.dto.ts
│       └── update-category.dto.ts
└── products/
    ├── products.controller.ts
    ├── products.service.ts
    ├── products.module.ts
    └── dto/
        ├── create-product.dto.ts
        ├── create-product-variant-dto.ts
        └── create-product-image.dto.ts
prisma/
├── schema.prisma
├── seed.ts                         # ⚠️ Données provisoires — valider avec Pierre Guet
└── migrations/
```

---

## ⚙️ Variables d'environnement requises

| Variable | Description |
|---|---|
| `DATABASE_URL` | URL PostgreSQL |
| `PORT` | Port du serveur (défaut : 3000) |
| `FRONTEND_URL` | URL du front Next.js (CORS) |
| `JWT_SECRET` | Clé secrète pour les tokens JWT |
| `ADMIN_EMAIL` | Email de l'admin initial |
| `ADMIN_PASSWORD` | Mot de passe admin (sera hashé) |
| `STRIPE_SECRET_KEY` | Clé secrète Stripe |
| `STRIPE_WEBHOOK_SECRET` | Secret de validation des webhooks Stripe |
| `STRIPE_SUCCESS_URL` | URL de redirection après paiement réussi |
| `STRIPE_CANCEL_URL` | URL de redirection après annulation |
