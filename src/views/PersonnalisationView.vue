<script setup>
import { ref, reactive, computed } from 'vue'
import { RouterLink } from 'vue-router'
import api from '@/services/api'

/* ---------------- Éditeur : image + zones ---------------- */
const view = ref('front')            // 'front' | 'back'
const teeColor = ref('#3a2e27')
const teeColors = ['#3a2e27', '#b5482e', '#7c8b5a', '#e6dcc4']

const logo = ref(null)               // { src, name }
const fileInput = ref(null)

// zones prédéfinies (positions en % du vêtement)
const zones = [
  { id: 'chest-left', label: 'Poitrine gauche', side: 'front', x: 36, y: 34, def: 18 },
  { id: 'chest-center', label: 'Poitrine centre', side: 'front', x: 50, y: 37, def: 30 },
  { id: 'chest-right', label: 'Poitrine droite', side: 'front', x: 64, y: 34, def: 18 },
  { id: 'waist', label: 'Taille', side: 'front', x: 50, y: 66, def: 22 },
  { id: 'back', label: 'Dos', side: 'back', x: 50, y: 38, def: 40 }
]

// placements actifs : { [zoneId]: { scale } }
const placements = reactive({})
const activeZone = ref(null)

const currentZones = computed(() => zones.filter((z) => z.side === view.value))
const activePlacements = computed(() =>
  zones.filter((z) => placements[z.id]).map((z) => ({ ...z, scale: placements[z.id].scale }))
)
const placementLabels = computed(() => activePlacements.value.map((z) => z.label))

function triggerUpload() {
  fileInput.value && fileInput.value.click()
}
function onFile(e) {
  const f = e.target.files && e.target.files[0]
  if (!f) return
  logo.value = { src: URL.createObjectURL(f), name: f.name }
}
function removeLogo() {
  logo.value = null
  for (const k of Object.keys(placements)) delete placements[k]
  activeZone.value = null
}

function toggleZone(zone) {
  if (!logo.value) { triggerUpload(); return }
  if (placements[zone.id]) {
    activeZone.value = zone.id
  } else {
    placements[zone.id] = { scale: zone.def }
    activeZone.value = zone.id
  }
}
function removeZone(id) {
  delete placements[id]
  if (activeZone.value === id) activeZone.value = null
}

function logoStyle(zone) {
  const p = placements[zone.id]
  return {
    left: zone.x + '%',
    top: zone.y + '%',
    width: (p ? p.scale : zone.def) + '%'
  }
}

/* ---------------- Demande envoyée à l'atelier ---------------- */
const form = reactive({
  client: '', email: '',
  garment: 'T-shirt coton bio', garmentColor: 'Encre',
  technique: 'flocage', qty: 10, note: ''
})
const sending = ref(false)
const sent = ref(null)

const canSend = computed(() => form.client && form.email && form.qty > 0)

