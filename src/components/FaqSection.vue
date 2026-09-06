<script setup>
import { ref } from 'vue'

const faqs = [
  { q: 'Quelle quantité minimum pour commander ?', a: "Aucune ! On imprime dès 1 pièce. Le flocage et l'impression DTF s'adaptent aussi bien à la pièce unique qu'aux grandes séries." },
  { q: 'Puis-je fournir mon propre fichier ?', a: "Oui, idéalement en vectoriel (.ai, .svg) ou en .png haute résolution. Si vous n'avez que du basse def, on regarde ensemble ce qu'on peut faire." },
  { q: 'Quels sont les délais ?', a: "Comptez en général 5 à 10 jours ouvrés après validation du bon à tirer, selon la technique et la quantité. On vous donne un délai précis dans le devis." },
  { q: 'Livrez-vous partout ?', a: "Retrait possible à l'atelier, ou envoi partout en France (et à l'étranger sur demande). Les frais dépendent du poids de la commande." }
]
const open = ref(0)
function toggle(i) { open.value = open.value === i ? -1 : i }
</script>

<template>
  <section class="section" id="faq">
    <div class="wrap">
      <div class="sec-head center">
        <p class="eyebrow">Questions fréquentes</p>
        <h2>Bon à savoir</h2>
      </div>
      <div class="faq">
        <div class="qa" v-for="(item, i) in faqs" :key="i" :class="{ open: open === i }">
          <button type="button" @click="toggle(i)" :aria-expanded="open === i">
            {{ item.q }}<span class="plus">+</span>
          </button>
          <div class="ans" v-show="open === i">{{ item.a }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.faq { max-width: 760px; margin: 0 auto; }
.qa { border-bottom: 1.5px dashed var(--line); }
.qa button {
  width: 100%; text-align: left; background: none; border: none; padding: 20px 0;
  font-family: 'Fraunces', serif; font-weight: 600; font-size: 1.15rem; color: var(--ink);
  cursor: pointer; display: flex; justify-content: space-between; align-items: center; gap: 16px;
}
.plus { flex-shrink: 0; font-family: 'Karla', sans-serif; font-weight: 700; color: var(--brick); transition: 0.2s; }
.qa.open .plus { transform: rotate(45deg); }
.ans { padding: 0 0 20px; color: var(--ink-soft); font-size: 0.96rem; max-width: 64ch; }
</style>
