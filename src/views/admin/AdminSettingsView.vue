<script setup>
import { ref, onMounted } from 'vue'

const apiBase = import.meta.env.VITE_API_URL
const serverBase = apiBase.replace('/api', '')

const settings = ref({})
const loading = ref(true)
const saving = ref(false)
const heroPreview = ref(null)
const fileInput = ref(null)
const uploadingHero = ref(false)
const saved = ref(false)

onMounted(async () => {
  const res = await fetch(`${apiBase}/settings`)
  settings.value = await res.json()
  if (settings.value.hero_image) {
    heroPreview.value = serverBase + settings.value.hero_image
  }
  loading.value = false
})

async function saveSetting(key) {
  saving.value = true
  await fetch(`${apiBase}/admin/settings`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, value: settings.value[key] })
  })
  saving.value = false
  saved.value = true
  setTimeout(() => (saved.value = false), 2000)
}

function onHeroFile(e) {
  const f = e.target.files[0]
  if (!f) return
  heroPreview.value = URL.createObjectURL(f)
  uploadHero(f)
}

async function uploadHero(file) {
  uploadingHero.value = true
  const formData = new FormData()
  formData.append('image', file)
  const res = await fetch(`${apiBase}/admin/settings/hero-image`, {
    method: 'POST',
    body: formData
  })
  const data = await res.json()
  settings.value.hero_image = data.path
  uploadingHero.value = false
}
</script>

<template>
  <div class="adm-page">
    <div class="adm-page-head">
      <h1>Réglages</h1>
      <p>Personnalisez le contenu de la page d'accueil.</p>
    </div>

    <div v-if="loading" class="adm-empty">Chargement…</div>

    <template v-else>
      <!-- Image hero -->
      <div class="adm-card settings-card">
        <div class="adm-card-head">
          <h2>Image d'accueil</h2>
        </div>
        <div class="settings-body">
          <div class="hero-preview" v-if="heroPreview">
            <img :src="heroPreview" alt="Image d'accueil" />
            <button class="change-btn" @click="fileInput.click()">
              {{ uploadingHero ? 'Upload…' : 'Changer l\'image' }}
            </button>
          </div>
          <div v-else class="drop-zone" @click="fileInput.click()">
            <span class="dz-icon">⬆</span>
            <p><b>Choisir une image d'accueil</b></p>
            <p class="dz-hint">JPG, PNG, WebP — 10 Mo max<br>Format recommandé : carré ou portrait</p>
          </div>
          <input ref="fileInput" type="file" accept="image/*" hidden @change="onHeroFile" />
        </div>
      </div>

      <!-- Textes hero -->
      <div class="adm-card settings-card">
        <div class="adm-card-head">
          <h2>Textes de la page d'accueil</h2>
        </div>
        <div class="settings-body">
          <div class="frow">
            <label>Titre principal</label>
            <input type="text" v-model="settings.hero_title" />
            <button class="adm-btn adm-btn-solid save-btn" @click="saveSetting('hero_title')" :disabled="saving">
              {{ saving ? '…' : 'Enregistrer' }}
            </button>
          </div>
          <div class="frow">
            <label>Sous-titre</label>
            <input type="text" v-model="settings.hero_subtitle" />
            <button class="adm-btn adm-btn-solid save-btn" @click="saveSetting('hero_subtitle')" :disabled="saving">
              {{ saving ? '…' : 'Enregistrer' }}
            </button>
          </div>
          <p v-if="saved" class="saved-msg">✓ Enregistré</p>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.settings-card { margin-bottom: 20px; }
.settings-body { padding: 20px 24px; }
.hero-preview { position: relative; border-radius: 10px; overflow: hidden; border: 1.5px solid var(--line); max-height: 300px; }
.hero-preview img { width: 100%; max-height: 300px; object-fit: cover; display: block; }
.change-btn { position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%); background: var(--ink); color: var(--cream); border: none; border-radius: 8px; padding: 0.5em 1.2em; font-family: 'Karla', sans-serif; font-weight: 700; font-size: 0.9rem; cursor: pointer; }
.drop-zone { border: 2px dashed var(--line); border-radius: 10px; padding: 40px; text-align: center; cursor: pointer; background: var(--cream-2); transition: 0.15s; }
.drop-zone:hover { border-color: var(--brick); }
.dz-icon { font-size: 2rem; color: var(--sage); }
.drop-zone p { margin: 6px 0 0; }
.dz-hint { font-size: 0.8rem; color: var(--ink-soft) !important; margin-top: 4px !important; }
.frow { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
.frow label { font-weight: 700; font-size: 0.8rem; }
.frow input { padding: 0.7em 0.85em; border: 1.5px solid var(--line); border-radius: 7px; font-family: 'Karla', sans-serif; font-size: 0.95rem; background: var(--panel); }
.save-btn { align-self: flex-start; }
.saved-msg { color: var(--sage); font-weight: 700; font-size: 0.9rem; }
</style>