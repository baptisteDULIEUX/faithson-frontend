<script setup>
import { ref, computed, onMounted } from 'vue'

const quotes = ref([])
const loading = ref(true)
const filter = ref('all')
const selected = ref(null)
const priceInput = ref('')
const apiBase = import.meta.env.VITE_API_URL

const tabs = [
  { key: 'all', label: 'Tous' },
  { key: 'nouveau', label: 'Nouveaux' },
  { key: 'envoye', label: 'Envoyés' },
  { key: 'accepte', label: 'Acceptés' },
  { key: 'refuse', label: 'Refusés' }
]

const statusLabels = {
  nouveau: 'Nouveau',
  envoye: 'Devis envoyé',
  accepte: 'Accepté',
  refuse: 'Refusé'
}

const badgeClass = {
  nouveau: 'st-blue',
  envoye: 'st-amber',
  accepte: 'st-green',
  refuse: 'st-red'
}

onMounted(async () => {
  await loadQuotes()
})

async function loadQuotes() {
  loading.value = true
  try {
    const res = await fetch(`${apiBase}/admin/quotes`)
    quotes.value = await res.json()
  } finally {
    loading.value = false
  }
}

const filtered = computed(() =>
    filter.value === 'all'
        ? quotes.value
        : quotes.value.filter((q) => q.statut === filter.value)
)

function open(q) {
  selected.value = { ...q }
  priceInput.value = q.montant_propose || ''
}
function close() { selected.value = null }

