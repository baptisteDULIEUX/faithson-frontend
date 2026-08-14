<script setup>
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import GarmentIcon from './GarmentIcon.vue'

const cart = useCartStore()
const router = useRouter()

function goCheckout() {
  cart.close()
  router.push('/panier')
}
</script>

<template>
  <div>
    <div class="overlay" :class="{ show: cart.isOpen }" @click="cart.close()"></div>

    <aside class="drawer" :class="{ show: cart.isOpen }" aria-label="Panier">
      <div class="dr-head">
        <h2>Votre panier</h2>
        <button class="close" @click="cart.close()" aria-label="Fermer">✕</button>
      </div>

      <div v-if="cart.isEmpty" class="empty">
        <p class="big">Votre panier est vide</p>
        <p class="sub">Ajoutez un article depuis la boutique pour commencer.</p>
        <RouterLink class="btn btn-solid" to="/boutique" @click="cart.close()">Voir la boutique</RouterLink>
      </div>

      <template v-else>
        <div class="lines">
          <div class="line" v-for="(item, i) in cart.items" :key="i">
            <div class="mini">
              <img v-if="item.image" :src="`/images/boutique/${item.image}`" :alt="item.name" />
              <GarmentIcon v-else shape="tshirt" color="#3a2e27" />
            </div>
            <div class="info">
              <b>{{ item.name }}</b>
              <span v-if="item.technique" class="tech">{{ item.technique }}</span>
              <div class="qty">
                <button @click="cart.setQty(i, item.qty - 1)" aria-label="moins">−</button>
                <span>{{ item.qty }}</span>
                <button @click="cart.setQty(i, item.qty + 1)" aria-label="plus">+</button>
                <button class="rm" @click="cart.remove(i)">retirer</button>
              </div>
            </div>
            <div class="price">{{ item.price * item.qty }} €</div>
          </div>
        </div>

        <div class="dr-foot">
          <div class="sub-row">
            <span>Sous-total</span>
            <b>{{ cart.subtotal }} €</b>
          </div>
          <p class="ship">Livraison calculée à l'étape suivante</p>
          <button class="btn btn-solid full" @click="goCheckout">Passer au paiement →</button>
        </div>
      </template>
    </aside>
  </div>
</template>

<style scoped>
.overlay { position: fixed; inset: 0; background: #3a2e2766; opacity: 0; pointer-events: none; transition: 0.2s; z-index: 90; }
.overlay.show { opacity: 1; pointer-events: auto; }
.drawer {
  position: fixed; top: 0; right: 0; bottom: 0; width: min(400px, 92vw);
  background: var(--cream); border-left: 1.5px solid var(--line); transform: translateX(100%);
  transition: transform 0.25s; z-index: 100; display: flex; flex-direction: column;
  box-shadow: -20px 0 50px -20px #3a2e2755;
}
.drawer.show { transform: translateX(0); }
.dr-head { display: flex; align-items: center; padding: 20px 22px; border-bottom: 1.5px solid var(--line); }
.dr-head h2 { font-size: 1.3rem; font-weight: 900; }
.close { margin-left: auto; background: var(--cream-2); border: 1.5px solid var(--line); width: 34px; height: 34px; border-radius: 8px; cursor: pointer; }
.empty { padding: 50px 24px; text-align: center; }
.empty .big { font-family: 'Fraunces', serif; font-weight: 900; font-size: 1.2rem; }
.empty .sub { color: var(--ink-soft); margin: 8px 0 20px; }
.lines { flex: 1; overflow-y: auto; padding: 8px 0; }
.line { display: flex; gap: 12px; padding: 16px 22px; border-bottom: 1px dashed var(--line); }
.mini { width: 60px; height: 60px; border-radius: 8px; background: var(--cream-2); border: 1.5px solid var(--line); flex-shrink: 0; overflow: hidden; display: flex; align-items: center; justify-content: center; }
.mini img { width: 100%; height: 100%; object-fit: cover; }
.mini :deep(svg) { width: 60%; }
.info { flex: 1; }
.info b { font-family: 'Fraunces', serif; font-size: 0.98rem; }
.tech { display: block; font-family: 'Caveat', cursive; color: var(--sage); font-size: 1rem; }
.qty { display: flex; align-items: center; gap: 8px; margin-top: 8px; }
.qty button { width: 26px; height: 26px; border: 1.5px solid var(--line); background: var(--cream); border-radius: 6px; cursor: pointer; font-weight: 700; }
.qty .rm { width: auto; padding: 0 8px; font-size: 0.76rem; color: var(--brick); border: none; background: none; text-decoration: underline; }
.price { font-family: 'Fraunces', serif; font-weight: 900; color: var(--brick); }
.dr-foot { border-top: 1.5px solid var(--line); padding: 20px 22px; }
.sub-row { display: flex; justify-content: space-between; font-size: 1.1rem; margin-bottom: 4px; }
.sub-row b { font-family: 'Fraunces', serif; font-weight: 900; }
.ship { font-size: 0.8rem; color: var(--ink-soft); margin-bottom: 14px; }
.full { width: 100%; }
</style>
