<script setup>
import { ref } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const password = ref('')

async function submit() {
  const ok = await auth.login(password.value)
  if (ok) {
    const redirect = route.query.redirect || '/admin/dashboard'
    router.push(redirect)
  }
}
</script>

<template>
  <div class="login-wrap">
    <div class="login-card">
      <RouterLink class="brand" to="/">
        <span class="mk">F</span>Faithson <b>Custom</b>
      </RouterLink>
      <h1>Espace atelier</h1>
      <p class="sub">Connectez-vous pour accéder à la gestion.</p>

      <form @submit.prevent="submit">
        <label for="pw">Mot de passe</label>
        <input
          id="pw"
          type="password"
          v-model="password"
          placeholder="••••••••"
          autofocus
        />
        <p v-if="auth.error" class="err">{{ auth.error }}</p>
        <button class="btn btn-solid full" :disabled="auth.loading">
          {{ auth.loading ? 'Connexion…' : 'Se connecter' }}
        </button>
      </form>


    </div>
  </div>
</template>

<style scoped>
.login-wrap { min-height: 70vh; display: flex; align-items: center; justify-content: center; padding: 60px 20px; }
.login-card { width: 100%; max-width: 400px; background: var(--panel); border: 1.5px solid var(--line); border-radius: 16px; padding: 36px; position: relative; box-shadow: 0 30px 60px -34px #3a2e2755; }
.login-card::before { content: ''; position: absolute; inset: 10px; border: 1.5px dashed var(--line); border-radius: 11px; pointer-events: none; }
.login-card > * { position: relative; }
.brand { display: inline-flex; align-items: center; gap: 0.5em; font-family: 'Fraunces', serif; font-weight: 900; font-size: 1.3rem; margin-bottom: 18px; }
.brand b { color: var(--brick); }
.brand .mk { width: 30px; height: 30px; border-radius: 8px; background: var(--brick); color: var(--cream); display: flex; align-items: center; justify-content: center; font-weight: 900; transform: rotate(-4deg); }
h1 { font-size: 1.5rem; font-weight: 900; }
.sub { color: var(--ink-soft); margin: 6px 0 22px; font-size: 0.92rem; }
label { display: block; font-weight: 700; font-size: 0.82rem; margin-bottom: 7px; }
input { width: 100%; padding: 0.8em 1em; border: 1.5px solid var(--line); border-radius: 8px; font-family: 'Karla', sans-serif; font-size: 1rem; background: var(--cream); color: var(--ink); }
input:focus { outline: none; border-color: var(--brick); }
.err { color: var(--brick); font-size: 0.85rem; font-weight: 700; margin: 10px 0 0; }
.full { width: 100%; justify-content: center; margin-top: 16px; }

code { background: var(--cream); border: 1px solid var(--line); border-radius: 4px; padding: 1px 6px; font-weight: 700; color: var(--ink); }
</style>
