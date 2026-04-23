<template>
  <div class="checkout-page">
    <div class="container">
      <header class="checkout-header">
        <h1 class="page-title">Finalizar Pedido</h1>
        <p class="page-subtitle">Complete los detalles de pago para procesar su compra</p>
      </header>

      <div class="checkout-grid">
        <main class="payment-container">
          <section class="payment-section">
            <h2 class="section-title">Tarjeta de Crédito / Débito</h2>

            <div id="payment-element" class="stripe-element-container">
              <div v-if="!elementsReady" class="loading-overlay">
                <div class="spinner"></div>
                <span>Cargando pasarela de pago segura...</span>
              </div>
            </div>

            <div v-if="errorMsg" class="alert-error">{{ errorMsg }}</div>

            <button
              @click="pagarConStripe"
              :disabled="loading || !stripeReady || !elementsReady"
              class="btn-primary"
            >
              <span v-if="loading" class="spinner-button"></span>
              {{ loading ? 'Procesando pago...' : 'Pagar ahora con tarjeta' }}
            </button>
          </section>

          <section class="payment-section">
            <h2 class="section-title">PayPal</h2>
            <div id="paypal-button-container"></div>
          </section>
        </main>

        <aside class="summary-container">
          <div class="summary-box">
            <h2 class="section-title">Resumen de la transacción</h2>
            <div class="summary-details">
              <div class="summary-item">
                <span>Productos:</span>
                <span>{{ cartStore.totalItems }}</span>
              </div>
              <div class="summary-item">
                <span>Gastos de envío:</span>
                <span class="text-success">Gratis</span>
              </div>
              <div class="summary-divider"></div>
              <div class="summary-item total">
                <span>Total a pagar:</span>
                <span class="total-price">{{ totalMostrado.toFixed(2) }}€</span>
              </div>
            </div>
            <div class="security-info">
              <p>🔒 Transacción segura mediante cifrado SSL de 256 bits</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, nextTick } from 'vue'  // ✅ nextTick añadido
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import * as api from '@/api/index'
import { loadStripe } from '@stripe/stripe-js'

const cartStore = useCartStore()
const router = useRouter()

const loading = ref(false)
const pedidoIdActivo = ref(null)
const montoPedido = ref(0)
const stripeReady = ref(null)
const elementsReady = ref(null)
const errorMsg = ref('')

const totalMostrado = computed(() => {
  return cartStore.totalPrecio > 0 ? cartStore.totalPrecio : montoPedido.value
})

onMounted(async () => {
  try {
    // 1. Inicializar Stripe
    stripeReady.value = await loadStripe('pk_test_51TObxb9kgrSKPXQeyU8gfL0Jn6KdhWRTK5Ek1KuSTq0bwsXKGfbNTa48KDiy0UEA3kCOeCVIQ6U5WihQv69rSnrz00XX2r4JnO')
    if (!stripeReady.value) throw new Error("No se pudo inicializar Stripe.")

    // 2. Crear o recuperar pedido
    let pedidoId
    try {
      const pedidoRes = await api.crearPedido()
      pedidoId = pedidoRes.data.id
      montoPedido.value = pedidoRes.data.total
    } catch (err) {
      // Fallback: recuperar pedido pendiente si el carrito está vacío (F5)
      const misPedidos = await api.getMisPedidos()
      const pendiente = misPedidos.data.find(p => p.estado === 'pendiente')
      if (pendiente) {
        pedidoId = pendiente.id
        montoPedido.value = pendiente.total
      } else {
        throw new Error("No hay pedido activo ni carrito con productos.")
      }
    }

    pedidoIdActivo.value = pedidoId

    // 3. Crear intento de pago en Stripe
    const intentRes = await api.crearIntentoStripe(pedidoId)
    const clientSecret = intentRes.data.clientSecret || intentRes.data.client_secret

    if (!clientSecret) {
      console.error("[Checkout] Respuesta recibida:", intentRes.data)
      throw new Error("No se recibió el clientSecret de Stripe.")
    }

    // 4. Crear instancia de Elements
    elementsReady.value = stripeReady.value.elements({
      clientSecret,
      appearance: {
        theme: 'night',
        variables: {
          colorPrimary: '#8121d0',
          colorBackground: '#1a1a1a',
          colorText: '#ffffff',
          fontFamily: 'Inter, system-ui, sans-serif',
        }
      }
    })

    // ✅ FIX CRÍTICO: Esperar a que Vue renderice el DOM antes de montar Stripe
    await nextTick()

    const paymentElement = elementsReady.value.create('payment')
    paymentElement.mount('#payment-element')

    if (window.paypal) renderPayPal()

  } catch (err) {
    console.error("[Checkout Error]:", err)
    const mensaje = err?.response?.data?.detail || err?.message || "Error al inicializar el pago"
    errorMsg.value = mensaje
    alert(`Error: ${mensaje}`)
    router.push('/carrito')
  }
})

