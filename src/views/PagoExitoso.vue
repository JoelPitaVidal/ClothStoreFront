<template>
  <div class="success-page">
    <div class="container">
      <div class="success-card">
        <div class="icon-wrapper">
          <span class="material-icons">check_circle</span>
        </div>
        
        <h1 class="title-gothic">Pago Confirmado</h1>
        <p class="message">Tu transacción ha sido procesada con éxito. Los hilos de tu destino ya están en marcha.</p>
        
        <div v-if="pedidoId" class="order-info">
          <p>Pedido: <strong>#{{ pedidoId }}</strong></p>
          
          <div class="action-buttons">
            <button @click="descargarPDF" :disabled="loading" class="btn-primary">
              <span v-if="!loading">Descargar Factura PDF</span>
              <span v-else>Generando documento...</span>
            </button>
            
            <router-link to="/tienda" class="btn-secondary">
              Volver a la Tienda
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import * as api from '@/api/index'

const route = useRoute()
const cartStore = useCartStore()
const pedidoId = ref(null)
const loading = ref(false)

onMounted(async () => {
  // 1. Obtener el ID del pedido de la URL (?pedido_id=X)
  pedidoId.value = route.query.pedido_id
  
  // 2. Limpiar el carrito local (ya que el pago fue un éxito)
  await cartStore.limpiarCarrito()
})

const descargarPDF = async () => {
  if (!pedidoId.value) return
  
  loading.value = true
  try {
    const response = await api.obtenerFacturaBlob(pedidoId.value)
    
    // Crear el enlace de descarga para el navegador
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `Factura_Midnight_${pedidoId.value}.pdf`)
    document.body.appendChild(link)
    link.click()
    
    link.remove()
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error("Error al descargar factura:", error)
    alert("La factura se está procesando. Reintenta en unos segundos.")
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.success-page {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #050505;
  color: #e0d5e8;
}
.success-card {
  background: #0f0f0f;
  padding: 3rem;
  border: 1px solid #4b0082;
  text-align: center;
  border-radius: 8px;
  box-shadow: 0 0 30px rgba(75, 0, 130, 0.2);
  max-width: 500px;
}
.icon-wrapper {
  color: #4b0082;
  font-size: 4rem;
  margin-bottom: 1rem;
}
.title-gothic {
  font-family: 'Cinzel', serif;
  font-size: 2.5rem;
  margin-bottom: 1rem;
}
.order-info { margin-top: 2rem; }
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
}
.btn-primary {
  padding: 1rem;
  background: #4b0082;
  color: white;
  border: none;
  cursor: pointer;
  font-family: 'Cinzel', serif;
  transition: 0.3s;
}
.btn-primary:hover { background: #6a0dad; }
.btn-secondary {
  color: #888;
  text-decoration: none;
  font-size: 0.9rem;
}
.btn-secondary:hover { color: white; }
</style>