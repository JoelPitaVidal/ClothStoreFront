<template>
  <div class="app-layout" :class="{ 'sidebar-active': sidebarOpen }">
    <!-- El Header escucha el evento para abrir el sidebar -->
    <AppHeader @toggle-sidebar="sidebarOpen = !sidebarOpen" />
    
    <!-- Aquí podrías añadir tu componente <AppSidebar v-if="sidebarOpen" /> -->

    <main class="main-content">
      <!-- RouterView cargará Login, Productos, Admin, etc. -->
      <RouterView />
    </main>

    <!-- Añadimos el Footer aquí para que sea global -->
    <AppFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue' // Importación del componente
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const sidebarOpen = ref(false)

onMounted(async () => {
  if (localStorage.getItem('token')) {
    await authStore.fetchUsuario()
  }
})
</script>

<style>
/* Variables globales para mantener la coherencia gótica */
:root {
  --header-height: 70px;
  --sidebar-width: 0px; 
  --deep-black: #0a0a0a;
  --bg-secondary: #0f0f0f; /* Añadida para el footer */
  --gothic-purple: #8121d0;
  --accent: #8121d0;
  --text-main: #e0d5e8;
  --text-soft: #a394ac;
  --text-muted: #777;
  --border: #1a1a1a;
}

body {
  margin: 0;
  background-color: var(--deep-black);
  color: white;
  font-family: 'Quicksand', sans-serif;
}

/* Layout con Flexbox para empujar el footer hacia abajo */
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  margin-top: var(--header-height);
  padding: 2rem;
  /* flex: 1 hace que este contenedor crezca y empuje al footer al fondo */
  flex: 1 0 auto; 
  transition: margin-left 0.3s ease;
  max-width: 1400px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
}

.sidebar-active .main-content {
  margin-left: var(--sidebar-width);
}

/* Títulos con fuente gótica para uso global */
.title-gothic {
  font-family: 'Cinzel', serif;
}

/* Transiciones */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>