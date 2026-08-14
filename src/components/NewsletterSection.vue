<script setup>
import { ref } from 'vue'
import api from '@/services/api'

const email = ref('')
const done = ref(false)
const loading = ref(false)

async function subscribe() {
  if (!email.value) return
  loading.value = true
  try {
    await api.subscribeNewsletter(email.value)
    done.value = true
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="section">
    <div class="wrap">
      <div class="news">
        <h2>Restez dans la boucle</h2>
        <p>Nouveaux produits, promos sur les séries et coulisses de l'atelier, une fois par mois maximum.</p>
        <p v-if="done" class="thanks">Merci, c'est noté&nbsp;! 🎉</p>
        <form v-else @submit.prevent="subscribe">
          <input type="email" v-model="email" placeholder="votre@email.com" aria-label="email" required />
          <button class="btn news-btn" :disabled="loading">
            {{ loading ? '…' : "Je m'inscris" }}
          </button>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped>
.news { background: var(--ink); color: var(--cream); border-radius: 16px; padding: 44px; text-align: center; position: relative; overflow: hidden; }
.news h2 { color: var(--cream); font-size: clamp(1.6rem, 3.4vw, 2.3rem); }
.news p { color: #d8ccb8; margin: 12px auto 22px; max-width: 44ch; }
.news form { display: flex; gap: 10px; max-width: 440px; margin: 0 auto; flex-wrap: wrap; }
.news input { flex: 1; min-width: 200px; padding: 0.85em 1em; border-radius: 6px; border: none; font-family: 'Karla', sans-serif; font-size: 0.95rem; }
.news-btn { background: var(--mustard); color: var(--ink); }
.news-btn:hover { background: #cf9a2e; }
.thanks { font-family: 'Caveat', cursive; font-size: 1.6rem; color: var(--mustard); }
</style>
