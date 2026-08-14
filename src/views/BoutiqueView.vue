<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'
import { categories } from '@/data/products'
import ProductCard from '@/components/ProductCard.vue'

const allProducts = ref([])
const loading = ref(true)
const activeCat = ref('all')

onMounted(async () => {
  allProducts.value = await api.getProducts()
  loading.value = false
})

const filtered = computed(() =>
  activeCat.value === 'all'
    ? allProducts.value
    : allProducts.value.filter((p) => p.category === activeCat.value)
)
</script>

<template>
  <section class="section">
    <div class="wrap">
      <div class="shop-head">
        <div class="sec-head no-mb">
          <p class="eyebrow">La boutique</p>
          <h2>Tous nos supports</h2>
        </div>
        <div class="filters">
          <button
            v-for="c in categories"
            :key="c.key"
            class="f"
            :class="{ on: activeCat === c.key }"
            @click="activeCat = c.key"
          >
            {{ c.label }}
          </button>
        </div>
      </div>

      <div v-if="loading" class="loading">Chargement des produits…</div>

      <div v-else class="grid">
        <ProductCard v-for="p in filtered" :key="p.id" :product="p" />
      </div>

      <div class="callout">
        <span class="tag">Note technique</span>
        <div>
          Le paiement en ligne est maquetté (interface complète, sans encaissement réel).
          Un vrai paiement passera par Stripe / PayPal côté backend Node.
          Pour les produits « sur devis », le bouton bascule vers la demande de devis.
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.shop-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 20px; flex-wrap: wrap; margin-bottom: 26px; }
.no-mb { margin-bottom: 0; }
.filters { display: flex; gap: 8px; flex-wrap: wrap; }
.f { border: 1.5px solid var(--line); background: var(--cream); border-radius: 100px; padding: 0.4em 0.95em; font-weight: 700; font-size: 0.85rem; cursor: pointer; transition: 0.15s; }
.f.on, .f:hover { background: var(--ink); color: var(--cream); border-color: var(--ink); }
.grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px; }
.loading { padding: 60px 0; text-align: center; color: var(--ink-soft); font-family: 'Caveat', cursive; font-size: 1.5rem; }
@media (max-width: 900px) { .grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 560px) { .grid { grid-template-columns: 1fr; } }
</style>
