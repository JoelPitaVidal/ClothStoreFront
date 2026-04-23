<template>
  <div class="admin-wrapper mt-header">
    <div class="admin-container">
      <h1 class="title-gothic-main">Panel de Control Administrativo</h1>

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
        <button 
          :class="['tab-btn', { active: activeTab === 'newsletter' }]" 
          @click="activeTab = 'newsletter'"
        >
          Gestión de Noticias
        </button>
      </div>

      <main class="admin-main-content">
        
        <div v-if="activeTab === 'productos'" class="fade-in">
          <section class="admin-card">
            <h2 class="section-subtitle"><span class="accent-line">|</span> {{ editandoId ? 'Modificar Reliquia' : 'Añadir Nuevo Producto' }}</h2>
            <form @submit.prevent="handleProductSubmit" class="gothic-form">
              <div class="form-group full-width">
                <label>Nombre del Producto</label>
                <input v-model="formProduct.nombre" type="text" class="gothic-input" required />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Precio (€)</label>
                  <input v-model.number="formProduct.precio" type="number" step="0.01" class="gothic-input" required />
                </div>
                <div class="form-group">
                  <label>Stock Total</label>
                  <input v-model.number="formProduct.stock" type="number" class="gothic-input" required />
                </div>
              </div>

              <div class="drop-config-zone">
                <label class="checkbox-container">
                  <input type="checkbox" v-model="formProduct.es_exclusivo">
                  <span class="checkmark"></span>
                  <span class="label-text-exclusive">ACTIVAR MODO DROP EXCLUSIVO</span>
                </label>
                <div v-if="formProduct.es_exclusivo" class="drop-fields-grid fade-in">
                  <div class="form-group">
                    <label>Fecha Lanzamiento</label>
                    <input v-model="formProduct.fecha_lanzamiento" type="datetime-local" class="gothic-input dt" />
                  </div>
                  <div class="form-group">
                    <label>Fecha Fin</label>
                    <input v-model="formProduct.fecha_fin" type="datetime-local" class="gothic-input dt" />
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Categoría</label>
                  <select v-model="formProduct.categoria_id" class="gothic-select" required>
                    <option disabled value="">Seleccione...</option>
                    <option v-for="cat in categorias" :key="cat.id" :value="cat.id">{{ cat.nombre }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>URL de Imagen</label>
                  <input v-model="formProduct.imagen_url" type="url" class="gothic-input" required />
                </div>
              </div>

              <div class="form-group full-width">
                <label>Descripción</label>
                <textarea v-model="formProduct.descripcion" class="gothic-textarea" rows="3"></textarea>
              </div>

              <div class="form-actions">
                <button type="submit" class="btn-gothic-submit" :disabled="loading">
                  {{ editandoId ? 'ACTUALIZAR' : 'GUARDAR PRODUCTO' }}
                </button>
                <button v-if="editandoId" type="button" class="btn-gothic-cancel" @click="cancelarEdicionProd">CANCELAR</button>
              </div>
            </form>
          </section>

          <section class="admin-card">
            <h2 class="section-subtitle"><span class="accent-line">|</span> Inventario</h2>
            <div class="table-scroll">
              <table class="midnight-table">
                <thead>
                  <tr><th>Estado</th><th>Producto</th><th>Stock</th><th>Tipo</th><th class="text-right">Acciones</th></tr>
                </thead>
                <tbody>
                  <tr v-for="prod in productos" :key="prod.id">
                    <td><span :class="['dot', prod.stock > 0 ? 'active' : 'empty']"></span></td>
                    <td class="font-bold">{{ prod.nombre }}</td>
                    <td>{{ prod.stock }}</td>
                    <td><span :class="prod.es_exclusivo ? 'tag-drop' : 'tag-reg'">{{ prod.es_exclusivo ? 'DROP' : 'REG' }}</span></td>
                    <td class="text-right">
                      <div class="action-btns">
                        <button class="btn-action" @click="prepararEdicionProd(prod)">✏️</button>
                        <button class="btn-action del" @click="handleEliminarProd(prod.id)">🗑️</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div v-else-if="activeTab === 'categorias'" class="fade-in">
          <section class="admin-card">
            <h2 class="section-subtitle"><span class="accent-line">|</span> {{ editandoCatId ? 'Editar Gremio' : 'Nueva Categoría' }}</h2>
            <form @submit.prevent="handleCategorySubmit" class="gothic-form">
              <div class="form-group full-width">
                <label>Nombre de la Categoría</label>
                <input v-model="formCat.nombre" type="text" class="gothic-input" placeholder="Ej: Calzado Nocturno" required />
              </div>
              <div class="form-group full-width">
                <label>Descripción</label>
                <textarea v-model="formCat.descripcion" class="gothic-textarea" rows="2" placeholder="Define la esencia de esta sección..."></textarea>
              </div>
              <div class="form-actions">
                <button type="submit" class="btn-gothic-submit" :disabled="loading">
                  {{ editandoCatId ? 'ACTUALIZAR CATEGORÍA' : 'CREAR CATEGORÍA' }}
                </button>
                <button v-if="editandoCatId" type="button" class="btn-gothic-cancel" @click="cancelarEdicionCat">CANCELAR</button>
              </div>
            </form>
          </section>

          <section class="admin-card">
            <h2 class="section-subtitle"><span class="accent-line">|</span> Gremios Registrados</h2>
            <div class="table-scroll">
              <table class="midnight-table">
                <thead>
                  <tr><th>Categoría</th><th>Descripción</th><th class="text-right">Acciones</th></tr>
                </thead>
                <tbody>
                  <tr v-for="cat in categorias" :key="cat.id">
                    <td class="font-bold text-accent">{{ cat.nombre }}</td>
                    <td class="text-secondary">{{ cat.descripcion || 'Sin descripción' }}</td>
                    <td class="text-right">
                      <div class="action-btns">
                        <button class="btn-action" @click="prepararEdicionCat(cat)">✏️</button>
                        <button class="btn-action del" @click="handleEliminarCat(cat.id)">🗑️</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div v-else-if="activeTab === 'newsletter'" class="fade-in">
          <section class="admin-card">
            <h2 class="section-subtitle"><span class="accent-line">|</span> {{ editandoNoticiaId ? 'Editar Comunicado' : 'Nueva Noticia' }}</h2>
            <form @submit.prevent="handleNewsSubmit" class="gothic-form">
              <div class="form-group full-width">
                <label>Título de la Noticia</label>
                <input v-model="formNews.titulo" type="text" class="gothic-input" placeholder="Ej: Nueva colección de invierno" required />
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label>URL de Imagen (Opcional)</label>
                  <input v-model="formNews.imagen_url" type="url" class="gothic-input" placeholder="https://..." />
                </div>
                <div class="form-group">
                  <label class="checkbox-container mt-label">
                    <input type="checkbox" v-model="formNews.es_drop_exclusivo">
                    <span class="checkmark"></span>
                    <span class="label-text-exclusive">MARCAR COMO DROP EXCLUSIVO</span>
                  </label>
                </div>
              </div>

              <div class="form-group full-width">
                <label>Contenido del Mensaje</label>
                <textarea v-model="formNews.contenido" class="gothic-textarea" rows="5" placeholder="Escribe el cuerpo de la noticia..." required></textarea>
              </div>

              <div class="form-actions">
                <button type="submit" class="btn-gothic-submit" :disabled="loading">
                  {{ editandoNoticiaId ? 'ACTUALIZAR NOTICIA' : 'PUBLICAR NOTICIA' }}
                </button>
                <button v-if="editandoNoticiaId" type="button" class="btn-gothic-cancel" @click="cancelarEdicionNews">CANCELAR</button>
              </div>
            </form>
          </section>

          <section class="admin-card">
            <h2 class="section-subtitle"><span class="accent-line">|</span> Historial de Noticias</h2>
            <div class="table-scroll">
              <table class="midnight-table">
                <thead>
                  <tr><th>Fecha</th><th>Título</th><th>Tipo</th><th class="text-right">Acciones</th></tr>
                </thead>
                <tbody>
                  <tr v-for="noticia in noticias" :key="noticia.id">
                    <td class="text-secondary">{{ new Date(noticia.fecha_publicacion).toLocaleDateString() }}</td>
                    <td class="font-bold">{{ noticia.titulo }}</td>
                    <td>
                      <span :class="noticia.es_drop_exclusivo ? 'tag-drop' : 'tag-reg'">
                        {{ noticia.es_drop_exclusivo ? 'DROP' : 'INFO' }}
                      </span>
                    </td>
                    <td class="text-right">
                      <div class="action-btns">
                        <button class="btn-action" @click="prepararEdicionNews(noticia)">✏️</button>
                        <button class="btn-action del" @click="handleEliminarNews(noticia.id)">🗑️</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      <Transition name="fade"><p v-if="mensaje" :class="['status-msg', { error: isError }]">{{ mensaje }}</p></Transition>
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
const noticias = ref([])

// IDs de edición
const editandoId = ref(null)
const editandoCatId = ref(null)
const editandoNoticiaId = ref(null)

// Formularios
const formProduct = ref({ nombre: '', precio: 0, stock: 10, descripcion: '', imagen_url: '', categoria_id: '', es_exclusivo: false, fecha_lanzamiento: null, fecha_fin: null })
const formCat = ref({ nombre: '', descripcion: '' })
const formNews = ref({ titulo: '', contenido: '', imagen_url: '', es_drop_exclusivo: false })

async function fetchDatos() {
  try {
    const [resCat, resProd, resNews] = await Promise.all([
      getCategorias(), 
      getProductos(),
      api.get('/newsletter/noticias')
    ])
    categorias.value = resCat.data || []
    productos.value = resProd.data.resultados || resProd.data || []
    noticias.value = resNews.data || []
  } catch (e) { showMsg("Error de conexión.", true) }
}

// LÓGICA PRODUCTOS
async function handleProductSubmit() {
  loading.value = true
  try {
    if (editandoId.value) await api.put(`/productos/${editandoId.value}`, formProduct.value)
    else await crearProducto(formProduct.value)
    showMsg("Inventario actualizado."); await fetchDatos(); cancelarEdicionProd()
  } catch (e) { showMsg("Error al guardar producto.", true) }
  finally { loading.value = false }
}
function prepararEdicionProd(prod) { 
  editandoId.value = prod.id
  formProduct.value = { ...prod, fecha_lanzamiento: prod.fecha_lanzamiento?.slice(0,16), fecha_fin: prod.fecha_fin?.slice(0,16) }
  window.scrollTo(0,0)
}
const cancelarEdicionProd = () => { editandoId.value = null; formProduct.value = { nombre: '', precio: 0, stock: 10, descripcion: '', imagen_url: '', categoria_id: '', es_exclusivo: false } }

async function handleEliminarProd(id) {
  if (confirm("¿Borrar reliquia?")) { await api.delete(`/productos/${id}`); fetchDatos(); showMsg("Eliminado.") }
}

// LÓGICA CATEGORÍAS
async function handleCategorySubmit() {
  loading.value = true
  try {
    if (editandoCatId.value) await api.put(`/categorias/${editandoCatId.value}`, formCat.value)
    else await api.post('/categorias/', formCat.value)
    showMsg("Categoría guardada."); await fetchDatos(); cancelarEdicionCat()
  } catch (e) { showMsg("Error en categoría.", true) }
  finally { loading.value = false }
}
function prepararEdicionCat(cat) { editandoCatId.value = cat.id; formCat.value = { ...cat }; window.scrollTo(0,0) }
const cancelarEdicionCat = () => { editandoCatId.value = null; formCat.value = { nombre: '', descripcion: '' } }

async function handleEliminarCat(id) {
  if (confirm("¿Borrar categoría? Esto puede afectar a los productos asociados.")) {
    try { await api.delete(`/categorias/${id}`); fetchDatos(); showMsg("Categoría borrada.") }
    catch(e) { showMsg("No se puede borrar si tiene productos.", true) }
  }
}

// LÓGICA NEWSLETTER (NOTICIAS)
async function handleNewsSubmit() {
  loading.value = true
  try {
    if (editandoNoticiaId.value) {
      await api.put(`/newsletter/noticias/${editandoNoticiaId.value}`, formNews.value)
    } else {
      await api.post('/newsletter/noticias', formNews.value)
    }
    showMsg("Noticia publicada."); await fetchDatos(); cancelarEdicionNews()
  } catch (e) { showMsg("Error al publicar noticia.", true) }
  finally { loading.value = false }
}
function prepararEdicionNews(noticia) {
  editandoNoticiaId.value = noticia.id
  formNews.value = { ...noticia }
  window.scrollTo(0,0)
}
const cancelarEdicionNews = () => {
  editandoNoticiaId.value = null
  formNews.value = { titulo: '', contenido: '', imagen_url: '', es_drop_exclusivo: false }
}
async function handleEliminarNews(id) {
  if (confirm("¿Eliminar este comunicado permanentemente?")) {
    await api.delete(`/newsletter/noticias/${id}`)
    fetchDatos()
    showMsg("Comunicado eliminado.")
  }
}

function showMsg(txt, err = false) { mensaje.value = txt; isError.value = err; setTimeout(() => mensaje.value = '', 3000) }
onMounted(fetchDatos)
</script>

<style scoped>
.admin-wrapper { min-height: 100vh; background: var(--bg-primary); color: var(--text-primary); padding: 40px 2rem; transition: 0.3s; }
.admin-container { max-width: 1000px; margin: 0 auto; }
.title-gothic-main { font-family: 'Cinzel'; color: var(--accent-color); text-align: center; letter-spacing: 4px; margin-bottom: 2rem; }

.tab-container { display: flex; justify-content: center; gap: 1rem; margin-bottom: 2rem; border-bottom: 1px solid var(--border-light); }
.tab-btn { background: none; border: none; padding: 1rem; color: var(--text-secondary); font-family: 'Cinzel'; cursor: pointer; transition: 0.3s; }
.tab-btn.active { color: var(--accent-color); border-bottom: 2px solid var(--accent-color); }

.admin-card { background: var(--bg-card); border: 1px solid var(--border-light); padding: 2rem; margin-bottom: 2rem; }
.section-subtitle { font-family: 'Cinzel'; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 10px; }
.accent-line { color: var(--accent-color); font-weight: bold; }

.gothic-form { display: flex; flex-wrap: wrap; gap: 1.2rem; }
.form-group { display: flex; flex-direction: column; gap: 0.4rem; flex: 1; min-width: 240px; }
.full-width { flex: 0 0 100%; }
.form-row { display: flex; gap: 1.2rem; width: 100%; align-items: center; }

label { font-size: 0.7rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 1px; }
.mt-label { margin-top: 1.2rem; }

.gothic-input, .gothic-select, .gothic-textarea { 
  background: var(--bg-primary); border: 1px solid var(--border-light); 
  color: var(--text-primary); padding: 0.8rem; border-radius: 2px;
  width: 100%;
}

.drop-config-zone { flex: 0 0 100%; background: var(--bg-primary); border: 1px dashed var(--accent-color); padding: 1.2rem; }
.drop-fields-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem; }

