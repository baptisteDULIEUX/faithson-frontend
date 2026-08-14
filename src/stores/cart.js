import { defineStore } from 'pinia'

const STORAGE_KEY = 'faithson_cart'

function loadItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    return []
  }
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: loadItems(), // [{ id, name, price, technique, qty, image }]
    isOpen: false
  }),

  getters: {
    count: (state) => state.items.reduce((n, i) => n + i.qty, 0),
    subtotal: (state) => state.items.reduce((s, i) => s + i.price * i.qty, 0),
    isEmpty: (state) => state.items.length === 0
  },

  actions: {
    persist() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items))
      } catch (e) {
        /* stockage indisponible : on ignore */
      }
    },
    add(product, qty = 1) {
      const line = this.items.find(
        (i) => i.id === product.id && i.technique === product.technique
      )
      if (line) {
        line.qty += qty
      } else {
        this.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          technique: product.technique || null,
          image: product.image || null,
          qty
        })
      }
      this.persist()
      this.isOpen = true
    },
    setQty(index, qty) {
      if (qty <= 0) return this.remove(index)
      this.items[index].qty = qty
      this.persist()
    },
    remove(index) {
      this.items.splice(index, 1)
      this.persist()
    },
    clear() {
      this.items = []
      this.persist()
    },
    open() {
      this.isOpen = true
    },
    close() {
      this.isOpen = false
    }
  }
})
