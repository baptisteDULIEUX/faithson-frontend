<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import api from '@/services/api'
import GarmentIcon from '@/components/GarmentIcon.vue'

const route = useRoute()
const router = useRouter()
const cart = useCartStore()

const allProducts = ref([])
const loading = ref(true)
const qty = ref(1)
const selectedTechnique = ref(null)
const imgError = ref(false)
const added = ref(false)

onMounted(async () => {
  allProducts.value = await api.getProducts()
  loading.value = false
  const p = product.value
  if (!p) { router.push({ name: 'boutique' }); return }
  selectedTechnique.value = p.technique
})

const product = computed(() =>
  allProducts.value.find((p) => p.id === route.params.id) || null
)

const imgSrc = computed(() => {
  if (!product.value?.image) return null
  if (product.value.image.startsWith('/uploads/')) {
    return import.meta.env.VITE_API_URL.replace('/api', '') + product.value.image
  }
  return `/images/boutique/${product.value.image}`
})
const showImage = computed(() => imgSrc.value && !imgError.value)

const isQuoteOnly = computed(() => product.value?.price === null)

// 4 autres produits de la même catégorie
const related = computed(() => {
  if (!product.value) return []
  return allProducts.value
    .filter((p) => p.category === product.value.category && p.id !== product.value.id)
    .slice(0, 4)
})

function addToCart() {
  if (!product.value || isQuoteOnly.value) return
  cart.add({ ...product.value, technique: selectedTechnique.value }, qty.value)
  added.value = true
  setTimeout(() => (added.value = false), 2000)
}
</script>

