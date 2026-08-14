<script setup>
import { computed } from 'vue'
import { RouterView, RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import '@/assets/styles/admin.css'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const nav = [
  { to: { name: 'admin-dashboard' }, ic: '▤', label: 'Tableau de bord' },
  { to: { name: 'admin-products' }, ic: '👕', label: 'Boutique' },
  { to: { name: 'admin-orders' }, ic: '🧾', label: 'Commandes' },
  { to: { name: 'admin-quotes' }, ic: '✎', label: 'Devis' },
  { to: { name: 'admin-custom' }, ic: '🎨', label: 'Personnalisations' }
]

const pageTitle = computed(() => {
  const map = {
    'admin-dashboard': 'Tableau de bord',
    'admin-products': 'Boutique',
    'admin-orders': 'Commandes',
    'admin-quotes': 'Devis',
    'admin-custom': 'Personnalisations'
  }
  return map[route.name] || 'Admin'
})

function logout() {
  auth.logout()
  router.push({ name: 'admin-login' })
}
</script>

<template>
  <div class="admin">
    <aside class="side">
      <RouterLink class="brand" to="/admin/dashboard">
        <span class="mk">F</span>Faithson
      </RouterLink>
      <span class="lbl">Pilotage</span>
      <RouterLink
        v-for="item in nav"
        :key="item.label"
        :to="item.to"
        class="nav-item"
        active-class="on"
      >
        <span class="ic">{{ item.ic }}</span>{{ item.label }}
      </RouterLink>

      <div class="side-foot">
        <RouterLink class="view-site" to="/">← Voir le site</RouterLink>
      </div>
    </aside>

    <div class="main">
      <header class="topbar">
        <h1>{{ pageTitle }}</h1>
        <div class="tb-right">
          <span class="who"><span class="av">A</span> Atelier</span>
          <button class="logout" @click="logout">Déconnexion</button>
        </div>
      </header>

      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.admin { display: grid; grid-template-columns: 240px 1fr; min-height: 100vh; background: var(--cream); }

.side { background: var(--ink); color: var(--cream); padding: 22px 16px; display: flex; flex-direction: column; gap: 5px; position: sticky; top: 0; height: 100vh; }
.brand { display: flex; align-items: center; gap: 0.55em; font-family: 'Fraunces', serif; font-weight: 900; font-size: 1.25rem; color: var(--cream); padding: 6px 8px 20px; }
.brand .mk { width: 30px; height: 30px; border-radius: 8px; background: var(--brick); display: flex; align-items: center; justify-content: center; font-weight: 900; transform: rotate(-4deg); }
.lbl { font-size: 0.66rem; letter-spacing: 0.18em; text-transform: uppercase; color: #8a7a68; padding: 6px 10px; font-weight: 700; }
.nav-item { display: flex; align-items: center; gap: 11px; padding: 10px 12px; border-radius: 8px; color: #d8ccb8; font-weight: 500; font-size: 0.94rem; transition: 0.15s; }
.nav-item .ic { width: 20px; text-align: center; }
.nav-item:hover { background: #4a3c33; color: var(--cream); }
.nav-item.on { background: var(--brick); color: var(--cream); }
.side-foot { margin-top: auto; border-top: 1px solid #4a3c33; padding-top: 14px; }
.view-site { color: #b09c88; font-size: 0.86rem; font-weight: 700; }
.view-site:hover { color: var(--mustard); }

.main { min-width: 0; }
.topbar { display: flex; align-items: center; gap: 16px; padding: 18px 30px; background: rgba(245, 238, 222, 0.9); backdrop-filter: blur(8px); border-bottom: 1.5px solid var(--line); position: sticky; top: 0; z-index: 20; }
.topbar h1 { font-size: 1.35rem; font-weight: 900; }
.tb-right { margin-left: auto; display: flex; align-items: center; gap: 16px; }
.who { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 0.9rem; }
.av { width: 30px; height: 30px; border-radius: 50%; background: var(--sage); color: var(--cream); display: flex; align-items: center; justify-content: center; font-family: 'Fraunces', serif; font-weight: 700; }
.logout { background: var(--panel); border: 1.5px solid var(--line); border-radius: 8px; padding: 0.5em 0.9em; font-weight: 700; font-size: 0.85rem; cursor: pointer; }
.logout:hover { border-color: var(--brick); color: var(--brick); }

@media (max-width: 820px) {
  .admin { grid-template-columns: 1fr; }
  .side { position: static; height: auto; flex-direction: row; flex-wrap: wrap; align-items: center; gap: 4px; }
  .lbl, .side-foot { display: none; }
  .brand { padding: 6px 8px; }
}
</style>
