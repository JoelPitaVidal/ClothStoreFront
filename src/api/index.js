import axios from 'axios'

/**
 * CONFIGURACIÓN BASE
 * El backend (Python) normalmente corre en el 8000.
 * El puerto 5173 es solo para el servidor de desarrollo de tu Frontend.
 */
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000', 
  headers: { 
    'Content-Type': 'application/json' 
  }
})

// --- INTERCEPTORES ---

// 1. Inyección automática del Token Bearer
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

// 2. Manejador global de respuestas y errores
api.interceptors.response.use(
  response => response,
  error => {
    // Si el servidor responde con 401, el token ya no es válido
    if (error.response?.status === 401) {
      console.warn("Sesión expirada o inválida. Redirigiendo...")
      localStorage.removeItem('token')
      // Solo redirigir si no estamos ya en la página de login para evitar bucles
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// --- FUNCIONES DE LA API ---

// Autenticación (Auth)
// Usamos URLSearchParams para cumplir con el estándar OAuth2 que usa FastAPI por defecto
export const login = (credentials) => {
  const params = new URLSearchParams()
  params.append('username', credentials.username) // FastAPI suele esperar 'username', no 'email'
  params.append('password', credentials.password)
  
  return api.post('/auth/login', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
}

export const registro = (data) => api.post('/auth/registro', data)
export const getMe = () => api.get('/auth/me')

// Productos (Colección Midnight Attire)
export const getProductos = (params) => api.get('/productos', { params })
export const getProducto  = (id) => api.get(`/productos/${id}`)
export const crearProducto = (data) => api.post('/productos', data)

// Categorías
export const getCategorias = () => api.get('/categorias')

// Carrito
export const getCarrito       = () => api.get('/carrito')
export const añadirAlCarrito  = (data) => api.post('/carrito/items', data)
export const eliminarDelCarrito = (itemId) => api.delete(`/carrito/items/${itemId}`)
export const vaciarCarrito    = () => api.delete('/carrito')

// Pedidos
export const crearPedido   = () => api.post('/pedidos')
export const getMisPedidos = () => api.get('/pedidos')

export default api