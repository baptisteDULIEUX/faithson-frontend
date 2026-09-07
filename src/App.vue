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
      <transition name="fade">
        <component :is="Component" :key="$route.path" />
      </transition>
    </RouterView>
  </main>

  <SiteFooter />
  <CartDrawer />
</template>
