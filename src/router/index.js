// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView      from '@/views/HomeView.vue'
import LoginView     from '@/views/LoginView.vue'
import ProductosView from '@/views/ProductosView.vue'
import CategoriasView from '@/views/CategoriasView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/',          component: HomeView },
    { path: '/login',     component: LoginView },
    { path: '/productos', component: ProductosView },
    { path: '/categorias', component: CategoriasView}
  ]
})

export default router