<template>
  <section class="section" style="padding-top: 36px">
    <div class="wrap">

      <!-- fil d'Ariane -->
      <nav class="breadcrumb">
        <RouterLink to="/">Accueil</RouterLink>
        <span class="sep">›</span>
        <RouterLink to="/boutique">Boutique</RouterLink>
        <span class="sep">›</span>
        <span v-if="product">{{ product.name }}</span>
      </nav>

      <div v-if="loading" class="loading">Chargement…</div>

      <template v-else-if="product">
        <div class="product-grid">

          <!-- IMAGE / APERÇU -->
          <div class="visual">
            <div class="visual-inner">
              <span v-if="product.badge" class="ribbon">{{ product.badge }}</span>
              <img
                v-if="showImage"
                :src="imgSrc"
                :alt="product.name"
                class="photo"
                @error="imgError = true"
              />
              <div v-else class="ph-wrap">
                <GarmentIcon :shape="product.placeholder?.shape" :color="product.placeholder?.color" />
              </div>
            </div>
          </div>

          <!-- INFOS -->
          <div class="info">
            <p class="eyebrow">{{ product.category === 'hauts' ? 'Hauts' : product.category === 'accessoires' ? 'Accessoires' : 'Pro' }}</p>
            <h1 class="p-title">{{ product.name }}</h1>

            <div class="price-row">
              <span class="price-label">{{ product.priceLabel }}</span>
              <span class="price-main">{{ isQuoteOnly ? 'sur devis' : product.price + ' €' }}</span>
            </div>

            <p class="description">{{ product.description }}</p>

            <!-- technique -->
            <div class="field" v-if="product.techniques && product.techniques.length > 1">
              <label>Technique d'impression</label>
              <div class="seg">
                <button
                  v-for="t in product.techniques"
                  :key="t"
                  class="seg-btn"
                  :class="{ on: selectedTechnique === t }"
                  @click="selectedTechnique = t"
                >
                  {{ t }}
                </button>
              </div>
            </div>
            <div v-else class="technique-badge">
              <span class="tech-hand">{{ product.technique }}</span>
            </div>

            <!-- quantité -->
            <div class="field" v-if="!isQuoteOnly">
              <label>Quantité</label>
              <div class="qty-row">
                <button class="qty-btn" @click="qty = Math.max(product.minQty || 1, qty - 1)">−</button>
                <span class="qty-val">{{ qty }}</span>
                <button class="qty-btn" @click="qty++">+</button>
                <span class="qty-min" v-if="product.minQty > 1">min. {{ product.minQty }} pièces</span>
              </div>
            </div>

            <!-- CTA -->
            <div class="cta-row">
              <button
                v-if="!isQuoteOnly"
                class="btn btn-solid cta-main"
                :class="{ success: added }"
                @click="addToCart"
              >
                {{ added ? '✓ Ajouté au panier' : 'Ajouter au panier' }}
              </button>
              <RouterLink v-else class="btn btn-solid cta-main" to="/#devis">
                Demander un devis →
              </RouterLink>
              <RouterLink class="btn btn-out" to="/personnalisation">
                Personnaliser →
              </RouterLink>
            </div>

            <!-- méta -->
            <div class="meta-block">
              <div class="meta-row" v-if="product.delai">
                <span class="m-key">Délai</span>
                <span class="m-val">{{ product.delai }}</span>
              </div>
              <div class="meta-row">
                <span class="m-key">Quantité minimum</span>
                <span class="m-val">{{ product.minQty || 1 }} pièce{{ (product.minQty || 1) > 1 ? 's' : '' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- DÉTAILS -->
        <div class="details-grid">
          <div class="detail-card">
            <h2>Caractéristiques</h2>
            <ul>
              <li v-for="d in product.details" :key="d">{{ d }}</li>
            </ul>
          </div>
          <div class="detail-card">
            <h2>Techniques disponibles</h2>
            <div class="technique-list">
              <span v-for="t in product.techniques" :key="t" class="t-chip">{{ t }}</span>
            </div>
            <p class="detail-note">
              Vous ne savez pas quelle technique choisir ? On vous conseille gratuitement dans le devis.
            </p>
          </div>
          <div class="detail-card">
            <h2>Fichier à fournir</h2>
            <ul>
              <li>Vectoriel .ai ou .svg (idéal)</li>
              <li>.png haute résolution (min. 300 dpi)</li>
              <li>Si aucun fichier : on vous aide à créer un visuel simple</li>
            </ul>
            <RouterLink to="/personnalisation" class="link-arrow">
              Tester le configurateur →
            </RouterLink>
          </div>
        </div>

        <!-- PRODUITS SIMILAIRES -->
        <div v-if="related.length" class="related">
          <h2 class="related-title">Dans la même catégorie</h2>
          <div class="related-grid">
            <RouterLink
              v-for="r in related"
              :key="r.id"
              :to="`/boutique/${r.id}`"
              class="rel-card"
            >
              <div class="rel-thumb">
                <img
                  v-if="r.image"
                  :src="`/images/boutique/${r.image}`"
                  :alt="r.name"
                  class="photo"
                />
                <div v-else class="ph-wrap small">
                  <GarmentIcon :shape="r.placeholder?.shape" :color="r.placeholder?.color" />
                </div>
              </div>
              <div class="rel-body">
                <span class="rel-name">{{ r.name }}</span>
                <span class="rel-tech">{{ r.technique }}</span>
                <span class="rel-price">{{ r.price == null ? 'sur devis' : 'dès ' + r.price + ' €' }}</span>
              </div>
            </RouterLink>
          </div>
        </div>
      </template>

      <div v-else class="not-found">
        <p>Produit introuvable.</p>
        <RouterLink class="btn btn-solid" to="/boutique">Retour à la boutique</RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.breadcrumb { display: flex; align-items: center; gap: 6px; font-size: 0.85rem; color: var(--ink-soft); margin-bottom: 28px; flex-wrap: wrap; }
.breadcrumb a:hover { color: var(--brick); }
.sep { opacity: 0.5; }

.loading { padding: 60px 0; text-align: center; font-family: 'Caveat', cursive; font-size: 1.5rem; color: var(--ink-soft); }
.not-found { padding: 60px 0; text-align: center; }
.not-found p { margin-bottom: 16px; color: var(--ink-soft); }

/* layout principal */
.product-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 52px; align-items: start; margin-bottom: 40px; }

/* visuel */
.visual-inner { position: relative; background: var(--cream-2); border: 1.5px solid var(--line); border-radius: 14px; aspect-ratio: 1 / 1; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.photo { width: 100%; height: 100%; object-fit: cover; }
.ph-wrap { display: flex; align-items: center; justify-content: center; width: 56%; }
.ph-wrap :deep(svg) { width: 100%; }
.ribbon { position: absolute; top: 14px; left: 14px; background: var(--sage); color: var(--cream); font-size: 0.7rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; padding: 0.35em 0.8em; border-radius: 4px; z-index: 2; }

/* infos */
.p-title { font-size: clamp(1.8rem, 4vw, 2.6rem); font-weight: 900; margin-top: 6px; line-height: 1.05; }
.price-row { display: flex; align-items: baseline; gap: 8px; margin: 14px 0 16px; }
.price-label { font-size: 0.85rem; color: var(--ink-soft); }
.price-main { font-family: 'Fraunces', serif; font-weight: 900; font-size: 2rem; color: var(--brick); }
.description { color: var(--ink-soft); line-height: 1.7; font-size: 1rem; margin-bottom: 20px; }

/* technique */
.field { margin-bottom: 18px; }
.field > label { display: block; font-weight: 700; font-size: 0.82rem; margin-bottom: 8px; }
.seg { display: flex; gap: 8px; flex-wrap: wrap; }
.seg-btn { border: 1.5px solid var(--line); background: var(--cream); border-radius: 6px; padding: 0.45em 0.9em; font-family: 'Karla', sans-serif; font-weight: 700; font-size: 0.85rem; cursor: pointer; transition: 0.15s; }
.seg-btn.on { background: var(--ink); color: var(--cream); border-color: var(--ink); }
.technique-badge { margin-bottom: 18px; }
.tech-hand { font-family: 'Caveat', cursive; font-weight: 700; color: var(--sage); font-size: 1.35rem; }

/* quantité */
.qty-row { display: flex; align-items: center; gap: 10px; }
.qty-btn { width: 36px; height: 36px; border: 1.5px solid var(--line); background: var(--cream); border-radius: 8px; font-size: 1.1rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.qty-btn:hover { border-color: var(--ink); }
.qty-val { min-width: 32px; text-align: center; font-family: 'Fraunces', serif; font-weight: 900; font-size: 1.2rem; }
.qty-min { font-size: 0.8rem; color: var(--ink-soft); }

/* CTA */
.cta-row { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 22px; }
.cta-main { flex: 1; min-width: 200px; justify-content: center; font-size: 1rem; padding: 1em 1.5em; transition: 0.18s; }
.cta-main.success { background: var(--sage); }

/* méta */
.meta-block { background: var(--cream-2); border: 1.5px solid var(--line); border-radius: 10px; padding: 16px 20px; }
.meta-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed var(--line); font-size: 0.9rem; }
.meta-row:last-child { border-bottom: none; }
.m-key { color: var(--ink-soft); font-weight: 700; }
.m-val { font-family: 'Fraunces', serif; font-weight: 600; }

/* détails */
.details-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; margin: 40px 0; }
.detail-card { background: var(--cream-2); border: 1.5px solid var(--line); border-radius: 12px; padding: 24px; }
.detail-card h2 { font-size: 1.15rem; font-weight: 900; margin-bottom: 14px; }
.detail-card ul { list-style: none; display: flex; flex-direction: column; gap: 8px; }
.detail-card ul li { font-size: 0.9rem; color: var(--ink-soft); display: flex; gap: 8px; }
.detail-card ul li::before { content: '✓'; color: var(--sage); font-weight: 700; flex-shrink: 0; }
.technique-list { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
.t-chip { border: 1.5px solid var(--line); border-radius: 100px; padding: 0.3em 0.8em; font-size: 0.82rem; font-weight: 700; background: var(--cream); }
.detail-note { font-size: 0.85rem; color: var(--ink-soft); font-style: italic; }
.link-arrow { display: inline-block; margin-top: 14px; font-weight: 700; font-size: 0.88rem; color: var(--brick); }
.link-arrow:hover { text-decoration: underline; }

/* produits liés */
.related { margin-bottom: 20px; }
.related-title { font-size: 1.5rem; font-weight: 900; margin-bottom: 20px; }
.related-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.rel-card { background: var(--cream); border: 1.5px solid var(--line); border-radius: 10px; overflow: hidden; display: flex; flex-direction: column; transition: 0.18s; text-decoration: none; color: inherit; }
.rel-card:hover { transform: translateY(-4px); box-shadow: 0 20px 36px -22px #3a2e2777; }
.rel-thumb { aspect-ratio: 1/1; background: var(--cream-2); display: flex; align-items: center; justify-content: center; overflow: hidden; }
.rel-thumb .photo { width: 100%; height: 100%; object-fit: cover; }
.rel-thumb .ph-wrap.small { width: 52%; }
.rel-thumb .ph-wrap.small :deep(svg) { width: 100%; }
.rel-body { padding: 12px 14px; display: flex; flex-direction: column; gap: 3px; }
.rel-name { font-family: 'Fraunces', serif; font-weight: 700; font-size: 1rem; }
.rel-tech { font-family: 'Caveat', cursive; font-weight: 700; color: var(--sage); font-size: 1rem; }
.rel-price { font-family: 'Fraunces', serif; font-weight: 900; color: var(--brick); font-size: 0.95rem; margin-top: 4px; }

@media (max-width: 900px) { .product-grid { grid-template-columns: 1fr; gap: 30px; } .details-grid { grid-template-columns: 1fr; } .related-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px) { .related-grid { grid-template-columns: 1fr 1fr; } .cta-row { flex-direction: column; } }
</style>
