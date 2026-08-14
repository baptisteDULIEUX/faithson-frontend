<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'
import { orderStatusLabels } from '@/data/orders'

const orders = ref([])
const loading = ref(true)
const filter = ref('all')

onMounted(async () => {
  orders.value = await api.getOrders()
  loading.value = false
})

const tabs = [
  { key: 'all', label: 'Toutes' },
  { key: 'nouvelle', label: 'Nouvelles' },
  { key: 'production', label: 'En production' },
  { key: 'prete', label: 'Prêtes' },
  { key: 'livree', label: 'Livrées' }
]

const filtered = computed(() =>
  filter.value === 'all' ? orders.value : orders.value.filter((o) => o.status === filter.value)
)

const badgeClass = { nouvelle: 'st-blue', production: 'st-brown', prete: 'st-green', livree: 'st-grey', annulee: 'st-red' }
const flow = ['nouvelle', 'production', 'prete', 'livree']

async function advance(order) {
  const i = flow.indexOf(order.status)
  if (i === -1 || i === flow.length - 1) return
  const next = flow[i + 1]
  await api.updateOrderStatus(order.id, next)
  order.status = next
}
function fmtDate(d) {
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>

<template>
  <div class="adm-page">
    <div class="adm-page-head">
      <h1>Commandes</h1>
      <p>Suivez et faites avancer les commandes dans l'atelier.</p>
    </div>

    <div class="adm-card">
      <div class="adm-tabs">
        <button v-for="t in tabs" :key="t.key" class="adm-tab" :class="{ on: filter === t.key }" @click="filter = t.key">
          {{ t.label }}
        </button>
      </div>

      <div v-if="loading" class="adm-empty">Chargement…</div>
      <table v-else class="adm-table">
        <thead><tr><th>Réf.</th><th>Client</th><th>Produit</th><th>Date</th><th>Statut</th><th style="text-align:right">Montant</th><th></th></tr></thead>
        <tbody>
          <tr v-for="o in filtered" :key="o.id">
            <td class="adm-ref">{{ o.id }}</td>
            <td class="adm-cli">{{ o.client }}<small>{{ o.email }}</small></td>
            <td>{{ o.product }} <span class="adm-tech">· {{ o.technique }}</span><br><small style="color:var(--ink-soft)">{{ o.qty }} pièces</small></td>
            <td>{{ fmtDate(o.date) }}</td>
            <td><span class="adm-badge" :class="badgeClass[o.status]">{{ orderStatusLabels[o.status] }}</span></td>
            <td class="adm-amt">{{ o.amount }} €</td>
            <td style="text-align:right">
              <button
                v-if="o.status !== 'livree' && o.status !== 'annulee'"
                class="adm-btn adm-btn-out"
                @click="advance(o)"
              >Faire avancer →</button>
            </td>
          </tr>
          <tr v-if="!filtered.length"><td colspan="7"><div class="adm-empty">Aucune commande ici.</div></td></tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
