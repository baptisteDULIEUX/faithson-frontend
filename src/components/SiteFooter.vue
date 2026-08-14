<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <footer>
    <div class="wrap">
      <div class="foot-grid">
        <div>
          <RouterLink class="logo" to="/"><span class="mk">F</span>Faithson <b>Custom</b></RouterLink>
          <p class="tagline">Atelier d'impression textile. On imprime avec soin, en local, du prototype à la série.</p>
        </div>
        <div>
          <h4>Boutique</h4>
          <RouterLink to="/boutique">T-shirts</RouterLink>
          <RouterLink to="/boutique">Sweats</RouterLink>
          <RouterLink to="/boutique">Textile pro</RouterLink>
          <RouterLink to="/boutique">Accessoires</RouterLink>
        </div>
        <div>
          <h4>Atelier</h4>
          <RouterLink to="/personnalisation">Personnaliser</RouterLink>
          <RouterLink to="/#devis">Devis</RouterLink>
          <RouterLink to="/#realisations">Réalisations</RouterLink>
          <RouterLink to="/#faq">FAQ</RouterLink>
        </div>
        <div>
          <h4>Espace pro</h4>
          <RouterLink to="/admin">Tableau de bord ↗</RouterLink>
          <a href="https://instagram.com/faithson_custom" target="_blank" rel="noopener">Instagram ↗</a>
          <a href="#">Mentions légales</a>
          <a href="#">CGV</a>
        </div>
      </div>
      <div class="foot-bot">
        <span>© 2026 Faithson Custom</span>
        <span>Fait avec soin à l'atelier</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
footer { background: var(--ink); color: var(--cream); padding: 64px 0 32px; }
.foot-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 30px; margin-bottom: 40px; }
.logo { font-family: 'Fraunces', serif; font-weight: 900; font-size: 1.4rem; display: flex; align-items: center; gap: 0.5em; color: var(--cream); }
.logo b { color: var(--mustard); }
.logo .mk {
  width: 30px; height: 30px; border-radius: 8px; background: var(--brick); color: var(--cream);
  display: flex; align-items: center; justify-content: center; font-weight: 900; transform: rotate(-4deg);
}
.tagline { color: #b09c88; margin-top: 14px; max-width: 36ch; }
h4 { font-family: 'Fraunces', serif; margin-bottom: 14px; font-size: 1rem; }
footer a { color: #c9b9a6; display: block; margin-bottom: 8px; font-size: 0.92rem; }
footer a:hover { color: var(--mustard); }
.foot-bot {
  border-top: 1px solid #5a4a3d; padding-top: 22px; font-size: 0.82rem; color: #a08e7a;
  display: flex; justify-content: space-between; flex-wrap: wrap; gap: 10px;
}
@media (max-width: 900px) { .foot-grid { grid-template-columns: 1fr 1fr; } }
</style>
