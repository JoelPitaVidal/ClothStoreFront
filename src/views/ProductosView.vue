<template>
  <div class="shop-wrapper mt-header">
    <div class="shop-container">
      
      <aside class="filters-sidebar">
        <h2 class="title-gothic-sm">Filtrar Reliquias</h2>
        <div class="filter-group">
          <h4 class="filter-title">Categorías</h4>
          <ul class="filter-list">
            <li v-for="cat in categorias" :key="cat.id" class="filter-item">
              <label class="gothic-checkbox">
                <input type="checkbox" :value="cat.id" v-model="selectedCategories"> 
                <span class="checkmark"></span>
                <span class="category-name">{{ cat.nombre }}</span>
              </label>
            </li>
          </ul>
        </div>
      </aside>

      <main class="products-main">
        <div v-if="loading" class="status-container">
          <div class="gothic-spinner"></div>
          <p class="status-text">Invocando reliquias desde las sombras...</p>
        </div>

        <div v-else-if="error" class="status-container">
          <p class="error-text text-danger">{{ error }}</p>
        </div>

        <div v-else class="products-grid">
          <div 
            v-for="producto in productos" 
            :key="producto.id" 
            class="product-card"
            :class="{ 'card-exclusive': producto.es_exclusivo }"
          >
            <div class="image-container" @click="abrirDetalle(producto)">
              <img 
                :src="producto.imagen_url || 'https://via.placeholder.com/500'" 
                :alt="producto.nombre"
                class="product-img"
              >
              
              <div v-if="producto.es_exclusivo" class="badge-exclusive">DROP EXCLUSIVO</div>
              
              <div v-if="producto.stock <= 10 && producto.stock > 0" class="stock-tag warning">
                QUEDAN {{ producto.stock }}
              </div>
              <div v-else-if="producto.stock === 0" class="stock-tag out">AGOTADO</div>

              <div v-if="esLanzamientoFuturo(producto)" class="launch-overlay">
                <div class="overlay-content">
                  <span class="lock-icon">🔒</span>
                  <p class="launch-label">PRÓXIMAMENTE</p>
                  <p class="launch-date">{{ formatearFecha(producto.fecha_lanzamiento) }}</p>
                </div>
              </div>
            </div>

            <div class="product-info">
              <h3 class="product-title">{{ producto.nombre }}</h3>
              
              <div v-if="producto.es_exclusivo && producto.stock > 0" class="hype-zone">
                <div class="hype-bar">
                  <div class="hype-fill" :style="{ width: Math.min(100, (producto.stock * 5)) + '%' }"></div>
                </div>
                <span class="hype-label">DISPONIBILIDAD LIMITADA</span>
              </div>

              <div class="product-footer">
                <span class="product-price">{{ producto.precio?.toFixed(2) }}€</span>
                
                <button 
                  @click.stop="handleAddToCart(producto)" 
                  class="btn-add-ritual"
                  :disabled="addingToCart === producto.id || !esComprable(producto)"
                >
                  <span v-if="esLanzamientoFuturo(producto)">⏳</span>
                  <span v-else-if="addingToCart === producto.id" class="loader-sm"></span>
                  <span v-else>AÑADIR +</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { getProductos, getCategorias } from '@/api'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
const productos = ref([])
const categorias = ref([])
const selectedCategories = ref([])
const loading = ref(true)
const error = ref(null)
const addingToCart = ref(null)

// --- LÓGICA DE TIEMPO / DROPS ---

const esLanzamientoFuturo = (p) => {
  if (!p.es_exclusivo || !p.fecha_lanzamiento) return false
  return new Date(p.fecha_lanzamiento) > new Date()
}

const esComprable = (p) => {
  if (p.stock <= 0) return false
  const ahora = new Date()
  if (p.es_exclusivo) {
    if (p.fecha_lanzamiento && ahora < new Date(p.fecha_lanzamiento)) return false
    if (p.fecha_fin && ahora > new Date(p.fecha_fin)) return false
  }
  return true
}

const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-ES', { 
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' 
  })
}

// --- LLAMADAS API ---

const fetchProductos = async () => {
  try {
    loading.value = true
    const params = selectedCategories.value.length ? { categoria_id: selectedCategories.value.join(',') } : {}
    const response = await getProductos(params)
    productos.value = response.data.resultados || response.data || []
  } catch (err) {
    error.value = "Las sombras no responden al llamado."
  } finally {
    loading.value = false
  }
}

const handleAddToCart = async (producto) => {
  if (!esComprable(producto)) return
  addingToCart.value = producto.id
  try {
    await cartStore.agregarProducto(producto.id, 1)
  } catch (err) {
    console.error("Error al añadir:", err)
  } finally {
    addingToCart.value = null
  }
}

