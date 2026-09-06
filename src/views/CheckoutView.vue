<!--<script setup>-->
<!--import { reactive, ref, computed } from 'vue'-->
<!--import { RouterLink } from 'vue-router'-->
<!--import { useCartStore } from '@/stores/cart'-->
<!--import api from '@/services/api'-->

<!--const cart = useCartStore()-->

<!--const SHIPPING = 5.9-->
<!--const shipping = computed(() => (cart.subtotal >= 80 ? 0 : SHIPPING))-->
<!--const total = computed(() => cart.subtotal + (cart.isEmpty ? 0 : shipping.value))-->

<!--const form = reactive({-->
<!--  prenom: '', nom: '', email: '',-->
<!--  adresse: '', cp: '', ville: '',-->
<!--  method: 'card',-->
<!--  card: '', exp: '', cvc: '', titulaire: ''-->
<!--})-->

<!--const processing = ref(false)-->
<!--const confirmation = ref(null) // null | { orderId, total }-->

<!--// petit formatage visuel du numéro de carte (groupes de 4)-->
<!--function onCardInput(e) {-->
<!--  const digits = e.target.value.replace(/\D/g, '').slice(0, 16)-->
<!--  form.card = digits.replace(/(.{4})/g, '$1 ').trim()-->
<!--}-->
<!--function onExpInput(e) {-->
<!--  let d = e.target.value.replace(/\D/g, '').slice(0, 4)-->
<!--  if (d.length >= 3) d = d.slice(0, 2) + '/' + d.slice(2)-->
<!--  form.exp = d-->
<!--}-->

<!--const canPay = computed(() => {-->
<!--  if (cart.isEmpty) return false-->
<!--  if (!form.prenom || !form.nom || !form.email || !form.adresse || !form.cp || !form.ville) return false-->
<!--  if (form.method === 'card') {-->
<!--    return form.card.replace(/\s/g, '').length === 16 && form.exp.length === 5 && form.cvc.length >= 3-->
<!--  }-->
<!--  return true-->
<!--})-->

