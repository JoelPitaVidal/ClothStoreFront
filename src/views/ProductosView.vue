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
      <div v-if="loading" class="loading-state">Invocando sombras...</div>
      <div v-else-if="error" class="error-state">{{ error }}</div>

      <div 
        v-else 
        v-for="producto in (productos || [])" 
        :key="producto.id" 
        class="product-card"
        @click="abrirDetalle(producto)"
      >
        <!-- IMAGEN -->
        <div class="product-image">
          <img 
            :src="producto.imagen_url || 'https://via.placeholder.com/500x500/1a1a1a/e0e0e0?text=Reliquia'" 
            :alt="producto.nombre"
          >
          <div v-if="producto.id % 3 === 0" class="product-badge">Exclusivo</div>
          
          <!-- STOCK FLOTANTE (No empuja el contenido) -->
          <div v-if="producto.stock <= 10 && producto.stock > 0" class="stock-tag warning">
            {{ producto.stock }} restan
          </div>
          <div v-else-if="producto.stock === 0" class="stock-tag out">
            Agotado
          </div>
        </div>

        <!-- INFORMACIÓN COMPACTA -->
        <div class="product-info">
          <h3 class="product-title">{{ producto.nombre }}</h3>
          
          <p class="product-description">
            {{ producto.descripcion || 'Sin descripción en los archivos antiguos.' }}
          </p>
          
          <div class="product-footer">
            <span class="product-price">{{ producto.precio?.toFixed(2) || '0.00' }}€</span>
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
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { getProductos, getCategorias, añadirAlCarrito } from '@/api'

const productos = ref([])
const categorias = ref([])
const selectedCategories = ref([])
const loading = ref(true)
const error = ref(null)
const addingToCart = ref(null)
const productoSeleccionado = ref(null)

const fetchProductos = async () => {
  try {
    loading.value = true
    const params = { limit: 100 }
    if (selectedCategories.value.length > 0) {
      params.categoria_id = selectedCategories.value.join(',')
    }
    const response = await getProductos(params)
    productos.value = response.data.resultados || []
  } catch (err) {
    error.value = "Las sombras no responden."
  } finally {
    loading.value = false
  }
}

const fetchCategorias = async () => {
  try {
    const response = await getCategorias()
    categorias.value = response.data
  } catch (err) { console.error(err) }
}

const handleAddToCart = async (producto) => {
  addingToCart.value = producto.id
  try {
    await añadirAlCarrito({ producto_id: producto.id, cantidad: 1 })
  } catch (err) {
    alert("Error al conectar con el carrito.")
  } finally {
    addingToCart.value = null
  }
}

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

watch(selectedCategories, () => fetchProductos())
onMounted(() => { fetchProductos(); fetchCategorias(); })
</script>

<style scoped>
.shop-container {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 2rem;
  padding: 2rem 5%;
  min-height: 100vh;
}

.filters { border-right: 1px solid #333; padding-right: 1.5rem; }
.title-gothic { font-family: 'Cinzel', serif; color: #8121d0; font-size: 1.2rem; }

.products-grid {
  display: grid;
  /* Controlamos el ancho máximo para evitar estiramientos raros */
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
  /* IMPORTANTE: align-items start evita que las celdas se estiren verticalmente */
  align-items: start; 
}

.product-card {
  background: #0a0a0a;
  border: 1px solid #222;
  border-radius: 4px;
  overflow: hidden;
  transition: 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  /* Altura automática: ya no intenta llenar el 100% del contenedor padre */
  height: auto; 
}

.product-card:hover {
  border-color: #8121d0;
  transform: translateY(-5px);
}

.product-image { position: relative; width: 100%; aspect-ratio: 1/1; }
.product-image img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.7); display: block; }

/* STOCK TAGS (Flotantes) */
.stock-tag {
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  padding: 2px 8px;
  font-size: 0.65rem;
  font-weight: bold;
  text-transform: uppercase;
  border-radius: 2px;
  z-index: 5;
}
.stock-tag.warning { background: rgba(255, 152, 0, 0.9); color: #000; }
.stock-tag.out { background: rgba(255, 68, 68, 0.9); color: #fff; }

.product-badge {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  background: #8121d0;
  color: white;
  padding: 2px 8px;
  font-size: 0.6rem;
  text-transform: uppercase;
}

.product-info {
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.product-title {
  font-family: 'Cinzel', serif;
  font-size: 0.9rem;
  color: #e0d5e8;
  margin: 0 0 0.5rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-description {
  font-size: 0.75rem;
  color: #888;
  margin-bottom: 1rem;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  /* Mantenemos una altura mínima para que los pies de tarjeta se alineen en la misma fila */
  min-height: 2.6em; 
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #1a1a1a;
  padding-top: 0.8rem;
}

.product-price { color: #8121d0; font-weight: bold; font-size: 1rem; }

/* MODAL STYLES */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(8px);
  display: flex; justify-content: center; align-items: center;
  z-index: 2000;
}

.modal-content {
  background: #0a0a0a; border: 1px solid #8121d0;
  width: 90%; max-width: 850px;
  border-radius: 8px; padding: 2.5rem;
  position: relative; animation: modalFade 0.3s ease;
}

.modal-body { display: grid; grid-template-columns: 1fr 1.2fr; gap: 2.5rem; }
.modal-img { width: 100%; border-radius: 4px; border: 1px solid #222; }
.title-gothic-large { font-family: 'Cinzel', serif; color: #8121d0; font-size: 1.8rem; margin: 0; }
.modal-category { color: #a394ac; font-size: 0.8rem; text-transform: uppercase; margin-top: 0.5rem; }
.separator { border: 0; border-top: 1px solid #333; margin: 1.5rem 0; }
.modal-full-description { color: #ccc; line-height: 1.6; font-size: 0.95rem; }
.modal-footer-info { margin-top: 2rem; display: flex; align-items: center; justify-content: space-between; }
.modal-price { font-size: 1.5rem; color: #8121d0; font-weight: bold; }
.btn-buy { background: #8121d0; color: white; border: none; padding: 0.8rem 1.5rem; font-family: 'Cinzel', serif; cursor: pointer; }
.close-button { position: absolute; top: 1rem; right: 1rem; background: none; border: none; color: #8121d0; font-size: 1.5rem; cursor: pointer; }

@keyframes modalFade { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }

@media (max-width: 768px) {
  .modal-body { grid-template-columns: 1fr; }
  .shop-container { grid-template-columns: 1fr; }
  .filters { display: none; }
}
</style>