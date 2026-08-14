/* =========================================================
   DEMANDES DE PERSONNALISATION (vêtements pré-personnalisés)
   ---------------------------------------------------------
   Le client propose un vêtement avec SON logo et l'emplacement voulu.
   L'artisan VALIDE la demande et PROPOSE UN PRIX (comme un devis).
   Le client peut alors payer.

   Statuts :
     'en_attente' : reçue, à traiter par l'artisan
     'validee'    : validée + prix proposé, en attente de paiement client
     'payee'      : le client a payé (production peut démarrer)
     'refusee'    : demande refusée par l'atelier
   ========================================================= */

export const customRequests = [
  {
    id: 'PERSO-058',
    date: '2026-08-09',
    client: 'Café Lomé',
    email: 'contact@cafelome.fr',
    garment: 'T-shirt coton bio',
    garmentColor: 'Encre',
    technique: 'sérigraphie',
    placement: 'Poitrine gauche',
    qty: 15,
    logoName: 'logo-cafe-lome.png',
    note: 'Logo en une seule couleur (crème), assez petit sur le cœur.',
    status: 'en_attente',
    proposedPrice: null
  },
  {
    id: 'PERSO-057',
    date: '2026-08-08',
    client: 'Association Vélo Cité',
    email: 'hello@velocite.org',
    garment: 'Sweat à capuche',
    garmentColor: 'Sauge',
    technique: 'flocage',
    placement: 'Dos (grand format)',
    qty: 30,
    logoName: 'velocite-logo.svg',
    note: 'Grand logo dans le dos + petit devant si possible.',
    status: 'en_attente',
    proposedPrice: null
  },
  {
    id: 'PERSO-056',
    date: '2026-08-06',
    client: 'Studio Kombu',
    email: 'hello@kombu.fr',
    garment: 'Totebag coton',
    garmentColor: 'Naturel',
    technique: 'sérigraphie',
    placement: 'Centre',
    qty: 50,
    logoName: 'kombu-mark.png',
    note: 'Logo centré, encre brique.',
    status: 'validee',
    proposedPrice: 415
  },
  {
    id: 'PERSO-055',
    date: '2026-08-02',
    client: 'Barbershop Figaro',
    email: 'figaro@email.com',
    garment: 'Polo brodé',
    garmentColor: 'Encre',
    technique: 'broderie',
    placement: 'Poitrine gauche',
    qty: 6,
    logoName: 'figaro.svg',
    note: 'Broderie fil doré.',
    status: 'payee',
    proposedPrice: 168
  }
]

export const customStatusLabels = {
  en_attente: 'En attente',
  validee: 'Validée — à payer',
  payee: 'Payée',
  refusee: 'Refusée'
}

export const placements = [
  'Poitrine gauche',
  'Centre poitrine',
  'Dos (grand format)',
  'Manche',
  'Bas du dos'
]
