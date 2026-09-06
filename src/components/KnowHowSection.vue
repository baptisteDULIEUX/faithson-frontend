<script setup>
const techniques = [
  { ico: '✎', title: 'Flocage', text: 'Le vinyle découpé et thermocollé, parfait pour les textes, logos et petites quantités. Rendu net, toucher velours ou flex selon le matériau.', note: 'idéal dès 1 pièce' },
  { ico: '✧', title: 'Impression DTF', text: 'Le numérique pour les visuels très détaillés et en couleurs, sans limite de nuances. Idéal pour les photos, dégradés et logos complexes.', note: 'photos & dégradés' }
]
</script>

<template>
  <section class="section" id="savoir">
    <div class="wrap">
      <div class="sec-head">
        <p class="eyebrow">Le savoir-faire</p>
        <h2>Deux techniques, une exigence</h2>
        <p>On choisit avec vous la méthode qui rend le mieux selon votre visuel, votre textile et votre quantité.</p>
      </div>
      <div class="know">
        <div class="know-card" v-for="t in techniques" :key="t.title">
          <div class="bubble">{{ t.ico }}</div>
          <div>
            <h3>{{ t.title }}</h3>
            <p>{{ t.text }}</p>
            <p class="kn">{{ t.note }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.know { display: grid; grid-template-columns: repeat(2, 1fr); gap: 22px; }
.know-card { display: flex; gap: 18px; background: var(--cream); border: 1.5px solid var(--line); border-radius: var(--radius); padding: 24px; }
.bubble { flex-shrink: 0; width: 54px; height: 54px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.6rem; background: var(--cream-2); border: 1.5px solid var(--line); }
.know-card h3 { font-size: 1.25rem; margin-bottom: 6px; }
.know-card p { font-size: 0.92rem; color: var(--ink-soft); }
.kn { font-family: 'Caveat', cursive; font-weight: 700; color: var(--brick); font-size: 1.1rem; margin-top: 8px; }
@media (max-width: 900px) { .know { grid-template-columns: 1fr; } }
</style>
