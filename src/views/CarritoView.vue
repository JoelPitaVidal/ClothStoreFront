<template>
  <div class="cart-page">
    <div class="container">
      <header class="cart-title-section">
        <h1 class="title-gothic">Carrito ✦</h1>
        <p v-if="cartStore.items?.length > 0" class="subtitle">
          Has reclamado {{ cartStore.totalItems }} objetos del vacío.
        </p>
      </header>

      <!-- ESTADO DE CARGA -->
      <div v-if="cartStore.loading && (!cartStore.items || cartStore.items.length === 0)" class="loading-state">
        <div class="spinner"></div>
        <p>Invocando reliquias...</p>
      </div>

      <!-- ESTADO VACÍO -->
      <div v-else-if="!cartStore.items || cartStore.items.length === 0" class="empty-state">
        <p>Carrito vacío, explora para descubrir nuestros productos.</p>
        <RouterLink to="/productos" class="btn-primary-gothic">Volver a la Tienda</RouterLink>
      </div>

      <!-- GRID DEL CARRITO -->
      <div v-else class="cart-grid">
        <main class="cart-items">
          <div v-for="item in cartStore.items" :key="item.id" class="cart-item">
            <!-- Verificamos que exista la información del producto -->
            <template v-if="item.producto || item.productos">
              <div class="item-img-container">
                <img 
                  :src="(item.producto?.imagen_url || item.productos?.imagen_url)" 
                  :alt="(item.producto?.nombre || item.productos?.nombre)" 
                  class="item-img"
                >
              </div>
              
              <div class="item-info">
                <h3 class="product-name">{{ item.producto?.nombre || item.productos?.nombre }}</h3>
                <p class="product-category">
                  Esencia: {{ item.producto?.categoria?.nombre || item.productos?.categoria?.nombre || 'Reliquia' }}
                </p>
                
                <div class="quantity-wrapper">
                  <button @click="actualizar(item, item.cantidad - 1)" class="qty-btn" :disabled="item.cantidad <= 1">−</button>
                  <span class="qty-number">{{ item.cantidad }}</span>
                  <button @click="actualizar(item, item.cantidad + 1)" class="qty-btn">+</button>
                </div>
              </div>

              <div class="item-price-actions">
                <p class="subtotal">
                  {{ ((item.producto?.precio || item.productos?.precio || 0) * item.cantidad).toFixed(2) }}€
                </p>
                <button class="btn-delete" @click="eliminar(item.id)">
                  🗑 Eliminar
                </button>
              </div>
            </template>
          </div>

          <div class="cart-actions-bottom">
            <button class="btn-clear" @click="vaciar">Vaciar Alijo</button>
          </div>
        </main>

        <aside class="cart-summary">
          <div class="summary-card">
            <h2 class="summary-title">Resumen del Ritual</h2>
            <div class="summary-details">
              <div class="summary-row">
                <span>Subtotal</span>
                <span>{{ (cartStore.totalPrecio || 0).toFixed(2) }}€</span>
              </div>
              <div class="summary-row">
                <span>Envío</span>
                <span class="free">Gratis (Cortesía nocturna)</span>
              </div>
              <hr class="summary-divider">
              <div class="summary-row total">
                <span>Total</span>
                <span>{{ (cartStore.totalPrecio || 0).toFixed(2) }}€</span>
              </div>
            </div>
            <button class="btn-checkout" @click="procederAlPago">
              Finalizar Ritual
            </button>
            <p class="secure-text">🔒 Transacción protegida por las sombras</p>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()

onMounted(() => {
  cartStore.fetchCarrito()
})

async function actualizar(item, nuevaCantidad) {
  const pId = item.producto_id || item.producto?.id || item.productos?.id
  if (pId) {
    await cartStore.actualizarCantidad(pId, nuevaCantidad)
  }
}

async function eliminar(id) {
  if (confirm("¿Seguro que deseas desterrar este objeto?")) {
    await cartStore.eliminarProducto(id)
  }
}

async function vaciar() {
  if (confirm("¿Vaciar todo el alijo? El vacío es absoluto.")) {
    await cartStore.limpiarCarrito()
  }
}