async function submitRequest() {
  if (!canSend.value) return
  sending.value = true
  try {
    const res = await api.createCustomRequest({
      client: form.client,
      email: form.email,
      garment: form.garment,
      garmentColor: form.garmentColor,
      technique: form.technique,
      placement: placementLabels.value.length ? placementLabels.value.join(', ') : 'À préciser',
      qty: Number(form.qty),
      note: form.note,
      logoName: logo.value ? logo.value.name : null
    })
    sent.value = res
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <section class="section">
    <div class="wrap">
      <div class="sec-head">
        <p class="eyebrow">Personnalisation</p>
        <h1 class="p-h1">Placez votre logo sur le vêtement</h1>
        <p class="p-lead">Importez votre image, puis cliquez sur une zone (poitrine, dos, taille) pour la positionner. Basculez entre l'avant et l'arrière du vêtement.</p>
      </div>

      <div class="editor">
        <!-- STAGE -->
        <div class="stage">
          <div class="view-toggle">
            <button :class="{ on: view === 'front' }" @click="view = 'front'">Avant</button>
            <button :class="{ on: view === 'back' }" @click="view = 'back'">Arrière</button>
          </div>

          <div class="gw">
            <!-- vêtement -->
            <svg viewBox="0 0 300 340" xmlns="http://www.w3.org/2000/svg" class="tee">
              <template v-if="view === 'front'">
                <path d="M75 55 L110 40 Q150 72 190 40 L225 55 L258 96 L226 122 L216 110 L216 300 L84 300 L84 110 L74 122 L42 96 Z" :fill="teeColor" />
                <path d="M112 44 Q150 76 188 44" fill="none" stroke="#ffffff" stroke-width="3" opacity=".28" />
              </template>
              <template v-else>
                <path d="M75 55 L110 42 Q150 56 190 42 L225 55 L258 96 L226 122 L216 110 L216 300 L84 300 L84 110 L74 122 L42 96 Z" :fill="teeColor" />
                <path d="M114 46 Q150 60 186 46" fill="none" stroke="#ffffff" stroke-width="3" opacity=".22" />
              </template>
            </svg>

            <!-- zones + logos -->
            <template v-for="zone in currentZones" :key="zone.id">
              <!-- logo placé -->
              <img
                v-if="placements[zone.id] && logo"
                :src="logo.src"
                :alt="zone.label"
                class="placed"
                :class="{ active: activeZone === zone.id }"
                :style="logoStyle(zone)"
                @click.stop="activeZone = zone.id"
              />
              <!-- marqueur de zone -->
              <button
                class="zone"
                :class="{ filled: placements[zone.id] }"
                :style="{ left: zone.x + '%', top: zone.y + '%' }"
                @click="toggleZone(zone)"
              >
                <span v-if="!placements[zone.id]" class="z-hint">+</span>
                <span class="z-label">{{ zone.label }}</span>
              </button>
            </template>
          </div>

          <p v-if="!logo" class="stage-hint">Importez une image pour commencer →</p>
        </div>

        <!-- PANEL -->
        <div class="panel">
          <!-- upload -->
          <div class="up-block">
            <input ref="fileInput" type="file" accept="image/*" hidden @change="onFile" />
            <div v-if="!logo" class="up-drop" @click="triggerUpload">
              <span class="up-ic">⬆</span>
              <b>Importer une image</b>
              <span class="up-sub">PNG, JPG ou SVG — logo de préférence détouré</span>
            </div>
            <div v-else class="up-loaded">
              <div class="up-thumb"><img :src="logo.src" :alt="logo.name" /></div>
              <div class="up-info">
                <b>{{ logo.name }}</b>
                <div class="up-actions">
                  <button class="mini" @click="triggerUpload">Changer</button>
                  <button class="mini danger" @click="removeLogo">Retirer</button>
                </div>
              </div>
            </div>
          </div>

          <!-- zones -->
          <div class="field">
            <label>Zones ({{ view === 'front' ? 'avant' : 'arrière' }})</label>
            <div class="zone-btns">
              <button
                v-for="zone in currentZones"
                :key="zone.id"
                class="zone-btn"
                :class="{ on: placements[zone.id] }"
                @click="toggleZone(zone)"
              >
                <span class="dot"></span>{{ zone.label }}
              </button>
            </div>
            <p class="tip">Astuce : cliquez une zone sur le vêtement ou ci-dessus pour y placer / retirer le logo.</p>
          </div>

          <!-- taille du logo actif -->
          <div class="field" v-if="activeZone && placements[activeZone]">
            <label>Taille du logo — {{ zones.find((z) => z.id === activeZone).label }}</label>
            <input type="range" min="8" max="55" v-model.number="placements[activeZone].scale" class="range" />
            <button class="mini danger" @click="removeZone(activeZone)">Retirer de cette zone</button>
          </div>

          <!-- couleur vêtement -->
          <div class="field">
            <label>Couleur du vêtement</label>
            <div class="sw-row">
              <button v-for="c in teeColors" :key="c" class="sw" :class="{ on: teeColor === c }" :style="{ background: c }" @click="teeColor = c" aria-label="couleur vêtement"></button>
            </div>
          </div>

          <!-- récap -->
          <div class="recap">
            <span class="r-lbl">Emplacements choisis</span>
            <span v-if="placementLabels.length" class="r-val">{{ placementLabels.join(' · ') }}</span>
            <span v-else class="r-empty">aucun pour l'instant</span>
          </div>

          <a class="btn btn-solid full" href="#demande">Envoyer ce projet à l'atelier →</a>
        </div>
      </div>

      <!-- DEMANDE -->
      <div class="request" id="demande">
        <div class="req-head">
          <p class="eyebrow">Dernière étape</p>
          <h2>Envoyez votre projet à l'atelier</h2>
          <p class="req-lead">L'atelier valide votre demande et vous propose un prix. Vous n'avez plus qu'à régler pour lancer la production.</p>
        </div>

        <div v-if="sent" class="req-success">
          <div class="check">✓</div>
          <h3>Demande envoyée&nbsp;!</h3>
          <p>Votre demande <b>{{ sent.requestId }}</b> est bien reçue. L'atelier revient vers vous avec une proposition de prix.</p>
          <RouterLink class="btn btn-out" to="/boutique">Retour à la boutique</RouterLink>
        </div>

        <div v-else class="req-card">
          <div class="grid2">
            <div class="frow"><label>Votre nom</label><input type="text" v-model="form.client" /></div>
            <div class="frow"><label>Email</label><input type="email" v-model="form.email" /></div>
          </div>
          <div class="grid2">
            <div class="frow">
              <label>Vêtement</label>
              <select v-model="form.garment">
                <option>T-shirt coton bio</option><option>Sweat à capuche</option>
                <option>Polo brodé</option><option>Totebag coton</option><option>Casquette</option>
              </select>
            </div>
            <div class="frow">
              <label>Couleur</label>
              <select v-model="form.garmentColor">
                <option>Encre</option><option>Brique</option><option>Sauge</option><option>Naturel</option>
              </select>
            </div>
          </div>
          <div class="grid2">
            <div class="frow">
              <label>Technique</label>
              <select v-model="form.technique">
                <option>flocage</option><option>impression DTF</option>
              </select>
            </div>
            <div class="frow"><label>Quantité</label><input type="number" v-model="form.qty" min="1" /></div>
          </div>

          <div class="summary-line">
            <div><span>Logo</span><b>{{ logo ? logo.name : 'aucun importé' }}</b></div>
            <div><span>Emplacements</span><b>{{ placementLabels.length ? placementLabels.join(', ') : 'à préciser' }}</b></div>
          </div>

          <div class="frow"><label>Précisions (couleurs du logo, remarques…)</label><textarea rows="3" v-model="form.note"></textarea></div>
          <button class="btn btn-solid full" :disabled="!canSend || sending" @click="submitRequest">
            {{ sending ? 'Envoi…' : 'Envoyer ma demande à l\'atelier' }}
          </button>

        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.p-h1 { font-size: clamp(2rem, 4.5vw, 2.9rem); font-weight: 900; margin-top: 6px; }
.p-lead { color: var(--ink-soft); margin-top: 12px; font-size: 1.05rem; max-width: 60ch; }

.editor { display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 40px; align-items: start; margin-top: 10px; }

/* stage */
.stage { background: var(--cream-2); border: 1.5px solid var(--line); border-radius: 14px; padding: 20px; position: relative; }
.view-toggle { display: flex; gap: 6px; justify-content: center; margin-bottom: 8px; }
.view-toggle button { border: 1.5px solid var(--line); background: var(--cream); border-radius: 100px; padding: 0.4em 1.1em; font-family: 'Karla', sans-serif; font-weight: 700; font-size: 0.85rem; cursor: pointer; }
.view-toggle button.on { background: var(--ink); color: var(--cream); border-color: var(--ink); }
.gw { position: relative; width: 78%; max-width: 360px; margin: 0 auto; aspect-ratio: 300 / 340; }
.tee { width: 100%; display: block; }

.placed { position: absolute; transform: translate(-50%, -50%); cursor: pointer; border: 2px dashed transparent; border-radius: 4px; object-fit: contain; }
.placed.active { border-color: var(--mustard); }

.zone { position: absolute; transform: translate(-50%, -50%); background: transparent; border: 1.5px dashed var(--sage); color: var(--sage); border-radius: 8px; width: 58px; height: 46px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.15s; }
.zone:hover { background: #7c8b5a22; }
.zone.filled { border-color: transparent; width: 30px; height: 30px; }
.zone.filled:hover { border-color: var(--mustard); background: transparent; }
.z-hint { font-size: 1.2rem; font-weight: 700; }
.z-label { position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%); white-space: nowrap; font-family: 'Karla', sans-serif; font-size: 0.62rem; font-weight: 700; color: var(--ink-soft); background: var(--cream); padding: 1px 6px; border-radius: 100px; border: 1px solid var(--line); opacity: 0; transition: 0.15s; }
.zone:hover .z-label { opacity: 1; }
.stage-hint { text-align: center; font-family: 'Caveat', cursive; color: var(--brick); font-size: 1.3rem; margin-top: 6px; }

/* panel */
.up-block { margin-bottom: 20px; }
.up-drop { border: 1.5px dashed var(--sage); border-radius: 10px; padding: 24px; text-align: center; cursor: pointer; background: var(--cream); transition: 0.15s; display: flex; flex-direction: column; gap: 4px; align-items: center; }
.up-drop:hover { background: #7c8b5a11; }
.up-ic { font-size: 1.6rem; color: var(--sage); }
.up-drop b { font-family: 'Fraunces', serif; font-size: 1.05rem; }
.up-sub { font-size: 0.8rem; color: var(--ink-soft); }
.up-loaded { display: flex; gap: 14px; align-items: center; background: var(--cream); border: 1.5px solid var(--line); border-radius: 10px; padding: 12px; }
.up-thumb { width: 56px; height: 56px; border-radius: 8px; border: 1.5px solid var(--line); background: var(--cream-2); overflow: hidden; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.up-thumb img { width: 100%; height: 100%; object-fit: contain; }
.up-info b { font-family: 'Fraunces', serif; font-size: 0.9rem; word-break: break-all; }
.up-actions { display: flex; gap: 8px; margin-top: 6px; }
.mini { font-size: 0.78rem; font-weight: 700; border: 1.5px solid var(--line); background: var(--cream); border-radius: 6px; padding: 0.3em 0.7em; cursor: pointer; }
.mini.danger { color: var(--brick); border-color: transparent; }
.mini.danger:hover { background: #f7ddd5; }

.field { margin-bottom: 18px; }
.field > label { display: block; font-weight: 700; font-size: 0.82rem; margin-bottom: 8px; }
.zone-btns { display: flex; flex-wrap: wrap; gap: 8px; }
.zone-btn { display: inline-flex; align-items: center; gap: 7px; border: 1.5px solid var(--line); background: var(--cream); border-radius: 100px; padding: 0.45em 0.9em; font-family: 'Karla', sans-serif; font-weight: 700; font-size: 0.82rem; cursor: pointer; }
.zone-btn .dot { width: 9px; height: 9px; border-radius: 50%; border: 1.5px solid var(--sage); }
.zone-btn.on { background: var(--ink); color: var(--cream); border-color: var(--ink); }
.zone-btn.on .dot { background: var(--mustard); border-color: var(--mustard); }
.tip { font-size: 0.78rem; color: var(--ink-soft); margin-top: 8px; }
.range { width: 100%; margin-bottom: 8px; }
.sw-row { display: flex; gap: 10px; }
.sw { width: 30px; height: 30px; border-radius: 50%; border: 2px solid #fff8; cursor: pointer; box-shadow: 0 0 0 1.5px var(--line); }
.sw.on { box-shadow: 0 0 0 2px var(--ink); }

.recap { background: var(--cream-2); border: 1.5px dashed var(--brick); border-radius: 8px; padding: 12px 16px; margin: 6px 0 16px; }
.r-lbl { display: block; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--sage); }
.r-val { font-family: 'Fraunces', serif; font-weight: 900; color: var(--brick); }
.r-empty { color: var(--ink-soft); font-style: italic; }
.full { width: 100%; justify-content: center; }

/* demande */
.request { margin-top: 60px; border-top: 1.5px dashed var(--line); padding-top: 50px; }
.req-head { max-width: 60ch; margin-bottom: 26px; }
.req-head h2 { font-size: clamp(1.7rem, 3.6vw, 2.4rem); font-weight: 900; margin-top: 6px; }
.req-lead { color: var(--ink-soft); margin-top: 12px; }
.req-card { background: var(--cream-2); border: 1.5px solid var(--line); border-radius: 12px; padding: 28px; max-width: 720px; }
.grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.frow { margin-bottom: 14px; }
.frow label { display: block; font-weight: 700; font-size: 0.8rem; margin-bottom: 6px; }
.frow input, .frow select, .frow textarea { width: 100%; padding: 0.72em 0.9em; border: 1.5px solid var(--line); border-radius: 6px; font-family: 'Karla', sans-serif; font-size: 0.95rem; background: var(--cream); color: var(--ink); }
.frow input:focus, .frow select:focus, .frow textarea:focus { outline: none; border-color: var(--brick); }
.summary-line { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; background: var(--cream); border: 1.5px solid var(--line); border-radius: 8px; padding: 12px 16px; margin-bottom: 16px; }
.summary-line span { display: block; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ink-soft); }
.summary-line b { font-family: 'Fraunces', serif; word-break: break-word; }
.req-success { background: var(--cream-2); border: 1.5px solid var(--line); border-radius: 12px; padding: 40px; text-align: center; max-width: 720px; }
.req-success .check { width: 58px; height: 58px; border-radius: 50%; background: var(--sage); color: var(--cream); display: flex; align-items: center; justify-content: center; font-size: 1.7rem; margin: 0 auto 14px; }
.req-success h3 { font-size: 1.4rem; }
.req-success p { color: var(--ink-soft); margin: 8px 0 18px; }

@media (max-width: 900px) { .editor { grid-template-columns: 1fr; } }
@media (max-width: 560px) { .grid2, .summary-line { grid-template-columns: 1fr; } }
</style>