async function updateQuote(patch) {
  const res = await fetch(`${apiBase}/admin/quotes/${selected.value.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch)
  })
  const updated = await res.json()
  const idx = quotes.value.findIndex((q) => q.id === updated.id)
  if (idx !== -1) quotes.value[idx] = updated
  selected.value = { ...updated }
}

async function sendQuote() {
  const price = Number(priceInput.value)
  if (!price) return
  await updateQuote({ statut: 'envoye', montant_propose: price })
}

async function setStatus(statut) {
  await updateQuote({ statut })
}

function fmtDate(d) {
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function fichierUrl(path) {
  return apiBase.replace('/api', '') + path
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
        <button
            v-for="t in tabs" :key="t.key"
            class="adm-tab" :class="{ on: filter === t.key }"
            @click="filter = t.key"
        >{{ t.label }}</button>
      </div>

      <div v-if="loading" class="adm-empty">Chargement…</div>
      <table v-else class="adm-table">
        <thead>
        <tr>
          <th>Réf.</th>
          <th>Email</th>
          <th>Produit</th>
          <th>Date</th>
          <th>Fichier</th>
          <th>Statut</th>
          <th style="text-align:right">Montant</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="q in filtered" :key="q.id" @click="open(q)">
          <td class="adm-ref">DEVIS-{{ q.id }}</td>
          <td class="adm-cli">{{ q.email || '—' }}</td>
          <td>{{ q.produit }} <span class="adm-tech">· {{ q.technique }}</span></td>
          <td>{{ fmtDate(q.created_at) }}</td>
          <td>

            v-if="q.fichier"
            :href="fichierUrl(q.fichier)"
            target="_blank"
            @click.stop
            class="file-link"
            >Voir le fichier ↗</a>
            <span v-else class="no-file">—</span>
          </td>
          <td>
              <span class="adm-badge" :class="badgeClass[q.statut]">
                {{ statusLabels[q.statut] }}
              </span>
          </td>
          <td class="adm-amt">{{ q.montant_propose ? q.montant_propose + ' €' : '—' }}</td>
        </tr>
        <tr v-if="!filtered.length">
          <td colspan="7"><div class="adm-empty">Aucun devis ici.</div></td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Drawer détail -->
    <div class="overlay" :class="{ show: selected }" @click="close"></div>
    <aside class="drawer" :class="{ show: selected }" v-if="selected">
      <div class="dr-head">
        <div>
          <h2>DEVIS-{{ selected.id }}</h2>
          <div class="dr-sub">{{ selected.email }}</div>
        </div>
        <button class="close" @click="close">✕</button>
      </div>

      <div class="dr-body">
        <div class="spec"><span>Produit</span><b>{{ selected.produit }}</b></div>
        <div class="spec"><span>Quantité</span><b>{{ selected.quantite || '—' }}</b></div>
        <div class="spec"><span>Technique</span><b>{{ selected.technique || '—' }}</b></div>
        <div class="spec"><span>Reçu le</span><b>{{ fmtDate(selected.created_at) }}</b></div>

        <div v-if="selected.fichier" class="fichier-block">
          <p class="spec-label">Fichier client</p>
          <a :href="fichierUrl(selected.fichier)" target="_blank" class="fichier-btn">
            Ouvrir le fichier ↗
          </a>
          <!-- aperçu image si c'est une image -->
          <img
              v-if="selected.fichier.match(/\.(jpg|jpeg|png|webp)$/i)"
              :src="fichierUrl(selected.fichier)"
              class="fichier-preview"
              alt="Aperçu"
          />
        </div>

        <div v-if="selected.message" class="note-box">
          "{{ selected.message }}"
        </div>

        <div class="action-zone">
          <template v-if="selected.statut === 'nouveau'">
            <h4>Proposer un prix</h4>
            <div class="price-row">
              <input type="number" v-model="priceInput" placeholder="Prix total €" />
              <button class="adm-btn adm-btn-solid" @click="sendQuote">Envoyer le devis</button>
            </div>
            <button class="adm-btn adm-btn-out full" @click="setStatus('refuse')">Refuser</button>
          </template>

          <template v-else-if="selected.statut === 'envoye'">
            <div class="status-info amber">
              <b>Prix proposé : {{ selected.montant_propose }} €</b>
              <span>En attente de réponse du client.</span>
            </div>
            <div class="price-row">
              <input type="number" v-model="priceInput" placeholder="Modifier le prix €" />
              <button class="adm-btn adm-btn-out" @click="sendQuote">Mettre à jour</button>
            </div>
            <button class="adm-btn adm-btn-green full" @click="setStatus('accepte')">Marquer accepté</button>
            <button class="adm-btn adm-btn-out full" @click="setStatus('refuse')">Refuser</button>
          </template>

          <template v-else-if="selected.statut === 'accepte'">
            <div class="status-info green">
              <b>Devis accepté — {{ selected.montant_propose }} €</b>
            </div>
          </template>

          <template v-else>
            <div class="status-info red"><b>Devis refusé</b></div>
          </template>
        </div>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.overlay { position: fixed; inset: 0; background: #3a2e2766; opacity: 0; pointer-events: none; transition: 0.2s; z-index: 90; }
.overlay.show { opacity: 1; pointer-events: auto; }
.drawer { position: fixed; top: 0; right: 0; bottom: 0; width: min(440px, 94vw); background: var(--cream); border-left: 1.5px solid var(--line); transform: translateX(100%); transition: transform 0.25s; z-index: 100; overflow-y: auto; }
.drawer.show { transform: translateX(0); }
.dr-head { padding: 20px 24px; background: var(--ink); color: var(--cream); display: flex; align-items: flex-start; gap: 12px; }
.dr-head h2 { color: var(--cream); font-size: 1.3rem; font-weight: 900; }
.dr-sub { font-size: 0.82rem; color: #d8ccb8; margin-top: 2px; }
.close { margin-left: auto; background: #ffffff22; border: none; color: var(--cream); width: 32px; height: 32px; border-radius: 8px; cursor: pointer; font-size: 1rem; }
.dr-body { padding: 8px 24px 28px; }
.spec { display: flex; justify-content: space-between; padding: 11px 0; border-bottom: 1px dashed var(--line); font-size: 0.92rem; }
.spec span { color: var(--ink-soft); font-weight: 700; }
.spec-label { font-size: 0.78rem; font-weight: 700; color: var(--ink-soft); margin: 16px 0 8px; text-transform: uppercase; letter-spacing: 0.05em; }
.fichier-block { margin-top: 16px; }
.fichier-btn { display: inline-block; background: var(--ink); color: var(--cream); padding: 0.6em 1em; border-radius: 8px; font-weight: 700; font-size: 0.9rem; }
.fichier-preview { width: 100%; border-radius: 8px; margin-top: 12px; border: 1.5px solid var(--line); }
.note-box { background: var(--panel); border: 1.5px solid var(--line); border-radius: 8px; padding: 12px 14px; margin: 14px 0; font-style: italic; color: var(--ink-soft); }
.action-zone { margin-top: 16px; display: flex; flex-direction: column; gap: 10px; }
.action-zone h4 { font-size: 0.9rem; margin-bottom: 4px; }
.price-row { display: flex; gap: 8px; }
.price-row input { flex: 1; padding: 0.65em 0.8em; border: 1.5px solid var(--line); border-radius: 8px; font-family: 'Karla', sans-serif; background: var(--panel); }
.full { width: 100%; justify-content: center; }
.status-info { border-radius: 8px; padding: 12px 14px; display: flex; flex-direction: column; gap: 2px; }
.status-info b { font-family: 'Fraunces', serif; }
.status-info span { font-size: 0.82rem; }
.status-info.amber { background: #faf0d6; color: #8a6414; }
.status-info.green { background: #e8efd8; color: #4d6a2c; }
.status-info.red { background: #f7ddd5; color: #a23b28; }
.file-link { color: var(--brick); font-weight: 700; font-size: 0.85rem; }
.no-file { color: var(--ink-soft); }
</style>