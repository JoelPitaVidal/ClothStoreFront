// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import HomeView       from '@/views/HomeView.vue'
import LoginView      from '@/views/LoginView.vue'
import ProductosView  from '@/views/ProductosView.vue'
import CategoriasView from '@/views/CategoriasView.vue'
import RegistroView   from '@/views/RegistroView.vue'
import AdminView      from '@/views/AdminView.vue' 
import CarritoView    from '@/views/CarritoView.vue' // Importación del alijo

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/',           name: 'home',       component: HomeView },
    { path: '/login',      name: 'login',      component: LoginView },
    { path: '/registro',   name: 'registro',   component: RegistroView },
    { path: '/productos',  name: 'productos',  component: ProductosView },
    { path: '/categorias', name: 'categorias', component: CategoriasView },
    { path: '/carrito',    name: 'carrito',    component: CarritoView }, // Ruta del carrito
    { 
      path: '/admin',      
      name: 'admin',      
      component: AdminView,
      // Marcamos la ruta para que necesite permisos de administrador
      meta: { requiresAdmin: true } 
    }
  ]
})

// GUARDIA DE NAVEGACIÓN: Se ejecuta antes de cada cambio de página
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Si la ruta requiere ser Admin...
  if (to.meta.requiresAdmin) {
    // Si el usuario aún no ha cargado (por un refresh), esperamos a que cargue
    if (localStorage.getItem('token') && !authStore.usuario) {
      await authStore.fetchUsuario()
    }

    // Verificamos si es admin
    if (authStore.usuario?.es_admin) {
      next() // Adelante, pase al Panel Maestro
    } else {
      console.warn("Acceso denegado: Se requiere rango de Administrador †")
      next('/') // Expulsado a la Home
    }
  } else {
    next() // Si no requiere admin, cualquiera puede pasar
  }
})

export default router