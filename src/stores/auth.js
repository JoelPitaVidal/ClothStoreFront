import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as loginApi, getMe } from '../api/index.js'

export const useAuthStore = defineStore('auth', () => {
  const usuario = ref(null)
  const token   = ref(localStorage.getItem('token') || null)

  // Getters reactivos
  const estaAutenticado = computed(() => !!usuario.value)
  const esAdmin         = computed(() => !!usuario.value?.es_admin)

  /**
   * Obtiene los datos del usuario actual usando el token guardado
   */
  async function fetchUsuario() {
    if (!token.value) return
    try {
      const res = await getMe()
      usuario.value = res.data
    } catch (error) {
      console.error("Error recuperando sesión:", error)
      logout()
    }
  }

  /**
   * Login: Guarda token y recupera al usuario inmediatamente.
   * ✅ CORREGIDO: pasamos objeto plano { username, password }.
   * api/index.js se encarga de convertirlo a URLSearchParams para OAuth2.
   * Antes el store construía URLSearchParams Y api/index.js lo volvía a
   * construir, resultando en credenciales undefined → 401 inevitable.
   */
  async function loginUsuario(username, password) {
    try {
      const res = await loginApi({ username, password })

      token.value = res.data.access_token
      localStorage.setItem('token', token.value)

      await fetchUsuario()

      return res.data
    } catch (error) {
      logout()
      throw error
    }
  }

  function logout() {
    usuario.value = null
    token.value   = null
    localStorage.removeItem('token')
  }

  return {
    usuario,
    token,
    estaAutenticado,
    esAdmin,
    fetchUsuario,
    loginUsuario,
    logout
  }
})