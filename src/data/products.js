/* =========================================================
   PRODUITS DE LA BOUTIQUE
   ---------------------------------------------------------
   ▶ TECHNIQUES disponibles : 'flocage' | 'impression DTF'

   ▶ Pour AJOUTER UNE IMAGE à un produit :
     1. Déposez le fichier dans  public/images/boutique/
        (ex : public/images/boutique/tshirt-bio.jpg)
     2. Renseignez le nom du fichier dans le champ "image"
        (ex :  image: 'tshirt-bio.jpg')
     Tant que "image" vaut null, le placeholder SVG s'affiche.

   ▶ Pour AJOUTER UN PRODUIT : copiez un bloc, changez l'id.
   ========================================================= */

export const products = [
  {
    id: 'tshirt-bio',
    name: 'T-shirt "Jesus is king"',
    technique: 'flocage',
    category: 'hauts',
    price: 12,
    priceLabel: 'à partir de',
    badge: 'Best-seller',
    image: 't-shirt-1.jpg',
    placeholder: { color: '#3a2e27', shape: 'tshirt' },
    description: 'Notre t-shirt en coton biologique est la pièce de base idéale. Le flocage vinyle ou flex s\'accroche parfaitement sur cette matière, pour un rendu net et durable, lavage après lavage.',
    details: [
      '100 % coton biologique certifié GOTS',
      'Grammage 185 g/m²',
      'Col rond côtelé, coutures renforcées',
      'Coupe régulière, tailles XS à 3XL',
      'Résistant à 40 °C en machine'
    ],
    techniques: ['flocage', 'impression DTF'],
    minQty: 1,
    delai: '5 à 8 jours ouvrés'
  },
  {
    id: 'tshirt',
    name: 'lion collection',
    technique: 'DTF',
    category: 'hauts',
    price: 29,
    priceLabel: 'à partir de',
    badge: null,
    image: 't-shirt-2.jpg',
    placeholder: { color: '#7c8b5a', shape: 'hoodie' },
    description: 'Un sweat hoodie épais et confortable, idéal pour les commandes d\'équipe. Le flocage vinyle s\'accroche parfaitement sur cette matière polaire et reste impeccable dans le temps.',
    details: [
      '80 % coton, 20 % polyester',
      'Grammage 320 g/m²',
      'Capuche à cordon, poche kangourou',
      'Tailles S à 3XL',
      'Lavage à 30 °C'
    ],
    techniques: ['flocage', 'impression DTF'],
    minQty: 1,
    delai: '6 à 10 jours ouvrés'
  },
  {
    id: 'polo',
    name: 'Polo',
    technique: 'flocage',
    category: 'hauts',
    price: 22,
    priceLabel: 'à partir de',
    badge: null,
    image: 't-shirt-3.jpg',
    placeholder: { color: '#e0a93b', shape: 'polo' },
    description: 'Le polo est un support élégant et sobre, parfait pour habiller vos équipes. Le flocage apporte un rendu propre, résistant et professionnel.',
    details: [
      '100 % coton piqué',
      'Grammage 220 g/m²',
      'Col 3 boutons, bandes d\'armures aux manches',
      'Tailles XS à 3XL',
      'Lavage à 40 °C'
    ],
    techniques: ['flocage', 'impression DTF'],
    minQty: 1,
    delai: '7 à 12 jours ouvrés'
  },
  {
    id: 'totebag',
    name: 'Totebag coton',
    technique: 'impression DTF',
    category: 'accessoires',
    price: 8,
    priceLabel: 'à partir de',
    badge: null,
    image: null,
    placeholder: { color: '#b5482e', shape: 'bag' },
    description: 'Le totebag en coton naturel est le cadeau publicitaire par excellence : utile, réutilisable, et vecteur de votre image à chaque sortie. L\'impression DTF permet de reproduire n\'importe quel visuel avec des couleurs vives.',
    details: [
      '100 % coton non traité',
      'Grammage 140 g/m²',
      'Anses longues pour port à l\'épaule',
      'Dimensions : 38 × 42 cm',
      'Lavage à 40 °C'
    ],
    techniques: ['impression DTF', 'flocage'],
    minQty: 1,
    delai: '4 à 7 jours ouvrés'
  },
  {
    id: 'casquette',
    name: 'Casquette',
    technique: 'flocage',
    category: 'accessoires',
    price: 14,
    priceLabel: 'à partir de',
    badge: null,
    image: null,
    placeholder: { color: '#3a2e27', shape: 'cap' },
    description: 'La casquette floquée donne un effet premium immédiat à votre identité. Idéale pour les équipes sportives, bars, restaurants ou marques lifestyle.',
    details: [
      '100 % coton twill',
      '6 panneaux, visière pré-courbée',
      'Fermeture réglable',
      'Taille unique ajustable',
      'Flocage sur le panneau avant ou le côté'
    ],
    techniques: ['flocage'],
    minQty: 1,
    delai: '7 à 10 jours ouvrés'
  },
  {
    id: 'vetement-pro',
    name: 'Vêtement de travail',
    technique: 'flocage',
    category: 'pro',
    price: null,
    priceLabel: 'sur',
    badge: 'Pro',
    image: null,
    placeholder: { color: '#e0a93b', shape: 'tshirt' },
    description: 'Pour habiller vos équipes au quotidien : vêtement de travail résistant, adapté à vos contraintes métier. Devis personnalisé selon le support, la technique et les quantités.',
    details: [
      'Support au choix : polo, veste, combinaison, tablier…',
      'Marquage recto et/ou verso possible',
      'Respect des normes de travail (EN ISO)',
      'Livraison en lot, par personne ou par service'
    ],
    techniques: ['flocage', 'impression DTF'],
    minQty: 5,
    delai: 'à préciser dans le devis'
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
    placeholder: { color: '#b5482e', shape: 'tshirt' },
    description: 'Le sweat col rond est une valeur sûre pour les séries d\'équipe. Plus sobre que le hoodie, il s\'adapte à tous les contextes. Le flocage velours ou flex apporte un effet visuel et tactile distinctif.',
    details: [
      '80 % coton, 20 % polyester',
      'Grammage 280 g/m²',
      'Col côtelé, manchettes et bande de basque assortis',
      'Tailles XS à 3XL',
      'Lavage à 40 °C'
    ],
    techniques: ['flocage', 'impression DTF'],
    minQty: 1,
    delai: '5 à 9 jours ouvrés'
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
    placeholder: { color: '#7c8b5a', shape: 'bag' },
    description: 'Un objet publicitaire qui s\'invite sur chaque bureau. L\'impression DTF permet de reproduire n\'importe quel visuel, même complexe, avec des couleurs vives et sans limite de nuances.',
    details: [
      'Surface en tissu microfibre, dessous antidérapant caoutchouc',
      'Dimensions standard : 22 × 18 cm',
      'Impression pleine surface possible',
      'Résistant aux frottements répétés',
      'Nettoyage à l\'eau froide'
    ],
    techniques: ['impression DTF'],
    minQty: 1,
    delai: '3 à 6 jours ouvrés'
  }
]

export const categories = [
  { key: 'all', label: 'Tout' },
  { key: 'hauts', label: 'Hauts' },
  { key: 'accessoires', label: 'Accessoires' },
  { key: 'pro', label: 'Pro' }
]

export const techniques = [
  { key: 'all', label: 'Toutes les techniques' },
  { key: 'flocage', label: 'Flocage' },
  { key: 'impression DTF', label: 'Impression DTF' }
]
