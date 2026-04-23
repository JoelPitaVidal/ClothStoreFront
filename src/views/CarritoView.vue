<template>
  <div class="cart-page">
    <div class="container">
      <header class="cart-title-section">
        <h1 class="title-gothic">Mi Carrito</h1>
        <p v-if="cartStore.items?.length > 0" class="subtitle">
          Tienes {{ cartStore.totalItems }} producto(s) en su selección
        </p>
      </header>

      <div v-if="cartStore.loading && (!cartStore.items || cartStore.items.length === 0)" class="loading-state">
        <div class="spinner"></div>
        <p>Sincronizando productos...</p>
      </div>

      <div v-else-if="!cartStore.items || cartStore.items.length === 0" class="empty-state">
        <p class="empty-text">Tu carrito está actualmente vacío.</p>
        <RouterLink to="/productos" class="btn-primary-gothic">Ver Catálogo</RouterLink>
      </div>

      <div v-else class="cart-grid">
        <main class="cart-items">
          <div v-for="item in cartStore.items" :key="item.id" class="cart-item">
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
                  Categoría: {{ item.producto?.categoria?.nombre || item.productos?.categoria?.nombre || 'General' }}
                </p>
                
                <div class="quantity-wrapper">
                  <button 
                    @click="actualizar(item, item.cantidad - 1)" 
                    class="qty-btn" 
                    :disabled="item.cantidad <= 1"
                  >−</button>
                  <span class="qty-number">{{ item.cantidad }}</span>
                  <button 
                    @click="actualizar(item, item.cantidad + 1)" 
                    class="qty-btn"
                  >+</button>
                </div>
              </div>

              <div class="item-price-actions">
                <p class="subtotal">
                  {{ ((item.producto?.precio || item.productos?.precio || 0) * item.cantidad).toFixed(2) }}€
                </p>
                <button class="btn-delete" @click="eliminar(item.id)">
                  Quitar
                </button>
              </div>
            </template>
          </div>

          <div class="cart-actions-bottom">
            <button class="btn-clear" @click="vaciar">Vaciar carrito</button>
          </div>
        </main>

        <aside class="cart-summary">
          <div class="summary-card">
            <h2 class="summary-title">Resumen del pedido</h2>
            <div class="summary-details">
              <div class="summary-row">
                <span>Subtotal</span>
                <span>{{ (cartStore.totalPrecio || 0).toFixed(2) }}€</span>
              </div>
              <div class="summary-row">
                <span>Envío</span>
                <span class="free">Gratis</span>
              </div>
              <hr class="summary-divider">
              <div class="summary-row total">
                <span>Total</span>
                <span class="total-amount">{{ (cartStore.totalPrecio || 0).toFixed(2) }}€</span>
              </div>
            </div>

            <button 
              class="btn-checkout" 
              @click="procederAlPago"
              :disabled="cartStore.loading || cartStore.items.length === 0"
            >
              {{ cartStore.loading ? 'PROCESANDO...' : 'Tramitar Pedido' }}
            </button>
            
            <p class="secure-text">🔒 Pagos seguros y encriptados</p>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'

const router = useRouter()
const cartStore = useCartStore()

onMounted(async () => {
  try {
    await cartStore.fetchCarrito()
  } catch (error) {
    console.error("[Cart] Error inicial:", error)
  }
})

async function actualizar(item, nuevaCantidad) {
  if (item.id && nuevaCantidad > 0) {
    await cartStore.actualizarCantidad(item.id, nuevaCantidad)
  }
}

async function eliminar(id) {
  if (confirm("¿Deseas eliminar este producto del carrito?")) {
    await cartStore.eliminarProducto(id)
  }
}

async function vaciar() {
  if (confirm("¿Estás seguro de que deseas vaciar todo el carrito?")) {
    await cartStore.limpiarCarrito()
  }
}

/**
 * Lógica de navegación profesional con manejo de errores
 */
function procederAlPago() {
  console.log("[Cart] Intentando navegar al checkout...");

  if (!cartStore.items || cartStore.items.length === 0) {
    console.warn("[Cart] Intento de pago con carrito vacío.");
    return;
  }

  // Intentamos navegación por router (SPA)
  router.push('/checkout')
    .then(() => {
      console.log("[Cart] Navegación exitosa.");
    })
    .catch((err) => {
      console.error("[Cart] Error de router, intentando navegación forzada:", err);
      // Fallback: Si el router falla, forzamos la carga de la URL
      window.location.href = '/checkout';
    });
}
</script>

<style scoped>
.cart-page {
  min-height: 100vh;
  padding-top: 120px;
  padding-bottom: 5rem;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: background-color 0.3s ease;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.cart-title-section {
  text-align: left;
  margin-bottom: 2.5rem;
  border-bottom: 1px solid var(--border-light);
  padding-bottom: 1rem;
}

.title-gothic {
  font-family: 'Cinzel', serif;
  font-size: 2.2rem;
  color: var(--accent-color);
  text-transform: uppercase;
  letter-spacing: 3px;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-top: 0.5rem;
  font-family: 'Cinzel', serif;
}

.cart-grid {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 3rem;
  align-items: start;
}

.cart-item {
  display: flex;
  gap: 1.5rem;
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  padding: 1.5rem;
  margin-bottom: 1rem;
  align-items: center;
}

.item-img-container {
  width: 100px;
  height: 130px;
  flex-shrink: 0;
  overflow: hidden;
  border: 1px solid var(--border-light);
}

.item-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  flex: 1;
}

.product-name {
  font-family: 'Cinzel', serif;
  font-size: 1.1rem;
  color: var(--text-primary);
  margin-bottom: 0.3rem;
}

.product-category {
  font-size: 0.7rem;
  color: var(--accent-color);
  text-transform: uppercase;
  margin-bottom: 1.2rem;
  letter-spacing: 1px;
}

.quantity-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--bg-primary);
  width: fit-content;
  border: 1px solid var(--border-light);
}

.qty-btn {
  background: transparent;
  border: none;
  color: var(--accent-color);
  width: 35px;
  height: 35px;
  cursor: pointer;
  font-size: 1.2rem;
}

.qty-btn:hover:not(:disabled) {
  background: var(--accent-color);
  color: white;
}

.item-price-actions {
  text-align: right;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.subtotal {
  font-size: 1.2rem;
  font-weight: bold;
  font-family: 'Cinzel', serif;
}

.btn-delete {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 0.75rem;
  cursor: pointer;
  text-decoration: underline;
}

.btn-checkout {
  width: 100%;
  background: var(--accent-color);
  color: #fff;
  border: none;
  padding: 1.2rem;
  font-family: 'Cinzel', serif;
  text-transform: uppercase;
  font-size: 1rem;
  letter-spacing: 2px;
  cursor: pointer;
  margin-top: 2rem;
  transition: 0.3s;
}

.btn-checkout:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.summary-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  padding: 2rem;
  position: sticky;
  top: 130px;
}

.summary-row.total {
  font-size: 1.4rem;
  color: var(--text-primary);
  font-family: 'Cinzel', serif;
}

.total-amount { color: var(--accent-color); }

.spinner {
  width: 50px; height: 50px;
  border: 3px solid var(--border-light);
  border-top-color: var(--accent-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1.5rem;
}

@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 900px) {
  .cart-grid { grid-template-columns: 1fr; }
  .summary-card { position: static; margin-top: 3rem; }
}
</style>