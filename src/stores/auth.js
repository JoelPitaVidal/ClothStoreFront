// src/stores/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as loginApi, getMe } from '../api/index.js'

export const useAuthStore = defineStore('auth', () => {
  const usuario = ref(null)
  const token   = ref(localStorage.getItem('token') || null)

  const estaAutenticado = computed(() => !!token.value)
  const esAdmin         = computed(() => usuario.value?.es_admin ?? false)

  async function inicializar() {
    if (token.value) {
      try {
        const res = await getMe()
        usuario.value = res.data
      } catch {
        logout()
      }
    }
  }

  async function loginUsuario(email, password) {
    const params = new URLSearchParams()
    params.append('username', email)
    params.append('password', password)
    const res = await loginApi(params)
    token.value = res.data.access_token
    localStorage.setItem('token', token.value)
    await inicializar()
  }

  function logout() {
    usuario.value = null
    token.value   = null
    localStorage.removeItem('token')
  }

  return { usuario, token, estaAutenticado, esAdmin, inicializar, loginUsuario, logout }
})