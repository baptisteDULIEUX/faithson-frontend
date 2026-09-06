<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import { categories, techniques } from '@/data/products'
import GarmentIcon from '@/components/GarmentIcon.vue'
import { useCartStore } from '@/stores/cart'

const router = useRouter()
const cart = useCartStore()

const allProducts = ref([])
const loading = ref(true)

// filtres
const activeCat = ref('all')
const activeTech = ref('all')
const priceMin = ref('')
const priceMax = ref('')
const sortBy = ref('default')
const showFilters = ref(false)

const sortOptions = [
  { key: 'default', label: 'Par défaut' },
  { key: 'price-asc', label: 'Prix croissant' },
  { key: 'price-desc', label: 'Prix décroissant' },
  { key: 'name-asc', label: 'Nom A → Z' }
]

onMounted(async () => {
  allProducts.value = await api.getProducts()
  loading.value = false
})

// prix max dynamique (hors produits sur devis)
const priceRange = computed(() => {
  const prices = allProducts.value.filter((p) => p.price !== null).map((p) => p.price)
  return { min: Math.min(...prices, 0), max: Math.max(...prices, 100) }
})

// produits filtrés + triés
const filtered = computed(() => {
  let list = allProducts.value

  if (activeCat.value !== 'all') list = list.filter((p) => p.category === activeCat.value)
  if (activeTech.value !== 'all') list = list.filter((p) => p.technique === activeTech.value)

  const min = Number(priceMin.value) || null
  const max = Number(priceMax.value) || null
  if (min !== null) list = list.filter((p) => p.price === null || p.price >= min)
  if (max !== null) list = list.filter((p) => p.price === null || p.price <= max)

  if (sortBy.value === 'price-asc') list = [...list].sort((a, b) => (a.price ?? 9999) - (b.price ?? 9999))
  else if (sortBy.value === 'price-desc') list = [...list].sort((a, b) => (b.price ?? -1) - (a.price ?? -1))
  else if (sortBy.value === 'name-asc') list = [...list].sort((a, b) => a.name.localeCompare(b.name, 'fr'))

  return list
})

const activeFilterCount = computed(() => {
  let n = 0
  if (activeCat.value !== 'all') n++
  if (activeTech.value !== 'all') n++
  if (priceMin.value) n++
  if (priceMax.value) n++
  return n
})

function resetFilters() {
  activeCat.value = 'all'
  activeTech.value = 'all'
  priceMin.value = ''
  priceMax.value = ''
  sortBy.value = 'default'
}

function goToProduct(id) {
  router.push({ name: 'product', params: { id } })
}

function addToCart(p) {
  if (p.price === null) {
    router.push('/#devis')
  } else {
    cart.add(p, 1)
  }
}
</script>