/* CHECKBOX PERSONALIZADO */
.checkbox-container { display: flex; align-items: center; cursor: pointer; gap: 10px; position: relative; }
.label-text-exclusive { font-weight: 800; color: var(--accent-color); font-size: 0.75rem; letter-spacing: 1px; }

.form-actions { flex: 0 0 100%; display: flex; gap: 1rem; margin-top: 1rem; }
.btn-gothic-submit { background: var(--accent-color); color: white; border: none; padding: 1rem; font-family: 'Cinzel'; cursor: pointer; flex: 2; transition: 0.3s; }
.btn-gothic-cancel { background: transparent; border: 1px solid var(--border-light); color: var(--text-primary); padding: 1rem; flex: 1; cursor: pointer; }

.midnight-table { width: 100%; border-collapse: collapse; }
.midnight-table th { text-align: left; padding: 1rem; color: var(--accent-color); font-family: 'Cinzel'; border-bottom: 2px solid var(--border-light); font-size: 0.8rem; }
.midnight-table td { padding: 1rem; border-bottom: 1px solid var(--border-light); font-size: 0.9rem; }

.text-accent { color: var(--accent-color); }
.text-secondary { color: var(--text-secondary); font-size: 0.8rem; }
.text-right { text-align: right; }

.action-btns { display: flex; gap: 0.5rem; justify-content: flex-end; }
.btn-action { background: var(--bg-primary); border: 1px solid var(--border-light); padding: 5px 10px; cursor: pointer; transition: 0.3s; }
.btn-action.del:hover { background: #e74c3c; color: white; }

.tag-drop { background: var(--accent-color); color: white; padding: 2px 6px; font-size: 0.7rem; font-weight: bold; }
.tag-reg { border: 1px solid var(--text-secondary); color: var(--text-secondary); padding: 2px 6px; font-size: 0.7rem; }
.dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
.dot.active { background: #2ecc71; }
.dot.empty { background: #e74c3c; }

.status-msg { position: fixed; bottom: 2rem; right: 2rem; background: var(--accent-color); color: white; padding: 1rem 2rem; font-family: 'Cinzel'; z-index: 100; box-shadow: 0 5px 15px rgba(0,0,0,0.3); }
.status-msg.error { background: #e74c3c; }

/* TRANSICIONES */
.fade-in { animation: fadeIn 0.5s ease-in; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>