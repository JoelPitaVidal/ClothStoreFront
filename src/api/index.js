import axios from 'axios'

// Configuración base de Axios
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000', // Asegúrate de que tu backend esté en este puerto
  headers: { 
    'Content-Type': 'application/json' 
  }
})

// --- INTERCEPTORES ---

// 1. Añade el token automáticamente a cada petición si existe
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 2. Maneja errores globales (como el 401 Unauthorized)
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      // Redirigir al login si el token expira o es inválido
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// --- FUNCIONES DE LA API (EXPORTS NOMBRADOS) ---

// Autenticación (Auth)
export const login = (data) => api.post('/auth/login', data, {
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
})
export const registro = (data) => api.post('/auth/registro', data)
export const getMe = () => api.get('/auth/me')

// Productos
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

// Exportación por defecto de la instancia de axios
export default api