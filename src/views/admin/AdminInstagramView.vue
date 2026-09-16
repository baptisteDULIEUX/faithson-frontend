<script setup>
import { ref, onMounted } from 'vue'

const posts = ref([])
const loading = ref(true)
const apiBase = import.meta.env.VITE_API_URL
const serverBase = apiBase.replace('/api', '')

const form = ref({ caption: '', link: '', featured: false, image: null })
const editingId = ref(null)
const drawerOpen = ref(false)
const saving = ref(false)
const fileInput = ref(null)
const previewUrl = ref(null)

async function load() {
  loading.value = true
  const res = await fetch(`${apiBase}/admin/instagram`)
  posts.value = await res.json()
  loading.value = false
}

onMounted(load)

function openCreate() {
  editingId.value = null
  form.value = { caption: '', link: '', featured: false, image: null }
  previewUrl.value = null
  drawerOpen.value = true
}

function openEdit(p) {
  editingId.value = p.id
  form.value = { caption: p.caption || '', link: p.link || '', featured: p.featured, image: null }
  previewUrl.value = p.image_path ? serverBase + p.image_path : null
  drawerOpen.value = true
}

function onFile(e) {
  const f = e.target.files[0]
  if (!f) return
  form.value.image = f
  previewUrl.value = URL.createObjectURL(f)
}

async function save() {
  saving.value = true
  const data = new FormData()
  data.append('caption', form.value.caption)
  data.append('link', form.value.link)
  data.append('featured', String(form.value.featured))
  if (form.value.image) data.append('image', form.value.image)

  const url = editingId.value
      ? `${apiBase}/admin/instagram/${editingId.value}`
      : `${apiBase}/admin/instagram`
  const method = editingId.value ? 'PATCH' : 'POST'

  await fetch(url, { method, body: data })
  await load()
  drawerOpen.value = false
  saving.value = false
}

async function remove(id) {
  if (!confirm('Supprimer ce post ?')) return
  await fetch(`${apiBase}/admin/instagram/${id}`, { method: 'DELETE' })
  await load()
}

async function move(index, direction) {
  const newPosts = [...posts.value]
  const target = index + direction
  if (target < 0 || target >= newPosts.length) return
      ;[newPosts[index], newPosts[target]] = [newPosts[target], newPosts[index]]
  const order = newPosts.map((p, i) => ({ id: p.id, position: i }))
  await fetch(`${apiBase}/admin/instagram/reorder`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ order })
  })
  await load()
}
</script>

<template>
  <div class="adm-page">
    <div class="adm-page-head">
      <h1>Réalisations Instagram</h1>
      <p>Gérez les posts affichés dans la section réalisations du site.</p>
    </div>

    <div class="adm-card">
      <div class="adm-card-head">
        <h2>{{ posts.length }} post{{ posts.length > 1 ? 's' : '' }}</h2>
        <button class="adm-btn adm-btn-solid" style="margin-left:auto" @click="openCreate">
          + Ajouter un post
        </button>
      </div>

      <div v-if="loading" class="adm-empty">Chargement…</div>

      <div v-else-if="!posts.length" class="adm-empty">
        Aucun post pour l'instant. Ajoutez-en un !
      </div>

      <div v-else class="ig-grid">
        <div class="ig-card" v-for="(p, i) in posts" :key="p.id">
          <div class="ig-thumb">
            <img v-if="p.image_path" :src="serverBase + p.image_path" :alt="p.caption" />
            <div v-else class="ig-ph">📷</div>
            <span v-if="p.featured" class="ig-badge">À la une</span>
          </div>
          <div class="ig-body">
            <p class="ig-caption">{{ p.caption || '—' }}</p>
            <p class="ig-link" v-if="p.link">{{ p.link }}</p>
          </div>
          <div class="ig-actions">
            <button class="adm-btn adm-btn-out" @click="move(i, -1)" :disabled="i === 0">↑</button>
            <button class="adm-btn adm-btn-out" @click="move(i, 1)" :disabled="i === posts.length - 1">↓</button>
            <button class="adm-btn adm-btn-out" @click="openEdit(p)">Modifier</button>
            <button class="adm-btn del" @click="remove(p.id)">Supprimer</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Drawer -->
    <div class="overlay" :class="{ show: drawerOpen }" @click="drawerOpen = false"></div>
    <aside class="drawer" :class="{ show: drawerOpen }">
      <div class="dr-head">
        <h2>{{ editingId ? 'Modifier le post' : 'Nouveau post' }}</h2>
        <button class="close" @click="drawerOpen = false">✕</button>
      </div>
      <div class="dr-body">
        <!-- aperçu image -->
        <div class="frow">
          <label>Image</label>
          <div class="img-preview" v-if="previewUrl">
            <img :src="previewUrl" alt="aperçu" />
            <button class="change-img" @click="fileInput.click()">Changer</button>
          </div>
          <div v-else class="drop-zone" @click="fileInput.click()">
            <span>⬆ Choisir une image</span>
          </div>
          <input ref="fileInput" type="file" accept="image/*" hidden @change="onFile" />
        </div>

        <div class="frow">
          <label>Légende</label>
          <input type="text" v-model="form.caption" placeholder="Ex : Commande association..." />
        </div>

        <div class="frow">
          <label>Lien (facultatif)</label>
          <input type="url" v-model="form.link" placeholder="https://instagram.com/p/..." />
        </div>

        <div class="frow check">
          <label class="cbx">
            <input type="checkbox" v-model="form.featured" />
            Post à la une (grande case)
          </label>
        </div>

        <div class="dr-actions">
          <button class="adm-btn adm-btn-solid full" :disabled="saving" @click="save">
            {{ saving ? 'Enregistrement…' : (editingId ? 'Enregistrer' : 'Ajouter') }}
          </button>
          <button class="adm-btn adm-btn-out full" @click="drawerOpen = false">Annuler</button>
        </div>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.ig-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; padding: 20px; }