<template>
  <section class="section">
    <div class="wrap">

      <!-- En-tête boutique -->
      <div class="shop-top">
        <div>
          <p class="eyebrow">La boutique</p>
          <h1 class="shop-title">Tous nos supports</h1>
        </div>
        <div class="shop-controls">
          <button class="filter-toggle" @click="showFilters = !showFilters">
            <span>Filtres</span>
            <span v-if="activeFilterCount" class="filter-count">{{ activeFilterCount }}</span>
            <span class="arrow" :class="{ open: showFilters }">▾</span>
          </button>
          <select class="sort-select" v-model="sortBy">
            <option v-for="o in sortOptions" :key="o.key" :value="o.key">{{ o.label }}</option>
          </select>
        </div>
      </div>

      <!-- Panneau de filtres -->
      <div class="filter-panel" :class="{ open: showFilters }">
        <div class="filter-body">
          <!-- Catégories -->
          <div class="filter-group">
            <p class="filter-label">Catégorie</p>
            <div class="pills">
              <button
                  v-for="c in categories"
                  :key="c.key"
                  class="pill"
                  :class="{ on: activeCat === c.key }"
                  @click="activeCat = c.key"
              >{{ c.label }}</button>
            </div>
          </div>

          <!-- Techniques -->
          <div class="filter-group">
            <p class="filter-label">Technique</p>
            <div class="pills">
              <button
                  v-for="t in techniques"
                  :key="t.key"
                  class="pill"
                  :class="{ on: activeTech === t.key }"
                  @click="activeTech = t.key"
              >{{ t.label }}</button>
            </div>
          </div>

          <!-- Prix -->
          <div class="filter-group">
            <p class="filter-label">Prix (€)</p>
            <div class="price-inputs">
              <div class="price-field">
                <label>Min</label>
                <input type="number" v-model="priceMin" :placeholder="priceRange.min" min="0" />
              </div>
              <span class="price-sep">—</span>
              <div class="price-field">
                <label>Max</label>
                <input type="number" v-model="priceMax" :placeholder="priceRange.max" min="0" />
              </div>
            </div>
          </div>

          <!-- Reset -->
          <button
              v-if="activeFilterCount"
              class="reset-btn"
              @click="resetFilters"
          >Réinitialiser ({{ activeFilterCount }})</button>
        </div>
      </div>

      <!-- Résultats -->
      <div class="results-bar">
        <span class="results-count">{{ filtered.length }} produit{{ filtered.length > 1 ? 's' : '' }}</span>
        <!-- tags actifs -->
        <div class="active-tags">
          <span v-if="activeCat !== 'all'" class="tag" @click="activeCat = 'all'">
            {{ categories.find(c => c.key === activeCat)?.label }} ×
          </span>
          <span v-if="activeTech !== 'all'" class="tag" @click="activeTech = 'all'">
            {{ activeTech }} ×
          </span>
          <span v-if="priceMin" class="tag" @click="priceMin = ''">min {{ priceMin }} € ×</span>
          <span v-if="priceMax" class="tag" @click="priceMax = ''">max {{ priceMax }} € ×</span>
        </div>
      </div>

      <!-- Chargement -->
      <div v-if="loading" class="loading">Chargement des produits…</div>

      <!-- Grille -->
      <div v-else-if="filtered.length" class="grid">
        <article
            v-for="p in filtered"
            :key="p.id"
            class="card"
        >
          <!-- Zone cliquable dédiée pour la redirection vers la fiche produit -->
          <div class="card-clickable-area" @click="goToProduct(p.id)">
            <div class="thumb">
              <span v-if="p.badge" class="ribbon">{{ p.badge }}</span>
              <img
                  v-if="p.image"
                  :src="`/images/boutique/${p.image}`"
                  :alt="p.name"
                  class="photo"
              />
              <div v-else class="ph-shape">
                <GarmentIcon :shape="p.placeholder?.shape" :color="p.placeholder?.color" />
              </div>
            </div>
            <div class="body">
              <h2>{{ p.name }}</h2>
              <span class="tech">{{ p.technique }}</span>
              <div class="foot">
                <span class="from">{{ p.priceLabel }}</span>
                <span class="price">{{ p.price === null ? 'devis' : p.price + ' €' }}</span>
              </div>
            </div>
          </div>

          <!-- Bouton d'action sorti du conteneur de navigation globale -->
          <div class="card-actions">
            <button
                class="qv"
                @click="addToCart(p)"
            >
              {{ p.price === null ? 'Demander un devis →' : 'Ajouter au panier →' }}
            </button>
          </div>
        </article>
      </div>

      <!-- Vide -->
      <div v-else class="empty">
        <p>Aucun produit ne correspond à vos filtres.</p>
        <button class="btn btn-out" @click="resetFilters">Réinitialiser les filtres</button>
      </div>

    </div>
  </section>
</template>

<style scoped>
.shop-top { display: flex; justify-content: space-between; align-items: flex-end; gap: 20px; flex-wrap: wrap; margin-bottom: 18px; }
.shop-title { font-size: clamp(1.8rem, 4vw, 2.6rem); font-weight: 900; margin-top: 4px; }
.shop-controls { display: flex; align-items: center; gap: 10px; }

.filter-toggle {
  display: flex; align-items: center; gap: 8px;
  border: 1.5px solid var(--line); border-radius: 8px; background: var(--cream);
  padding: 0.6em 1em; font-family: 'Karla', sans-serif; font-weight: 700; font-size: 0.9rem;
  cursor: pointer; transition: 0.15s;
}
.filter-toggle:hover { border-color: var(--ink); }
.filter-count { background: var(--brick); color: var(--cream); border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 0.72rem; }
.arrow { transition: 0.2s; display: inline-block; }
.arrow.open { transform: rotate(180deg); }

.sort-select { border: 1.5px solid var(--line); border-radius: 8px; background: var(--cream); padding: 0.6em 0.9em; font-family: 'Karla', sans-serif; font-weight: 700; font-size: 0.9rem; cursor: pointer; color: var(--ink); }

