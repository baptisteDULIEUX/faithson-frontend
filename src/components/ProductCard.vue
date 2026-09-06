<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import GarmentIcon from './GarmentIcon.vue'

const props = defineProps({
  product: { type: Object, required: true }
})

const cart = useCartStore()
const router = useRouter()
const imgError = ref(false)

const imgSrc = computed(() =>
  props.product.image ? `/images/boutique/${props.product.image}` : null
)
const showImage = computed(() => imgSrc.value && !imgError.value)
const isQuoteOnly = computed(() => props.product.price === null)

function goToDetail(e) {
  router.push({ name: 'product', params: { id: props.product.id } })
}
function handleCartClick(e) {
  e.stopPropagation()
  if (isQuoteOnly.value) {
    window.location.href = '/#devis'
  } else {
    cart.add(props.product, 1)
  }
}
</script>

<template>
  <article class="card" @click="goToDetail">
    <div class="thumb">
      <span v-if="product.badge" class="ribbon">{{ product.badge }}</span>
      <img
        v-if="showImage"
        :src="imgSrc"
        :alt="product.name"
        class="photo"
        @error="imgError = true"
      />
      <div v-else class="ph-shape">
        <GarmentIcon :shape="product.placeholder?.shape" :color="product.placeholder?.color" />
      </div>
      <button class="qv" @click="handleCartClick">
        {{ isQuoteOnly ? 'Demander un devis →' : 'Ajouter au panier →' }}
      </button>
    </div>
    <div class="body">
      <h3>{{ product.name }}</h3>
      <span class="tech">{{ product.technique }}</span>
      <div class="foot">
        <span class="from">{{ product.priceLabel }}</span>
        <span class="price">{{ isQuoteOnly ? 'devis' : product.price + ' €' }}</span>
      </div>
    </div>
  </article>
</template>

<style scoped>
.card { background: var(--cream); border: 1.5px solid var(--line); border-radius: var(--radius, 10px); overflow: hidden; transition: 0.2s; display: flex; flex-direction: column; cursor: pointer; }
.card:hover { transform: translateY(-5px); box-shadow: 0 26px 44px -28px #3a2e2788; }
.card:hover .qv { opacity: 1; transform: translateY(0); }
.thumb { aspect-ratio: 1/1; display: flex; align-items: center; justify-content: center; position: relative; background: var(--cream-2); }
.thumb :deep(svg) { width: 54%; }
.photo { width: 100%; height: 100%; object-fit: cover; }
.ribbon { position: absolute; top: 12px; left: 12px; z-index: 2; background: var(--sage); color: var(--cream); font-size: 0.64rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; padding: 0.35em 0.7em; border-radius: 3px; }
.qv { position: absolute; bottom: 12px; left: 12px; right: 12px; z-index: 2; background: var(--ink); color: var(--cream); border: none; border-radius: 7px; padding: 0.7em; font-family: 'Karla', sans-serif; font-weight: 700; font-size: 0.85rem; cursor: pointer; opacity: 0; transform: translateY(8px); transition: 0.18s; }
.body { padding: 16px 18px; flex: 1; display: flex; flex-direction: column; }
.body h3 { font-size: 1.2rem; }
.tech { font-family: 'Caveat', cursive; font-weight: 700; color: var(--sage); font-size: 1.2rem; margin-top: 2px; }
.foot { display: flex; justify-content: space-between; align-items: baseline; margin-top: auto; padding-top: 12px; }
.price { font-family: 'Fraunces', serif; font-weight: 900; color: var(--brick); font-size: 1.15rem; }
.from { font-size: 0.72rem; color: var(--ink-soft); }
</style>
