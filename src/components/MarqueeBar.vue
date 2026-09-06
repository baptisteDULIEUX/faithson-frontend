<script setup>
const items = [
  'Flocage', 'Impression DTF', 'Textile professionnel',
  'Petites séries', 'Fabrication locale', 'Personnalisation sur mesure'
]
</script>

<template>
  <div class="marquee" aria-hidden="true">
    <span class="track">
      <template v-for="n in 2" :key="n">
        <span v-for="item in items" :key="item + n">
          <em>✦</em> {{ item }}
        </span>
      </template>
    </span>
  </div>
</template>

<style scoped>
.marquee {
  background: var(--ink); color: var(--cream); overflow: hidden; padding: 14px 0;
  font-family: 'Fraunces', serif; font-style: italic; font-size: 1.1rem; border-top: 3px solid var(--brick);
}
.track { white-space: nowrap; display: inline-block; padding-left: 100%; animation: scroll 26s linear infinite; }
.track em { color: var(--mustard); font-style: normal; margin: 0 18px; }
@keyframes scroll { to { transform: translateX(-100%); } }
@media (prefers-reduced-motion: reduce) { .track { animation: none; padding-left: 0; } }
</style>
