// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import HomeView       from '@/views/HomeView.vue'
import LoginView      from '@/views/LoginView.vue'
import ProductosView  from '@/views/ProductosView.vue'
import CategoriasView from '@/views/CategoriasView.vue'
import RegistroView   from '@/views/RegistroView.vue'
import AdminView      from '@/views/AdminView.vue' 
import CarritoView    from '@/views/CarritoView.vue'
// 1. Importa la nueva vista de Checkout
import CheckoutView   from '@/views/CheckoutView.vue' 

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/',           name: 'home',       component: HomeView },
    { path: '/login',      name: 'login',      component: LoginView },
    { path: '/registro',   name: 'registro',   component: RegistroView },
    { path: '/productos',  name: 'productos',  component: ProductosView },
    { path: '/categorias', name: 'categorias', component: CategoriasView },
    { path: '/carrito',    name: 'carrito',    component: CarritoView },
    
    // 2. Nueva ruta de Checkout con protección de autenticación
    { 
      path: '/checkout',   
      name: 'checkout',   
      component: CheckoutView,
      meta: { requiresAuth: true } 
    },

    { 
      path: '/admin',      
      name: 'admin',      
      component: AdminView,
      meta: { requiresAdmin: true } 
    }
  ]
})

// GUARDIA DE NAVEGACIÓN ACTUALIZADA
router.beforeEach(async (to, from) => {
  const authStore = useAuthStore()
  const token = localStorage.getItem('token')

  // 3. Si la ruta requiere estar logueado (como el Checkout)
  if (to.meta.requiresAuth || to.meta.requiresAdmin) {
    
    if (!token) {
      console.warn("Acceso denegado: Debes iniciar sesión.")
      return { name: 'login' }
    }

    // Recuperamos el usuario si no está en el store (tras un refresh)
    if (!authStore.usuario) {
      try {
        await authStore.fetchUsuario()
      } catch (error) {
        localStorage.removeItem('token')
        return { name: 'login' }
      }
    }

    // 4. Verificamos específicamente si requiere admin
    if (to.meta.requiresAdmin && !authStore.usuario?.es_admin) {
      console.warn("Acceso denegado: Se requiere rango de Administrador †")
      return { name: 'home' }
    }
  }
})

export default router