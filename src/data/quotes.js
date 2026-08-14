/* =========================================================
   DEVIS (données de démonstration)
   Statuts : 'nouveau' | 'envoye' | 'accepte' | 'refuse'
   ========================================================= */

export const quotes = [
  { id: 'DEVIS-204', date: '2026-08-09', client: 'Club de Rugby des Coteaux', email: 'club@rugbycoteaux.fr', product: 'Maillots numérotés', technique: 'flocage', qty: 60, note: '60 maillots numérotés, dos + poitrine', status: 'nouveau', amount: null },
  { id: 'DEVIS-203', date: '2026-08-08', client: 'Boulangerie Lévy', email: 'contact@boulangerie-levy.fr', product: 'Tabliers + casquettes', technique: 'broderie', qty: 18, note: '12 tabliers + 6 casquettes avec logo', status: 'nouveau', amount: null },
  { id: 'DEVIS-202', date: '2026-08-08', client: 'Festival Les Estivales', email: 'contact@estivales.fr', product: 'T-shirts staff', technique: 'sérigraphie', qty: 150, note: '150 t-shirts 2 couleurs, logo devant', status: 'envoye', amount: 1650 },
  { id: 'DEVIS-201', date: '2026-08-05', client: 'Startup Nuage', email: 'hello@nuage.io', product: 'Hoodies équipe', technique: 'broderie', qty: 25, note: 'onboarding, broderie discrète cœur', status: 'envoye', amount: 725 },
  { id: 'DEVIS-200', date: '2026-08-01', client: 'Yoga Studio Zen', email: 'contact@zenstudio.fr', product: 'Totebags', technique: 'sérigraphie', qty: 40, note: 'cadeaux clients', status: 'accepte', amount: 300 },
  { id: 'DEVIS-199', date: '2026-07-26', client: 'Mairie de Villebois', email: 'com@villebois.fr', product: 'Gilets événement', technique: 'flocage', qty: 80, note: 'forum des associations', status: 'refuse', amount: 960 }
]

export const quoteStatusLabels = {
  nouveau: 'Nouveau',
  envoye: 'Devis envoyé',
  accepte: 'Accepté',
  refuse: 'Refusé'
}
