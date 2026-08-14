/* =========================================================
   COMMANDES (données de démonstration)
   Utilisées par l'espace admin pour les statistiques.
   Statuts : 'nouvelle' | 'production' | 'prete' | 'livree' | 'annulee'
   Plus tard : remplacées par les vraies commandes du backend Node.
   ========================================================= */

export const orders = [
  { id: '#1047', date: '2026-08-09', client: 'Emma Rousseau', email: 'emma.r@email.com', product: 'T-shirt coton bio', technique: 'sérigraphie', qty: 20, amount: 240, status: 'nouvelle' },
  { id: '#1046', date: '2026-08-08', client: 'Studio Kombu', email: 'hello@kombu.fr', product: 'Sweat à capuche', technique: 'flocage', qty: 12, amount: 372, status: 'production' },
  { id: '#1045', date: '2026-08-07', client: "Association Solidar'Toit", email: 'contact@solidartoit.org', product: 'T-shirt', technique: 'sérigraphie', qty: 40, amount: 452, status: 'production' },
  { id: '#1044', date: '2026-08-06', client: 'Léo Marchand', email: 'leo.m@email.com', product: 'Polo brodé', technique: 'broderie', qty: 6, amount: 150, status: 'production' },
  { id: '#1043', date: '2026-08-05', client: 'Café des Sports', email: 'lecafe@email.com', product: 'Totebag', technique: 'sérigraphie', qty: 25, amount: 188, status: 'prete' },
  { id: '#1042', date: '2026-08-02', client: 'Team Roller Nancy', email: 'team@rollernancy.fr', product: 'Sweat col rond', technique: 'flocage', qty: 30, amount: 744, status: 'livree' },
  { id: '#1041', date: '2026-07-28', client: 'Boutique Fleur de Sel', email: 'contact@fleurdesel.fr', product: 'Totebag', technique: 'sérigraphie', qty: 50, amount: 375, status: 'livree' },
  { id: '#1040', date: '2026-07-22', client: 'Julie Ferrand', email: 'julie.f@email.com', product: 'T-shirt coton bio', technique: 'DTF', qty: 3, amount: 54, status: 'livree' },
  { id: '#1039', date: '2026-07-15', client: 'Club de Rugby des Coteaux', email: 'club@rugbycoteaux.fr', product: 'Sweat à capuche', technique: 'flocage', qty: 45, amount: 1305, status: 'livree' },
  { id: '#1038', date: '2026-07-08', client: 'Bar Le Zinc', email: 'lezinc@email.com', product: 'Polo brodé', technique: 'broderie', qty: 8, amount: 200, status: 'livree' },
  { id: '#1037', date: '2026-06-30', client: 'Festival Les Estivales', email: 'contact@estivales.fr', product: 'T-shirt', technique: 'sérigraphie', qty: 120, amount: 1320, status: 'livree' },
  { id: '#1036', date: '2026-06-24', client: 'Marc Delaunay', email: 'marc.d@email.com', product: 'Casquette', technique: 'broderie', qty: 10, amount: 140, status: 'annulee' },
  { id: '#1035', date: '2026-06-18', client: 'École Montessori', email: 'ecole@montessori-x.fr', product: 'Totebag', technique: 'sérigraphie', qty: 60, amount: 450, status: 'livree' },
  { id: '#1034', date: '2026-06-10', client: 'Salle CrossPark', email: 'hello@crosspark.fr', product: 'Sweat col rond', technique: 'flocage', qty: 24, amount: 600, status: 'livree' },
  { id: '#1033', date: '2026-05-27', client: 'Nadia Cherif', email: 'nadia.c@email.com', product: 'T-shirt coton bio', technique: 'DTF', qty: 5, amount: 90, status: 'livree' },
  { id: '#1032', date: '2026-05-14', client: 'Brasserie du Port', email: 'contact@brasserieduport.fr', product: 'Polo brodé', technique: 'broderie', qty: 15, amount: 375, status: 'livree' }
]

export const orderStatusLabels = {
  nouvelle: 'Nouvelle',
  production: 'En production',
  prete: 'Prête',
  livree: 'Livrée',
  annulee: 'Annulée'
}
