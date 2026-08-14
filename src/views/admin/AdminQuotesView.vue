<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'
import { quoteStatusLabels } from '@/data/quotes'

const quotes = ref([])
const loading = ref(true)
const filter = ref('all')
const editing = ref(null) // id en cours de chiffrage
const priceInput = ref('')

onMounted(async () => {
  quotes.value = await api.getQuotes()
  loading.value = false
})

const tabs = [
  { key: 'all', label: 'Tous' },
  { key: 'nouveau', label: 'Nouveaux' },
  { key: 'envoye', label: 'Envoyés' },
  { key: 'accepte', label: 'Acceptés' },
  { key: 'refuse', label: 'Refusés' }
]
const filtered = computed(() =>
  filter.value === 'all' ? quotes.value : quotes.value.filter((q) => q.status === filter.value)
)
const badgeClass = { nouveau: 'st-blue', envoye: 'st-amber', accepte: 'st-green', refuse: 'st-red' }

function startPricing(q) {
  editing.value = q.id
  priceInput.value = q.amount || ''
}
async function sendQuote(q) {
  const amount = Number(priceInput.value)
  if (!amount) return
  await api.updateQuote(q.id, { status: 'envoye', amount })
  q.status = 'envoye'; q.amount = amount
  editing.value = null
}
async function setStatus(q, status) {
  await api.updateQuote(q.id, { status })
  q.status = status
}
function fmtDate(d) {
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
}
</script>

<template>
  <div class="adm-page">
    <div class="adm-page-head">
      <h1>Devis</h1>
      <p>Chiffrez les demandes reçues et suivez leur statut.</p>
    </div>

    <div class="adm-card">
      <div class="adm-tabs">
        <button v-for="t in tabs" :key="t.key" class="adm-tab" :class="{ on: filter === t.key }" @click="filter = t.key">
          {{ t.label }}
        </button>
      </div>

      <div v-if="loading" class="adm-empty">Chargement…</div>
      <div v-else>
        <div v-for="q in filtered" :key="q.id" class="quote-row">
          <div class="q-main">
            <div class="q-top">
              <span class="adm-ref">{{ q.id }}</span>
              <span class="adm-badge" :class="badgeClass[q.status]">{{ quoteStatusLabels[q.status] }}</span>
              <span class="q-date">{{ fmtDate(q.date) }}</span>
            </div>
            <div class="q-cli">{{ q.client }} <small>· {{ q.email }}</small></div>
            <div class="q-note">
              {{ q.qty }} × {{ q.product }} <span class="adm-tech">· {{ q.technique }}</span> — {{ q.note }}
            </div>
          </div>

          <div class="q-side">
            <div class="q-amount" v-if="q.amount">{{ q.amount }} €</div>

            <div v-if="editing === q.id" class="q-price-edit">
              <input type="number" v-model="priceInput" placeholder="Prix €" />
              <button class="adm-btn adm-btn-solid" @click="sendQuote(q)">Envoyer</button>
              <button class="adm-btn adm-btn-out" @click="editing = null">Annuler</button>
            </div>

            <div v-else class="q-actions">
              <button v-if="q.status === 'nouveau'" class="adm-btn adm-btn-solid" @click="startPricing(q)">Chiffrer & envoyer</button>
              <button v-if="q.status === 'envoye'" class="adm-btn adm-btn-out" @click="startPricing(q)">Modifier le prix</button>
              <template v-if="q.status === 'envoye'">
                <button class="adm-btn adm-btn-green" @click="setStatus(q, 'accepte')">Accepté</button>
                <button class="adm-btn adm-btn-out" @click="setStatus(q, 'refuse')">Refusé</button>
              </template>
            </div>
          </div>
        </div>
        <div v-if="!filtered.length" class="adm-empty">Aucun devis dans cette catégorie.</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.quote-row { display: flex; gap: 20px; padding: 18px 20px; border-bottom: 1px solid var(--line); align-items: flex-start; flex-wrap: wrap; }
.q-main { flex: 1; min-width: 260px; }
.q-top { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
.q-date { color: var(--ink-soft); font-size: 0.8rem; margin-left: auto; }
.q-cli { font-weight: 700; }
.q-cli small { color: var(--ink-soft); font-weight: 400; }
.q-note { color: var(--ink-soft); font-size: 0.9rem; margin-top: 4px; }
.q-side { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
.q-amount { font-family: 'Fraunces', serif; font-weight: 900; font-size: 1.3rem; color: var(--brick); }
.q-actions { display: flex; gap: 8px; flex-wrap: wrap; justify-content: flex-end; }
.q-price-edit { display: flex; gap: 8px; align-items: center; }
.q-price-edit input { width: 110px; padding: 0.5em 0.7em; border: 1.5px solid var(--line); border-radius: 7px; font-family: 'Karla', sans-serif; background: var(--cream); }
</style>
