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

      <div v-else v-for="producto in productos" :key="producto.id" class="product-card">
        
        <!-- IMAGEN COMPACTA -->
        <div class="product-image">
          <img 
            :src="producto.imagen_url || 'https://via.placeholder.com/500x500/1a1a1a/e0e0e0?text=Reliquia'" 
            :alt="producto.nombre"
          >
          <div v-if="producto.es_nuevo || producto.id % 3 === 0" class="product-badge">
            {{ producto.id % 3 === 0 ? 'Exclusivo' : 'Nuevo' }}
          </div>
        </div>

        <!-- INFORMACIÓN REDUCIDA -->
        <div class="product-info">
          <h3 class="product-title" :title="producto.nombre">{{ producto.nombre }}</h3>
          
          <p class="product-description">
            {{ producto.descripcion || 'Sin descripción en los archivos antiguos.' }}
          </p>
          
          <div class="product-footer">
            <span class="product-price">{{ producto.precio.toFixed(2) }}€</span>
            <button 
              @click="handleAddToCart(producto)" 
              class="btn-add-cart"
              :disabled="addingToCart === producto.id"
            >
              <span v-if="addingToCart === producto.id">...</span>
              <span v-else>+ 🛒</span>
            </button>
          </div>
        </div>
      </div>
    </main>
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

const fetchProductos = async () => {
  try {
    loading.value = true
    error.value = null
    const params = selectedCategories.value.length > 0 
      ? { categoria_id: selectedCategories.value.join(',') } 
      : {}
    const response = await getProductos(params)
    productos.value = response.data
  } catch (err) {
    error.value = "Las sombras no responden. Revisa la conexión."
    console.error(err)
  } finally {
    loading.value = false
  }
}

const fetchCategorias = async () => {
  try {
    const response = await getCategorias()
    categorias.value = response.data
  } catch (err) {
    console.error("Error cargando categorías:", err)
  }
}

const handleAddToCart = async (producto) => {
  addingToCart.value = producto.id
  try {
    await añadirAlCarrito({ producto_id: producto.id, cantidad: 1 })
    alert(`${producto.nombre} reclamado.`)
  } catch (err) {
    if (err.response?.status === 401) alert("Inicia sesión primero.")
    else alert("Error al conectar con el carrito.")
  } finally {
    addingToCart.value = null
  }
}

watch(selectedCategories, () => {
  fetchProductos()
})

onMounted(() => {
  fetchProductos()
  fetchCategorias()
})
</script>

<style scoped>
.shop-container {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 2rem;
  padding: 2rem 5%;
  min-height: 100vh;
}

/* FILTROS */
.filters {
  border-right: 1px solid #333;
  padding-right: 1.5rem;
}
.title-gothic { font-family: 'Cinzel', serif; color: #8121d0; font-size: 1.2rem; }
.filter-group h4 { color: #a394ac; font-size: 0.8rem; text-transform: uppercase; margin: 1.5rem 0 0.5rem; }
.filter-group ul { list-style: none; padding: 0; }
.filter-group li { margin-bottom: 0.5rem; color: #e0d5e8; font-size: 0.9rem; }

/* REJILLA COMPACTA */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
  align-items: start;
}

/* TARJETA REDUCIDA */
.product-card {
  background: #0a0a0a;
  border: 1px solid #222;
  border-radius: 4px;
  overflow: hidden;
  transition: 0.3s ease;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  border-color: #8121d0;
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(129, 33, 208, 0.2);
}

/* IMAGEN CUADRADA (Reduce altura) */
.product-image {
  position: relative;
  aspect-ratio: 1 / 1; 
  overflow: hidden;
  background: #111;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(0.3) brightness(0.7);
  transition: 0.5s;
}

.product-card:hover .product-image img {
  filter: grayscale(0) brightness(1);
  transform: scale(1.05);
}

.product-badge {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  background: #8121d0;
  color: white;
  padding: 2px 8px;
  font-size: 0.6rem;
  text-transform: uppercase;
  font-weight: bold;
}

/* INFO Y DESCRIPCIÓN */
.product-info {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.product-title {
  font-family: 'Cinzel', serif;
  font-size: 0.95rem;
  margin: 0;
  color: #e0d5e8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-description {
  font-size: 0.75rem;
  color: #888;
  margin: 0;
  line-height: 1.3;
  /* Limitar a 2 líneas */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* FOOTER ALINEADO */
.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #1a1a1a;
}

.product-price {
  color: #8121d0;
  font-weight: bold;
  font-size: 1rem;
}

.btn-add-cart {
  background: transparent;
  border: 1px solid #8121d0;
  color: white;
  padding: 0.3rem 0.6rem;
  cursor: pointer;
  border-radius: 2px;
  transition: 0.2s;
}

.btn-add-cart:hover:not(:disabled) {
  background: #8121d0;
}

/* ESTADOS */
.loading-state { grid-column: 1/-1; text-align: center; padding: 5rem; color: #8121d0; font-family: 'Cinzel'; }
.error-state { grid-column: 1/-1; text-align: center; color: #ff4444; }

@media (max-width: 768px) {
  .shop-container { grid-template-columns: 1fr; }
  .filters { display: none; }
}
</style>