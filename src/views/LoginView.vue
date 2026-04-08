<template>
  <div class="auth-container mt-header">
    <div class="auth-card">
      <h2 class="title-gothic">Iniciar Sesión</h2>
      <p class="auth-subtitle"></p>

      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="input-group">
          <label>Nombre de usuario</label>
          <input v-model="form.username" type="text" placeholder="Tu nombre" required>
        </div>

        <div class="input-group">
          <label>Contraseña</label>
          <input v-model="form.password" type="password" placeholder="••••••••" required>
        </div>

        <button type="submit" class="btn-auth" :disabled="loading">
          {{ loading ? 'Verificando...' : 'Acceder' }}
        </button>

        <p v-if="error" class="error-msg">{{ error }}</p>

        <div class="auth-footer">
          <span>¿No tienes cuenta?</span>
          <router-link to="/registro" class="link-accent">Regístrate aquí</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth' // ✅ AÑADIDO: importar el store

const router    = useRouter()
const authStore = useAuthStore()             // ✅ AÑADIDO: instanciar el store
const loading   = ref(false)
const error     = ref(null)

const form = ref({
  username: '',
  password: ''
})

const handleLogin = async () => {
  loading.value = true
  error.value   = null
  try {
    // ✅ CORREGIDO: delegamos al store en lugar de llamar a la API directamente.
    // loginUsuario() ya se encarga de:
    //   1. Llamar a la API de login
    //   2. Guardar el token en localStorage
    //   3. Llamar a fetchUsuario() para poblar authStore.usuario
    await authStore.loginUsuario(form.value.username, form.value.password)

    // Solo llegamos aquí si el login fue exitoso
    router.push('/productos')
  } catch (err) {
    error.value = "Las credenciales no son válidas."
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>

.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 2rem;
}

.auth-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  padding: 3rem;
  width: 100%;
  max-width: 450px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-intense);
  text-align: center;
}

.auth-subtitle {
  color: var(--text-secondary);
  font-style: italic;
  margin-bottom: 2rem;
}

.input-group {
  text-align: left;
  margin-bottom: 1.5rem;
}

.input-group label {
  display: block;
  font-family: var(--font-gothic);
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
  color: var(--accent);
}

.input-group input {
  width: 100%;
  background: #000;
  border: 1px solid #333;
  padding: 0.8rem;
  color: white;
  border-radius: 4px;
  transition: border 0.3s;
  box-sizing: border-box;
}

.input-group input:focus {
  border-color: var(--accent);
  outline: none;
}

.btn-auth {
  width: 100%;
  padding: 1rem;
  background: var(--accent);
  color: white;
  border: none;
  font-family: var(--font-gothic);
  text-transform: uppercase;
  cursor: pointer;
  transition: 0.3s;
  margin-top: 1rem;
}

.btn-auth:hover {
  box-shadow: 0 0 20px var(--accent-glow);
  transform: scale(1.02);
}

.btn-auth:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.auth-footer {
  margin-top: 2rem;
  font-size: 0.9rem;
}

.link-accent {
  color: var(--accent);
  text-decoration: none;
  margin-left: 0.5rem;
}

.error-msg {
  color: #ff4444;
  margin-top: 1rem;
  font-size: 0.8rem;
}
</style>