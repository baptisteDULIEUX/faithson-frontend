<script setup>
import { ref } from 'vue'

const props = defineProps({
  productId: { type: String, required: true },
  currentImage: { type: String, default: null }
})

const emit = defineEmits(['uploaded'])

const dragging = ref(false)
const uploading = ref(false)
const preview = ref(props.currentImage)
const error = ref(null)

function onDragOver(e) {
  e.preventDefault()
  dragging.value = true
}
function onDragLeave() {
  dragging.value = false
}
function onDrop(e) {
  e.preventDefault()
  dragging.value = false
  const file = e.dataTransfer.files[0]
  if (file) upload(file)
}
function onFileInput(e) {
  const file = e.target.files[0]
  if (file) upload(file)
}

async function upload(file) {
  error.value = null
  uploading.value = true

  const formData = new FormData()
  formData.append('image', file)

  try {
    const res = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/products/${props.productId}/image`,
        { method: 'POST', body: formData }
    )
    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || 'Erreur upload')
    }
    const data = await res.json()
    preview.value = data.image
    emit('uploaded', data.image)
  } catch (err) {
    error.value = err.message
  } finally {
    uploading.value = false
  }
}
</script>

<template>
  <div class="uploader">
    <!-- Aperçu si image existante -->
    <div v-if="preview" class="preview">
      <img :src="preview" alt="Image du produit" />
      <button class="change" @click="$refs.input.click()">Changer l'image</button>
    </div>

    <!-- Zone drag & drop -->
    <div
        v-else
        class="drop-zone"
        :class="{ dragging, uploading }"
        @dragover="onDragOver"
        @dragleave="onDragLeave"
        @drop="onDrop"
        @click="$refs.input.click()"
    >
      <div v-if="uploading" class="state">
        <span class="spinner"></span>
        <p>Upload en cours…</p>
      </div>
      <div v-else class="state">
        <span class="icon">⬆</span>
        <p><b>Glissez une image ici</b></p>
        <p class="hint">ou cliquez pour choisir un fichier</p>
        <p class="hint">JPG, PNG, WebP — 5 Mo max</p>
      </div>
    </div>

    <p v-if="error" class="error">{{ error }}</p>

    <input
        ref="input"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        hidden
        @change="onFileInput"
    />
  </div>
</template>

<style scoped>
.uploader { width: 100%; }

.preview { position: relative; border-radius: 10px; overflow: hidden; border: 1.5px solid var(--line); }
.preview img { width: 100%; height: 200px; object-fit: cover; display: block; }
.change {
  position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%);
  background: var(--ink); color: var(--cream); border: none; border-radius: 8px;
  padding: 0.5em 1em; font-family: 'Karla', sans-serif; font-weight: 700;
  font-size: 0.85rem; cursor: pointer;
}

.drop-zone {
  border: 2px dashed var(--line); border-radius: 10px; padding: 32px 20px;
  text-align: center; cursor: pointer; transition: 0.15s; background: var(--cream-2);
}
.drop-zone:hover, .drop-zone.dragging { border-color: var(--brick); background: #f7ddd522; }
.drop-zone.uploading { opacity: 0.7; cursor: wait; }

.state { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.icon { font-size: 2rem; color: var(--sage); }
.state p { font-size: 0.9rem; color: var(--ink); margin: 0; }
.hint { color: var(--ink-soft) !important; font-size: 0.78rem !important; }

.spinner {
  width: 28px; height: 28px; border: 3px solid var(--line);
  border-top-color: var(--brick); border-radius: 50%; animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.error { color: var(--brick); font-size: 0.85rem; margin-top: 8px; font-weight: 700; }
</style>