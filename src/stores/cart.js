import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  getCarrito, 
  añadirAlCarrito as apiAñadir, 
  eliminarDelCarrito as apiEliminar, 
  vaciarCarrito as apiVaciar 
} from '@/api/index'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const loading = ref(false)

  // Getters
  const totalItems = computed(() => items.value.reduce((acc, item) => acc + item.cantidad, 0))
  const totalPrice = computed(() => items.value.reduce((acc, item) => acc + (item.precio * item.cantidad), 0))

  // Acciones
  async function fetchCarrito() {
    loading.value = true
    try {
      const response = await getCarrito()
      items.value = response.data
    } catch (error) {
      console.error('Error al obtener el carrito:', error)
    } finally {
      loading.value = false
    }
  }

  async function agregarProducto(productoId, cantidad = 1) {
    try {
      await apiAñadir({ producto_id: productoId, cantidad })
      await fetchCarrito() // Recargamos el carrito tras añadir
    } catch (error) {
      console.error('Error al añadir al carrito:', error)
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
    totalPrice,
    fetchCarrito,
    agregarProducto,
    eliminarProducto,
    limpiarCarrito
  }
})