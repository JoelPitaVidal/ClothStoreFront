<template>
  <div class="admin-container">
    <h1 class="title">✦ Panel Maestro ✦</h1>
    
    <!-- SECCIÓN FORMULARIO (Crear / Editar) -->
    <section class="admin-section">
      <h2 class="section-subtitle">
        {{ editandoId ? '✦ Modificar Reliquia ✦' : '✦ Añadir Nuevo Producto ✦' }}
      </h2>

      <form @submit.prevent="handleSubmit" class="admin-form">
        <div class="form-group">
          <label>Nombre del Producto</label>
          <input v-model="form.nombre" type="text" placeholder="Ej: Capa de Terciopelo Nocturno" required />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Precio (€)</label>
            <input v-model.number="form.precio" type="number" step="0.01" required />
          </div>
          <div class="form-group">
            <label>Stock</label>
            <input v-model.number="form.stock" type="number" required />
          </div>
        </div>

        <div class="form-group">
          <label>Categoría</label>
          <select v-model="form.categoria_id" class="gothic-select" required>
            <option disabled value="">Selecciona una categoría...</option>
            <option v-for="cat in categorias" :key="cat.id" :value="cat.id">
              {{ cat.nombre }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>URL de la Imagen</label>
          <input v-model="form.imagen_url" type="url" placeholder="https://..." required />
        </div>

        <div class="form-group">
          <label>Descripción</label>
          <textarea v-model="form.descripcion" rows="3" placeholder="Describe la esencia..."></textarea>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-submit" :disabled="loading">
            {{ loading ? 'Procesando...' : (editandoId ? 'Actualizar †' : 'Añadir †') }}
          </button>
          
          <button v-if="editandoId" type="button" class="btn-cancel" @click="cancelarEdicion">
            Cancelar
          </button>
        </div>

        <p v-if="mensaje" :class="['status-msg', { error: isError }]">{{ mensaje }}</p>
      </form>
    </section>

    <!-- SECCIÓN LISTADO (Editar / Eliminar) -->
    <section class="admin-section">
      <h2 class="section-subtitle">✦ Inventario Actual ✦</h2>
      <div class="table-container">
        <table class="gothic-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <!-- Iteramos sobre la lista blindada -->
            <tr v-for="prod in (productos || [])" :key="prod.id">
              <td>{{ prod.nombre || 'Sin nombre' }}</td>
              <td>{{ prod.precio ? prod.precio.toFixed(2) : '0.00' }}€</td>
              <td>{{ prod.stock ?? 0 }}</td>
              <td class="actions-cell">
                <button class="btn-icon edit" @click="prepararEdicion(prod)" title="Editar">✏️</button>
                <button class="btn-icon delete" @click="handleEliminar(prod.id)" title="Eliminar">🗑️</button>
              </td>
            </tr>
            <!-- Mensaje si no hay productos reales -->
            <tr v-if="!productos || productos.length === 0">
              <td colspan="4" style="text-align: center; padding: 2rem; color: #666;">
                No hay reliquias en el inventario.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api, { crearProducto, getCategorias, getProductos } from '@/api'

const loading = ref(false)
const mensaje = ref('')
const isError = ref(false)
const categorias = ref([])
const productos = ref([]) // Inicializado como array
const editandoId = ref(null)

const form = ref({
  nombre: '',
  precio: 0,
  stock: 10,
  descripcion: '',
  imagen_url: '',
  categoria_id: ''
})

onMounted(() => {
  fetchInicial()
})

async function fetchInicial() {
  try {
    const [resCat, resProd] = await Promise.all([getCategorias(), getProductos()])
    categorias.value = resCat.data
    
    // CORRECCIÓN: Manejar respuesta paginada { resultados: [], total: X }
    if (resProd.data && resProd.data.resultados) {
      productos.value = resProd.data.resultados
    } else {
      productos.value = resProd.data || []
    }
  } catch (error) {
    console.error("Error al cargar datos:", error)
    isError.value = true
    mensaje.value = "Las sombras impiden ver el inventario."
  }
}

async function handleSubmit() {
  loading.value = true
  mensaje.value = ''
  isError.value = false

  try {
    const payload = {
      ...form.value,
      precio: parseFloat(form.value.precio),
      stock: parseInt(form.value.stock),
      categoria_id: parseInt(form.value.categoria_id)
    }

    if (editandoId.value) {
      await api.put(`/productos/${editandoId.value}`, payload)
      mensaje.value = "Reliquia actualizada correctamente."
    } else {
      await crearProducto(payload)
      mensaje.value = "Reliquia añadida al catálogo."
    }

    await fetchInicial() 
    cancelarEdicion()
  } catch (error) {
    isError.value = true
    mensaje.value = "Error: " + (error.response?.data?.detail || "Fallo en el ritual")
  } finally {
    loading.value = false
  }
}

function prepararEdicion(prod) {
  editandoId.value = prod.id
  form.value = { ...prod }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function cancelarEdicion() {
  editandoId.value = null
  form.value = { nombre: '', precio: 0, stock: 10, descripcion: '', imagen_url: '', categoria_id: '' }
}

async function handleEliminar(id) {
  if (!id) return
  if (!confirm("¿Deseas desterrar este producto para siempre?")) return

  try {
    await api.delete(`/productos/${id}`)
    await fetchInicial()
    mensaje.value = "Producto eliminado."
    isError.value = false
  } catch (error) {
    isError.value = true
    mensaje.value = "No se pudo eliminar. ¿Quizás está en un pedido activo?"
  }
}
</script>

<style scoped>
.admin-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
}

.title { font-family: 'Cinzel', serif; color: #e0d5e8; text-align: center; margin-bottom: 2rem; text-shadow: 0 0 10px #8121d0; }

.admin-section {
  background: #111;
  border: 1px solid #8121d0;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 0 15px rgba(0,0,0,0.5);
}

.section-subtitle {
  font-family: 'Cinzel', serif;
  color: #8121d0;
  font-size: 1.1rem;
  text-align: center;
  margin-bottom: 1.5rem;
}

.admin-form { display: flex; flex-direction: column; gap: 1.2rem; }
.form-group { display: flex; flex-direction: column; gap: 0.4rem; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

label { color: #a394ac; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; }

input, textarea, .gothic-select {
  background: #0a0a0a;
  border: 1px solid #333;
  color: white;
  padding: 0.7rem;
  border-radius: 4px;
  transition: 0.3s;
}

input:focus, .gothic-select:focus { border-color: #8121d0; outline: none; }

.form-actions { display: flex; gap: 1rem; }

.btn-submit {
  flex: 2;
  background: #8121d0;
  color: white;
  padding: 0.8rem;
  border: none;
  font-family: 'Cinzel', serif;
  cursor: pointer;
  font-weight: bold;
}

.btn-cancel {
  flex: 1;
  background: #444;
  color: white;
  border: none;
  cursor: pointer;
  font-family: 'Cinzel', serif;
}

.table-container { overflow-x: auto; margin-top: 1rem; }
.gothic-table { width: 100%; border-collapse: collapse; color: #e0d5e8; }
.gothic-table th { border-bottom: 2px solid #8121d0; padding: 0.8rem; text-align: left; font-family: 'Cinzel'; font-size: 0.8rem; }
.gothic-table td { padding: 0.8rem; border-bottom: 1px solid #222; font-size: 0.9rem; }

.actions-cell { display: flex; gap: 0.5rem; }
.btn-icon { background: none; border: 1px solid #333; cursor: pointer; padding: 4px 8px; border-radius: 4px; }
.btn-icon:hover { border-color: #8121d0; }

.status-msg { text-align: center; margin-top: 1rem; font-size: 0.9rem; color: #00ff88; }
.status-msg.error { color: #ff4444; }
</style>