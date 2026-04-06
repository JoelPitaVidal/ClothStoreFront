<template>
  <header class="header">
    <div class="header-left">
      <button class="menu-btn" @click="$emit('toggle-sidebar')">
        <span></span><span></span><span></span>
      </button>
      <RouterLink to="/" class="logo">
        ✦ <span>Midnight Attire</span>
      </RouterLink>
    </div>

    <nav class="header-nav">
      <RouterLink to="/">Inicio</RouterLink>
      <RouterLink to="/productos">Tienda</RouterLink>
      <RouterLink to="/categorias">Categorías</RouterLink>
    </nav>

    <div class="header-right">
      <button class="cart-btn" @click="cartStore.fetchCarrito()">
        <span class="cart-icon">🛒</span>
        <span v-if="cartStore.totalItems > 0" class="cart-badge">{{ cartStore.totalItems }}</span>
      </button>

      <!-- Usuario Autenticado -->
      <div v-if="authStore.usuario" class="user-menu" @click="menuOpen = !menuOpen">
        <div class="avatar">{{ iniciales }}</div>
        <span class="user-name">{{ authStore.usuario.nombre }}</span>
        
        <div v-if="menuOpen" class="dropdown">
          <RouterLink to="/perfil" @click="menuOpen = false">Mi perfil</RouterLink>
          <RouterLink to="/pedidos" @click="menuOpen = false">Mis pedidos</RouterLink>
          <hr />
          <button @click="cerrarSesion">Cerrar sesión</button>
        </div>
      </div>

      <!-- Invitado -->
      <div v-else class="auth-links">
        <RouterLink to="/login" class="btn-ghost">Entrar</RouterLink>
        <RouterLink to="/registro" class="btn-primary">Registro</RouterLink>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'

const router    = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const menuOpen  = ref(false)

const iniciales = computed(() => {
  if (!authStore.usuario || !authStore.usuario.nombre) return '?'
  return authStore.usuario.nombre
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

function cerrarSesion() {
  authStore.logout()
  menuOpen.value = false
  router.push('/login')
}
</script>

<style scoped>
/* Tipografías y Colores aplicados al estilo Gótico/Oscuro */
.header {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 70px;
  background: rgba(10, 10, 10, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 2px solid #8121d0; /* Morado eléctrico */
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  z-index: 100;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
}

.header-left { display: flex; align-items: center; gap: 1.5rem; }

.logo {
  font-family: 'Cinzel', serif;
  font-size: 1.6rem;
  color: #e0d5e8;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-shadow: 0 0 15px rgba(129, 33, 208, 0.8);
}

.logo span {
  color: #8121d0;
  font-weight: bold;
}

.header-nav { display: flex; gap: 1rem; }

.header-nav a {
  font-family: 'Cinzel', serif;
  font-size: 0.85rem;
  color: #a394ac;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 0.5rem 1rem;
  transition: all 0.3s ease;
}

.header-nav a:hover, .header-nav a.router-link-active {
  color: #8121d0;
  text-shadow: 0 0 10px rgba(129, 33, 208, 0.5);
}

.header-right { display: flex; align-items: center; gap: 1.2rem; }

.cart-btn {
  position: relative;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.4rem;
  color: #e0d5e8;
}

.cart-badge {
  position: absolute;
  top: -5px; right: -5px;
  background: #8121d0;
  color: white;
  font-size: 0.7rem;
  width: 18px; height: 18px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  border: 1px solid #e0d5e8;
}

.user-menu {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;
  color: #e0d5e8;
}

.avatar {
  width: 35px; height: 35px;
  background: #1a121d;
  border: 1px solid #8121d0;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Cinzel', serif;
  font-weight: bold;
  box-shadow: 0 0 10px rgba(129, 33, 208, 0.4);
}

.dropdown {
  position: absolute;
  top: 120%; right: 0;
  background: #1a121d;
  border: 1px solid #8121d0;
  border-radius: 4px;
  padding: 0.5rem;
  min-width: 180px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.8);
}

.dropdown a, .dropdown button {
  display: block; width: 100%;
  padding: 0.6rem 1rem;
  color: #a394ac;
  background: transparent;
  border: none;
  text-align: left;
  font-family: 'Quicksand', sans-serif;
  text-transform: uppercase;
  font-size: 0.8rem;
  cursor: pointer;
}

.dropdown a:hover, .dropdown button:hover {
  background: rgba(129, 33, 208, 0.2);
  color: #e0d5e8;
}

.auth-links { display: flex; gap: 1rem; }

.btn-primary {
  background: #8121d0;
  color: white;
  padding: 0.5rem 1.2rem;
  border-radius: 4px;
  text-decoration: none;
  font-family: 'Cinzel', serif;
  font-size: 0.8rem;
  transition: 0.3s;
}

.btn-ghost {
  color: #e0d5e8;
  text-decoration: none;
  font-family: 'Cinzel', serif;
  font-size: 0.8rem;
}

@media (max-width: 768px) {
  .header-nav, .user-name { display: none; }
}
</style>