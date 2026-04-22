import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json'
  }
})

// --- INTERCEPTORES ---
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      const url = error.config.url || ''
      const esRutaPublica = url.includes('/auth/login') || url.includes('/auth/registro')

      if (!esRutaPublica) {
        console.warn("Sesión expirada o inválida. Redirigiendo...")
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// --- FUNCIONES DE LA API ---

// Autenticación
export const login = (credentials) => {
  const params = new URLSearchParams()
  params.append('username', credentials.username)
  params.append('password', credentials.password)
  return api.post('/auth/login', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}
export const registro = (data) => api.post('/auth/registro', data)
export const getMe = () => api.get('/auth/me')

// Productos
export const getProductos = (params) => api.get('/productos', { params })
export const getProducto = (id) => api.get(`/productos/${id}`)
export const crearProducto = (data) => api.post('/productos', data)
export const eliminarProducto = (id) => api.delete(`/productos/${id}`)
export const toggleExclusivo = (id, datos) => api.patch(`/productos/${id}/exclusivo`, datos)

// Categorías
export const getCategorias = () => api.get('/categorias')

// Carrito
export const getCarrito = () => api.get('/carrito')
export const añadirAlCarrito = (data) => api.post('/carrito/items', data)
export const eliminarDelCarrito = (itemId) => api.delete(`/carrito/items/${itemId}`)
export const vaciarCarrito = () => api.delete('/carrito')
export const actualizarCantidadCarrito = (productoId, cantidad) =>
  api.patch(`/carrito/items/${productoId}`, { cantidad })

// Pedidos
export const crearPedido = () => api.post('/pedidos')
export const getMisPedidos = () => api.get('/pedidos')
export const actualizarEstadoPedido = (id, estado) => api.patch(`/pedidos/${id}/estado`, { estado })

// Pagos (Ajustados para coincidir con el Backend)
// IMPORTANTE: pedidoId debe pasarse como query param: ?pedido_id=...
export const crearIntentoStripe = (pedidoId) => 
  api.post(`/pagos/stripe/crear-intento?pedido_id=${pedidoId}`)

// Para PayPal usamos el esquema que definimos en FastAPI (PayPalRequest)
export const verificarPagoPaypal = (orderId, pedidoId) => 
  api.post('/pagos/paypal/verificar', { 
    order_id: orderId, 
    pedido_id: pedidoId 
  })

export default api