<script setup>
import { ref, onMounted } from 'vue'

const posts = ref([])
const loading = ref(true)
const apiBase = import.meta.env.VITE_API_URL
const serverBase = apiBase.replace('/api', '')
const instagramHandle = '@Faithson_Custom'
const instagramUrl = 'https://instagram.com/faithson_custom'

onMounted(async () => {
  try {
    const res = await fetch(`${apiBase}/instagram`)
    const data = await res.json()
    posts.value = Array.isArray(data) ? data : []
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="section" id="realisations">
    <div class="wrap">
      <div class="sec-head">
        <p class="eyebrow">Réalisations</p>
        <h2>Le carnet de l'atelier</h2>
      </div>

      <div class="ig-head">
        <span class="ig-handle">{{ instagramHandle }}</span>
        <span style="color:#8a7a68;font-size:.92rem">— nos derniers projets</span>
        <a class="btn btn-out follow" :href="instagramUrl" target="_blank" rel="noopener">Suivre</a>
      </div>

      <div v-if="loading" class="loading">Chargement…</div>

      <div v-else-if="!posts.length" class="empty">
        Aucune réalisation pour l'instant.
      </div>

      <div v-else class="ig-mosaic">
        <!-- CORRECTION : Ajout de la balise <a -->
        <a
            v-for="post in posts"
            :key="post.id"
            class="ig-cell"
            :class="{ big: post.featured }"
            :href="post.link || instagramUrl"
            target="_blank"
            rel="noopener"
        >
          <img
              v-if="post.image_path"
              :src="serverBase + post.image_path"
              :alt="post.caption"
              class="ig-img"
          />
          <div v-else class="ig-ph">
            <span class="ph">▣</span>
            <span class="cap">{{ post.caption }}</span>
          </div>
        </a>
      </div>
    </div> <!-- CORRECTION : Fermeture de div class="wrap" -->
  </section>
</template>

<style scoped>
.ig-head { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; }
.ig-handle { font-family: 'Fraunces', serif; font-weight: 600; font-size: 1.2rem; }
.follow { margin-left: auto; }
.ig-mosaic { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.ig-cell { background: var(--cream-2); border: 1.5px solid var(--line); border-radius: 8px; overflow: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; min-height: 150px; aspect-ratio: 1/1; transition: 0.15s; }
.ig-cell:hover { border-color: var(--sage); }
.ig-cell.big { grid-column: span 2; grid-row: span 2; aspect-ratio: auto; }
.ig-img { width: 100%; height: 100%; object-fit: cover; }
.ig-ph { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 12px; width: 100%; height: 100%; }
.ph { font-size: 1.5rem; color: var(--sage); }
.cap { font-size: 0.72rem; color: #8a7a68; font-weight: 700; }
.loading { padding: 40px; text-align: center; font-family: 'Caveat', cursive; font-size: 1.4rem; color: var(--ink-soft); }
.empty { padding: 40px; text-align: center; color: var(--ink-soft); }
@media (max-width: 900px) { .ig-mosaic { grid-template-columns: repeat(2, 1fr); } .ig-cell.big { grid-column: span 2; } }
</style>