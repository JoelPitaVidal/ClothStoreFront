<template>
  <header class="header">
    <div class="header-left">
      <RouterLink to="/" class="logo">
        ✦ <span>Midnight Attire</span>
      </RouterLink>
    </div>

    <nav class="header-nav">
      <RouterLink to="/">Inicio</RouterLink>
      <RouterLink to="/productos">Tienda</RouterLink>
      <RouterLink to="/categorias">Categorías</RouterLink>
      <RouterLink 
        v-if="authStore.usuario?.es_admin" 
        to="/admin" 
        class="nav-admin-link"
      >
        Panel Maestro
      </RouterLink>
    </nav>

    <div class="header-right">
      <!-- MODO OSCURO/CLARO -->
      <button class="mode-toggle" @click="toggleMode" :title="isDark ? 'Luz' : 'Sombras'">
        {{ isDark ? '🌙' : '☀️' }}
      </button>

      <!-- BOTÓN DEL CARRITO (Redirige a /carrito) -->
      <button class="cart-btn" @click="irAlCarrito" title="Ver mi alijo">
        <span class="cart-icon">🛒</span>
        <Transition name="pop">
          <span v-if="cartStore.totalItems > 0" class="cart-badge">
            {{ cartStore.totalItems }}
          </span>
        </Transition>
      </button>

      <!-- USUARIO AUTENTICADO -->
      <div v-if="authStore.usuario" class="user-menu" @click="menuOpen = !menuOpen">
        <div class="avatar">{{ iniciales }}</div>
        <span class="user-name">{{ authStore.usuario.nombre }}</span>
        
        <Transition name="fade-drop">
          <div v-if="menuOpen" class="dropdown">
            <RouterLink to="/perfil" @click="menuOpen = false">Mi perfil</RouterLink>
            <RouterLink to="/pedidos" @click="menuOpen = false">Mis pedidos</RouterLink>
            
            <template v-if="authStore.usuario.es_admin">
              <hr class="divider" />
              <RouterLink to="/admin" @click="menuOpen = false" class="admin-action">
                Panel Admin †
              </RouterLink>
            </template>
            
            <hr class="divider" />
            <button @click="cerrarSesion" class="logout-btn">Cerrar sesión</button>
          </div>
        </Transition>
      </div>

      <!-- INVITADO -->
      <div v-else class="auth-links">
        <RouterLink to="/login" class="btn-ghost">Entrar</RouterLink>
        <RouterLink to="/registro" class="btn-primary-auth">Registro</RouterLink>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'

const router    = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const menuOpen  = ref(false)
const isDark    = ref(true)

const iniciales = computed(() => {
  if (!authStore.usuario || !authStore.usuario.nombre) return '?'
  return authStore.usuario.nombre
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

// Navegación directa a la vista del carrito
async function irAlCarrito() {
  // Sincronizamos antes de ir para que los datos sean reales
  if (authStore.usuario) {
    await cartStore.fetchCarrito()
  }
  router.push('/carrito')
}

function cerrarSesion() {
  authStore.logout()
  menuOpen.value = false
  router.push('/login')
}

function toggleMode() {
  isDark.value = !isDark.value
  document.body.classList.toggle('light-mode', !isDark.value)
}

onMounted(() => {
  if (authStore.usuario) {
    cartStore.fetchCarrito()
  }
})
</script>

<style scoped>
/* ESTRUCTURA BASE */
.header {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 70px;
  background: rgba(10, 10, 10, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 2px solid #8121d0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
}

.logo {
  font-family: 'Cinzel', serif;
  font-size: 1.6rem;
  color: #e0d5e8;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.logo span { color: #8121d0; font-weight: bold; }

.header-nav { display: flex; gap: 0.5rem; align-items: center; }
.header-nav a {
  font-family: 'Cinzel', serif;
  font-size: 0.8rem;
  color: #a394ac;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 0.5rem 0.8rem;
  transition: 0.3s;
}
.header-nav a:hover, .header-nav a.router-link-active {
  color: #8121d0;
}

.header-right { display: flex; align-items: center; gap: 1.2rem; }

.mode-toggle {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
}

/* BOTÓN CARRITO Y BADGE */
.cart-btn {
  position: relative;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.3rem;
  color: #e0d5e8;
  display: flex;
  align-items: center;
}

.cart-badge {
  position: absolute;
  top: -8px; right: -8px;
  background: #8121d0;
  color: white;
  font-size: 0.6rem;
  font-weight: bold;
  width: 18px; height: 18px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  border: 1px solid #000;
}

/* MENU USUARIO */
.user-menu { position: relative; display: flex; align-items: center; gap: 0.8rem; cursor: pointer; }
.avatar {
  width: 32px; height: 32px;
  background: #1a121d;
  border: 1px solid #8121d0;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Cinzel', serif; font-size: 0.8rem; color: #e0d5e8;
}

.dropdown {
  position: absolute;
  top: 50px; right: 0;
  background: #0a0a0a;
  border: 1px solid #8121d0;
  padding: 0.5rem 0;
  min-width: 180px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.8);
}

.dropdown a, .dropdown button {
  display: block; width: 100%;
  padding: 0.6rem 1.2rem;
  color: #a394ac;
  background: transparent;
  border: none;
  text-align: left;
  font-size: 0.75rem;
  cursor: pointer;
  text-transform: uppercase;
  text-decoration: none;
}

.dropdown a:hover, .dropdown button:hover {
  background: #8121d0;
  color: white;
}

.divider { border: 0; border-top: 1px solid #1a1a1a; margin: 0.5rem 0; }

/* AUTH LINKS */
.auth-links { display: flex; gap: 1rem; }
.btn-ghost { color: #a394ac; text-decoration: none; font-size: 0.8rem; text-transform: uppercase; padding: 0.5rem; }
.btn-primary-auth { 
  background: #8121d0; 
  color: white; 
  text-decoration: none; 
  padding: 0.5rem 1rem; 
  font-size: 0.8rem; 
  text-transform: uppercase;
  border-radius: 2px;
}

/* ANIMACIONES */
.pop-enter-active { animation: pop-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
@keyframes pop-in {
  0% { transform: scale(0); }
  100% { transform: scale(1); }
}

.fade-drop-enter-active, .fade-drop-leave-active { transition: all 0.2s ease; }
.fade-drop-enter-from, .fade-drop-leave-to { opacity: 0; transform: translateY(-10px); }

@media (max-width: 768px) {
  .header-nav, .user-name { display: none; }
}
</style>