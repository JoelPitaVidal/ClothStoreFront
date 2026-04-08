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

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/',           name: 'home',       component: HomeView },
    { path: '/login',      name: 'login',      component: LoginView },
    { path: '/registro',   name: 'registro',   component: RegistroView },
    { path: '/productos',  name: 'productos',  component: ProductosView },
    { path: '/categorias', name: 'categorias', component: CategoriasView },
    { path: '/carrito',    name: 'carrito',    component: CarritoView },
    { 
      path: '/admin',      
      name: 'admin',      
      component: AdminView,
      meta: { requiresAdmin: true } 
    }
  ]
})

// GUARDIA DE NAVEGACIÓN MODERNA
router.beforeEach(async (to, from) => {
  const authStore = useAuthStore()

  // 1. Si la ruta requiere privilegios de Administrador
  if (to.meta.requiresAdmin) {
    const token = localStorage.getItem('token')

    // Si no hay token, ni siquiera intentamos cargar al usuario
    if (!token) {
      console.warn("Acceso denegado: Inicie sesión como Administrador.")
      return { name: 'login' } // Redirige al login
    }

    // Si hay token pero no tenemos los datos del usuario (ej. tras un F5), los recuperamos
    if (!authStore.usuario) {
      try {
        await authStore.fetchUsuario()
      } catch (error) {
        return { name: 'login' }
      }
    }

    // Verificamos si el usuario tiene rango de admin
    if (!authStore.usuario?.es_admin) {
      console.warn("Acceso denegado: Se requiere rango de Administrador †")
      return { name: 'home' } // Expulsado a la Home
    }
  }

  // Si no se retorna nada, la navegación continúa normalmente (reemplaza a next())
})

export default router