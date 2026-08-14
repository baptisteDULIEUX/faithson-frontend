# Faithson Custom — Frontend (Vue 3 + Vite)

Frontend interactif du site **Faithson Custom** (atelier d'impression textile),
basé sur la maquette « Atelier Chaleureux ». Le **backend Node.js viendra plus tard** :
tout est déjà structuré pour s'y brancher sans réécrire l'interface.

## Démarrer

Il faut [Node.js](https://nodejs.org) (version 18 ou plus).

```bash
npm install     # installe les dépendances (à faire une fois)
npm run dev     # lance le serveur de développement
```

Puis ouvrez l'adresse affichée (par défaut http://localhost:5173).

Autres commandes :

```bash
npm run build     # build de production (dossier dist/)
npm run preview   # prévisualise le build
```

## Ce qui est fait

- **Accueil** complet (hero, process, aperçu boutique, savoir-faire, réalisations, avis, FAQ, devis/contact, newsletter)
- **Boutique** avec filtres par catégorie et ajout au panier
- **Panier** (tiroir latéral) avec quantités, persistant entre les visites
- **Paiement** : interface complète (coordonnées, livraison, carte) — *maquettée, sans encaissement réel*
- **Réalisations / Instagram** : première version **sans API** (gérée à la main)
- **Personnalisation** : éditeur d'image fonctionnel — importer un logo et le placer sur des **zones prédéfinies** (poitrine gauche/centre/droite, dos, taille), avec bascule avant/arrière, redimensionnement, puis **envoi de la demande** à l'atelier
- **Espace admin** (`/admin`) : connexion, statistiques, devis, et gestion des demandes de personnalisation

## Espace admin

Accessible via `/admin` (ou le lien « Tableau de bord » en pied de page).

- **Connexion** : mot de passe de démo `faithson2026`
- **Tableau de bord** : CA, nombre de commandes, panier moyen, à traiter, CA par mois, répartition par technique, dernières commandes
- **Boutique** : ajouter / modifier / supprimer des produits *(non enregistré tant que l'API n'est pas branchée — modifications perdues au rechargement)*
- **Commandes** : tableau filtrable, avancement du statut
- **Devis** : chiffrage (proposer un prix), envoi, accepté / refusé
- **Personnalisations** : demandes « logo sur vêtement ». L'artisan **valide et propose un prix**, le client paie ensuite (flux type devis)

> ⚠️ **Sécurité** : la connexion admin est ici une **porte de démonstration côté client** — elle ne protège rien réellement (le code frontend est public). En production, l'authentification **doit** être faite par le backend Node (mot de passe vérifié côté serveur, jeton JWT ou session, routes `/admin` protégées). Voir les commentaires dans `src/stores/auth.js` et `src/services/api.js`.

> Les actions admin (changer un statut, proposer un prix…) sont conservées **en mémoire pendant la session** : au rechargement de la page on repart des données de démo, car il n'y a pas encore de base de données.

## Ajouter des images facilement

### Produits de la boutique
1. Déposez l'image dans `public/images/boutique/`
2. Renseignez le nom du fichier dans `src/data/products.js` (champ `image`)

### Publications Instagram (réalisations)
1. Déposez l'image dans `public/images/instagram/`
2. Ajoutez / complétez une entrée dans `src/data/instagram.js` (champ `image`)

> Tant qu'aucune image n'est renseignée, un placeholder s'affiche automatiquement.

## Brancher le backend Node (plus tard)

Toute la communication passe par **`src/services/api.js`**. Aujourd'hui ces fonctions
renvoient les données locales / simulent une réponse. Quand le backend existera :

1. Créez un fichier `.env` à partir de `.env.example` et renseignez `VITE_API_URL`.
2. Dans `src/services/api.js`, décommentez les lignes `request(...)` de chaque fonction.

Aucune autre partie de l'app n'a besoin d'être modifiée.

Endpoints attendus côté backend (proposition) :

| Fonction front            | Méthode | Route            |
|---------------------------|---------|------------------|
| `getProducts`             | GET     | `/products`      |
| `getInstagramPosts`       | GET     | `/instagram`     |
| `createOrder` (paiement)  | POST    | `/orders`        |
| `createQuote` (devis)     | POST    | `/quotes`        |
| `subscribeNewsletter`     | POST    | `/newsletter`    |
| `createCustomRequest`     | POST    | `/custom-requests` |
| `createProduct`           | POST    | `/admin/products` |
| `updateProduct`           | PATCH   | `/admin/products/:id` |
| `deleteProduct`           | DELETE  | `/admin/products/:id` |
| `adminLogin`              | POST    | `/admin/login`   |
| `getOrders`               | GET     | `/admin/orders`  |
| `updateOrderStatus`       | PATCH   | `/admin/orders/:id` |
| `getQuotes`               | GET     | `/admin/quotes`  |
| `updateQuote`             | PATCH   | `/admin/quotes/:id` |
| `getCustomRequests`       | GET     | `/admin/custom-requests` |
| `updateCustomRequest`     | PATCH   | `/admin/custom-requests/:id` |

## Arborescence

```
src/
├── assets/styles/
│   ├── main.css             # design tokens (couleurs, typo) + styles partagés
│   └── admin.css            # styles de l'espace admin
├── components/              # header, footer, sections, carte produit, panier…
├── layouts/AdminLayout.vue  # coquille de l'espace admin (sidebar + topbar)
├── views/
│   ├── HomeView / BoutiqueView / PersonnalisationView / CheckoutView
│   └── admin/               # Login, Dashboard, Orders, Quotes, Custom
├── data/                    # products, instagram, orders, quotes, customRequests  ← à éditer
├── services/api.js          # point unique vers le futur backend
├── stores/                  # cart.js (panier) + auth.js (connexion admin)
└── router/index.js          # routes + garde /admin
```

## Pile technique

Vue 3 (`<script setup>`) · Vite · Vue Router · Pinia.
