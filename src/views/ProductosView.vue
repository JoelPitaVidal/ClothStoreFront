<template>
  <div class="shop-container mt-header">
    <aside class="filters">
      <h2 class="title-gothic">Filtros</h2>
      
      <div class="filter-group">
        <h4>Categorías</h4>
        <ul>
          <li v-for="cat in categorias" :key="cat.id">
            <label>
              <input type="checkbox" :value="cat.id" v-model="selectedCategories"> 
              {{ cat.nombre }}
            </label>
          </li>
        </ul>
      </div>
    </aside>

    <main class="products-grid">
      <div v-if="loading" class="loading-state">Invocando sombras...</div>

      <div v-else-if="error" class="error-state">{{ error }}</div>

      <div v-else v-for="producto in productos" :key="producto.id" class="product-card">
        
        <div class="product-image">
          <img 
            :src="producto.imagen_url || 'https://via.placeholder.com/500x700/1a1a1a/e0e0e0?text=Midnight+Attire'" 
            :alt="producto.nombre"
          >
          
          <div v-if="producto.es_nuevo || producto.id % 3 === 0" class="product-badge">
            {{ producto.es_nuevo ? 'Nuevo' : 'Exclusivo' }}
          </div>
        </div>

        <div class="product-info">
          <h3 class="product-title">{{ producto.nombre }}</h3>
          <p class="product-price">{{ producto.precio.toFixed(2) }}€</p>
          
          <button 
            @click="handleAddToCart(producto)" 
            class="btn-add-cart"
            :disabled="addingToCart === producto.id"
          >
            <span v-if="addingToCart === producto.id">Invocando...</span>
            <span v-else>Añadir al Carrito 🛒</span>
          </button>
        </div>
      </div>
      </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { getProductos, getCategorias, añadirAlCarrito } from '@/api' // Tu Axios reparado

// Estados Reactivos
const productos = ref([])
const categorias = ref([])
const selectedCategories = ref([])
const loading = ref(true)
const error = ref(null)
const addingToCart = ref(null)

// --- LÓGICA DE DATOS ---

// Cargar Productos (con filtros opcionales)
const fetchProductos = async () => {
  try {
    loading.value = true
    error.value = null
    
    // Construir parámetros de filtro si hay categorías seleccionadas
    const params = selectedCategories.value.length > 0 
      ? { categoria_id: selectedCategories.value.join(',') } 
      : {}
      
    const response = await getProductos(params)
    // Asegúrate de que tu API devuelve directamente la lista de productos en response.data
    productos.value = response.data
  } catch (err) {
    error.value = "Las sombras no responden. Revisa la conexión con el servidor (puerto 8000)."
    console.error("Error detallado:", err)
  } finally {
    loading.value = false
  }
}

// Cargar Categorías para los filtros
const fetchCategorias = async () => {
  try {
    const response = await getCategorias()
    categorias.value = response.data
  } catch (err) {
    console.error("Error cargando categorías:", err)
  }
}

// Acción de añadir al carrito
const handleAddToCart = async (producto) => {
  addingToCart.value = producto.id // Activar estado de carga en el botón
  try {
    await añadirAlCarrito({ producto_id: producto.id, cantidad: 1 })
    // Aquí podrías usar una notificación más elegante que un 'alert'
    alert(`${producto.nombre} ha sido reclamado por tu carrito.`)
  } catch (err) {
    console.error("Error al añadir al carrito:", err)
    if (err.response?.status === 401) {
      alert("Debes iniciar sesión para reclamar productos.")
    } else {
      alert("Hubo un problema al conectar con el carrito.")
    }
  } finally {
    addingToCart.value = null // Desactivar estado de carga
  }
}

// --- OBSERVADORES ---

// Recargar productos automáticamente cuando cambien los filtros
watch(selectedCategories, () => {
  fetchProductos()
})

// --- CICLO DE VIDA ---

// Carga inicial al montar el componente
onMounted(() => {
  fetchProductos()
  fetchCategorias()
})
</script>

<style scoped>
/* *** TUS ESTILOS ORIGINALES INTACTOS *** */
.shop-container {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
  padding: 2rem 5%;
  min-height: 100vh;
}

/* Filtros */
.filters {
  border-right: 1px solid var(--border-light);
  padding-right: 1.5rem;
}

.filter-group h4 {
  font-family: var(--font-gothic);
  color: var(--accent-bright);
  margin: 1.5rem 0 0.5rem;
  font-size: 0.9rem;
}

/* Rejilla de Productos */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2.5rem;
}

/* La Tarjeta "Intensa" */
.product-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: var(--transition);
  position: relative;
}

.product-card:hover {
  transform: translateY(-10px);
  border-color: var(--accent);
  box-shadow: var(--shadow-intense);
}

.product-image {
  position: relative;
  aspect-ratio: 3/4;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
  filter: grayscale(0.3) brightness(0.8); /* Look Gótico */
}

.product-card:hover img {
  transform: scale(1.1);
  filter: grayscale(0) brightness(1);
}

.product-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: var(--accent);
  color: white;
  padding: 0.2rem 0.8rem;
  font-family: var(--font-gothic);
  font-size: 0.7rem;
  border-radius: 2px;
}

.product-info {
  padding: 1.5rem;
  text-align: center;
}

.product-title {
  font-family: var(--font-gothic);
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.product-price {
  color: var(--text-secondary);
  font-weight: bold;
  margin-bottom: 1.2rem;
}

.btn-add-cart {
  width: 100%;
  padding: 0.8rem;
  background: transparent;
  border: 1px solid var(--accent);
  color: var(--text-primary);
  font-family: var(--font-gothic);
  text-transform: uppercase;
  cursor: pointer;
  transition: var(--transition);
}

.btn-add-cart:hover:not(:disabled) {
  background: var(--accent);
  color: white;
  box-shadow: 0 0 15px var(--accent-glow);
}

/* --- ESTILOS EXTRA PARA ESTADOS DE CARGA/ERROR GÓTICOS --- */
.loading-state, .error-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 10rem 2rem;
  font-family: var(--font-gothic);
  color: var(--accent);
  font-size: 1.8rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  animation: pulse 2s infinite;
}

.error-state {
  color: #ff4444; /* Un rojo oscuro para errores */
}

.btn-add-cart:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  border-color: #444;
}

@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}

@media (max-width: 768px) {
  .shop-container { grid-template-columns: 1fr; }
  .filters { display: none; }
}
</style>