.ig-card { border: 1.5px solid var(--line); border-radius: 10px; overflow: hidden; background: var(--cream); }
.ig-thumb { position: relative; aspect-ratio: 1/1; background: var(--cream-2); display: flex; align-items: center; justify-content: center; }
.ig-thumb img { width: 100%; height: 100%; object-fit: cover; }
.ig-ph { font-size: 2rem; color: var(--ink-soft); }
.ig-badge { position: absolute; top: 8px; left: 8px; background: var(--mustard); color: var(--ink); font-size: 0.65rem; font-weight: 700; padding: 3px 7px; border-radius: 4px; }
.ig-body { padding: 10px 12px; }
.ig-caption { font-size: 0.88rem; font-weight: 700; }
.ig-link { font-size: 0.75rem; color: var(--ink-soft); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ig-actions { display: flex; gap: 6px; padding: 8px 12px; border-top: 1px solid var(--line); flex-wrap: wrap; }
.del { color: var(--brick); border: 1.5px solid transparent; background: none; }
.del:hover { background: #f7ddd5; }

.overlay { position: fixed; inset: 0; background: #3a2e2766; opacity: 0; pointer-events: none; transition: 0.2s; z-index: 90; }
.overlay.show { opacity: 1; pointer-events: auto; }
.drawer { position: fixed; top: 0; right: 0; bottom: 0; width: min(400px, 94vw); background: var(--cream); border-left: 1.5px solid var(--line); transform: translateX(100%); transition: 0.25s; z-index: 100; overflow-y: auto; }
.drawer.show { transform: translateX(0); }
.dr-head { padding: 20px 24px; background: var(--ink); color: var(--cream); display: flex; align-items: center; gap: 12px; position: sticky; top: 0; }
.dr-head h2 { color: var(--cream); font-size: 1.1rem; font-weight: 900; }
.close { margin-left: auto; background: #ffffff22; border: none; color: var(--cream); width: 32px; height: 32px; border-radius: 8px; cursor: pointer; }
.dr-body { padding: 20px 24px; display: flex; flex-direction: column; gap: 14px; }
.frow { display: flex; flex-direction: column; gap: 6px; }
.frow label { font-weight: 700; font-size: 0.8rem; }
.frow input[type='text'], .frow input[type='url'] { padding: 0.7em 0.85em; border: 1.5px solid var(--line); border-radius: 7px; font-family: 'Karla', sans-serif; font-size: 0.95rem; background: var(--panel); }
.frow.check { flex-direction: row; align-items: center; }
.cbx { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 0.85rem; cursor: pointer; }
.img-preview { position: relative; border-radius: 8px; overflow: hidden; border: 1.5px solid var(--line); }
.img-preview img { width: 100%; max-height: 200px; object-fit: cover; display: block; }
.change-img { position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%); background: var(--ink); color: var(--cream); border: none; border-radius: 7px; padding: 0.45em 0.9em; font-family: 'Karla', sans-serif; font-weight: 700; font-size: 0.82rem; cursor: pointer; }
.drop-zone { border: 2px dashed var(--line); border-radius: 8px; padding: 24px; text-align: center; cursor: pointer; color: var(--ink-soft); background: var(--cream-2); font-weight: 700; font-size: 0.9rem; }
.drop-zone:hover { border-color: var(--brick); }
.dr-actions { display: flex; flex-direction: column; gap: 8px; margin-top: 8px; }
.full { width: 100%; justify-content: center; }

@media (max-width: 900px) { .ig-grid { grid-template-columns: repeat(2, 1fr); } }
</style>