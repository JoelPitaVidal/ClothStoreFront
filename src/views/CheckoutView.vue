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
  :disabled="loading || !stripe || !elements" 
  class="btn-checkout"
>
  {{ loading ? 'Procesando...' : 'Confirmar Pago con Tarjeta' }}
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
const loading = ref(false)
const pedidoIdActivo = ref(null)
const montoPedido = ref(0)

let stripe = null
let elements = null

// Si el carrito está vacío (por un F5), usamos el monto del pedido creado
const totalMostrado = computed(() => {
  return cartStore.totalPrecio > 0 ? cartStore.totalPrecio : montoPedido.value
})

onMounted(async () => {
  // 1. Cargar Stripe
  stripe = await loadStripe('pk_test_51TObxb9kgrSKPXQeyU8gfL0Jn6KdhWRTK5Ek1KuSTq0bwsXKGfbNTa48KDiy0UEA3kCOeCVIQ6U5WihQv69rSnrz00XX2r4JnO')

  try {
    // 2. Intentar crear pedido o recuperar el último pendiente
    let pedidoId;
    try {
      const pedidoRes = await api.crearPedido()
      pedidoId = pedidoRes.data.id
      montoPedido.value = pedidoRes.data.total
    } catch (err) {
      // Si falla porque el carrito está vacío, buscamos en el historial el pendiente
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

    // 3. Obtener Client Secret para Stripe
    const intentRes = await api.crearIntentoStripe(pedidoId)
    const clientSecret = intentRes.data.clientSecret

    // 4. Montar Elementos
    elements = stripe.elements({ clientSecret })
    const paymentElement = elements.create('payment')
    paymentElement.mount('#payment-element')
    
  } catch (err) {
    console.error("Error inicializando:", err)
    alert("Debes tener productos en el carrito para acceder al pago.")
    router.push('/carrito')
  }

  // 5. Configurar PayPal
  if (window.paypal && pedidoIdActivo.value) {
    window.paypal.Buttons({
      createOrder: async () => {
        // Usamos el pedido ya creado anteriormente
        const intentRes = await api.crearIntentoPaypal(pedidoIdActivo.value)
        return intentRes.data.paypal_order_id 
      },
      onApprove: async (data) => {
        await api.confirmarPagoPaypal(data.orderID, pedidoIdActivo.value)
        await cartStore.limpiarCarrito()
        router.push('/pago-exitoso')
      }
    }).render('#paypal-button-container')
  }
})

async function pagarConStripe() {
  if (loading.value || !stripe || !elements) return
  loading.value = true
  
  try {
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/pago-exitoso`,
      },
    })

    if (error) {
      const messageContainer = document.querySelector('#payment-message')
      messageContainer.textContent = error.message
    }
  } catch (e) {
    console.error("Error en el pago:", e)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.cart-page { min-height: 100vh; padding: 40px 0; color: #e0d5e8; background: #050505; }
.payment-card { background: rgba(15, 15, 15, 0.9); border: 1px solid #2a2a2a; padding: 2rem; margin-bottom: 2rem; border-radius: 4px; }
.stripe-input-container { padding: 1rem; background: #000; border: 1px solid #444; border-radius: 4px; min-height: 40px; margin-bottom: 1.5rem; }
.btn-checkout { width: 100%; padding: 1.2rem; background: #4b0082; color: white; border: none; font-family: 'Cinzel', serif; cursor: pointer; transition: 0.3s; }
.btn-checkout:hover:not(:disabled) { background: #6a0dad; }
.btn-checkout:disabled { background: #222; color: #555; cursor: not-allowed; }
.error-text { color: #ff4444; font-size: 0.85rem; margin-bottom: 15px; }
</style>