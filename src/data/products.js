/* =========================================================
   PRODUITS DE LA BOUTIQUE
   ---------------------------------------------------------
   ▶ Pour AJOUTER UNE IMAGE à un produit :
     1. Déposez le fichier dans  public/images/boutique/
        (ex : public/images/boutique/tshirt-bio.jpg)
     2. Renseignez le nom du fichier dans le champ "image" ci-dessous
        (ex :  image: 'tshirt-bio.jpg')
     Tant que "image" vaut null, un joli placeholder s'affiche
     automatiquement à la place. Aucune image = aucun bug.

   ▶ Pour AJOUTER UN PRODUIT : copiez un bloc, changez l'id (unique).

   ▶ Catégories utilisées par les filtres : 'hauts', 'accessoires', 'pro'
   ========================================================= */

export const products = [
  {
    id: 'tshirt-bio',
    name: 'T-shirt coton bio',
    technique: 'sérigraphie',
    category: 'hauts',
    price: 12,
    priceLabel: 'à partir de',
    badge: 'Best-seller',
    image: null, // ex: 'tshirt-bio.jpg'
    placeholder: { color: '#3a2e27', shape: 'tshirt' }
  },
  {
    id: 'sweat-capuche',
    name: 'Sweat à capuche',
    technique: 'flocage',
    category: 'hauts',
    price: 29,
    priceLabel: 'à partir de',
    badge: null,
    image: null,
    placeholder: { color: '#7c8b5a', shape: 'hoodie' }
  },
  {
    id: 'polo-brode',
    name: 'Polo brodé',
    technique: 'broderie',
    category: 'hauts',
    price: 22,
    priceLabel: 'à partir de',
    badge: 'Broderie',
    image: null,
    placeholder: { color: '#e0a93b', shape: 'polo' }
  },
  {
    id: 'totebag',
    name: 'Totebag coton',
    technique: 'sérigraphie',
    category: 'accessoires',
    price: 8,
    priceLabel: 'à partir de',
    badge: null,
    image: null,
    placeholder: { color: '#b5482e', shape: 'bag' }
  },
  {
    id: 'casquette',
    name: 'Casquette',
    technique: 'broderie',
    category: 'accessoires',
    price: 14,
    priceLabel: 'à partir de',
    badge: null,
    image: null,
    placeholder: { color: '#3a2e27', shape: 'cap' }
  },
  {
    id: 'vetement-pro',
    name: 'Vêtement de travail',
    technique: 'sur mesure',
    category: 'pro',
    price: null, // null => affiché "sur devis"
    priceLabel: 'sur',
    badge: 'Pro',
    image: null,
    placeholder: { color: '#e0a93b', shape: 'tshirt' }
  },
  {
    id: 'sweat-col-rond',
    name: 'Sweat col rond',
    technique: 'flocage',
    category: 'hauts',
    price: 26,
    priceLabel: 'à partir de',
    badge: null,
    image: null,
    placeholder: { color: '#b5482e', shape: 'tshirt' }
  },
  {
    id: 'tapis-souris',
    name: 'Tapis de souris',
    technique: 'impression DTF',
    category: 'accessoires',
    price: 9,
    priceLabel: 'à partir de',
    badge: 'Éco',
    image: null,
    placeholder: { color: '#7c8b5a', shape: 'bag' }
  }
]

export const categories = [
  { key: 'all', label: 'Tout' },
  { key: 'hauts', label: 'Hauts' },
  { key: 'accessoires', label: 'Accessoires' },
  { key: 'pro', label: 'Pro' }
]