function renderPayPal() {
  window.paypal.Buttons({
    style: { layout: 'vertical', shape: 'rect' },
    createOrder: async () => {
      const intentRes = await api.crearIntentoPaypal(pedidoIdActivo.value)
      return intentRes.data.paypal_order_id
    },
    onApprove: async (data) => {
      loading.value = true
      try {
        await api.confirmarPagoPaypal(data.orderID, pedidoIdActivo.value)
        await cartStore.limpiarCarrito()
        router.push({ path: '/pago-exitoso', query: { pedido_id: pedidoIdActivo.value } })
      } catch (e) {
        alert("Error en la confirmación del pago. Por favor, contacte con soporte.")
      } finally {
        loading.value = false
      }
    }
  }).render('#paypal-button-container')
}

async function pagarConStripe() {
  if (loading.value || !stripeReady.value || !elementsReady.value) return
  loading.value = true
  errorMsg.value = ''

  try {
    const { error } = await stripeReady.value.confirmPayment({
      elements: elementsReady.value,
      confirmParams: {
        return_url: `${window.location.origin}/pago-exitoso?pedido_id=${pedidoIdActivo.value}`,
      },
    })

    if (error) {
      errorMsg.value = error.message
    }
  } catch (e) {
    console.error("[Stripe Submit Error]:", e)
    errorMsg.value = "Error inesperado al procesar el pago."
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.checkout-page {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  min-height: 100vh;
  padding: 120px 20px 60px;
}

.container { max-width: 1100px; margin: 0 auto; }

.checkout-header {
  margin-bottom: 40px;
  border-bottom: 1px solid var(--border-light);
  padding-bottom: 20px;
}

.page-title { font-size: 1.8rem; font-weight: 700; margin-bottom: 8px; }
.page-subtitle { color: var(--text-secondary); font-size: 0.95rem; }

.checkout-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 30px;
}

.payment-section {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  padding: 30px;
  margin-bottom: 25px;
  border-radius: 4px;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 25px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stripe-element-container {
  min-height: 200px;
  margin-bottom: 25px;
  padding: 15px;
  background: var(--bg-primary);
  border: 1px solid var(--border-light);
}

.loading-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 170px;
  gap: 12px;
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.btn-primary {
  width: 100%;
  padding: 15px;
  background: var(--accent-color);
  color: white;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

.summary-box {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  padding: 25px;
  position: sticky;
  top: 130px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.summary-divider { border-top: 1px solid var(--border-light); margin: 20px 0; }

.summary-item.total { font-size: 1.2rem; font-weight: 700; color: var(--text-primary); }
.total-price { color: var(--accent-color); }

.security-info {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid var(--border-light);
  text-align: center;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.text-success { color: #2ecc71; }

.alert-error {
  color: #e74c3c;
  margin-bottom: 15px;
  font-size: 0.85rem;
  padding: 10px;
  border: 1px solid #e74c3c;
  border-radius: 4px;
}

.spinner {
  width: 35px; height: 35px;
  border: 3px solid var(--border-light);
  border-top-color: var(--accent-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 900px) {
  .checkout-grid { grid-template-columns: 1fr; }
  .summary-box { position: static; }
}
</style>