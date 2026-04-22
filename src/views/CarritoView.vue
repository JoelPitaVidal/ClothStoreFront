<template>
  <div class="cart-page">
    <div class="container">
      <header class="cart-title-section">
        <h1 class="title-gothic">Mi Carrito</h1>
        <p v-if="cartStore.items?.length > 0" class="subtitle">
          Tienes {{ cartStore.totalItems }} producto(s) en tu selección
        </p>
      </header>

      <div v-if="cartStore.loading && (!cartStore.items || cartStore.items.length === 0)" class="loading-state">
        <div class="spinner"></div>
        <p>Invocando productos...</p>
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
                  {{ item.producto?.categoria?.nombre || item.productos?.categoria?.nombre || 'Reliquia' }}
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
            <button class="btn-checkout" @click="procederAlPago">
              Tramitar Pedido
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

onMounted(() => {
  cartStore.fetchCarrito()
})

async function actualizar(item, nuevaCantidad) {
  if (item.id && nuevaCantidad > 0) {
    await cartStore.actualizarCantidad(item.id, nuevaCantidad)
  }
}

async function eliminar(id) {
  if (confirm("¿Deseas retirar esta pieza de tu colección?")) {
    await cartStore.eliminarProducto(id)
  }
}

async function vaciar() {
  if (confirm("¿Limpiar por completo tu selección actual?")) {
    await cartStore.limpiarCarrito()
  }
}

function procederAlPago() {
  router.push('/checkout')
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

/* GRID */
.cart-grid {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 3rem;
  align-items: start;
}

/* ITEMS */
.cart-item {
  display: flex;
  gap: 1.5rem;
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  padding: 1.5rem;
  margin-bottom: 1rem;
  align-items: center;
  transition: transform 0.3s ease;
}

.cart-item:hover {
  border-color: var(--accent-color);
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
  transition: 0.5s ease;
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

/* CANTIDAD */
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
  transition: 0.2s;
}

.qty-btn:hover:not(:disabled) {
  background: var(--accent-color);
  color: white;
}

.qty-btn:disabled {
  color: var(--text-secondary);
  opacity: 0.3;
}

.qty-number {
  font-family: 'Cinzel', serif;
  font-weight: bold;
}

/* PRECIO Y ACCIONES */
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
  color: var(--text-primary);
}

.btn-delete {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 0.75rem;
  cursor: pointer;
  text-transform: uppercase;
  text-decoration: underline;
  transition: 0.3s;
}

.btn-delete:hover {
  color: #ff4444;
}

.btn-clear {
  background: transparent;
  border: 1px solid var(--border-light);
  color: var(--text-secondary);
  padding: 0.6rem 1.2rem;
  font-size: 0.75rem;
  font-family: 'Cinzel', serif;
  cursor: pointer;
  transition: 0.3s;
}

.btn-clear:hover {
  border-color: var(--accent-color);
  color: var(--accent-color);
}

/* RESUMEN (SIDEBAR) */
.summary-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  padding: 2rem;
  position: sticky;
  top: 130px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.summary-title {
  font-family: 'Cinzel', serif;
  font-size: 1.2rem;
  color: var(--accent-color);
  margin-bottom: 2rem;
  text-transform: uppercase;
  border-bottom: 1px solid var(--border-light);
  padding-bottom: 0.5rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.free {
  color: #2ecc71;
  font-weight: bold;
  text-transform: uppercase;
}

.summary-divider {
  border: 0;
  border-top: 1px solid var(--border-light);
  margin: 1.5rem 0;
}

.summary-row.total {
  font-size: 1.4rem;
  color: var(--text-primary);
  font-family: 'Cinzel', serif;
  margin-top: 1rem;
}

.total-amount {
  color: var(--accent-color);
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

.btn-checkout:hover {
  filter: brightness(1.2);
  box-shadow: 0 5px 15px rgba(129, 33, 208, 0.3);
}

.secure-text {
  font-size: 0.7rem;
  color: var(--text-secondary);
  text-align: center;
  margin-top: 1.5rem;
  opacity: 0.7;
}

/* ESTADOS VACÍOS/CARGA */
.empty-state {
  text-align: center;
  padding: 10rem 0;
}

.empty-text {
  font-family: 'Cinzel', serif;
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.btn-primary-gothic {
  display: inline-block;
  background: transparent;
  border: 1px solid var(--accent-color);
  color: var(--accent-color);
  padding: 1rem 2.5rem;
  text-decoration: none;
  font-family: 'Cinzel', serif;
  margin-top: 1.5rem;
  transition: 0.3s;
}

.btn-primary-gothic:hover {
  background: var(--accent-color);
  color: white;
}

.loading-state {
  text-align: center;
  padding: 8rem;
  color: var(--text-secondary);
  font-family: 'Cinzel', serif;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 3px solid var(--border-light);
  border-top-color: var(--accent-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1.5rem;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* RESPONSIVE */
@media (max-width: 900px) {
  .cart-grid { grid-template-columns: 1fr; }
  .summary-card { position: static; margin-top: 3rem; }
  .cart-item { flex-direction: row; align-items: flex-start; }
}

@media (max-width: 600px) {
  .cart-item { flex-direction: column; text-align: center; }
  .item-img-container { margin: 0 auto; }
  .quantity-wrapper { margin: 1rem auto; }
  .item-price-actions { text-align: center; margin-top: 1rem; border-top: 1px solid var(--border-light); padding-top: 1rem; }
}
</style>