const fetchCategorias = async () => {
  const response = await getCategorias()
  categorias.value = response.data || []
}

watch(selectedCategories, () => fetchProductos())

onMounted(() => {
  fetchProductos()
  fetchCategorias()
})
</script>

<style scoped>
/* WRAPPER ADAPTATIVO */
.shop-wrapper {
  min-height: 100vh;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  padding: 120px 2rem 4rem;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.shop-container {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 3rem;
}

/* SIDEBAR */
.title-gothic-sm {
  font-family: 'Cinzel', serif;
  color: var(--accent-color, #8121d0);
  font-size: 1.2rem;
  margin-bottom: 2rem;
  letter-spacing: 2px;
}

.filter-title {
  color: var(--text-secondary);
  text-transform: uppercase;
  font-size: 0.7rem;
  letter-spacing: 1px;
  margin-bottom: 1rem;
}

.filter-list { list-style: none; padding: 0; }
.filter-item { margin-bottom: 1rem; }

/* CHECKBOX PERSONALIZADO (MODO CLARO/OSCURO) */
.gothic-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.gothic-checkbox input { display: none; }
.checkmark {
  width: 18px; height: 18px;
  border: 1px solid var(--border-light, #333);
  margin-right: 12px;
  position: relative;
  background-color: var(--bg-card);
  transition: 0.3s;
}

.gothic-checkbox input:checked + .checkmark {
  background: var(--accent-color, #8121d0);
  border-color: var(--accent-color, #8121d0);
}

.gothic-checkbox:hover .category-name { color: var(--accent-color, #8121d0); }

/* PRODUCT CARD */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2.5rem;
}

.product-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light, #1a1a1a);
  transition: all 0.3s ease;
  position: relative;
}

.product-card:hover {
  transform: translateY(-5px);
  border-color: var(--accent-color, #8121d0);
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.card-exclusive {
  border-color: var(--accent-color, #8121d0);
}

/* IMAGEN Y OVERLAYS */
.image-container {
  aspect-ratio: 4/5;
  position: relative;
  overflow: hidden;
  background: #111;
  cursor: pointer;
}

.product-img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.badge-exclusive {
  position: absolute;
  top: 1rem; left: 1rem;
  background: var(--accent-color, #8121d0);
  color: #fff;
  padding: 4px 10px;
  font-family: 'Cinzel';
  font-size: 0.65rem;
  z-index: 5;
}

.launch-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  display: flex; justify-content: center; align-items: center;
  z-index: 10; color: #fff;
}

.launch-label { font-family: 'Cinzel'; color: var(--accent-color); letter-spacing: 2px; }

/* INFORMACIÓN Y BOTONES */
.product-info { padding: 1.5rem; }
.product-title {
  font-family: 'Cinzel', serif;
  color: var(--text-primary);
  font-size: 1rem;
  margin-bottom: 1rem;
}

.hype-zone { margin-bottom: 1.5rem; }
.hype-bar {
  height: 2px; background: var(--border-light, #333);
  margin-bottom: 4px; overflow: hidden;
}
.hype-fill { 
  height: 100%; background: var(--accent-color, #8121d0); 
  box-shadow: 0 0 10px var(--accent-color);
}
.hype-label { font-size: 0.55rem; color: var(--text-secondary); letter-spacing: 1px; }

.product-footer {
  display: flex; justify-content: space-between; align-items: center;
  border-top: 1px solid var(--border-light, #1a1a1a);
  padding-top: 1rem;
}

.product-price { font-family: 'Cinzel'; color: var(--accent-color); font-weight: bold; }

.btn-add-ritual {
  background: none;
  border: 1px solid var(--accent-color, #8121d0);
  color: var(--accent-color, #8121d0);
  padding: 8px 15px;
  font-family: 'Cinzel';
  font-size: 0.7rem;
  cursor: pointer;
  transition: 0.3s;
}

.btn-add-ritual:hover:not(:disabled) {
  background: var(--accent-color, #8121d0);
  color: #fff;
}

.btn-add-ritual:disabled {
  border-color: var(--text-secondary);
  color: var(--text-secondary);
  cursor: not-allowed;
}

/* CARGA */
.status-container { grid-column: 1 / -1; text-align: center; padding: 5rem; }
.gothic-spinner {
  width: 40px; height: 40px;
  border: 2px solid var(--border-light);
  border-top-color: var(--accent-color);
  border-radius: 50%;
  margin: 0 auto 1rem;
  animation: spin 1s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 900px) {
  .shop-container { grid-template-columns: 1fr; }
}
</style>