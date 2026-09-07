<script setup>
import { ref, computed, onMounted } from 'vue'

const customStatusLabels = {
  en_attente: 'En attente',
  validee: 'Validée — à payer',
  payee: 'Payée',
  refusee: 'Refusée'
}

const requests = ref([])
const loading = ref(true)
const filter = ref('all')
const selected = ref(null)
const priceInput = ref('')

const apiBase = import.meta.env.VITE_API_URL

onMounted(async () => {
  await loadRequests()
})

async function loadRequests() {
  loading.value = true
  try {
    const res = await fetch(`${apiBase}/admin/custom-requests`)
    const data = await res.json()
    requests.value = Array.isArray(data) ? data : []
  } finally {
    loading.value = false
  }
}

async function validate(r) {
  const price = Number(priceInput.value)
  if (!price) return
  const res = await fetch(`${apiBase}/admin/custom-requests/${r.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'validee', proposed_price: price })
  })
  const updated = await res.json()
  Object.assign(r, updated)
  selected.value = { ...updated }
}

async function refuse(r) {
  const res = await fetch(`${apiBase}/admin/custom-requests/${r.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'refusee' })
  })
  const updated = await res.json()
  Object.assign(r, updated)
  selected.value = { ...updated }
}

async function markPaid(r) {
  const res = await fetch(`${apiBase}/admin/custom-requests/${r.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'payee' })
  })
  const updated = await res.json()
  Object.assign(r, updated)
  selected.value = { ...updated }
}

// position du marqueur d'emplacement sur l'aperçu (1er emplacement reconnu)
function markerPos(placement) {
  const map = {
    'Poitrine gauche': { top: '36%', left: '38%' },
    'Poitrine centre': { top: '38%', left: '50%' },
    'Poitrine droite': { top: '36%', left: '62%' },
    'Centre poitrine': { top: '38%', left: '50%' },
    Taille: { top: '62%', left: '50%' },
    Dos: { top: '44%', left: '50%' },
    'Dos (grand format)': { top: '44%', left: '50%' },
    Manche: { top: '34%', left: '20%' },
    'Bas du dos': { top: '62%', left: '50%' }
  }
  const p = placement || ''
  const hit = Object.keys(map).find((k) => p.includes(k))
  return hit ? map[hit] : { top: '40%', left: '50%' }
}
function fmtDate(d) {
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
}
</script>

<template>
  <div class="adm-page">
    <div class="adm-page-head">
      <h1>Personnalisations</h1>
      <p>
        Demandes de clients qui veulent leur logo sur un vêtement.
        Validez la demande et proposez un prix — le client pourra alors payer.
        <b v-if="pendingCount">{{ pendingCount }} en attente.</b>
      </p>
    </div>

    <div class="adm-card">
      <div class="adm-tabs">
        <button v-for="t in tabs" :key="t.key" class="adm-tab" :class="{ on: filter === t.key }" @click="filter = t.key">
          {{ t.label }}
        </button>
      </div>

      <div v-if="loading" class="adm-empty">Chargement…</div>
      <table v-else class="adm-table">
        <thead><tr><th>Réf.</th><th>Client</th><th>Vêtement</th><th>Emplacement</th><th>Qté</th><th>Statut</th><th style="text-align:right">Prix</th></tr></thead>
        <tbody>
          <tr v-for="r in filtered" :key="r.id" @click="open(r)">
            <td class="adm-ref">{{ r.id }}</td>
            <td class="adm-cli">{{ r.client }}<small>{{ fmtDate(r.date) }}</small></td>
            <td>{{ r.garment }} <span class="adm-tech">· {{ r.technique }}</span></td>
            <td>{{ r.placement }}</td>
            <td>{{ r.qty }}</td>
            <td><span class="adm-badge" :class="badgeClass[r.status]">{{ customStatusLabels[r.status] }}</span></td>
            <td class="adm-amt">{{ r.proposedPrice ? r.proposedPrice + ' €' : '—' }}</td>
          </tr>
          <tr v-if="!filtered.length"><td colspan="7"><div class="adm-empty">Aucune demande ici.</div></td></tr>
        </tbody>
      </table>
    </div>

    <!-- Drawer détail -->
    <div class="overlay" :class="{ show: selected }" @click="close"></div>
    <aside class="drawer" :class="{ show: selected }" v-if="selected">
      <div class="dr-head">
        <div>
          <h2>{{ selected.id }}</h2>
          <div class="dr-sub">{{ selected.client }} · {{ selected.email }}</div>
        </div>
        <button class="close" @click="close">✕</button>
      </div>

      <!-- aperçu emplacement -->
      <div class="preview">
        <div class="gw">
          <svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 30 L72 20 Q100 38 128 20 L150 30 L172 55 L150 72 L143 65 V200 H57 V65 L50 72 L28 55 Z" fill="#3a2e27" />
          </svg>
          <div class="marker" :style="markerPos(selected.placement)" :title="selected.placement">
            <span>logo</span>
          </div>
        </div>
        <p class="placement-cap">Emplacement : <b>{{ selected.placement }}</b></p>
      </div>

      <!-- Aperçu du logo si disponible -->
      <div v-if="selected.logo_path" class="logo-preview">
        <p class="spec-label">Logo fourni par le client</p>
        <img
            :src="apiBase.replace('/api', '') + selected.logo_path"
            alt="Logo client"
            class="logo-img"
        />

        <a :href="apiBase.replace('/api', '') + selected.logo_path"
           target="_blank"
           class="logo-link"
        >Télécharger le fichier ↗</a>
      </div>
      <div class="dr-body">
        <div class="spec"><span>Vêtement</span><b>{{ selected.garment }} · {{ selected.garmentColor }}</b></div>
        <div class="spec"><span>Technique</span><b>{{ selected.technique }}</b></div>
        <div class="spec"><span>Quantité</span><b>{{ selected.qty }} pièces</b></div>
        <div class="spec"><span>Logo fourni</span><b>{{ selected.logoName || '—' }}</b></div>
        <div class="note-box" v-if="selected.note">“{{ selected.note }}”</div>

        <!-- Actions selon le statut -->
        <div class="action-zone">
          <template v-if="selected.status === 'en_attente'">
            <h4>Valider et proposer un prix</h4>
            <div class="price-row">
              <input type="number" v-model="priceInput" placeholder="Prix total €" />
              <button class="adm-btn adm-btn-solid" @click="validate(selected)">Valider & proposer</button>
            </div>
            <button class="adm-btn adm-btn-out full" @click="refuse(selected)">Refuser la demande</button>
          </template>

          <template v-else-if="selected.status === 'validee'">
            <div class="status-info amber">
              <b>Prix proposé : {{ selected.proposedPrice }} €</b>
              <span>En attente de paiement du client.</span>
            </div>
            <div class="price-row">
              <input type="number" v-model="priceInput" placeholder="Modifier le prix €" />
              <button class="adm-btn adm-btn-out" @click="validate(selected)">Mettre à jour</button>
            </div>
            <button class="adm-btn adm-btn-green full" @click="markPaid(selected)">Marquer comme payé (simulation)</button>
          </template>

          <template v-else-if="selected.status === 'payee'">
            <div class="status-info green">
              <b>Payée — {{ selected.proposedPrice }} €</b>
              <span>La production peut démarrer.</span>
            </div>
          </template>

          <template v-else>
            <div class="status-info red"><b>Demande refusée</b></div>
          </template>
        </div>


      </div>
    </aside>
  </div>
</template>

<style scoped>
.overlay { position: fixed; inset: 0; background: #3a2e2766; opacity: 0; pointer-events: none; transition: 0.2s; z-index: 90; }
.overlay.show { opacity: 1; pointer-events: auto; }
.drawer {
  position: fixed; top: 0; right: 0; bottom: 0; width: min(440px, 94vw); background: var(--cream);
  border-left: 1.5px solid var(--line); transform: translateX(100%); transition: transform 0.25s;
  z-index: 100; overflow-y: auto; box-shadow: -20px 0 50px -20px #3a2e2755;
}
.drawer.show { transform: translateX(0); }
.dr-head { padding: 20px 24px; background: var(--ink); color: var(--cream); display: flex; align-items: flex-start; gap: 12px; }
.dr-head h2 { color: var(--cream); font-size: 1.3rem; font-weight: 900; }
.dr-sub { font-size: 0.82rem; color: #d8ccb8; margin-top: 2px; }
.close { margin-left: auto; background: #ffffff22; border: none; color: var(--cream); width: 32px; height: 32px; border-radius: 8px; cursor: pointer; font-size: 1rem; }

.preview { padding: 22px 24px 6px; text-align: center; }
.gw { position: relative; width: 150px; margin: 0 auto; }
.gw svg { width: 100%; }
.marker { position: absolute; transform: translate(-50%, -50%); background: var(--mustard); color: var(--ink); border: 2px solid var(--ink); border-radius: 6px; font-size: 0.6rem; font-weight: 700; padding: 3px 6px; }
.placement-cap { margin-top: 10px; font-size: 0.9rem; color: var(--ink-soft); }

.dr-body { padding: 8px 24px 28px; }
.spec { display: flex; justify-content: space-between; padding: 11px 0; border-bottom: 1px dashed var(--line); font-size: 0.92rem; }
.spec span { color: var(--ink-soft); font-weight: 700; }
.note-box { background: var(--panel); border: 1.5px solid var(--line); border-radius: 8px; padding: 12px 14px; margin: 14px 0; font-style: italic; color: var(--ink-soft); }

.action-zone { margin-top: 16px; }
.action-zone h4 { font-size: 0.9rem; margin-bottom: 10px; }
.price-row { display: flex; gap: 8px; margin-bottom: 10px; }
.price-row input { flex: 1; padding: 0.65em 0.8em; border: 1.5px solid var(--line); border-radius: 8px; font-family: 'Karla', sans-serif; background: var(--panel); }
.full { width: 100%; justify-content: center; }
.status-info { border-radius: 8px; padding: 12px 14px; margin-bottom: 12px; display: flex; flex-direction: column; gap: 2px; }
.status-info b { font-family: 'Fraunces', serif; }
.status-info span { font-size: 0.82rem; }
.status-info.amber { background: #faf0d6; color: #8a6414; }
.status-info.green { background: #e8efd8; color: #4d6a2c; }
.status-info.red { background: #f7ddd5; color: #a23b28; }
.logo-preview { margin-top: 16px; }
.logo-img { width: 100%; border-radius: 8px; border: 1.5px solid var(--line); margin-top: 8px; object-fit: contain; max-height: 200px; }
.logo-link { display: inline-block; margin-top: 8px; color: var(--brick); font-weight: 700; font-size: 0.88rem; }
.spec-label { font-size: 0.78rem; font-weight: 700; color: var(--ink-soft); text-transform: uppercase; letter-spacing: 0.05em; }
.dr-note { margin-top: 18px; }
</style>
