<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import api from '@/services/api'
import GarmentIcon from '@/components/GarmentIcon.vue'
import ImageUploader from "@/components/ImageUploader.vue";

const products = ref([])
const loading = ref(true)

const drawerOpen = ref(false)
const editingId = ref(null) // null => création
const saving = ref(false)

const shapes = ['tshirt', 'hoodie', 'polo', 'bag', 'cap']
const colors = ['#3a2e27', '#b5482e', '#7c8b5a', '#e0a93b', '#e6dcc4']
const cats = [
  { key: 'hauts', label: 'Hauts' },
  { key: 'accessoires', label: 'Accessoires' },
  { key: 'pro', label: 'Pro' }
]

const form = reactive({
  name: '', technique: 'flocage', category: 'hauts',
  price: 12, quoteOnly: false, badge: '', image: '',
  shape: 'tshirt', color: '#3a2e27'
})

onMounted(async () => {
  products.value = await api.getProducts()
  loading.value = false
})

function resetForm() {
  Object.assign(form, {
    name: '', technique: 'flocage', category: 'hauts',
    price: 12, quoteOnly: false, badge: '', image: '',
    shape: 'tshirt', color: '#3a2e27'
  })
}

function openCreate() {
  editingId.value = null
  resetForm()
  drawerOpen.value = true
}
function openEdit(p) {
  editingId.value = p.id
  Object.assign(form, {
    name: p.name,
    technique: p.technique,
    category: p.category,
    price: p.price == null ? 0 : p.price,
    quoteOnly: p.price == null,
    badge: p.badge || '',
    image: p.image || '',
    shape: p.placeholder?.shape || 'tshirt',
    color: p.placeholder?.color || '#3a2e27'
  })
  drawerOpen.value = true
}
function closeDrawer() { drawerOpen.value = false }

const canSave = computed(() => form.name.trim().length > 0)

async function save() {
  if (!canSave.value) return
  saving.value = true
  const payload = {
    name: form.name.trim(),
    technique: form.technique,
    category: form.category,
    price: form.quoteOnly ? null : Number(form.price),
    badge: form.badge.trim() || null,
    image: form.image.trim() || null,
    placeholder: { shape: form.shape, color: form.color }
  }
  try {
    if (editingId.value) {
      const updated = await api.updateProduct(editingId.value, payload)
      const idx = products.value.findIndex((p) => p.id === editingId.value)
      if (idx !== -1) products.value[idx] = updated
    } else {
      const created = await api.createProduct(payload)
      products.value.push(created)
    }
    drawerOpen.value = false
  } finally {
    saving.value = false
  }
}

async function remove(p) {
  if (!confirm(`Supprimer « ${p.name} » ?`)) return
  await api.deleteProduct(p.id)
  products.value = products.value.filter((x) => x.id !== p.id)
}

function catLabel(key) {
  return cats.find((c) => c.key === key)?.label || key
}
</script>

