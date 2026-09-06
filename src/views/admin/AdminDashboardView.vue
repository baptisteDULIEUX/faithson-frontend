<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import api from '@/services/api'
import { orderStatusLabels } from '@/data/orders'

const orders = ref([])
const loading = ref(true)

onMounted(async () => {
  orders.value = await api.getOrders()
  loading.value = false
})

// commandes valides (hors annulées) pour le CA
const valid = computed(() => orders.value.filter((o) => o.status !== 'annulee'))

const ca = computed(() => valid.value.reduce((s, o) => s + o.amount, 0))
const nb = computed(() => valid.value.length)
const panierMoyen = computed(() => (nb.value ? Math.round(ca.value / nb.value) : 0))
const aTraiter = computed(() => orders.value.filter((o) => o.status === 'nouvelle' || o.status === 'production').length)

// CA par mois
const monthlyCA = computed(() => {
  const map = {}
  valid.value.forEach((o) => {
    const key = o.date.slice(0, 7) // YYYY-MM
    map[key] = (map[key] || 0) + o.amount
  })
  const months = Object.keys(map).sort()
  const max = Math.max(...Object.values(map), 1)
  const labels = { '01': 'Jan', '02': 'Fév', '03': 'Mar', '04': 'Avr', '05': 'Mai', '06': 'Juin', '07': 'Juil', '08': 'Août', '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Déc' }
  return months.map((m) => ({
    label: labels[m.slice(5)],
    value: map[m],
    pct: Math.round((map[m] / max) * 100)
  }))
})

// répartition par technique (part du CA)
const techniqueSplit = computed(() => {
  const map = {}
  valid.value.forEach((o) => { map[o.technique] = (map[o.technique] || 0) + o.amount })
  const total = Object.values(map).reduce((a, b) => a + b, 0) || 1
  const colors = { flocage: '#7c8b5a', 'impression DTF': '#3a2e27', DTF: '#3a2e27' }
  return Object.entries(map)
    .map(([tech, val]) => ({ tech, val, pct: Math.round((val / total) * 100), color: colors[tech] || '#7c8b5a' }))
    .sort((a, b) => b.val - a.val)
})

// dernières commandes
const recent = computed(() =>
  [...orders.value].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6)
)

const badgeClass = {
  nouvelle: 'st-blue', production: 'st-brown', prete: 'st-green', livree: 'st-grey', annulee: 'st-red'
}
function fmtDate(d) {
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
}
</script>

<template>
  <div class="adm-page">
    <div v-if="loading" class="adm-empty">Chargement des statistiques…</div>

    <template v-else>
      <!-- KPIs -->
      <div class="adm-kpis">
        <div class="adm-kpi"><span class="k-ic">💶</span><div class="k-lbl">Chiffre d'affaires</div><div class="k-val">{{ ca.toLocaleString('fr-FR') }} €</div><div class="k-tr">sur {{ nb }} commandes</div></div>
        <div class="adm-kpi"><span class="k-ic">🧾</span><div class="k-lbl">Commandes</div><div class="k-val">{{ nb }}</div><div class="k-tr">hors annulées</div></div>
        <div class="adm-kpi"><span class="k-ic">🛒</span><div class="k-lbl">Panier moyen</div><div class="k-val">{{ panierMoyen }} €</div><div class="k-tr">par commande</div></div>
        <div class="adm-kpi"><span class="k-ic">⏳</span><div class="k-lbl">À traiter</div><div class="k-val">{{ aTraiter }}</div><div class="k-tr">nouvelles + en prod.</div></div>
      </div>

      <div class="cols">
        <!-- CA par mois -->
        <div class="adm-card">
          <div class="adm-card-head"><h2>Chiffre d'affaires par mois</h2></div>
          <div class="chart">
            <div class="adm-bars">
              <div class="adm-bar-wrap" v-for="m in monthlyCA" :key="m.label">
                <span class="v">{{ m.value }}€</span>
                <div class="adm-bar" :style="{ height: m.pct + '%' }"></div>
                <span class="d">{{ m.label }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- répartition technique -->
        <div class="adm-card">
          <div class="adm-card-head"><h2>Part du CA par technique</h2></div>
          <div class="adm-dist">
            <div class="adm-dist-row" v-for="t in techniqueSplit" :key="t.tech">
              <div class="lbl"><span>{{ t.tech }}</span><span>{{ t.pct }} %</span></div>
              <div class="track"><div class="fill" :style="{ width: t.pct + '%', background: t.color }"></div></div>
            </div>
          </div>
        </div>
      </div>

      <!-- dernières commandes -->
      <div class="adm-card recent">
        <div class="adm-card-head">
          <h2>Dernières commandes</h2>
          <RouterLink class="adm-btn adm-btn-out" :to="{ name: 'admin-orders' }" style="margin-left:auto">Tout voir</RouterLink>
        </div>
        <table class="adm-table">
          <thead><tr><th>Réf.</th><th>Client</th><th>Produit</th><th>Date</th><th>Statut</th><th style="text-align:right">Montant</th></tr></thead>
          <tbody>
            <tr v-for="o in recent" :key="o.id">
              <td class="adm-ref">{{ o.id }}</td>
              <td class="adm-cli">{{ o.client }}</td>
              <td>{{ o.product }} <span class="adm-tech">· {{ o.technique }}</span></td>
              <td>{{ fmtDate(o.date) }}</td>
              <td><span class="adm-badge" :class="badgeClass[o.status]">{{ orderStatusLabels[o.status] }}</span></td>
              <td class="adm-amt">{{ o.amount }} €</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>

<style scoped>
.cols { display: grid; grid-template-columns: 1.3fr 1fr; gap: 22px; margin-bottom: 22px; }
.chart { padding: 20px; }
.recent { margin-bottom: 10px; }
@media (max-width: 1000px) { .cols { grid-template-columns: 1fr; } }
</style>