<!--async function pay() {-->
<!--  if (!canPay.value) return-->
<!--  processing.value = true-->
<!--  try {-->
<!--    const res = await api.createOrder({-->
<!--      customer: { prenom: form.prenom, nom: form.nom, email: form.email },-->
<!--      shipping: { adresse: form.adresse, cp: form.cp, ville: form.ville },-->
<!--      items: cart.items,-->
<!--      total: total.value,-->
<!--      paymentMethod: form.method-->
<!--    })-->
<!--    confirmation.value = res-->
<!--    cart.clear()-->
<!--  } catch (e) {-->
<!--    alert("Le paiement n'a pas pu aboutir. Réessayez.")-->
<!--  } finally {-->
<!--    processing.value = false-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<template>-->
<!--  <section class="section">-->
<!--    <div class="wrap">-->

<!--      &lt;!&ndash; CONFIRMATION &ndash;&gt;-->
<!--      <div v-if="confirmation" class="confirm">-->
<!--        <div class="check">✓</div>-->
<!--        <h1>Merci pour votre commande&nbsp;!</h1>-->
<!--        <p>Votre commande <b>{{ confirmation.orderId }}</b> est bien enregistrée.-->
<!--          Un récapitulatif vous sera envoyé par email.</p>-->
<!--        <p class="paid">Total réglé : <b>{{ confirmation.total.toFixed(2) }} €</b></p>-->
<!--        <RouterLink class="btn btn-solid" to="/boutique">Retour à la boutique</RouterLink>-->
<!--      </div>-->

<!--      &lt;!&ndash; PANIER VIDE &ndash;&gt;-->
<!--      <div v-else-if="cart.isEmpty" class="empty">-->
<!--        <h1>Votre panier est vide</h1>-->
<!--        <p>Ajoutez un article pour passer commande.</p>-->
<!--        <RouterLink class="btn btn-solid" to="/boutique">Voir la boutique</RouterLink>-->
<!--      </div>-->

<!--      &lt;!&ndash; CHECKOUT &ndash;&gt;-->
<!--      <div v-else class="checkout">-->
<!--        <div class="forms">-->
<!--          <h1 class="page-title">Finaliser la commande</h1>-->

<!--          <div class="block">-->
<!--            <h2 class="b-title"><span class="n">1</span> Vos coordonnées</h2>-->
<!--            <div class="frow two">-->
<!--              <div><label>Prénom</label><input v-model="form.prenom" type="text" /></div>-->
<!--              <div><label>Nom</label><input v-model="form.nom" type="text" /></div>-->
<!--            </div>-->
<!--            <div class="frow"><label>Email</label><input v-model="form.email" type="email" /></div>-->
<!--          </div>-->

<!--          <div class="block">-->
<!--            <h2 class="b-title"><span class="n">2</span> Livraison</h2>-->
<!--            <div class="frow"><label>Adresse</label><input v-model="form.adresse" type="text" /></div>-->
<!--            <div class="frow two">-->
<!--              <div><label>Code postal</label><input v-model="form.cp" type="text" /></div>-->
<!--              <div><label>Ville</label><input v-model="form.ville" type="text" /></div>-->
<!--            </div>-->
<!--          </div>-->

<!--          <div class="block">-->
<!--            <h2 class="b-title"><span class="n">3</span> Paiement</h2>-->
<!--            <div class="methods">-->
<!--              <label class="method" :class="{ on: form.method === 'card' }">-->
<!--                <input type="radio" value="card" v-model="form.method" /> 💳 Carte bancaire-->
<!--              </label>-->
<!--            </div>-->

<!--            <div v-if="form.method === 'card'" class="card-form">-->
<!--              <div class="frow"><label>Numéro de carte</label>-->
<!--                <input :value="form.card" @input="onCardInput" inputmode="numeric" placeholder="0000 0000 0000 0000" />-->
<!--              </div>-->
<!--              <div class="frow two">-->
<!--                <div><label>Expiration</label>-->
<!--                  <input :value="form.exp" @input="onExpInput" inputmode="numeric" placeholder="MM/AA" />-->
<!--                </div>-->
<!--                <div><label>CVC</label>-->
<!--                  <input v-model="form.cvc" inputmode="numeric" maxlength="4" placeholder="123" />-->
<!--                </div>-->
<!--              </div>-->
<!--              <div class="frow"><label>Titulaire</label><input v-model="form.titulaire" type="text" placeholder="Nom sur la carte" /></div>-->
<!--            </div>-->


<!--          </div>-->

<!--          <button class="btn btn-solid pay-btn" :disabled="!canPay || processing" @click="pay">-->
<!--            {{ processing ? 'Traitement…' : `Payer ${total.toFixed(2)} €` }}-->
<!--          </button>-->
<!--        </div>-->

<!--        &lt;!&ndash; RÉCAP &ndash;&gt;-->
<!--        <aside class="summary">-->
<!--          <h2>Votre commande</h2>-->
<!--          <div class="s-line" v-for="(item, i) in cart.items" :key="i">-->
<!--            <span class="q">{{ item.qty }}×</span>-->
<!--            <span class="nm">{{ item.name }}<small v-if="item.technique"> · {{ item.technique }}</small></span>-->
<!--            <span class="pr">{{ item.price * item.qty }} €</span>-->
<!--          </div>-->
<!--          <div class="s-tot">-->
<!--            <div><span>Sous-total</span><span>{{ cart.subtotal.toFixed(2) }} €</span></div>-->
<!--            <div><span>Livraison</span><span>{{ shipping === 0 ? 'offerte' : shipping.toFixed(2) + ' €' }}</span></div>-->
<!--            <div class="grand"><span>Total</span><span>{{ total.toFixed(2) }} €</span></div>-->
<!--          </div>-->
<!--          <p class="free-ship" v-if="shipping !== 0">Livraison offerte dès 80 € d'achat.</p>-->
<!--        </aside>-->
<!--      </div>-->
<!--    </div>-->
<!--  </section>-->
<!--</template>-->

<!--<style scoped>-->
<!--.page-title { font-size: clamp(1.8rem, 4vw, 2.4rem); font-weight: 900; margin-bottom: 26px; }-->
<!--.checkout { display: grid; grid-template-columns: 1fr 340px; gap: 34px; align-items: start; }-->

<!--.block { background: var(&#45;&#45;cream-2); border: 1.5px solid var(&#45;&#45;line); border-radius: 12px; padding: 24px; margin-bottom: 20px; }-->
<!--.b-title { font-size: 1.25rem; display: flex; align-items: center; gap: 10px; margin-bottom: 18px; }-->
<!--.b-title .n { width: 28px; height: 28px; border-radius: 50%; background: var(&#45;&#45;brick); color: var(&#45;&#45;cream); display: flex; align-items: center; justify-content: center; font-family: 'Karla', sans-serif; font-size: 0.9rem; }-->
<!--.frow { margin-bottom: 14px; }-->
<!--.frow:last-child { margin-bottom: 0; }-->
<!--.frow label { display: block; font-weight: 700; font-size: 0.8rem; margin-bottom: 6px; }-->
<!--.frow input { width: 100%; padding: 0.75em 0.9em; border: 1.5px solid var(&#45;&#45;line); border-radius: 6px; font-family: 'Karla', sans-serif; font-size: 0.95rem; background: var(&#45;&#45;cream); color: var(&#45;&#45;ink); }-->
<!--.frow input:focus { outline: none; border-color: var(&#45;&#45;brick); }-->
<!--.frow.two { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }-->

<!--.methods { display: flex; gap: 10px; margin-bottom: 18px; flex-wrap: wrap; }-->
<!--.method { display: flex; align-items: center; gap: 8px; border: 1.5px solid var(&#45;&#45;line); border-radius: 8px; padding: 0.7em 1em; font-weight: 700; font-size: 0.9rem; cursor: pointer; background: var(&#45;&#45;cream); }-->
<!--.method.on { border-color: var(&#45;&#45;brick); box-shadow: 0 0 0 1.5px var(&#45;&#45;brick); }-->

<!--.card-form { background: var(&#45;&#45;cream); border: 1.5px dashed var(&#45;&#45;line); border-radius: 8px; padding: 18px; }-->

<!--.pay-btn { width: 100%; font-size: 1.05rem; padding: 1em; margin-top: 6px; }-->

<!--.summary { background: var(&#45;&#45;cream-2); border: 1.5px solid var(&#45;&#45;line); border-radius: 12px; padding: 24px; position: sticky; top: 96px; }-->
<!--.summary h2 { font-size: 1.2rem; margin-bottom: 16px; }-->
<!--.s-line { display: flex; gap: 8px; padding: 10px 0; border-bottom: 1px dashed var(&#45;&#45;line); font-size: 0.9rem; }-->
<!--.s-line .q { color: var(&#45;&#45;ink-soft); font-weight: 700; }-->
<!--.s-line .nm { flex: 1; }-->
<!--.s-line .nm small { color: var(&#45;&#45;ink-soft); }-->
<!--.s-line .pr { font-weight: 700; }-->
<!--.s-tot { padding-top: 14px; }-->
<!--.s-tot > div { display: flex; justify-content: space-between; padding: 4px 0; font-size: 0.92rem; }-->
<!--.s-tot .grand { font-family: 'Fraunces', serif; font-weight: 900; font-size: 1.2rem; border-top: 1.5px solid var(&#45;&#45;line); margin-top: 8px; padding-top: 12px; }-->
<!--.free-ship { font-size: 0.78rem; color: var(&#45;&#45;ink-soft); margin-top: 12px; }-->

<!--.confirm, .empty { text-align: center; padding: 40px 0 20px; max-width: 520px; margin: 0 auto; }-->
<!--.confirm h1, .empty h1 { font-size: clamp(1.8rem, 4vw, 2.4rem); font-weight: 900; }-->
<!--.confirm p, .empty p { color: var(&#45;&#45;ink-soft); margin: 12px 0; }-->
<!--.confirm .paid { font-size: 1.05rem; color: var(&#45;&#45;ink); }-->
<!--.check { width: 66px; height: 66px; border-radius: 50%; background: var(&#45;&#45;sage); color: var(&#45;&#45;cream); display: flex; align-items: center; justify-content: center; font-size: 2rem; margin: 0 auto 18px; }-->
<!--.confirm .btn, .empty .btn { margin-top: 14px; }-->
<!--code { background: var(&#45;&#45;cream); border: 1px solid var(&#45;&#45;line); border-radius: 4px; padding: 1px 5px; font-size: 0.85em; }-->

<!--@media (max-width: 900px) { .checkout { grid-template-columns: 1fr; } .summary { position: static; } }-->
<!--@media (max-width: 560px) { .frow.two { grid-template-columns: 1fr; } }-->
<!--</style>-->


<script setup>
import { reactive, ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()

const SHIPPING = 5.9
const shipping = computed(() => (cart.subtotal >= 80 ? 0 : SHIPPING))
const total = computed(() => cart.subtotal + (cart.isEmpty ? 0 : shipping.value))

// Suppression des champs de carte bancaire (gérés par Stripe)
const form = reactive({
  prenom: '', nom: '', email: '',
  adresse: '', cp: '', ville: ''
})

const processing = ref(false)
const confirmation = ref(null)

const canPay = computed(() => {
  if (cart.isEmpty) return false
  if (!form.prenom || !form.nom || !form.email || !form.adresse || !form.cp || !form.ville) return false
  return true
})

async function pay() {
  if (!canPay.value) return
  processing.value = true

  try {
    // Formatage des articles avec la bonne clé "qty" de votre store
    const formattedItems = cart.items.map(item => ({
      price_data: {
        currency: 'eur',
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.qty,
    }))

    // Appel à votre backend pour générer la session Stripe
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer: { prenom: form.prenom, nom: form.nom, email: form.email },
        shipping: { adresse: form.adresse, cp: form.cp, ville: form.ville },
        items: formattedItems
      }),
    })

    const data = await response.json()

    if (!response.ok) throw new Error(data.error)

    if (data.url) {
      // Redirection vers la page de paiement sécurisée de Stripe
      window.location.href = data.url
    }
  } catch (e) {
    alert("Le paiement n'a pas pu aboutir. Réessayez.")
    processing.value = false
  }
}
</script>

<template>
  <section class="section">
    <div class="wrap">
      <!-- Les sections CONFIRMATION et PANIER VIDE restent identiques -->

      <div v-if="!confirmation && !cart.isEmpty" class="checkout">
        <div class="forms">
          <h1 class="page-title">Finaliser la commande</h1>

          <div class="block">
            <h2 class="b-title"><span class="n">1</span> Vos coordonnées</h2>
            <div class="frow two">
              <div><label>Prénom</label><input v-model="form.prenom" type="text" /></div>
              <div><label>Nom</label><input v-model="form.nom" type="text" /></div>
            </div>
            <div class="frow"><label>Email</label><input v-model="form.email" type="email" /></div>
          </div>

          <div class="block">
            <h2 class="b-title"><span class="n">2</span> Livraison</h2>
            <div class="frow"><label>Adresse</label><input v-model="form.adresse" type="text" /></div>
            <div class="frow two">
              <div><label>Code postal</label><input v-model="form.cp" type="text" /></div>
              <div><label>Ville</label><input v-model="form.ville" type="text" /></div>
            </div>
          </div>

          <!-- La section de saisie de carte a été supprimée -->
          <div class="block">
            <h2 class="b-title"><span class="n">3</span> Paiement sécurisé</h2>
            <p style="font-size: 0.9rem; color: var(--ink-soft);">
              Vous allez être redirigé vers l'interface sécurisée de Stripe pour renseigner votre carte bancaire.
            </p>
          </div>

          <button class="btn btn-solid pay-btn" :disabled="!canPay || processing" @click="pay">
            {{ processing ? 'Redirection en cours…' : `Payer ${total.toFixed(2)} € sur Stripe` }}
          </button>
        </div>

        <!-- Le bloc RÉCAP reste identique -->
      </div>
    </div>
  </section>
</template>