<script setup>
import AnnounceBar from '@/components/AnnounceBar.vue'
import SiteHeader from '@/components/SiteHeader.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import CartDrawer from '@/components/CartDrawer.vue'
</script>

<template>
  <AnnounceBar />
  <SiteHeader />

  <main>
    <RouterView v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </RouterView>
  </main>

  <SiteFooter />
  <CartDrawer />
</template>
