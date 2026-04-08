import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  getCarrito, 
  añadirAlCarrito as apiAñadir, 
  eliminarDelCarrito as apiEliminar, 
  vaciarCarrito as apiVaciar,
  actualizarCantidadCarrito // Ya existe en la API, no dará error
} from '@/api/index'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const loading = ref(false)

  // Getters
  const totalItems = computed(() => {
    if (!Array.isArray(items.value)) return 0
    return items.value.reduce((acc, item) => acc + (item.cantidad || 0), 0)
  })

  const totalPrecio = computed(() => {
    if (!Array.isArray(items.value)) return 0
    return items.value.reduce((acc, item) => {
      // Soporta tanto 'producto' como 'productos' (común en joins de Supabase/FastAPI)
      const precio = item.producto?.precio || item.productos?.precio || 0
      return acc + (precio * item.cantidad)
    }, 0)
  })

  // Acciones
  async function fetchCarrito() {
    loading.value = true
    try {
      const response = await getCarrito()
      // Nos aseguramos de asignar un array vacío si la data viene corrupta
      items.value = Array.isArray(response.data) ? response.data : []
    } catch (error) {
      console.error('Error al obtener el carrito:', error)
      items.value = []
    } finally {
      loading.value = false
    }
  }

  async function agregarProducto(productoId, cantidad = 1) {
    try {
      await apiAñadir({ producto_id: productoId, cantidad })
      await fetchCarrito()
    } catch (error) {
      console.error('Error al añadir al carrito:', error)
    }
  }

  async function actualizarCantidad(productoId, nuevaCantidad) {
    try {
      if (nuevaCantidad < 1) return
      await actualizarCantidadCarrito(productoId, nuevaCantidad)
      await fetchCarrito()
    } catch (error) {
      console.error('Error al actualizar cantidad:', error)
    }
  }

  async function eliminarProducto(itemId) {
    try {
      await apiEliminar(itemId)
      await fetchCarrito()
    } catch (error) {
      console.error('Error al eliminar del carrito:', error)
    }
  }

  async function limpiarCarrito() {
    try {
      await apiVaciar()
      items.value = []
    } catch (error) {
      console.error('Error al vaciar el carrito:', error)
    }
  }

  return {
    items,
    loading,
    totalItems,
    totalPrecio,
    fetchCarrito,
    agregarProducto,
    actualizarCantidad,
    eliminarProducto,
    limpiarCarrito
  }
})