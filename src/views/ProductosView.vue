<template>
  <div class="shop-container mt-header">
    <!-- BARRA LATERAL DE FILTROS -->
    <aside class="filters">
      <h2 class="title-gothic">Filtros</h2>
      
      <div class="filter-group">
        <h4>Categorías</h4>
        <ul>
          <li v-for="cat in categorias" :key="cat.id">
            <label class="checkbox-container">
              <input type="checkbox" :value="cat.id" v-model="selectedCategories"> 
              <span class="checkmark"></span>
              {{ cat.nombre }}
            </label>
          </li>
        </ul>
      </div>
    </aside>

    <!-- REJILLA DE PRODUCTOS -->
    <main class="products-grid">
      <!-- Estados de Carga y Error -->
      <div v-if="loading" class="status-message">
        <div class="spinner"></div>
        <p>Invocando sombras...</p>
      </div>
      <div v-else-if="error" class="status-message error-text">{{ error }}</div>

      <!-- Lista de Productos -->
      <div 
        v-else 
        v-for="producto in productos" 
        :key="producto.id" 
        class="product-card"
        @click="abrirDetalle(producto)"
      >
        <div class="product-image">
          <img 
            :src="producto.imagen_url || 'https://via.placeholder.com/500x500/1a1a1a/e0e0e0?text=Reliquia'" 
            :alt="producto.nombre"
          >
          <div v-if="producto.id % 3 === 0" class="product-badge">Exclusivo</div>
          
          <!-- Etiquetas de Stock -->
          <div v-if="producto.stock <= 10 && producto.stock > 0" class="stock-tag warning">
            {{ producto.stock }} restan
          </div>
          <div v-else-if="producto.stock === 0" class="stock-tag out">
            Agotado
          </div>
        </div>

        <div class="product-info">
          <h3 class="product-title">{{ producto.nombre }}</h3>
          <p class="product-description">
            {{ producto.descripcion || 'Sin descripción en los archivos antiguos.' }}
          </p>
          
          <div class="product-footer">
            <span class="product-price">{{ producto.precio?.toFixed(2) }}€</span>
            <button 
              @click.stop="handleAddToCart(producto)" 
              class="btn-add-cart"
              :disabled="addingToCart === producto.id || producto.stock === 0"
            >
              <span v-if="addingToCart === producto.id">...</span>
              <span v-else>+ 🛒</span>
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- MODAL DE DETALLE EXTENDIDO -->
    <Transition name="fade">
      <div v-if="productoSeleccionado" class="modal-overlay" @click="cerrarDetalle">
        <div class="modal-content" @click.stop>
          <button class="close-button" @click="cerrarDetalle">✕</button>
          
          <div class="modal-body">
            <div class="modal-image-container">
              <img :src="productoSeleccionado.imagen_url" :alt="productoSeleccionado.nombre" class="modal-img">
            </div>
            <div class="modal-text">
              <h2 class="title-gothic-large">{{ productoSeleccionado.nombre }}</h2>
              <p class="modal-category">Categoría: {{ getNombreCategoria(productoSeleccionado.categoria_id) }}</p>
              <hr class="separator">
              <p class="modal-full-description">{{ productoSeleccionado.descripcion }}</p>
              
              <div class="modal-footer-info">
                <span class="modal-price">{{ productoSeleccionado.precio?.toFixed(2) }}€</span>
                <button 
                  @click="handleAddToCart(productoSeleccionado)" 
                  class="btn-buy"
                  :disabled="addingToCart === productoSeleccionado.id || productoSeleccionado.stock === 0"
                >
                  {{ productoSeleccionado.stock === 0 ? 'Agotado' : 'Añadir al Carrito' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { getProductos, getCategorias } from '@/api'
import { useCartStore } from '@/stores/cart'

// Store de Pinia para manejar el estado global del carrito
const cartStore = useCartStore()

// Estados reactivos
const productos = ref([])
const categorias = ref([])
const selectedCategories = ref([])
const loading = ref(true)
const error = ref(null)
const addingToCart = ref(null)
const productoSeleccionado = ref(null)

/**
 * Carga los productos desde la API aplicando filtros si existen
 */
const fetchProductos = async () => {
  try {
    loading.value = true
    error.value = null
    const params = {}
    
    if (selectedCategories.value.length > 0) {
      params.categoria_id = selectedCategories.value.join(',')
    }
    
    const response = await getProductos(params)
    // Manejo flexible de la respuesta (por si viene en .resultados o directo)
    productos.value = response.data.resultados || response.data || []
  } catch (err) {
    error.value = "Las sombras no responden al llamado de la base de datos."
    console.error("Error API Productos:", err)
  } finally {
    loading.value = false
  }
}

/**
 * Carga las categorías para la barra lateral
 */
const fetchCategorias = async () => {
  try {
    const response = await getCategorias()
    categorias.value = response.data || []
  } catch (err) {
    console.error("Error API Categorías:", err)
  }
}

/**
 * Acción de añadir al carrito usando el Store
 */
const handleAddToCart = async (producto) => {
  if (producto.stock === 0) return
  
  addingToCart.value = producto.id
  try {
    // Llamamos a la acción del store de Pinia
    await cartStore.agregarProducto(producto.id, 1)
  } catch (err) {
    alert("El ritual de transporte al carrito ha fallado.")
  } finally {
    addingToCart.value = null
  }
}

// Funciones de UI del Modal
const abrirDetalle = (producto) => {
  productoSeleccionado.value = producto
  document.body.style.overflow = 'hidden'
}

const cerrarDetalle = () => {
  productoSeleccionado.value = null
  document.body.style.overflow = 'auto'
}

const getNombreCategoria = (id) => {
  const cat = categorias.value.find(c => c.id === id)
  return cat ? cat.nombre : 'Reliquia'
}

// Observar cambios en los filtros para recargar automáticamente
watch(selectedCategories, () => fetchProductos())

// Carga inicial
onMounted(() => {
  fetchProductos()
  fetchCategorias()
})
</script>

<style scoped>
/* Contenedor Principal */
.shop-container {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 2rem;
  padding: 2rem 5%;
  min-height: 100vh;
  /* CAMBIADO: Antes #050505 */
  background-color: var(--bg-dark);
  transition: background-color 0.4s ease;
}

/* Barra Lateral */
.filters { 
  /* CAMBIADO: Antes #222 */
  border-right: 1px solid var(--border-light); 
  padding-right: 1.5rem; 
}

.title-gothic { 
  font-family: 'Cinzel', serif; 
  color: #8121d0; /* El morado se mantiene como acento */
  font-size: 1.2rem; 
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.filter-group h4 {
  /* CAMBIADO: Antes #ccc */
  color: var(--text-primary);
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.filter-group ul { list-style: none; padding: 0; }
.filter-group li { 
  margin-bottom: 0.8rem; 
  /* CAMBIADO: Antes #888 */
  color: var(--text-secondary); 
  font-size: 0.85rem; 
}

/* Grid de Productos */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
  align-items: start;
}

.status-message {
  grid-column: 1 / -1;
  text-align: center;
  padding: 4rem;
  color: #8121d0;
  font-family: 'Cinzel', serif;
}

/* Tarjetas de Producto */
.product-card {
  /* CAMBIADO: Antes #0a0a0a (Negro puro) ahora usa var(--bg-card) (Blanco en modo claro) */
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 4px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  border-color: #8121d0;
  transform: translateY(-5px);
  /* Sombra más suave para modo claro */
  box-shadow: 0 10px 20px rgba(0,0,0,0.15);
}

:global(body:not(.light-mode)) .product-card:hover {
  box-shadow: 0 10px 20px rgba(0,0,0,0.5);
}

.product-image { 
  position: relative; 
  width: 100%; 
  aspect-ratio: 1/1; 
  background: #111; /* Mantenemos fondo oscuro para la foto para resaltar el producto */
}

.product-image img { 
  width: 100%; 
  height: 100%; 
  object-fit: cover; 
  filter: brightness(0.85); 
  transition: 0.5s; 
}
.product-card:hover .product-image img { filter: brightness(1); }

.stock-tag {
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  padding: 2px 8px;
  font-size: 0.65rem;
  font-weight: bold;
  text-transform: uppercase;
  border-radius: 2px;
}
.stock-tag.warning { background: #ff9800; color: #000; }
.stock-tag.out { background: #ff4444; color: #fff; }

.product-info { padding: 1.2rem; }

.product-title { 
  font-family: 'Cinzel', serif; 
  font-size: 0.95rem; 
  /* CAMBIADO: Antes #eee */
  color: var(--text-primary); 
  margin-bottom: 0.6rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.4s ease;
}

.product-description {
  font-size: 0.8rem;
  /* CAMBIADO: Antes #666 */
  color: var(--text-secondary);
  margin-bottom: 1.2rem;
  line-height: 1.4;
  height: 2.8em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* CAMBIADO: Antes #1a1a1a */
  border-top: 1px solid var(--border-light);
  padding-top: 1rem;
}

.product-price { color: #8121d0; font-weight: bold; font-size: 1.1rem; }

.btn-add-cart {
  background: transparent;
  /* CAMBIADO: Antes #333 */
  border: 1px solid var(--border-light);
  color: #8121d0;
  padding: 6px 12px;
  cursor: pointer;
  transition: 0.3s;
  border-radius: 3px;
}

.btn-add-cart:hover:not(:disabled) {
  background: #8121d0;
  color: white;
  border-color: #8121d0;
}

/* MODAL / POPUP */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  /* CAMBIADO: Usar variable con opacidad para el fondo del modal */
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(5px);
  display: flex; justify-content: center; align-items: center;
  z-index: 2000;
}

.modal-content {
  /* CAMBIADO: Antes #0a0a0a (Negro) ahora usa var(--bg-card) (Blanco en modo claro) */
  background: var(--bg-card); 
  border: 1px solid #8121d0;
  width: 90%; max-width: 850px;
  padding: 2.5rem; position: relative;
  transition: background 0.4s ease;
}

.modal-body { display: grid; grid-template-columns: 1fr 1.2fr; gap: 2.5rem; }
.modal-img { width: 100%; border: 1px solid var(--border-light); }

.title-gothic-large {
  font-family: 'Cinzel', serif;
  font-size: 2rem;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.modal-category { color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem; }
.separator { border: 0; border-top: 1px solid var(--border-light); margin: 1rem 0; }
.modal-full-description { color: var(--text-secondary); line-height: 1.6; margin-bottom: 2rem; }
.modal-price { color: #8121d0; font-size: 1.8rem; font-weight: bold; }

.btn-buy {
  background: #8121d0;
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-family: 'Cinzel', serif;
  cursor: pointer;
  transition: 0.3s;
}

.btn-buy:hover:not(:disabled) { background: #9d3fef; }

.close-button {
  position: absolute;
  top: 1rem; right: 1rem;
  background: none; border: none;
  color: #8121d0; font-size: 1.5rem; cursor: pointer;
}

/* Animaciones */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.spinner {
  width: 40px; height: 40px;
  border: 3px solid rgba(129, 33, 208, 0.2);
  border-top-color: #8121d0;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 768px) {
  .shop-container { grid-template-columns: 1fr; }
  .filters { display: none; }
  .modal-body { grid-template-columns: 1fr; gap: 1.5rem; }
}
</style>