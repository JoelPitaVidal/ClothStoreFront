// src/api/index.js
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: { 'Content-Type': 'application/json' }
})

// Interceptor — añade el token JWT automáticamente a cada petición
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor — maneja errores de autenticación globalmente
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Productos
export const getProductos = (params) => api.get('/productos', { params })
export const getProducto  = (id) => api.get(`/productos/${id}`)
export const crearProducto = (data) => api.post('/productos', data)

// Categorías
export const getCategorias = () => api.get('/categorias')

// Auth
export const login    = (data) => api.post('/auth/login', data, {
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
})
export const registro = (data) => api.post('/auth/registro', data)
export const getMe    = () => api.get('/auth/me')

// Carrito
export const getCarrito      = () => api.get('/carrito')
export const añadirAlCarrito = (data) => api.post('/carrito/items', data)
export const eliminarDelCarrito = (itemId) => api.delete(`/carrito/items/${itemId}`)
export const vaciarCarrito   = () => api.delete('/carrito')

// Pedidos
export const crearPedido  = () => api.post('/pedidos')
export const getMisPedidos = () => api.get('/pedidos')

export default api