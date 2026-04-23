<template>
  <div class="newsletter-page">
    <div class="newsletter-container">
      <header class="newsletter-header">
        <span class="subtitle">MANTENTE INFORMADO</span>
        <h1 class="title">Newsletter <span>&</span> Lanzamientos</h1>
        <p class="description">
          Publicamos las noticias y los avisos de las nuevas tiradas de productos exclusivos aquí antes que en ningún sitio.
        </p>
      </header>
      
      <section class="subscribe-section">
        <div class="subscribe-card">
          <h3 class="subscribe-title">¿Quieres ser el primero?</h3>
          <p class="subscribe-text">Recibe notificaciones inmediatas de drops exclusivos.</p>
          <div class="input-group">
            <input 
              v-model="email" 
              type="email" 
              placeholder="Escribe tu email..." 
              @keyup.enter="handleSuscripcion"
            />
            <button @click="handleSuscripcion" class="btn-subscribe">
              SUSCRIBIRME
            </button>
          </div>
        </div>
      </section>

      <div class="news-feed">
        <div v-for="noticia in noticias" :key="noticia.id" class="noticia-card">
          <div class="card-content">
            <div class="card-meta">
              <span v-if="noticia.es_drop_exclusivo" class="drop-badge">DROPS</span>
              <span class="date">{{ formatDate(noticia.fecha_publicacion) }}</span>
            </div>
            <h2 class="news-title">{{ noticia.titulo }}</h2>
            <p class="news-body">{{ noticia.contenido }}</p>
            <div class="card-footer">
              <span class="author">MIDNIGHT TEAM</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="noticias.length === 0" class="empty-state">
        <p>No hay noticias publicadas en este momento. Vuelve pronto.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api';

const email = ref('');
const noticias = ref([]);

const handleSuscripcion = async () => {
  if (!email.value) return alert("Por favor, introduce un email.");
  try {
    await api.post('/newsletter/suscribir', { email: email.value });
    alert("¡Bienvenido a la élite! Te has suscrito correctamente.");
    email.value = '';
  } catch (e) {
    alert(e.response?.data?.detail || "Error al suscribirse");
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  });
};

onMounted(async () => {
  try {
    const res = await api.get('/newsletter/noticias');
    noticias.value = res.data;
  } catch (e) {
    console.error("Error al cargar noticias:", e);
  }
});
</script>

<style scoped>
/* CONTENEDOR PRINCIPAL */
.newsletter-page {
  min-height: 100vh;
  padding-top: 120px;
  background: var(--bg-main, #050505);
  color: var(--text-main, #fff);
  transition: background 0.4s ease, color 0.4s ease;
}

/* VARIABLES DINÁMICAS (MODO CLARO / OSCURO) */
:root {
  --text-muted: #a394ac;
  --card-bg: rgba(15, 15, 15, 0.6);
  --card-border: rgba(129, 33, 208, 0.3);
  --input-bg: rgba(255, 255, 255, 0.05);
  --news-card-hover: rgba(30, 30, 30, 0.4);
}

:global(body.light-mode) {
  --bg-main: #f9f9f9;
  --text-main: #111;
  --text-muted: #555;
  --card-bg: rgba(255, 255, 255, 0.9);
  --card-border: rgba(0, 0, 0, 0.1);
  --input-bg: #fff;
  --news-card-hover: rgba(240, 240, 240, 0.8);
}

.newsletter-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 2rem 5rem;
}

/* HEADER */
.newsletter-header {
  text-align: center;
  margin-bottom: 4rem;
}

.subtitle {
  color: #8121d0;
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 4px;
  text-transform: uppercase;
}

.title {
  font-family: 'Cinzel', serif;
  font-size: 3rem;
  margin: 1rem 0;
  letter-spacing: 2px;
  color: var(--text-main);
}

.title span { color: #8121d0; }

.description {
  color: var(--text-muted);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* SECCIÓN SUSCRIPCIÓN (CORREGIDA) */
.subscribe-section { margin-bottom: 5rem; }

.subscribe-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  backdrop-filter: blur(10px);
  padding: 3.5rem 2rem;
  border-radius: 4px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.subscribe-title {
  font-family: 'Cinzel', serif;
  font-size: 2rem; /* Tamaño aumentado */
  margin-bottom: 0.5rem;
  color: var(--text-main); /* Ahora brilla correctamente */
  font-weight: 700;
}

.subscribe-text {
  color: var(--text-muted);
  margin-bottom: 2.5rem;
  font-size: 1rem;
}

.input-group {
  display: flex;
  gap: 10px;
  max-width: 550px;
  margin: 0 auto;
}

.input-group input {
  flex: 1;
  background: var(--input-bg);
  border: 1px solid var(--card-border);
  padding: 1.2rem;
  color: var(--text-main);
  font-family: 'Inter', sans-serif;
  outline: none;
  transition: all 0.3s ease;
}

.input-group input:focus { border-color: #8121d0; box-shadow: 0 0 10px rgba(129, 33, 208, 0.2); }

.btn-subscribe {
  background: #8121d0;
  color: #fff;
  border: none;
  padding: 0 2.5rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-subscribe:hover { background: #9d3fef; transform: translateY(-2px); }

/* FEED DE NOTICIAS */
.news-feed { display: flex; flex-direction: column; gap: 2.5rem; }

.noticia-card {
  background: var(--card-bg);
  border-left: 4px solid #8121d0;
  padding: 2.5rem;
  transition: all 0.3s ease;
  border-top: 1px solid var(--card-border);
  border-right: 1px solid var(--card-border);
  border-bottom: 1px solid var(--card-border);
}

.noticia-card:hover { transform: translateX(8px); background: var(--news-card-hover); }

.card-meta { display: flex; align-items: center; gap: 15px; margin-bottom: 1.2rem; }

.drop-badge {
  background: #8121d0;
  color: #fff;
  font-size: 0.6rem;
  font-weight: 900;
  padding: 3px 10px;
  letter-spacing: 1px;
}

.date { font-size: 0.75rem; color: var(--text-muted); font-weight: 500; }

.news-title {
  font-family: 'Cinzel', serif;
  font-size: 1.8rem;
  margin-bottom: 1.2rem;
  color: var(--text-main);
}

.news-body {
  color: var(--text-main);
  opacity: 0.8;
  line-height: 1.8;
  font-size: 1.05rem;
}

.card-footer {
  margin-top: 2rem;
  padding-top: 1.2rem;
  border-top: 1px solid var(--card-border);
}

.author {
  font-size: 0.7rem;
  font-weight: 800;
  color: #8121d0;
  letter-spacing: 2px;
}

.empty-state { text-align: center; color: var(--text-muted); margin-top: 5rem; font-style: italic; }

/* RESPONSIVE */
@media (max-width: 768px) {
  .title { font-size: 2.2rem; }
  .input-group { flex-direction: column; }
  .btn-subscribe { padding: 1.2rem; }
  .noticia-card { padding: 1.8rem; }
  .subscribe-card { padding: 2rem 1.5rem; }
}
</style>