<template>
  <div class="adm-page">
    <div class="adm-page-head">
      <h1>Boutique</h1>
      <p>Ajoutez, modifiez ou supprimez les produits de la boutique.</p>
    </div>

    <div class="adm-card">
      <div class="adm-card-head">
        <h2>{{ products.length }} produits</h2>
        <button class="adm-btn adm-btn-solid" style="margin-left:auto" @click="openCreate">+ Ajouter un produit</button>
      </div>

      <div v-if="loading" class="adm-empty">Chargement…</div>
      <table v-else class="adm-table">
        <thead><tr><th></th><th>Nom</th><th>Catégorie</th><th>Technique</th><th>Prix</th><th></th></tr></thead>
        <tbody>
          <tr v-for="p in products" :key="p.id">
            <td class="thumb-cell">
              <div class="thumb">
                <img v-if="p.image" :src="`/images/boutique/${p.image}`" :alt="p.name" />
                <GarmentIcon v-else :shape="p.placeholder?.shape" :color="p.placeholder?.color" />
              </div>
            </td>
            <td class="adm-cli">{{ p.name }}<small v-if="p.badge">{{ p.badge }}</small></td>
            <td>{{ catLabel(p.category) }}</td>
            <td><span class="adm-tech">{{ p.technique }}</span></td>
            <td class="adm-amt" style="text-align:left">{{ p.price == null ? 'sur devis' : p.price + ' €' }}</td>
            <td class="actions">
              <button class="adm-btn adm-btn-out" @click="openEdit(p)">Modifier</button>
              <button class="adm-btn del" @click="remove(p)">Supprimer</button>
            </td>
          </tr>
          <tr v-if="!products.length"><td colspan="6"><div class="adm-empty">Aucun produit. Ajoutez-en un !</div></td></tr>
        </tbody>
      </table>
    </div>

    <!-- Drawer formulaire -->
    <div class="overlay" :class="{ show: drawerOpen }" @click="closeDrawer"></div>
    <aside class="drawer" :class="{ show: drawerOpen }">
      <div class="dr-head">
        <h2>{{ editingId ? 'Modifier le produit' : 'Nouveau produit' }}</h2>
        <button class="close" @click="closeDrawer">✕</button>
      </div>

      <div class="dr-body">
        <!-- aperçu -->
        <div class="preview">
          <div class="pv-thumb">
            <img v-if="form.image" :src="`/images/boutique/${form.image}`" :alt="form.name" />
            <GarmentIcon v-else :shape="form.shape" :color="form.color" />
          </div>
        </div>

        <div class="frow"><label>Nom du produit</label><input type="text" v-model="form.name" placeholder="ex : T-shirt coton bio" /></div>

        <div class="frow2">
          <div class="frow"><label>Catégorie</label>
            <select v-model="form.category"><option v-for="c in cats" :key="c.key" :value="c.key">{{ c.label }}</option></select>
          </div>
          <div class="frow"><label>Technique</label>
            <select v-model="form.technique">
              <option>flocage</option>
              <option>impression DTF</option>
            </select>
          </div>
        </div>

        <div class="frow2">
          <div class="frow"><label>Prix (€)</label>
            <input type="number" v-model="form.price" min="0" :disabled="form.quoteOnly" />
          </div>
          <div class="frow check">
            <label class="cbx"><input type="checkbox" v-model="form.quoteOnly" /> Sur devis (sans prix)</label>
          </div>
        </div>

        <div class="frow"><label>Badge (facultatif)</label><input type="text" v-model="form.badge" placeholder="ex : Best-seller, Éco…" /></div>

        <div class="frow">
          <label>Image du produit</label>
          <ImageUploader
              v-if="editingId"
              :productId="editingId"
              :currentImage="form.image"
              @uploaded="(url) => { form.image = url }"
          />
          <p v-else class="frow-hint">
            Sauvegardez d'abord le produit, puis revenez modifier son image.
          </p>
        </div>

        <div class="frow">
          <label>Placeholder — forme (si pas d'image)</label>
          <div class="shape-row">
            <button v-for="s in shapes" :key="s" class="shape-btn" :class="{ on: form.shape === s }" @click="form.shape = s">{{ s }}</button>
          </div>
        </div>
        <div class="frow">
          <label>Placeholder — couleur</label>
          <div class="color-row">
            <button v-for="c in colors" :key="c" class="sw" :class="{ on: form.color === c }" :style="{ background: c }" @click="form.color = c"></button>
          </div>
        </div>

        <div class="dr-actions">
          <button class="adm-btn adm-btn-solid full" :disabled="!canSave || saving" @click="save">
            {{ saving ? 'Enregistrement…' : (editingId ? 'Enregistrer les modifications' : 'Ajouter le produit') }}
          </button>
          <button class="adm-btn adm-btn-out full" @click="closeDrawer">Annuler</button>
        </div>
      </div>
    </aside>
  </div>
</template>

<style scoped>


.thumb-cell { width: 64px; }
.thumb { width: 48px; height: 48px; border-radius: 8px; background: var(--cream-2); border: 1.5px solid var(--line); overflow: hidden; display: flex; align-items: center; justify-content: center; }
.thumb img { width: 100%; height: 100%; object-fit: cover; }
.thumb :deep(svg) { width: 60%; }
.actions { text-align: right; white-space: nowrap; }
.actions .adm-btn { margin-left: 6px; }
.del { color: var(--brick); border: 1.5px solid transparent; background: none; }
.del:hover { background: #f7ddd5; }

/* drawer */
.overlay { position: fixed; inset: 0; background: #3a2e2766; opacity: 0; pointer-events: none; transition: 0.2s; z-index: 90; }
.overlay.show { opacity: 1; pointer-events: auto; }
.drawer { position: fixed; top: 0; right: 0; bottom: 0; width: min(440px, 94vw); background: var(--cream); border-left: 1.5px solid var(--line); transform: translateX(100%); transition: transform 0.25s; z-index: 100; overflow-y: auto; box-shadow: -20px 0 50px -20px #3a2e2755; }
.drawer.show { transform: translateX(0); }
.dr-head { padding: 20px 24px; background: var(--ink); color: var(--cream); display: flex; align-items: center; gap: 12px; position: sticky; top: 0; }
.dr-head h2 { color: var(--cream); font-size: 1.2rem; font-weight: 900; }
.close { margin-left: auto; background: #ffffff22; border: none; color: var(--cream); width: 32px; height: 32px; border-radius: 8px; cursor: pointer; font-size: 1rem; }
.dr-body { padding: 22px 24px 30px; }
.preview { display: flex; justify-content: center; margin-bottom: 18px; }
.pv-thumb { width: 110px; height: 110px; border-radius: 12px; background: var(--cream-2); border: 1.5px solid var(--line); display: flex; align-items: center; justify-content: center; overflow: hidden; }
.pv-thumb img { width: 100%; height: 100%; object-fit: cover; }
.pv-thumb :deep(svg) { width: 58%; }
.frow { margin-bottom: 14px; }
.frow label { display: block; font-weight: 700; font-size: 0.8rem; margin-bottom: 6px; }
.frow input[type='text'], .frow input[type='number'], .frow select { width: 100%; padding: 0.7em 0.85em; border: 1.5px solid var(--line); border-radius: 7px; font-family: 'Karla', sans-serif; font-size: 0.95rem; background: var(--panel); color: var(--ink); }
.frow input:focus, .frow select:focus { outline: none; border-color: var(--brick); }
.frow2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.frow.check { display: flex; align-items: flex-end; }
.cbx { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 0.85rem; cursor: pointer; }
.shape-row { display: flex; gap: 6px; flex-wrap: wrap; }
.shape-btn { border: 1.5px solid var(--line); background: var(--panel); border-radius: 7px; padding: 0.4em 0.7em; font-weight: 700; font-size: 0.78rem; cursor: pointer; }
.shape-btn.on { background: var(--ink); color: var(--cream); border-color: var(--ink); }
.color-row { display: flex; gap: 10px; }
.sw { width: 30px; height: 30px; border-radius: 50%; border: 2px solid #fff8; cursor: pointer; box-shadow: 0 0 0 1.5px var(--line); }
.sw.on { box-shadow: 0 0 0 2px var(--ink); }
.dr-actions { margin-top: 22px; display: flex; flex-direction: column; gap: 10px; }
.full { width: 100%; justify-content: center; }
.frow-hint { font-size: 0.82rem; color: var(--ink-soft); font-style: italic; }
code { background: var(--cream-2); border: 1px solid var(--line); border-radius: 4px; padding: 1px 5px; font-size: 0.85em; }
</style>
