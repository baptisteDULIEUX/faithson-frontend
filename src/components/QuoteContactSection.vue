<script setup>
import { reactive, ref } from 'vue'
import api from '@/services/api'

const quote = reactive({ produit: 'T-shirt', quantite: '', technique: 'À conseiller', message: '' })
const sending = ref(false)
const sent = ref(null) // null | { quoteId }

async function submitQuote() {
  sending.value = true
  try {
    const res = await api.createQuote({ ...quote })
    sent.value = res
  } catch (e) {
    alert("Une erreur est survenue. Réessayez plus tard.")
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <section class="section alt">
    <div class="wrap">
      <div class="two-col">
        <!-- DEVIS -->
        <div class="form-card" id="devis">
          <p class="eyebrow">Demande de devis</p>
          <h2 class="fc-title">Dites-nous tout</h2>

          <div v-if="sent" class="success">
            <div class="check">✓</div>
            <h3>Demande envoyée&nbsp;!</h3>
            <p>On revient vers vous sous 24 h. Référence : <b>{{ sent.quoteId }}</b>.</p>
            <button class="btn btn-out" @click="sent = null">Faire une autre demande</button>
          </div>

          <template v-else>
            <div class="frow">
              <label>Produit</label>
              <select v-model="quote.produit">
                <option>T-shirt</option><option>Sweat / hoodie</option><option>Polo</option>
                <option>Totebag</option><option>Textile pro</option><option>Autre</option>
              </select>
            </div>
            <div class="frow two">
              <div>
                <label>Quantité</label>
                <input type="number" v-model="quote.quantite" placeholder="ex : 30" min="1" />
              </div>
              <div>
                <label>Technique</label>
                <select v-model="quote.technique">
                  <option>À conseiller</option><option>Sérigraphie</option><option>Broderie</option>
                  <option>Flocage</option><option>DTF</option>
                </select>
              </div>
            </div>
            <div class="frow">
              <label>Votre visuel</label>
              <label class="drop">déposez votre fichier ici
                <input type="file" hidden />
              </label>
            </div>
            <div class="frow">
              <label>Le projet en quelques mots</label>
              <textarea rows="3" v-model="quote.message" placeholder="couleurs, délai, budget…"></textarea>
            </div>
            <button class="btn btn-solid full" :disabled="sending" @click="submitQuote">
              {{ sending ? 'Envoi…' : 'Envoyer ma demande' }}
            </button>
          </template>
        </div>

        <!-- CONTACT -->
        <div class="form-card" id="contact">
          <p class="eyebrow">Contact</p>
          <h2 class="fc-title">On papote ?</h2>
          <div class="contact-line"><b>Instagram</b><span>@Faithson_Custom</span></div>
          <div class="contact-line"><b>Email</b><span>contact@faithson.fr</span></div>
          <div class="contact-line last"><b>Atelier</b><span>visite sur rendez-vous</span></div>
          <div class="frow two">
            <div><label>Nom</label><input type="text" /></div>
            <div><label>Email</label><input type="email" /></div>
          </div>
          <div class="frow"><label>Message</label><textarea rows="3"></textarea></div>
          <button class="btn btn-out full">Envoyer</button>
          <div class="callout">
            <span class="tag">Note technique</span>
            <div>L'envoi réel des formulaires passera par le backend Node (ou Formspree / EmailJS).
              Ici la demande de devis est simulée via <code>services/api.js</code>.</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
.form-card { background: var(--cream); border: 1.5px solid var(--line); border-radius: 12px; padding: 32px; position: relative; }
.form-card::before { content: ''; position: absolute; inset: 9px; border: 1.5px dashed var(--line); border-radius: 7px; pointer-events: none; }
.form-card > * { position: relative; }
.fc-title { font-size: 1.8rem; margin: 6px 0 20px; }
.frow { margin-bottom: 16px; }
.frow label { display: block; font-weight: 700; font-size: 0.82rem; margin-bottom: 7px; }
.frow input, .frow select, .frow textarea {
  width: 100%; padding: 0.75em 0.9em; border: 1.5px solid var(--line); border-radius: 6px;
  font-family: 'Karla', sans-serif; font-size: 0.95rem; background: var(--cream); color: var(--ink);
}
.frow input:focus, .frow select:focus, .frow textarea:focus { outline: none; border-color: var(--brick); }
.frow.two { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.drop {
  display: block; border: 1.5px dashed var(--sage); border-radius: 8px; padding: 20px; text-align: center;
  color: var(--sage); font-family: 'Caveat', cursive; font-weight: 700; font-size: 1.25rem;
  background: var(--cream-2); cursor: pointer;
}
.full { width: 100%; }
.contact-line { display: flex; align-items: center; padding: 12px 0; border-bottom: 1px dashed var(--line); font-weight: 500; }
.contact-line b { font-family: 'Fraunces', serif; }
.contact-line span { margin-left: auto; }
.contact-line.last { border-bottom: none; margin-bottom: 14px; }
.success { text-align: center; padding: 20px 0; }
.check { width: 54px; height: 54px; border-radius: 50%; background: var(--sage); color: var(--cream); display: flex; align-items: center; justify-content: center; font-size: 1.6rem; margin: 0 auto 14px; }
.success h3 { font-size: 1.4rem; }
.success p { margin: 8px 0 18px; color: var(--ink-soft); }
code { background: var(--cream-2); border: 1px solid var(--line); border-radius: 4px; padding: 1px 5px; font-size: 0.85em; }
@media (max-width: 900px) { .two-col { grid-template-columns: 1fr; } }
@media (max-width: 560px) { .frow.two { grid-template-columns: 1fr; } }
</style>
