<script setup>
defineProps({
  shape: { type: String, default: 'tshirt' },
  color: { type: String, default: '#3a2e27' }
})
</script>

<template>
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="aperçu produit">
    <!-- t-shirt -->
    <path
      v-if="shape === 'tshirt'"
      d="M50 40 L72 30 Q100 48 128 30 L150 40 L170 65 L150 82 L143 75 V172 H57 V75 L50 82 L30 65 Z"
      :fill="color"
    />
    <!-- hoodie -->
    <template v-else-if="shape === 'hoodie'">
      <path d="M45 45 L70 32 Q100 52 130 32 L155 45 L172 70 L152 88 V178 H48 V88 L28 70 Z" :fill="color" />
      <rect x="72" y="60" width="56" height="8" rx="4" fill="#f5eede" />
    </template>
    <!-- polo -->
    <template v-else-if="shape === 'polo'">
      <path d="M52 42 L74 32 Q100 46 126 32 L148 42 L166 66 L148 80 V172 H52 V80 L34 66 Z" :fill="color" />
      <circle cx="126" cy="72" r="8" fill="#3a2e27" />
    </template>
    <!-- bag -->
    <template v-else-if="shape === 'bag'">
      <rect x="58" y="35" width="84" height="118" rx="4" :fill="color" />
      <path d="M72 35 v-8 h56 v8" stroke="#3a2e27" stroke-width="4" fill="none" />
      <circle cx="100" cy="94" r="22" fill="#f5eede" />
    </template>
    <!-- cap -->
    <template v-else-if="shape === 'cap'">
      <path d="M40 105 Q100 45 160 105 Q100 115 40 105Z" :fill="color" />
      <rect x="62" y="105" width="76" height="28" rx="14" fill="#7c8b5a" />
    </template>
    <!-- fallback -->
    <path v-else d="M50 40 L72 30 Q100 48 128 30 L150 40 L170 65 L150 82 V172 H50 V82 L30 65 Z" :fill="color" />
  </svg>
</template>

<style scoped>
svg { width: 54%; }
</style>