function procederAlPago() {
  alert("Próximamente: Integración con la pasarela de pagos sombría.")
}
</script>

<style scoped>
/* Tu CSS se mantiene igual, está perfecto para la estética gótica */
.cart-page { min-height: 100vh; padding-top: 100px; padding-bottom: 3rem; background-color: #050505; color: #e0d5e8; }
.container { max-width: 1100px; margin: 0 auto; padding: 0 1.5rem; }
.cart-title-section { text-align: left; margin-bottom: 2.5rem; border-bottom: 1px solid #1a1a1a; padding-bottom: 1rem; }
.title-gothic { font-family: 'Cinzel', serif; font-size: 2rem; color: #8121d0; text-transform: uppercase; letter-spacing: 2px; }
.subtitle { color: #a394ac; font-size: 0.9rem; margin-top: 0.5rem; }
.cart-grid { display: grid; grid-template-columns: 1fr 350px; gap: 2.5rem; align-items: start; }
.cart-item { display: flex; gap: 1.5rem; background: rgba(15, 15, 15, 0.6); border: 1px solid #1a1a1a; padding: 1.2rem; margin-bottom: 1rem; border-radius: 2px; align-items: center; }
.item-img-container { width: 90px; height: 110px; flex-shrink: 0; overflow: hidden; border: 1px solid #333; }
.item-img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(0.3); transition: 0.3s; }
.item-info { flex: 1; }
.product-name { font-family: 'Cinzel', serif; font-size: 1rem; color: #e0d5e8; margin-bottom: 0.2rem; }
.product-category { font-size: 0.7rem; color: #8121d0; text-transform: uppercase; margin-bottom: 1rem; }
.quantity-wrapper { display: flex; align-items: center; gap: 0.8rem; background: #000; width: fit-content; border: 1px solid #222; }
.qty-btn { background: transparent; border: none; color: #8121d0; width: 30px; height: 30px; cursor: pointer; font-size: 1.2rem; }
.qty-btn:hover:not(:disabled) { background: #8121d0; color: white; }
.qty-number { font-family: 'monospace'; min-width: 20px; text-align: center; }
.item-price-actions { text-align: right; display: flex; flex-direction: column; gap: 1rem; }
.subtotal { font-size: 1.1rem; font-weight: bold; color: #e0d5e8; }
.btn-delete { background: transparent; border: none; color: #555; font-size: 0.7rem; cursor: pointer; text-transform: uppercase; }
.btn-delete:hover { color: #ff4444; }
.btn-clear { background: transparent; border: 1px solid #222; color: #555; padding: 0.5rem 1rem; font-size: 0.7rem; cursor: pointer; }
.summary-card { background: #0a0a0a; border: 1px solid #1a1a1a; padding: 1.5rem; position: sticky; top: 100px; }
.summary-title { font-family: 'Cinzel', serif; font-size: 1.1rem; color: #8121d0; margin-bottom: 1.5rem; text-transform: uppercase; }
.summary-row { display: flex; justify-content: space-between; margin-bottom: 0.8rem; font-size: 0.85rem; color: #a394ac; }
.summary-divider { border: 0; border-top: 1px solid #1a1a1a; margin: 1rem 0; }
.summary-row.total { font-size: 1.3rem; color: #fff; font-family: 'Cinzel', serif; }
.btn-checkout { width: 100%; background: #8121d0; color: #fff; border: none; padding: 1rem; font-family: 'Cinzel', serif; text-transform: uppercase; cursor: pointer; margin-top: 1.5rem; }
.btn-checkout:hover { background: #9d3df0; }
.empty-state { text-align: center; padding: 8rem 0; }
.btn-primary-gothic { display: inline-block; background: transparent; border: 1px solid #8121d0; color: #8121d0; padding: 0.8rem 2rem; text-decoration: none; font-family: 'Cinzel', serif; margin-top: 1.5rem; }

@media (max-width: 850px) {
  .cart-grid { grid-template-columns: 1fr; }
  .summary-card { position: static; margin-top: 2rem; }
  .cart-item { flex-direction: column; text-align: center; }
}
</style>