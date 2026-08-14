<script setup>
const quotes = [
  { av: 'M', text: 'Commande de 40 sweats pour notre asso, rendu impeccable et dans les délais. On reviendra sans hésiter.', name: 'Marie L.', role: 'Association sportive' },
  { av: 'K', text: "J'ai fait imprimer un t-shirt unique pour un anniversaire, l'accueil était top et le résultat au-delà de mes attentes.", name: 'Karim B.', role: 'Particulier' },
  { av: 'S', text: 'Nos polos brodés avec le logo font vraiment pro. Bon conseil sur le choix de la technique.', name: 'Sophie R.', role: 'Restaurant' }
]
</script>

<template>
  <section class="section alt">
    <div class="wrap">
      <div class="sec-head center">
        <p class="eyebrow">On en parle</p>
        <h2>Ils sont repartis rhabillés</h2>
      </div>
      <div class="quotes">
        <figure class="quote" v-for="q in quotes" :key="q.name">
          <div class="mk">“</div>
          <blockquote>{{ q.text }}</blockquote>
          <figcaption class="who">
            <span class="av">{{ q.av }}</span>
            <span><b>{{ q.name }}</b><span class="role">{{ q.role }}</span></span>
          </figcaption>
        </figure>
      </div>
    </div>
  </section>
</template>

<style scoped>
.quotes { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
.quote { background: var(--cream); border: 1.5px solid var(--line); border-radius: var(--radius); padding: 26px; }
.mk { font-family: 'Fraunces', serif; font-size: 3rem; line-height: 0.4; color: var(--cream-3); height: 22px; }
.quote blockquote { font-size: 0.98rem; margin: 10px 0 16px; }
.who { display: flex; align-items: center; gap: 10px; }
.av { width: 38px; height: 38px; border-radius: 50%; background: var(--sage); color: var(--cream); display: flex; align-items: center; justify-content: center; font-weight: 700; font-family: 'Fraunces', serif; }
.who b { display: block; font-size: 0.9rem; }
.role { font-size: 0.78rem; color: var(--ink-soft); }
@media (max-width: 900px) { .quotes { grid-template-columns: 1fr; } }
</style>
