import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomeView from '@/views/HomeView.vue'

const routes = [
  /* ---------- Site public ---------- */
  { path: '/', name: 'home', component: HomeView },
  { path: '/boutique', name: 'boutique', component: () => import('@/views/BoutiqueView.vue') },
  { path: '/boutique/:id', name: 'product', component: () => import('@/views/ProductView.vue') },
  { path: '/personnalisation', name: 'personnalisation', component: () => import('@/views/PersonnalisationView.vue') },
  { path: '/panier', name: 'checkout', component: () => import('@/views/CheckoutView.vue') },
  {
    path: '/success',
    name: 'success',
    component: () => import('@/views/SuccessView.vue')
  },

  /* ---------- Connexion admin ---------- */
  { path: '/admin/login', name: 'admin-login', component: () => import('@/views/admin/AdminLoginView.vue') },

  /* ---------- Espace admin (protégé) ---------- */
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: { name: 'admin-dashboard' } },
      { path: 'dashboard', name: 'admin-dashboard', component: () => import('@/views/admin/AdminDashboardView.vue') },
      { path: 'boutique', name: 'admin-products', component: () => import('@/views/admin/AdminProductsView.vue') },
      { path: 'commandes', name: 'admin-orders', component: () => import('@/views/admin/AdminOrdersView.vue') },
      { path: 'devis', name: 'admin-quotes', component: () => import('@/views/admin/AdminQuotesView.vue') },
      { path: 'personnalisations', name: 'admin-custom', component: () => import('@/views/admin/AdminCustomView.vue') }
    ]
  },

  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to) {
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  }
})

// Garde de navigation : protège les routes /admin
router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuth) {
    return { name: 'admin-login', query: { redirect: to.fullPath } }
  }
  if (to.name === 'admin-login' && auth.isAuth) {
    return { name: 'admin-dashboard' }
  }
})

export default router
