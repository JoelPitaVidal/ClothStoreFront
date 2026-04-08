<template>
  <div class="admin-wrapper">
    <div class="admin-container">
      <h1 class="title">Panel de Control Administrativo</h1>

      <!-- SELECTOR DE PESTAÑAS -->
      <div class="tab-container">
        <button 
          :class="['tab-btn', { active: activeTab === 'productos' }]" 
          @click="activeTab = 'productos'"
        >
          Gestión de Productos
        </button>
        <button 
          :class="['tab-btn', { active: activeTab === 'categorias' }]" 
          @click="activeTab = 'categorias'"
        >
          Gestión de Categorías
        </button>
      </div>

      <main class="admin-main-content">
        <!-- SECCIÓN: GESTIÓN DE PRODUCTOS -->
        <div v-if="activeTab === 'productos'" class="fade-in">
          <section class="admin-section">
            <h2 class="section-subtitle">{{ editandoId ? 'Modificar Producto' : 'Añadir Nuevo Producto' }}</h2>
            <form @submit.prevent="handleProductSubmit" class="admin-form">
              <div class="form-group">
                <label>Nombre del Producto</label>
                <input v-model="formProduct.nombre" type="text" placeholder="Nombre descriptivo" required />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Precio (€)</label>
                  <input v-model.number="formProduct.precio" type="number" step="0.01" required />
                </div>
                <div class="form-group">
                  <label>Stock Disponible</label>
                  <input v-model.number="formProduct.stock" type="number" required />
                </div>
              </div>

              <div class="form-group">
                <label>Categoría</label>
                <select v-model="formProduct.categoria_id" class="gothic-select" required>
                  <option disabled value="">Seleccione una categoría...</option>
                  <option v-for="cat in categorias" :key="cat.id" :value="cat.id">
                    {{ cat.nombre }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label>URL de Imagen</label>
                <input v-model="formProduct.imagen_url" type="url" placeholder="https://..." required />
              </div>

              <div class="form-group">
                <label>Descripción</label>
                <textarea v-model="formProduct.descripcion" rows="3"></textarea>
              </div>

              <div class="form-actions">
                <button type="submit" class="btn-submit" :disabled="loading">
                  {{ loading ? 'Guardando...' : (editandoId ? 'Guardar Cambios' : 'Registrar Producto') }}
                </button>
                <button v-if="editandoId" type="button" class="btn-cancel" @click="cancelarEdicionProd">Cancelar</button>
              </div>
            </form>
          </section>

          <section class="admin-section">
            <h2 class="section-subtitle">Inventario de Productos</h2>
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
                <tbody v-if="productos && productos.length > 0">
                  <tr v-for="prod in productos" :key="prod.id">
                    <td class="font-bold">{{ prod.nombre }}</td>
                    <td>{{ prod.precio?.toFixed(2) }}€</td>
                    <td>{{ prod.stock }}</td>
                    <td class="actions-cell">
                      <button class="btn-icon edit" @click="prepararEdicionProd(prod)">✏️</button>
                      <button class="btn-icon delete" @click="handleEliminarProd(prod.id)">🗑️</button>
                    </td>
                  </tr>
                </tbody>
                <tbody v-else>
                  <tr>
                    <td colspan="4" class="empty-state">No hay productos registrados o cargando...</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <!-- SECCIÓN: GESTIÓN DE CATEGORÍAS -->
        <div v-else class="fade-in">
          <section class="admin-section">
            <h2 class="section-subtitle">{{ editandoCatId ? 'Editar Categoría' : 'Nueva Categoría' }}</h2>
            <form @submit.prevent="handleCategorySubmit" class="admin-form">
              <div class="form-group">
                <label>Nombre de la Categoría</label>
                <input v-model="formCat.nombre" type="text" required />
              </div>
              <div class="form-group">
                <label>Descripción</label>
                <textarea v-model="formCat.descripcion" rows="2"></textarea>
              </div>
              <div class="form-actions">
                <button type="submit" class="btn-submit" :disabled="loading">
                  {{ loading ? 'Guardando...' : (editandoCatId ? 'Actualizar' : 'Crear Categoría') }}
                </button>
                <button v-if="editandoCatId" type="button" class="btn-cancel" @click="cancelarEdicionCat">Cancelar</button>
              </div>
            </form>
          </section>

          <section class="admin-section">
            <h2 class="section-subtitle">Listado de Categorías</h2>
            <div class="table-container">
              <table class="gothic-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody v-if="categorias && categorias.length > 0">
                  <tr v-for="cat in categorias" :key="cat.id">
                    <td class="font-bold">{{ cat.nombre }}</td>
                    <td>{{ cat.descripcion }}</td>
                    <td class="actions-cell">
                      <button class="btn-icon edit" @click="prepararEdicionCat(cat)">✏️</button>
                      <button class="btn-icon delete" @click="handleEliminarCat(cat.id)">🗑️</button>
                    </td>
                  </tr>
                </tbody>
                <tbody v-else>
                  <tr>
                    <td colspan="3" class="empty-state">No hay categorías registradas o cargando...</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      <Transition name="fade">
        <p v-if="mensaje" :class="['status-msg', { error: isError }]">{{ mensaje }}</p>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api, { getCategorias, getProductos, crearProducto } from '@/api'

const activeTab = ref('productos')
const loading = ref(false)
const mensaje = ref('')
const isError = ref(false)

const productos = ref([])
const categorias = ref([])

const editandoId = ref(null)
const editandoCatId = ref(null)

const formProduct = ref({ nombre: '', precio: 0, stock: 10, descripcion: '', imagen_url: '', categoria_id: '' })
const formCat = ref({ nombre: '', descripcion: '' })

onMounted(fetchDatos)

async function fetchDatos() {
  try {
    const [resCat, resProd] = await Promise.all([getCategorias(), getProductos()])
    categorias.value = resCat.data || []
    // Manejo de la estructura de respuesta de productos
    productos.value = resProd.data.resultados || resProd.data || []
  } catch (error) {
    showMsg("Error al sincronizar datos.", true)
  }
}

async function handleProductSubmit() {
  loading.value = true
  try {
    if (editandoId.value) {
      await api.put(`/productos/${editandoId.value}`, formProduct.value)
      showMsg("Producto actualizado.")
    } else {
      await crearProducto(formProduct.value)
      showMsg("Producto registrado.")
    }
    await fetchDatos()
    cancelarEdicionProd()
  } catch (error) {
    showMsg("Error en la operación.", true)
  } finally { loading.value = false }
}

function prepararEdicionProd(prod) {
  editandoId.value = prod.id
  formProduct.value = { ...prod }
}

function cancelarEdicionProd() {
  editandoId.value = null
  formProduct.value = { nombre: '', precio: 0, stock: 10, descripcion: '', imagen_url: '', categoria_id: '' }
}

async function handleEliminarProd(id) {
  if (!confirm("¿Eliminar este producto?")) return
  try {
    await api.delete(`/productos/${id}`)
    await fetchDatos()
    showMsg("Producto eliminado.")
  } catch (error) { showMsg("Error al eliminar.", true) }
}

async function handleCategorySubmit() {
  loading.value = true
  try {
    if (editandoCatId.value) {
      await api.put(`/categorias/${editandoCatId.value}`, formCat.value)
      showMsg("Categoría actualizada.")
    } else {
      await api.post('/categorias/', formCat.value)
      showMsg("Categoría creada.")
    }
    await fetchDatos()
    cancelarEdicionCat()
  } catch (error) {
    showMsg("Error al procesar categoría.", true)
  } finally { loading.value = false }
}

function prepararEdicionCat(cat) {
  editandoCatId.value = cat.id
  formCat.value = { ...cat }
}

function cancelarEdicionCat() {
  editandoCatId.value = null
  formCat.value = { nombre: '', descripcion: '' }
}

async function handleEliminarCat(id) {
  if (!confirm("¿Eliminar categoría?")) return
  try {
    await api.delete(`/categorias/${id}`)
    await fetchDatos()
    showMsg("Categoría eliminada.")
  } catch (error) { showMsg("No se pudo eliminar.", true) }
}

function showMsg(txt, err = false) {
  mensaje.value = txt
  isError.value = err
  setTimeout(() => { mensaje.value = '' }, 3000)
}
</script>

<style scoped>
.admin-wrapper {
  min-height: 100vh;
  padding-top: 100px;
  background-color: var(--bg-dark, #050505);
}

.admin-container { max-width: 1000px; margin: 0 auto; padding: 0 2rem 4rem; }

.title { 
  font-family: 'Cinzel', serif; 
  color: var(--text-primary, #fff); 
  text-align: center; 
  margin-bottom: 2rem; 
}

.tab-container { 
  display: flex; 
  gap: 1.5rem; 
  margin-bottom: 2rem; 
  border-bottom: 1px solid var(--border-light, #333); 
}

.tab-btn { 
  background: none; border: none; 
  color: var(--text-secondary, #888); 
  padding: 1rem; 
  cursor: pointer; 
  font-family: 'Cinzel';
  text-transform: uppercase;
  transition: all 0.3s;
}

.tab-btn.active { color: #8121d0; border-bottom: 2px solid #8121d0; }

.admin-section { 
  background: var(--bg-card, #111); 
  border: 1px solid var(--border-light, #222); 
  padding: 2rem; 
  border-radius: 4px; 
  margin-bottom: 2rem; 
}

.section-subtitle { color: #8121d0; font-family: 'Cinzel'; margin-bottom: 1.5rem; }

.admin-form { display: flex; flex-direction: column; gap: 1.2rem; }
.form-group { display: flex; flex-direction: column; gap: 0.4rem; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

label { color: var(--text-secondary, #aaa); font-size: 0.75rem; text-transform: uppercase; }

input, textarea, .gothic-select { 
  background: var(--bg-dark, #0a0a0a); 
  border: 1px solid var(--border-light, #333); 
  color: var(--text-primary, #fff); 
  padding: 0.8rem;
  border-radius: 2px;
}

.btn-submit { background: #8121d0; color: white; border: none; padding: 0.8rem; cursor: pointer; font-family: 'Cinzel'; }
.btn-cancel { background: var(--border-light, #333); color: var(--text-primary, #fff); border: none; padding: 0.8rem; cursor: pointer; margin-left: 0.5rem; }

.table-container { overflow-x: auto; }
.gothic-table { width: 100%; border-collapse: collapse; }
.gothic-table th { border-bottom: 1px solid #8121d0; padding: 1rem; text-align: left; color: #8121d0; font-size: 0.8rem; }
.gothic-table td { padding: 1rem; border-bottom: 1px solid var(--border-light, #222); color: var(--text-primary, #fff); }

.empty-state { text-align: center; padding: 3rem; color: var(--text-secondary, #666); }

.actions-cell { display: flex; gap: 10px; }
.btn-icon { background: var(--bg-dark, #050505); border: 1px solid var(--border-light, #333); cursor: pointer; padding: 5px; color: white; }

.status-msg { 
  position: fixed; bottom: 2rem; right: 2rem; 
  background: #00ff88; color: #000; 
  padding: 1rem 2rem; border-radius: 4px; font-weight: bold; 
}
.status-msg.error { background: #ff4444; color: white; }

.fade-in { animation: fadeIn 0.4s ease forwards; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>