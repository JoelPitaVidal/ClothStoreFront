<template>
  <div class="cart-page">
    <div class="container">
      <header class="cart-title-section">
        <h1 class="title-gothic">Finalizar Pedido</h1>
        <p class="subtitle">Selecciona tu método de pago para completar la adquisición</p>
      </header>

      <div class="cart-grid">
        <main class="payment-methods">
          <div class="payment-card stripe-section">
            <h2 class="summary-title">Tarjeta de Crédito / Débito</h2>
            
            <div id="payment-element" class="stripe-input-container"></div>
            
            <div id="payment-message" class="error-text"></div>
            
            <button 
              @click="pagarConStripe" 
              :disabled="loading || !stripeReady || !elementsReady" 
              class="btn-checkout"
            >
              {{ loading ? 'Procesando Transacción...' : 'Confirmar Pago con Tarjeta' }}
            </button>
          </div>

          <div class="payment-card">
            <h2 class="summary-title">PayPal</h2>
            <div id="paypal-button-container"></div>
          </div>
        </main>

        <aside class="cart-summary">
          <div class="summary-card">
            <h2 class="summary-title">Resumen Final</h2>
            <div class="summary-details">
              <div class="summary-row total">
                <span>Total del Pedido</span>
                <span>{{ totalMostrado.toFixed(2) }}€</span>
              </div>
            </div>
            <p class="secure-text">🔒 Conexión encriptada de extremo a extremo</p>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import * as api from '@/api/index' 
import { loadStripe } from '@stripe/stripe-js'

const cartStore = useCartStore()
const router = useRouter()

// Estados reactivos
const loading = ref(false)
const pedidoIdActivo = ref(null)
const montoPedido = ref(0)
const stripeReady = ref(null)
const elementsReady = ref(null)

const totalMostrado = computed(() => {
  return cartStore.totalPrecio > 0 ? cartStore.totalPrecio : montoPedido.value
})

onMounted(async () => {
  // 1. Cargar Stripe y asignarlo a la ref
  stripeReady.value = await loadStripe('pk_test_51TObxb9kgrSKPXQeyU8gfL0Jn6KdhWRTK5Ek1KuSTq0bwsXKGfbNTa48KDiy0UEA3kCOeCVIQ6U5WihQv69rSnrz00XX2r4JnO')

  try {
    let pedidoId;
    try {
      const pedidoRes = await api.crearPedido()
      pedidoId = pedidoRes.data.id
      montoPedido.value = pedidoRes.data.total
    } catch (err) {
      // Intento recuperar pedido pendiente si el carrito está vacío
      const misPedidos = await api.getMisPedidos()
      const pendiente = misPedidos.data.find(p => p.estado === 'pendiente')
      if (pendiente) {
        pedidoId = pendiente.id
        montoPedido.value = pendiente.total
      } else {
        throw new Error("No hay productos ni pedidos pendientes")
      }
    }

    pedidoIdActivo.value = pedidoId

    // 2. Obtener Client Secret
    const intentRes = await api.crearIntentoStripe(pedidoId)
    const clientSecret = intentRes.data.clientSecret

    // 3. Crear elementos y asignarlos a la ref
    elementsReady.value = stripeReady.value.elements({ 
      clientSecret,
      appearance: { theme: 'night', labels: 'floating' } 
    })
    
    const paymentElement = elementsReady.value.create('payment')
    paymentElement.mount('#payment-element')

    // 4. PayPal
    renderPayPal()
    
  } catch (err) {
    console.error("Error inicializando:", err)
    alert("Error al cargar la pasarela de pago.")
    router.push('/carrito')
  }
})

function renderPayPal() {
  if (window.paypal && pedidoIdActivo.value) {
    window.paypal.Buttons({
      createOrder: async () => {
        const intentRes = await api.crearIntentoPaypal(pedidoIdActivo.value)
        return intentRes.data.paypal_order_id 
      },
      onApprove: async (data) => {
        loading.value = true
        try {
          await api.confirmarPagoPaypal(data.orderID, pedidoIdActivo.value)
          await cartStore.limpiarCarrito()
          router.push({ path: '/pago-exitoso', query: { pedido_id: pedidoIdActivo.value }})
        } catch (e) {
          alert("Error al verificar el pago")
        } finally {
          loading.value = false
        }
      }
    }).render('#paypal-button-container')
  }
}

async function pagarConStripe() {
  if (loading.value || !stripeReady.value || !elementsReady.value) return
  loading.value = true
  
  try {
    const { error } = await stripeReady.value.confirmPayment({
      elements: elementsReady.value,
      confirmParams: {
        return_url: `${window.location.origin}/pago-exitoso?pedido_id=${pedidoIdActivo.value}`,
      },
    })

    if (error) {
      const messageContainer = document.querySelector('#payment-message')
      if (messageContainer) messageContainer.textContent = error.message
      loading.value = false
    }
  } catch (e) {
    console.error("Error en el pago:", e)
    loading.value = false
  }
}
</script>

<style scoped>
.cart-page { min-height: 100vh; padding: 40px 0; color: #e0d5e8; background: #050505; }
.payment-card { background: rgba(15, 15, 15, 0.9); border: 1px solid #2a2a2a; padding: 2rem; margin-bottom: 2rem; border-radius: 4px; }
.stripe-input-container { padding: 1rem; background: #000; border: 1px solid #444; border-radius: 4px; min-height: 40px; margin-bottom: 1.5rem; }
.btn-checkout { width: 100%; padding: 1.2rem; background: #4b0082; color: white; border: none; font-family: 'Cinzel', serif; cursor: pointer; transition: 0.3s; font-size: 1.1rem; }
.btn-checkout:hover:not(:disabled) { background: #6a0dad; box-shadow: 0 0 15px rgba(106, 13, 173, 0.4); }
.btn-checkout:disabled { background: #222; color: #555; cursor: not-allowed; border: 1px solid #333; }
.error-text { color: #ff4444; font-size: 0.85rem; margin-bottom: 15px; font-weight: bold; min-height: 20px; }
</style>