<template>
  <header class="header">
    <div class="header-left">
      <RouterLink to="/" class="logo">
        MIDNIGHT <span>ATTIRE</span>
      </RouterLink>
    </div>

    <nav class="header-nav">
      <RouterLink to="/">Inicio</RouterLink>
      <RouterLink to="/categorias">Colecciones</RouterLink>
      <RouterLink to="/productos">Tienda</RouterLink>
      
      <RouterLink to="/newsletter" class="nav-news-link">
        Newsletter
        <span class="dot-new"></span>
      </RouterLink>
      
      <RouterLink 
        v-if="authStore.usuario?.es_admin" 
        to="/admin" 
        class="nav-admin-link"
      >
        Administración
      </RouterLink>
    </nav>

    <div class="header-right">
      <button class="mode-toggle-pill" @click="toggleMode" :title="isDark ? 'Modo Claro' : 'Modo Oscuro'">
        <div :class="['pill-indicator', { 'is-light': !isDark }]">
          <span class="mode-text">{{ isDark ? 'DARK' : 'LIGHT' }}</span>
        </div>
      </button>

      <button class="cart-btn" @click="irAlCarrito">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
        <Transition name="pop">
          <span v-if="cartStore.totalItems > 0" class="cart-badge">{{ cartStore.totalItems }}</span>
        </Transition>
      </button>

      <div v-if="authStore.usuario" class="user-menu" @click="menuOpen = !menuOpen">
        <div class="avatar">{{ iniciales }}</div>
        <span class="user-name">{{ authStore.usuario.nombre }}</span>
        
        <Transition name="fade-drop">
          <div v-if="menuOpen" class="dropdown">
            <div class="dropdown-header">Mi cuenta</div>
            <RouterLink to="/perfil" @click="menuOpen = false">Perfil</RouterLink>
            <RouterLink to="/pedidos" @click="menuOpen = false">Pedidos</RouterLink>
            <div class="dropdown-divider"></div>
            <button @click="cerrarSesion" class="logout-btn">Cerrar Sesión</button>
          </div>
        </Transition>
      </div>

      <div v-else class="auth-links">
        <RouterLink to="/login" class="btn-ghost-nav">Acceder</RouterLink>
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

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()

const menuOpen = ref(false)
const isDark = ref(true)

const iniciales = computed(() => {
  if (!authStore.usuario?.nombre) return '?'
  return authStore.usuario.nombre.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const toggleMode = () => {
  isDark.value = !isDark.value
  document.body.classList.toggle('light-mode', !isDark.value)
}

async function irAlCarrito() {
  if (authStore.usuario) await cartStore.fetchCarrito()
  router.push('/carrito')
}

function cerrarSesion() {
  authStore.logout()
  menuOpen.value = false
  router.push('/login')
}

onMounted(() => {
  if (authStore.usuario) cartStore.fetchCarrito()
})
</script>

<style scoped>
.header {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 75px;
  background: var(--header-bg, rgba(5, 5, 5, 0.9));
  backdrop-filter: blur(15px);
  border-bottom: 1px solid var(--header-border, rgba(129, 33, 208, 0.2));
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4rem;
  z-index: 1000;
  transition: all 0.4s ease;
}

:global(body.light-mode) {
  --header-bg: rgba(255, 255, 255, 0.9);
  --header-border: rgba(0, 0, 0, 0.08);
  --header-text: #111;
  --header-text-muted: #555;
  --header-toggle-bg: #eee;
}

.logo {
  font-family: 'Cinzel', serif;
  font-size: 1.4rem;
  color: var(--header-text, #fff);
  text-decoration: none;
  letter-spacing: 4px;
}
.logo span { color: #8121d0; }

/* NAVEGACIÓN */
.header-nav { display: flex; gap: 2rem; }
.header-nav a {
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  color: var(--header-text-muted, #a394ac);
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 500;
  transition: 0.3s;
}
.header-nav a:hover, .header-nav a.router-link-active { color: #8121d0; }

/* NEWSLETTER DOT */
.nav-news-link { position: relative; display: flex; align-items: center; }
.dot-new {
  width: 6px; height: 6px; background-color: #8121d0;
  border-radius: 50%; margin-left: 5px; box-shadow: 0 0 8px #8121d0;
}

.header-right { display: flex; align-items: center; gap: 1.5rem; }

/* MODO PILL */
.mode-toggle-pill {
  background: var(--header-toggle-bg, #111);
  border: 1px solid var(--header-border, #333);
  padding: 3px; border-radius: 20px;
  cursor: pointer; width: 65px; height: 28px;
  display: flex; align-items: center;
}
.pill-indicator {
  background: #222; width: 100%; height: 100%;
  border-radius: 15px; display: flex; align-items: center; justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.pill-indicator.is-light { background: #8121d0; }
.mode-text { font-family: 'Inter', sans-serif; font-size: 0.55rem; font-weight: 800; color: #fff; letter-spacing: 1px; }

/* CARRITO */
.cart-btn { background: transparent; border: none; cursor: pointer; color: var(--header-text, #fff); position: relative; display: flex; align-items: center; }
.cart-badge {
  position: absolute; top: -8px; right: -8px;
  background: #8121d0; color: #fff; font-size: 0.6rem;
  width: 16px; height: 16px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
}

.auth-links { display: flex; align-items: center; gap: 0.5rem; }
.btn-ghost-nav { color: var(--header-text, #fff); text-decoration: none; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; padding: 0.6rem 1rem; }
.btn-primary-auth { background: #8121d0; color: #fff !important; text-decoration: none; padding: 0.6rem 1.4rem; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; border-radius: 2px; }

.user-menu { position: relative; display: flex; align-items: center; gap: 0.8rem; cursor: pointer; }
.avatar { width: 32px; height: 32px; border: 1px solid #8121d0; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; color: var(--header-text, #fff); }
.user-name { font-size: 0.8rem; color: var(--header-text-muted, #a394ac); }

.dropdown {
  position: absolute; top: 55px; right: 0;
  background: var(--bg-card, #0a0a0a);
  border: 1px solid var(--header-border, #222);
  min-width: 200px; padding: 0.5rem 0; border-radius: 4px;
}

.dropdown a, .dropdown button { display: block; width: 100%; padding: 0.8rem 1.2rem; color: var(--header-text, #eee); text-decoration: none; font-size: 0.8rem; border: none; background: transparent; text-align: left; }
.dropdown a:hover { background: #8121d0; color: #fff; }

@media (max-width: 1024px) {
  .header { padding: 0 2rem; }
  .header-nav, .user-name { display: none; }
}
</style>