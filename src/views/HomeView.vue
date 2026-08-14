<script setup>
import { RouterLink } from 'vue-router'
import { products } from '@/data/products'
import HeroSection from '@/components/HeroSection.vue'
import MarqueeBar from '@/components/MarqueeBar.vue'
import ProcessSection from '@/components/ProcessSection.vue'
import ProductCard from '@/components/ProductCard.vue'
import KnowHowSection from '@/components/KnowHowSection.vue'
import InstagramFeed from '@/components/InstagramFeed.vue'
import TestimonialsSection from '@/components/TestimonialsSection.vue'
import FaqSection from '@/components/FaqSection.vue'
import QuoteContactSection from '@/components/QuoteContactSection.vue'
import NewsletterSection from '@/components/NewsletterSection.vue'

// aperçu boutique : 4 premiers produits
const featured = products.slice(0, 4)
</script>

<template>
  <HeroSection />
  <MarqueeBar />
  <ProcessSection />

  <!-- Aperçu boutique -->
  <section class="section alt">
    <div class="wrap">
      <div class="shop-head">
        <div class="sec-head no-mb">
          <p class="eyebrow">La boutique</p>
          <h2>Nos supports</h2>
        </div>
        <RouterLink class="btn btn-out" to="/boutique">Toute la boutique →</RouterLink>
      </div>
      <div class="grid">
        <ProductCard v-for="p in featured" :key="p.id" :product="p" />
      </div>
    </div>
  </section>

  <KnowHowSection />
  <InstagramFeed />
  <TestimonialsSection />
  <FaqSection />
  <QuoteContactSection />
  <NewsletterSection />
</template>

<style scoped>
.shop-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 20px; flex-wrap: wrap; margin-bottom: 26px; }
.no-mb { margin-bottom: 0; }
.grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px; }
@media (max-width: 900px) { .grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 560px) { .grid { grid-template-columns: 1fr; } }
</style>
