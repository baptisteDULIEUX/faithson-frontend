<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()
const menuOpen = ref(false)
</script>

<template>
  <header>
    <div class="wrap">
      <nav>
        <RouterLink class="logo" to="/">
          <span class="mk">F</span>Faithson <b>Custom</b>
        </RouterLink>

        <div class="nav-links" :class="{ open: menuOpen }">
          <RouterLink to="/boutique" @click="menuOpen = false">Boutique</RouterLink>
          <RouterLink to="/#savoir" @click="menuOpen = false">Savoir-faire</RouterLink>
          <RouterLink to="/personnalisation" @click="menuOpen = false">Personnaliser</RouterLink>
          <RouterLink to="/#realisations" @click="menuOpen = false">Réalisations</RouterLink>
          <RouterLink to="/#devis" @click="menuOpen = false">Devis</RouterLink>
        </div>

        <div class="nav-right">
          <button class="cart" aria-label="Ouvrir le panier" @click="cart.open()">
            🛍️
            <span v-if="cart.count" class="count">{{ cart.count }}</span>
          </button>
          <RouterLink class="btn btn-solid quote-btn" to="/#devis">Devis</RouterLink>
          <button class="burger" aria-label="Menu" @click="menuOpen = !menuOpen">☰</button>
        </div>
      </nav>
    </div>
  </header>
</template>

<style scoped>
header {
  position: sticky; top: 0; z-index: 60;
  background: rgba(245, 238, 222, 0.92);
  backdrop-filter: blur(10px);
  border-bottom: 1.5px solid var(--line);
}
nav { display: flex; align-items: center; justify-content: space-between; height: 74px; gap: 20px; }
.logo {
  font-family: 'Fraunces', serif; font-weight: 900; font-size: 1.4rem;
  display: flex; align-items: center; gap: 0.5em;
}
.logo b { color: var(--brick); }
.logo .mk {
  width: 30px; height: 30px; border-radius: 8px; background: var(--brick); color: var(--cream);
  display: flex; align-items: center; justify-content: center; font-size: 1rem; font-weight: 900;
  transform: rotate(-4deg);
}
.nav-links { display: flex; gap: 26px; font-weight: 500; font-size: 0.95rem; }
.nav-links a { position: relative; padding: 4px 0; }
.nav-links a::after {
  content: ''; position: absolute; left: 0; right: 100%; bottom: -2px;
  height: 2px; background: var(--brick); transition: 0.2s;
}
.nav-links a:hover::after { right: 0; }
.nav-right { display: flex; align-items: center; gap: 12px; }
.cart {
  position: relative; width: 42px; height: 42px; border: 1.5px solid var(--line);
  border-radius: 8px; display: flex; align-items: center; justify-content: center;
  background: var(--cream); cursor: pointer; font-size: 1.1rem;
}
.cart .count {
  position: absolute; top: -7px; right: -7px; background: var(--brick); color: var(--cream);
  font-size: 0.62rem; font-weight: 700; width: 18px; height: 18px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
}
.burger { display: none; background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--ink); }

@media (max-width: 900px) {
  .nav-links {
    position: absolute; top: 74px; left: 0; right: 0;
    flex-direction: column; gap: 0; background: var(--cream);
    border-bottom: 1.5px solid var(--line); padding: 0 26px;
    max-height: 0; overflow: hidden; transition: max-height 0.25s ease;
  }
  .nav-links.open { max-height: 320px; }
  .nav-links a { padding: 14px 0; border-bottom: 1px dashed var(--line); }
  .quote-btn { display: none; }
  .burger { display: block; }
}
</style>
