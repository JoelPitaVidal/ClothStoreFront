<template>
  <div class="auth-container mt-header">
    <div class="auth-card">
      <h2 class="title-gothic">Crear Cuenta</h2>
      
      <form @submit.prevent="handleRegistro" class="auth-form">
        <div class="input-group">
          <label>Nombre de usuario</label>
          <!-- ✅ CORREGIDO: v-model apunta a form.nombre (antes era form.username) -->
          <input v-model="form.nombre" type="text" required>
        </div>

        <div class="input-group">
          <label>Email</label>
          <input v-model="form.email" type="email" required>
        </div>

        <div class="input-group">
          <label>Contraseña</label>
          <input v-model="form.password" type="password" required>
        </div>

        <p v-if="error" class="error-msg">{{ error }}</p>

        <button type="submit" class="btn-auth" :disabled="loading">
          {{ loading ? 'Creando cuenta...' : 'Registrarme' }}
        </button>

        <div class="auth-footer">
          <router-link to="/login" class="link-accent">Ya tengo cuenta</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { registro } from '@/api'

const router  = useRouter()
const loading = ref(false)
const error   = ref(null)

// ✅ CORREGIDO: el objeto usa "nombre", que es lo que espera el schema UsuarioRegistro
const form = ref({ nombre: '', email: '', password: '' })

const handleRegistro = async () => {
  error.value = null
  loading.value = true
  try {
    await registro(form.value)
    // Redirigir al login tras registro exitoso
    router.push('/login')
  } catch (err) {
    // Mostrar el error en pantalla en lugar de alert()
    const detail = err.response?.data?.detail
    error.value = detail || "Error al crear la cuenta. Puede que el email ya exista."
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
}

.error-msg {
  color: #ff4444;
  margin-top: 1rem;
  font-size: 0.85rem;
  text-align: left;
}
</style>