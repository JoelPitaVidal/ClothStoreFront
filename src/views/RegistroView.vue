<template>
  <div class="auth-container mt-header">
    <div class="auth-card">
      <h2 class="title-gothic">Crear Cuenta</h2>
      
      <form @submit.prevent="handleRegistro" class="auth-form">
        <div class="input-group">
          <label>Usuario</label>
          <input v-model="form.username" type="text" required>
        </div>

        <div class="input-group">
          <label>Email</label>
          <input v-model="form.email" type="email" required>
        </div>

        <div class="input-group">
          <label>Contraseña</label>
          <input v-model="form.password" type="password" required>
        </div>

        <button type="submit" class="btn-auth" :disabled="loading">
          Registrarme
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

const router = useRouter()
const loading = ref(false)
const form = ref({ username: '', email: '', password: '' })

const handleRegistro = async () => {
  try {
    loading.value = true
    await registro(form.value)
    alert("Cuenta creada con éxito. Ahora inicia sesión.")
    router.push('/login')
  } catch (err) {
    alert("Error al crear la cuenta. Puede que el usuario ya exista.")
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