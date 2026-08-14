/* =========================================================
   COUCHE API — point unique de communication avec le backend
   ---------------------------------------------------------
   Aujourd'hui : données LOCALES (src/data) + réponses simulées.
   Le backend Node.js n'existe pas encore.

   Un petit état en mémoire (seedé depuis src/data) permet aux
   actions de l'espace admin de "prendre effet" pendant la session
   (valider un devis, proposer un prix, etc.). Au rechargement de la
   page, on repart des données d'origine — c'est normal, il n'y a pas
   encore de base de données.

   Quand le backend existera : décommentez les appels `request(...)`,
   le reste de l'app ne change pas.
   ========================================================= */

import { products } from '@/data/products'
import { instagramPosts } from '@/data/instagram'
import { orders as seedOrders } from '@/data/orders'
import { quotes as seedQuotes } from '@/data/quotes'
import { customRequests as seedCustom } from '@/data/customRequests'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

/* ⚠️ DÉMO UNIQUEMENT — voir stores/auth.js.
   En production, JAMAIS de mot de passe dans le frontend :
   la vérification se fait côté serveur. */
const DEMO_ADMIN_PASSWORD = 'faithson2026'

// état en mémoire (clones pour ne pas modifier les fichiers source)
const state = {
  products: products.map((p) => ({ ...p })),
  orders: seedOrders.map((o) => ({ ...o })),
  quotes: seedQuotes.map((q) => ({ ...q })),
  custom: seedCustom.map((c) => ({ ...c }))
}
let customSeq = 59 // pour les nouveaux id PERSO-0xx

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  })
  if (!res.ok) throw new Error(`Erreur ${res.status} sur ${path}`)
  return res.status === 204 ? null : res.json()
}

const fakeDelay = (ms = 300) => new Promise((r) => setTimeout(r, ms))
const clone = (v) => JSON.parse(JSON.stringify(v))

export const api = {
  /* ---------- Vitrine / boutique ---------- */
  async getProducts() {
    // return request('/products')
    await fakeDelay()
    return clone(state.products)
  },

  /* ---------- Gestion boutique (admin) ---------- */
  async createProduct(product) {
    // return request('/admin/products', { method: 'POST', body: JSON.stringify(product) })
    await fakeDelay(250)
    const base = (product.id || product.name || 'produit')
      .toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    let id = base || 'produit'
    let n = 2
    while (state.products.some((p) => p.id === id)) id = `${base}-${n++}`
    const created = {
      id,
      name: product.name || 'Nouveau produit',
      technique: product.technique || 'sérigraphie',
      category: product.category || 'hauts',
      price: product.price ?? null,
      priceLabel: product.price == null ? 'sur' : 'à partir de',
      badge: product.badge || null,
      image: product.image || null,
      placeholder: product.placeholder || { color: '#3a2e27', shape: 'tshirt' }
    }
    state.products.push(created)
    return clone(created)
  },
  async updateProduct(id, patch) {
    // return request(`/admin/products/${id}`, { method: 'PATCH', body: JSON.stringify(patch) })
    await fakeDelay(250)
    const p = state.products.find((x) => x.id === id)
    if (p) {
      Object.assign(p, patch)
      p.priceLabel = p.price == null ? 'sur' : 'à partir de'
    }
    return clone(p)
  },
  async deleteProduct(id) {
    // return request(`/admin/products/${id}`, { method: 'DELETE' })
    await fakeDelay(200)
    const i = state.products.findIndex((x) => x.id === id)
    if (i !== -1) state.products.splice(i, 1)
    return { ok: true }
  },

  async getInstagramPosts() {
    // return request('/instagram')
    await fakeDelay()
    return instagramPosts
  },

  /* ---------- Commande / paiement client ---------- */
  async createOrder(payload) {
    // return request('/orders', { method: 'POST', body: JSON.stringify(payload) })
    await fakeDelay(700)
    return { ok: true, orderId: '#' + Math.floor(1000 + Math.random() * 9000), total: payload.total }
  },

  /* ---------- Devis (client) ---------- */
  async createQuote(payload) {
    // return request('/quotes', { method: 'POST', body: JSON.stringify(payload) })
    await fakeDelay(600)
    return { ok: true, quoteId: 'DEVIS-' + Math.floor(100 + Math.random() * 900) }
  },

  async subscribeNewsletter(email) {
    // return request('/newsletter', { method: 'POST', body: JSON.stringify({ email }) })
    await fakeDelay(400)
    return { ok: true, email }
  },

  /* ---------- Personnalisation (client) ---------- */
  async createCustomRequest(payload) {
    // return request('/custom-requests', { method: 'POST', body: JSON.stringify(payload) })
    await fakeDelay(600)
    const id = 'PERSO-0' + customSeq++
    state.custom.unshift({
      id,
      date: new Date().toISOString().slice(0, 10),
      status: 'en_attente',
      proposedPrice: null,
      ...payload
    })
    return { ok: true, requestId: id }
  },

  /* ================= ESPACE ADMIN ================= */
  async adminLogin(password) {
    // return request('/admin/login', { method: 'POST', body: JSON.stringify({ password }) })
    await fakeDelay(400)
    if (password !== DEMO_ADMIN_PASSWORD) throw new Error('unauthorized')
    return { ok: true, token: 'demo-token-' + Date.now() }
  },

  async getOrders() {
    // return request('/admin/orders')
    await fakeDelay()
    return clone(state.orders)
  },
  async updateOrderStatus(id, status) {
    // return request(`/admin/orders/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) })
    await fakeDelay(200)
    const o = state.orders.find((x) => x.id === id)
    if (o) o.status = status
    return clone(o)
  },

  async getQuotes() {
    // return request('/admin/quotes')
    await fakeDelay()
    return clone(state.quotes)
  },
  async updateQuote(id, patch) {
    // return request(`/admin/quotes/${id}`, { method: 'PATCH', body: JSON.stringify(patch) })
    await fakeDelay(250)
    const q = state.quotes.find((x) => x.id === id)
    if (q) Object.assign(q, patch)
    return clone(q)
  },

  async getCustomRequests() {
    // return request('/admin/custom-requests')
    await fakeDelay()
    return clone(state.custom)
  },
  async updateCustomRequest(id, patch) {
    // return request(`/admin/custom-requests/${id}`, { method: 'PATCH', body: JSON.stringify(patch) })
    await fakeDelay(250)
    const c = state.custom.find((x) => x.id === id)
    if (c) Object.assign(c, patch)
    return clone(c)
  }
}

export default api
