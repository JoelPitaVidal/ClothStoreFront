<template>
  <div class="app-layout" :class="{ 'sidebar-active': sidebarOpen }">
    <!-- El Header escucha el evento para abrir el sidebar -->
    <AppHeader @toggle-sidebar="sidebarOpen = !sidebarOpen" />
    
    <!-- Aquí podrías añadir tu componente <AppSidebar v-if="sidebarOpen" /> -->

    <main class="main-content">
      <!-- RouterView cargará Login, Productos, Admin, etc. -->
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const sidebarOpen = ref(false)

// CRUCIAL: Cuando la aplicación se carga en el navegador
onMounted(async () => {
  // Si hay un token en el almacenamiento local, recuperamos los datos del usuario
  if (localStorage.getItem('token')) {
    await authStore.fetchUsuario()
  }
})
</script>

<style>
/* Variables globales para mantener la coherencia gótica */
:root {
  --header-height: 70px;
  --sidebar-width: 0px; /* Cambiar a 250px si añades un sidebar fijo */
  --deep-black: #0a0a0a;
  --gothic-purple: #8121d0;
  --text-soft: #a394ac;
}

/* Reset básico para que el fondo sea siempre oscuro */
body {
  margin: 0;
  background-color: var(--deep-black);
  color: white;
  font-family: 'Quicksand', sans-serif;
}

.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  /* margin-top asegura que el contenido no se esconda debajo del header fixed */
  margin-top: var(--header-height);
  padding: 2rem;
  flex: 1;
  transition: margin-left 0.3s ease;
  
  /* Centrado opcional para que el contenido no pegue a los bordes en pantallas gigantes */
  max-width: 1400px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
}

/* Si en el futuro activas el sidebar, esto desplazará el contenido */
.sidebar-active .main-content {
  margin-left: var(--sidebar-width);
}

/* Transiciones de página suaves */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>