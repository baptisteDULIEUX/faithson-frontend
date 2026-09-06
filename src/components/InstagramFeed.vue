<script setup>
import { ref } from 'vue'
import { instagramPosts, instagramHandle, instagramUrl } from '@/data/instagram'

// on garde une copie locale réactive pour gérer les erreurs d'image
const posts = ref(instagramPosts.map((p) => ({ ...p, error: false })))

function srcFor(post) {
  return post.image ? `/images/instagram/${post.image}` : null
}
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
        <span class="ig-note">— nos derniers projets</span>
        <a class="btn btn-out follow" :href="instagramUrl" target="_blank" rel="noopener">Suivre</a>
      </div>

      <div class="ig-mosaic">
        <a
          v-for="(post, i) in posts"
          :key="i"
          class="ig-cell"
          :class="{ big: post.featured }"
          :href="post.link || instagramUrl"
          target="_blank"
          rel="noopener"
        >
          <img
            v-if="srcFor(post) && !post.error"
            :src="srcFor(post)"
            :alt="post.caption"
            class="ig-img"
            @error="post.error = true"
          />
          <template v-else>
            <span class="ph">▣</span>
            <span class="cap">{{ post.caption }}</span>
          </template>
        </a>
      </div>


    </div>
  </section>
</template>

<style scoped>
.ig-head { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; }
.ig-handle { font-family: 'Fraunces', serif; font-weight: 600; font-size: 1.2rem; }
.ig-note { color: #8a7a68; font-size: 0.92rem; }
.follow { margin-left: auto; }
.ig-mosaic { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.ig-cell {
  background: var(--cream-2); border: 1.5px solid var(--line); border-radius: 8px;
  position: relative; overflow: hidden; display: flex; flex-direction: column;
  align-items: center; justify-content: center; text-align: center; padding: 12px;
  min-height: 150px; aspect-ratio: 1 / 1; transition: 0.15s;
}
.ig-cell:hover { border-color: var(--sage); }
.ig-cell.big { grid-column: span 2; grid-row: span 2; aspect-ratio: auto; }
.ig-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.ph { width: 38px; height: 38px; border-radius: 8px; border: 2px dashed var(--sage); display: flex; align-items: center; justify-content: center; color: var(--sage); margin-bottom: 8px; }
.cap { font-size: 0.72rem; color: #8a7a68; font-weight: 700; }
code { background: var(--cream); border: 1px solid var(--line); border-radius: 4px; padding: 1px 5px; font-size: 0.85em; }
@media (max-width: 900px) { .ig-mosaic { grid-template-columns: repeat(2, 1fr); } .ig-cell.big { grid-column: span 2; } }
</style>
