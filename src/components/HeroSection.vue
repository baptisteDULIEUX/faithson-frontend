<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'


const heroImage = 'hero-tshirt.jpg'   // ex: 'hero-tshirt.jpg'

const imgError = ref(false)
</script>

<template>
  <section class="hero" id="top">
    <div class="wrap">
      <div class="hero-grid">

        <!-- Texte gauche -->
        <div>
          <p class="eyebrow">Atelier d'impression textile</p>
          <h1>On imprime vos idées,<br /><em>pièce par pièce.</em></h1>
          <p class="hero-lead">
            Flocage et impression DTF : un atelier qui met du soin dans chaque tirage.
            Pour une pièce unique comme pour toute une équipe.
          </p>
          <div class="hero-cta">
            <RouterLink class="btn btn-solid" to="/personnalisation">Personnaliser un vêtement</RouterLink>
            <RouterLink class="btn btn-out" to="/boutique">Voir la boutique</RouterLink>
          </div>
          <div class="hero-meta">
            <div class="m"><b>+300</b><span>projets imprimés</span></div>
            <div class="m"><b>2</b><span>techniques maison</span></div>
            <div class="m"><b>24 h</b><span>pour un devis</span></div>
          </div>
        </div>

        <!-- Visuel droite -->
        <div class="visual">
          <span class="tag-round">fait main</span>

          <!-- Image réelle si fournie -->
          <img
              v-if="heroImage && !imgError"
              :src="`/images/${heroImage}`"
              alt="T-shirt personnalisé Faithson Custom"
              class="hero-img"
              @error="imgError = true"
          />

          <!-- Fallback SVG propre -->
          <div v-else class="fallback">
            <svg viewBox="0 0 260 290" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path
                  d="M65 48 L96 35 Q130 62 164 35 L195 48 L222 83 L196 105 L187 96 L187 255 L73 255 L73 96 L64 105 L38 83 Z"
                  fill="#b5482e"
              />
              <path d="M98 39 Q130 66 162 39" fill="none" stroke="#f5eede" stroke-width="2.5" opacity=".45" />
              <text
                  x="130" y="158"
                  font-family="Fraunces, serif" font-style="italic" font-weight="900"
                  font-size="26" fill="#f5eede" text-anchor="middle"
              >Faithson</text>
            </svg>
            <p class="fallback-hint">
              Déposez votre photo dans <code>public/images/</code><br/>
              et renseignez <code>heroImage</code> dans HeroSection.vue
            </p>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
.hero { position: relative; padding: 70px 0 40px; overflow: hidden; }
.hero-grid { display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 50px; align-items: center; }

.hero h1 { font-size: clamp(2.7rem, 6.2vw, 4.8rem); font-weight: 900; letter-spacing: -0.015em; }
.hero h1 em { font-style: italic; color: var(--brick); }
.hero-lead { font-size: 1.18rem; margin: 24px 0 30px; max-width: 40ch; color: var(--ink-soft); }
.hero-cta { display: flex; gap: 14px; flex-wrap: wrap; }
.hero-meta { display: flex; gap: 26px; margin-top: 36px; flex-wrap: wrap; }
.hero-meta .m b { font-family: 'Fraunces', serif; font-weight: 900; font-size: 1.6rem; display: block; }
.hero-meta .m span { font-size: 0.85rem; color: var(--ink-soft); }

/* carte visuelle droite */
.visual {
  position: relative;
  background: var(--cream-2);
  border: 1.5px solid var(--line);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 28px 50px -30px #3a2e2766;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* image réelle */
.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* fallback */
.fallback {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
  padding: 32px;
  width: 100%;
  height: 100%;
}
.fallback svg { width: 68%; max-width: 220px; }
.fallback-hint {
  font-size: 0.75rem;
  color: var(--ink-soft);
  text-align: center;
  line-height: 1.6;
}
.fallback-hint code {
  background: var(--cream);
  border: 1px solid var(--line);
  border-radius: 4px;
  padding: 1px 5px;
  font-size: 0.85em;
}

/* pastille */
.tag-round {
  position: absolute; top: 16px; right: 20px; z-index: 4;
  background: var(--mustard); color: var(--ink);
  font-family: 'Caveat', cursive; font-weight: 700; font-size: 1.2rem;
  padding: 0.1em 0.8em; border-radius: 100px;
  transform: rotate(4deg); box-shadow: 0 5px 12px #0002;
}

@media (max-width: 900px) { .hero-grid { grid-template-columns: 1fr; } .hero { padding-top: 40px; } }
</style>
