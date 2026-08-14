import { defineStore } from 'pinia'
import api from '@/services/api'

/* =========================================================
   AUTHENTIFICATION ADMIN
   ---------------------------------------------------------
   ⚠️  IMPORTANT — SÉCURITÉ
   Cette authentification est une PORTE DE DÉMONSTRATION côté client.
   Elle NE protège rien réellement : le code frontend est public.

   En production, la sécurité DOIT être assurée par le backend Node :
     - le mot de passe est vérifié côté serveur,
     - le serveur renvoie un jeton (JWT ou cookie de session),
     - chaque route /admin de l'API vérifie ce jeton.
   La logique ci-dessous est déjà branchée sur api.adminLogin() :
   il suffira que cette fonction appelle le vrai backend.
   ========================================================= */

const TOKEN_KEY = 'faithson_admin_token'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: sessionStorage.getItem(TOKEN_KEY) || null,
    error: null,
    loading: false
  }),

  getters: {
    isAuth: (state) => !!state.token
  },

  actions: {
    async login(password) {
      this.loading = true
      this.error = null
      try {
        const res = await api.adminLogin(password)
        this.token = res.token
        sessionStorage.setItem(TOKEN_KEY, res.token)
        return true
      } catch (e) {
        this.error = 'Mot de passe incorrect.'
        return false
      } finally {
        this.loading = false
      }
    },
    logout() {
      this.token = null
      sessionStorage.removeItem(TOKEN_KEY)
    }
  }
})
