<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  productId: { type: String, required: true }
})

const images = ref([])
const uploading = ref(false)
const apiBase = import.meta.env.VITE_API_URL

async function loadImages() {
  const res = await fetch(`${apiBase}/products/${props.productId}/images`)
  images.value = await res.json()
}

onMounted(loadImages)

async function uploadImage(file) {
  uploading.value = true
  const formData = new FormData()
  formData.append('image', file)
  await fetch(`${apiBase}/admin/products/${props.productId}/images`, {
    method: 'POST',
    body: formData
  })
  await loadImages()
  uploading.value = false
}

function onFileInput(e) {
  const files = Array.from(e.target.files)
  files.forEach(uploadImage)
}

function onDrop(e) {
  e.preventDefault()
  const files = Array.from(e.dataTransfer.files)
  files.forEach(uploadImage)
}

async function removeImage(id) {
  await fetch(`${apiBase}/admin/products/images/${id}`, { method: 'DELETE' })
  await loadImages()
}

async function move(index, direction) {
  const newImages = [...images.value]
  const target = index + direction
  if (target < 0 || target >= newImages.length) return
      ;[newImages[index], newImages[target]] = [newImages[target], newImages[index]]
  const order = newImages.map((img, i) => ({ id: img.id, position: i }))
  await fetch(`${apiBase}/admin/products/${props.productId}/images/reorder`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ order })
  })
  await loadImages()
}

const serverBase = apiBase.replace('/api', '')
</script>

<template>
  <div class="product-images">
    <p class="pi-label">Images du produit</p>

    <!-- grille des images existantes -->
    <div class="pi-grid" v-if="images.length">
      <div class="pi-item" v-for="(img, i) in images" :key="img.id">
        <img :src="serverBase + img.path" :alt="`Image ${i + 1}`" class="pi-img" />
        <div class="pi-badge" v-if="i === 0">principale</div>
        <div class="pi-actions">
          <button @click="move(i, -1)" :disabled="i === 0" title="Monter">↑</button>
          <button @click="move(i, 1)" :disabled="i === images.length - 1" title="Descendre">↓</button>
          <button class="del" @click="removeImage(img.id)" title="Supprimer">✕</button>
        </div>
      </div>
    </div>

    <!-- zone d'upload -->
    <div
        class="pi-drop"
        :class="{ uploading }"
        @dragover.prevent
        @drop="onDrop"
        @click="$refs.input.click()"
    >
      <span v-if="uploading" class="spinner"></span>
      <template v-else>
        <span class="pi-icon">⬆</span>
        <p><b>Glissez vos images ici</b></p>
        <p class="pi-hint">ou cliquez — JPG, PNG, WebP — 5 Mo max — plusieurs à la fois</p>
      </template>
    </div>

    <input ref="input" type="file" accept="image/*" multiple hidden @change="onFileInput" />
  </div>
</template>

<style scoped>
.pi-label { font-weight: 700; font-size: 0.8rem; margin-bottom: 8px; }
.pi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 10px; }
.pi-item { position: relative; border-radius: 8px; overflow: hidden; border: 1.5px solid var(--line); aspect-ratio: 1/1; }
.pi-img { width: 100%; height: 100%; object-fit: cover; display: block; }
.pi-badge { position: absolute; top: 6px; left: 6px; background: var(--sage); color: var(--cream); font-size: 0.6rem; font-weight: 700; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; }
.pi-actions { position: absolute; bottom: 0; left: 0; right: 0; display: flex; gap: 4px; padding: 6px; background: linear-gradient(transparent, #0006); opacity: 0; transition: 0.15s; }
.pi-item:hover .pi-actions { opacity: 1; }
.pi-actions button { flex: 1; border: none; background: #ffffffcc; border-radius: 5px; cursor: pointer; font-weight: 700; font-size: 0.78rem; padding: 4px; }
.pi-actions .del { color: var(--brick); }
.pi-actions button:disabled { opacity: 0.3; cursor: not-allowed; }
.pi-drop { border: 2px dashed var(--line); border-radius: 10px; padding: 20px; text-align: center; cursor: pointer; background: var(--cream-2); transition: 0.15s; display: flex; flex-direction: column; align-items: center; gap: 4px; }
.pi-drop:hover { border-color: var(--brick); }
.pi-drop.uploading { opacity: 0.6; cursor: wait; }
.pi-icon { font-size: 1.6rem; color: var(--sage); }
.pi-drop p { font-size: 0.88rem; margin: 0; }
.pi-hint { color: var(--ink-soft) !important; font-size: 0.76rem !important; }
.spinner { width: 26px; height: 26px; border: 3px solid var(--line); border-top-color: var(--brick); border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>