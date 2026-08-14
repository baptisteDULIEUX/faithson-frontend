<script setup>
import { RouterLink } from 'vue-router'

const chips = [
  { c: '#b5482e', l: 'Brique' },
  { c: '#7c8b5a', l: 'Sauge' },
  { c: '#e0a93b', l: 'Moutarde' },
  { c: '#3a2e27', l: 'Encre' }
]
</script>

<template>
  <section class="hero" id="top">
    <div class="wrap">
      <div class="hero-grid">
        <div>
          <p class="eyebrow">Atelier d'impression textile</p>
          <h1>On imprime vos idées,<br /><em>pièce par pièce.</em></h1>
          <p class="hero-lead">
            Sérigraphie, broderie, flocage : un atelier qui met du soin dans chaque tirage.
            Pour une pièce unique comme pour toute une équipe.
          </p>
          <div class="hero-cta">
            <RouterLink class="btn btn-solid" to="/personnalisation">Personnaliser un vêtement</RouterLink>
            <RouterLink class="btn btn-out" to="/boutique">Voir la boutique</RouterLink>
          </div>
          <div class="hero-meta">
            <div class="m"><b>+300</b><span>projets imprimés</span></div>
            <div class="m"><b>4</b><span>techniques maison</span></div>
            <div class="m"><b>24 h</b><span>pour un devis</span></div>
          </div>
        </div>

        <div class="kraft">
          <span class="tag-round">fait main</span>
          <svg class="garment" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
            <path d="M75 55 L110 40 Q150 70 190 40 L225 55 L255 95 L225 120 L215 110 L215 260 L85 260 L85 110 L75 120 L45 95 Z" fill="#b5482e" />
            <path d="M112 44 Q150 74 188 44" fill="none" stroke="#f5eede" stroke-width="3" opacity=".5" />
            <text x="150" y="168" font-family="Fraunces, serif" font-style="italic" font-weight="900" font-size="30" fill="#f5eede" text-anchor="middle">Faithson</text>
            <circle cx="150" cy="198" r="6" fill="#e0a93b" />
          </svg>
          <p class="cap">sérigraphie 1 couleur · coton bio</p>
          <div class="chips">
            <div class="chip" v-for="chip in chips" :key="chip.l">
              <div class="c" :style="{ background: chip.c }"></div>
              <div class="l">{{ chip.l }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero { position: relative; padding: 70px 0 30px; overflow: hidden; }
.hero-grid { display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 50px; align-items: center; }
.hero h1 { font-size: clamp(2.7rem, 6.2vw, 4.8rem); font-weight: 900; letter-spacing: -0.015em; }
.hero h1 em { font-style: italic; color: var(--brick); }
.hero-lead { font-size: 1.18rem; margin: 24px 0 30px; max-width: 40ch; color: var(--ink-soft); }
.hero-cta { display: flex; gap: 14px; flex-wrap: wrap; }
.hero-meta { display: flex; gap: 26px; margin-top: 36px; flex-wrap: wrap; }
.hero-meta .m b { font-family: 'Fraunces', serif; font-weight: 900; font-size: 1.6rem; display: block; }
.hero-meta .m span { font-size: 0.85rem; color: var(--ink-soft); }

.kraft {
  background: var(--cream-2); border: 1.5px solid var(--line); border-radius: 12px;
  padding: 26px; position: relative; box-shadow: 0 24px 46px -28px #3a2e2766;
}
.kraft::before {
  content: ''; position: absolute; inset: 10px; border: 1.5px dashed var(--line);
  border-radius: 7px; pointer-events: none;
}
.tag-round {
  position: absolute; top: -16px; right: 24px; background: var(--mustard); color: var(--ink);
  font-family: 'Caveat', cursive; font-weight: 700; font-size: 1.35rem; padding: 0.1em 0.85em;
  border-radius: 100px; transform: rotate(4deg); box-shadow: 0 5px 12px #0002; z-index: 3;
}
.garment { width: 100%; }
.cap { text-align: center; font-family: 'Caveat', cursive; font-weight: 700; font-size: 1.45rem; color: var(--brick); margin-top: 6px; }
.chips { display: flex; gap: 8px; justify-content: center; margin-top: 14px; }
.chip { width: 46px; text-align: center; }
.chip .c { height: 40px; border-radius: 4px 4px 0 0; border: 1.5px solid #0002; border-bottom: none; }
.chip .l { font-size: 0.58rem; font-weight: 700; background: var(--cream); border: 1.5px solid var(--line); border-radius: 0 0 4px 4px; padding: 2px 0; color: var(--ink-soft); }

@media (max-width: 900px) { .hero-grid { grid-template-columns: 1fr; } }
</style>