/* panneau filtres */
.filter-panel { overflow: hidden; max-height: 0; transition: max-height 0.3s ease; }
.filter-panel.open { max-height: 600px; }
.filter-body {
  display: grid; grid-template-columns: 1fr 1fr 1fr auto; gap: 20px; align-items: start;
  background: var(--cream-2); border: 1.5px solid var(--line); border-radius: 12px;
  padding: 22px 24px; margin-bottom: 18px;
}
.filter-label { font-size: 0.78rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: var(--sage); margin-bottom: 10px; }
.pills { display: flex; flex-wrap: wrap; gap: 7px; }
.pill { border: 1.5px solid var(--line); background: var(--cream); border-radius: 100px; padding: 0.35em 0.85em; font-family: 'Karla', sans-serif; font-weight: 700; font-size: 0.82rem; cursor: pointer; transition: 0.15s; }
.pill.on, .pill:hover { background: var(--ink); color: var(--cream); border-color: var(--ink); }
.price-inputs { display: flex; align-items: center; gap: 10px; }
.price-field { display: flex; flex-direction: column; gap: 5px; }
.price-field label { font-size: 0.72rem; font-weight: 700; color: var(--ink-soft); }
.price-field input { width: 90px; padding: 0.55em 0.7em; border: 1.5px solid var(--line); border-radius: 7px; font-family: 'Karla', sans-serif; font-size: 0.9rem; background: var(--cream); color: var(--ink); }
.price-field input:focus { outline: none; border-color: var(--brick); }
.price-sep { color: var(--ink-soft); margin-top: 18px; }
.reset-btn { align-self: flex-end; border: 1.5px dashed var(--brick); background: none; color: var(--brick); border-radius: 8px; padding: 0.55em 0.9em; font-family: 'Karla', sans-serif; font-weight: 700; font-size: 0.82rem; cursor: pointer; white-space: nowrap; transition: 0.15s; }
.reset-btn:hover { background: #f7ddd5; }

/* barre résultats */
.results-bar { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 20px; }
.results-count { font-size: 0.9rem; color: var(--ink-soft); font-weight: 700; }
.active-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.tag { background: var(--cream-2); border: 1.5px solid var(--line); border-radius: 100px; padding: 0.2em 0.75em; font-size: 0.78rem; font-weight: 700; cursor: pointer; transition: 0.12s; }
.tag:hover { border-color: var(--brick); color: var(--brick); }

/* grille produits */
.grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px; }
.card { background: var(--cream); border: 1.5px solid var(--line); border-radius: var(--radius, 10px); overflow: hidden; transition: 0.2s; display: flex; flex-direction: column; }
.card:hover { transform: translateY(-5px); box-shadow: 0 26px 44px -28px #3a2e2788; }
.card:hover .qv { opacity: 1; transform: translateY(0); }
.card-clickable-area { display: flex; flex-direction: column; flex: 1; cursor: pointer; }
.thumb { aspect-ratio: 1/1; display: flex; align-items: center; justify-content: center; position: relative; background: var(--cream-2); }
.thumb :deep(svg) { width: 54%; }
.photo { width: 100%; height: 100%; object-fit: cover; }
.ribbon { position: absolute; top: 12px; left: 12px; background: var(--sage); color: var(--cream); font-size: 0.64rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; padding: 0.35em 0.7em; border-radius: 3px; }
.card-actions { padding: 0 16px 16px 16px; }
.qv { width: 100%; background: var(--ink); color: var(--cream); border: none; border-radius: 7px; padding: 0.7em; font-family: 'Karla', sans-serif; font-weight: 700; font-size: 0.85rem; cursor: pointer; transition: 0.18s; }
.body { padding: 16px 18px; flex: 1; display: flex; flex-direction: column; }
.body h2 { font-size: 1.1rem; font-weight: 700; }
.tech { font-family: 'Caveat', cursive; font-weight: 700; color: var(--sage); font-size: 1.15rem; margin-top: 2px; }
.foot { display: flex; justify-content: space-between; align-items: baseline; margin-top: auto; padding-top: 10px; }
.price { font-family: 'Fraunces', serif; font-weight: 900; color: var(--brick); font-size: 1.1rem; }
.from { font-size: 0.72rem; color: var(--ink-soft); }

.loading, .empty { padding: 60px 0; text-align: center; color: var(--ink-soft); }
.loading { font-family: 'Caveat', cursive; font-size: 1.5rem; }
.empty p { margin-bottom: 16px; }

@media (max-width: 1000px) { .filter-body { grid-template-columns: 1fr 1fr; } }
@media (max-width: 900px) { .grid { grid-template-columns: repeat(2, 1fr); } .filter-body { grid-template-columns: 1fr; } }
@media (max-width: 560px) { .grid { grid-template-columns: repeat(2, 1fr); } .sort-select { font-size: 0.8rem; padding: 0.5em 0.6em; } }
</style>