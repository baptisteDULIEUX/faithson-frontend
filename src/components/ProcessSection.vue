<script setup>
const steps = [
  { ico: '✎', title: 'Votre idée', text: 'Vous personnalisez en ligne ou vous nous envoyez votre visuel. On échange sur le rendu voulu.' },
  { ico: '✦', title: 'Le devis', text: 'On vous propose la technique la plus adaptée et un prix clair sous 24 h. Sans engagement.' },
  { ico: '⬒', title: "L'impression", text: 'On valide un bon à tirer, puis on imprime à l\'atelier avec un contrôle à chaque pièce.' },
  { ico: '✧', title: 'La livraison', text: 'Retrait à l\'atelier ou envoi. Vos pièces sont prêtes à être portées.' }
]
</script>

<template>
  <section class="section" id="process">
    <div class="wrap">
      <div class="sec-head center">
        <p class="eyebrow">Comment ça marche</p>
        <h2>De l'idée au vêtement, en 4 temps</h2>
      </div>
      <div class="steps">
        <div class="step" v-for="(s, i) in steps" :key="s.title">
          <span class="no">{{ i + 1 }}</span>
          <div class="ico">{{ s.ico }}</div>
          <h3>{{ s.title }}</h3>
          <p>{{ s.text }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px; }
.step { background: var(--cream); border: 1.5px solid var(--line); border-radius: var(--radius); padding: 24px 22px; position: relative; }
.no { font-family: 'Fraunces', serif; font-weight: 900; font-size: 2.4rem; color: var(--cream-3); line-height: 1; position: absolute; top: 14px; right: 18px; }
.ico { font-size: 1.5rem; }
.step h3 { font-size: 1.2rem; margin: 6px 0 8px; }
.step p { font-size: 0.92rem; color: var(--ink-soft); }
@media (max-width: 900px) { .steps { grid-template-columns: 1fr 1fr; } }
@media (max-width: 560px) { .steps { grid-template-columns: 1fr; } }
</style>
