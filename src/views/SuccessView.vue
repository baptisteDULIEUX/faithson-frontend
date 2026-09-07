<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

const route = useRoute()
const order = ref(null)
const loading = ref(true)
const error = ref(false)

onMounted(async () => {
  const sessionId = route.query.session_id
  if (!sessionId) { error.value = true; loading.value = false; return }

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/checkout-session/${sessionId}`)
    if (!res.ok) throw new Error()
    order.value = await res.json()
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="section">
    <div class="wrap">

      <div v-if="loading" class="center">
        <p class="loading">Chargement de votre confirmation…</p>
      </div>

      <div v-else-if="error" class="center">
        <div class="icon error">✕</div>
        <h1>Une erreur est survenue</h1>
        <p>Impossible de récupérer les détails de votre commande.<br/>Si vous avez été débité, contactez-nous à <a href="mailto:contact@faithson.fr">contact@faithson.fr</a>.</p>
        <RouterLink class="btn btn-out" to="/">Retour à l'accueil</RouterLink>
      </div>

      <div v-else class="confirm">
        <div class="icon success">✓</div>
        <h1>Merci pour votre commande&nbsp;!</h1>
        <p class="sub">Un email de confirmation a été envoyé à <b>{{ order.customerEmail }}</b>.</p>

        <div class="recap">
          <div class="recap-row">
            <span>Commande</span>
            <b>{{ order.orderId.slice(-12).toUpperCase() }}</b>
          </div>
          <div class="recap-row">
            <span>Client</span>
            <b>{{ order.customerName }}</b>
          </div>
          <div class="recap-row">
            <span>Livraison</span>
            <b>{{ order.adresse }}</b>
          </div>
          <div class="recap-row total">
            <span>Total réglé</span>
            <b>{{ order.total }} {{ order.currency }}</b>
          </div>
        </div>

        <p class="next">
          L'atelier prépare votre commande. Vous recevrez un email dès qu'elle est expédiée.
        </p>

        <div class="actions">
          <RouterLink class="btn btn-solid" to="/boutique">Continuer mes achats</RouterLink>
          <RouterLink class="btn btn-out" to="/">Retour à l'accueil</RouterLink>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
.wrap { max-width: 560px; }
.center, .confirm { text-align: center; padding: 40px 0; }
.loading { font-family: 'Caveat', cursive; font-size: 1.5rem; color: var(--ink-soft); }

.icon {
  width: 70px; height: 70px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 2rem; margin: 0 auto 24px;
}
.icon.success { background: var(--sage); color: var(--cream); }
.icon.error   { background: var(--brick); color: var(--cream); }

h1 { font-size: clamp(1.8rem, 4vw, 2.4rem); font-weight: 900; }
.sub { color: var(--ink-soft); margin: 10px 0 28px; }

.recap {
  background: var(--cream-2); border: 1.5px solid var(--line);
  border-radius: 12px; padding: 6px 24px; margin: 0 auto 24px; text-align: left;
}
.recap-row {
  display: flex; justify-content: space-between; align-items: baseline;
  padding: 12px 0; border-bottom: 1px dashed var(--line); font-size: 0.95rem;
}
.recap-row:last-child { border-bottom: none; }
.recap-row span { color: var(--ink-soft); font-weight: 700; }
.recap-row.total b { font-family: 'Fraunces', serif; font-weight: 900; font-size: 1.2rem; color: var(--brick); }

.next { color: var(--ink-soft); font-size: 0.95rem; margin-bottom: 28px; }
.actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

a { color: var(--brick); }
a:hover { text-decoration: underline; }
</style>