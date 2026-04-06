<template>
  <main class="home-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="fade-in">Elegancia Surgida de las <span class="text-accent">Sombras</span></h1>
        <p class="hero-subtitle">Descubre la colección exclusiva de Midnight Attire. Ropa con alma gótica y corte artesanal.</p>
        <div class="hero-actions">
          <RouterLink to="/productos" class="btn-primary">Explorar Colección</RouterLink>
          <RouterLink to="/categorias" class="btn-ghost">Ver Categorías</RouterLink>
        </div>
      </div>
      <div class="hero-scroll-indicator">
        <span>Scrollea para descubrir</span>
        <div class="mouse-icon"></div>
      </div>
    </section>

    <!-- Sección de Características (Confianza) -->
    <section class="features">
      <div class="feature-card">
        <span class="icon">♰</span>
        <h3>Diseño Único</h3>
        <p>Prendas diseñadas por artistas del estilo dark-serif.</p>
      </div>
      <div class="feature-card">
        <span class="icon">✦</span>
        <h3>Calidad Premium</h3>
        <p>Telas seleccionadas para durar una eternidad.</p>
      </div>
      <div class="feature-card">
        <span class="icon">📦</span>
        <h3>Envío Discreto</h3>
        <p>Recibe tu pedido en un packaging temático de lujo.</p>
      </div>
    </section>
  </main>
</template>

<style scoped>
.hero {
  position: relative;
  /* 1. Altura completa de la ventana */
  height: 100vh; 
  display: flex;
  align-items: center;
  justify-content: center;
  
  /* 2. El truco: margen negativo igual a la altura del header */
  margin-top: -70px; 
  
  /* 3. Aseguramos que la imagen cubra todo el espacio */
  background-image: url('https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=2070');
  background-size: cover;
  background-position: center;
  background-attachment: fixed; /* Efecto Parallax: la imagen se queda quieta al scrollear */
}

.hero-overlay {
  position: absolute;
  inset: 0;
  /* Degradado para que la parte de arriba sea más oscura y el menú se lea mejor */
  background: linear-gradient(
    to bottom, 
    rgba(5, 5, 5, 0.8) 0%, 
    rgba(5, 5, 5, 0.4) 50%, 
    rgba(5, 5, 5, 0.95) 100%
  );
}
.hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  padding: 0 1rem;
}

.hero-content h1 {
  font-size: 3.5rem;
  line-height: 1.1;
  margin-bottom: 1.5rem;
}

.hero-subtitle {
  font-family: var(--font-elegant);
  color: var(--text-secondary);
  font-size: 1.2rem;
  margin-bottom: 2.5rem;
  max-width: 600px;
  margin-inline: auto;
}

.hero-actions {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
}

/* Animación de entrada */
.fade-in {
  animation: fadeIn 1.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Sección de Features */
.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  padding: 5rem 10%;
  background: var(--bg-dark);
}

.feature-card {
  text-align: center;
  padding: 2rem;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  transition: var(--transition);
}

.feature-card:hover {
  background: var(--bg-panel);
  border-color: var(--accent);
}

.feature-card .icon {
  font-size: 2rem;
  color: var(--accent-bright);
  display: block;
  margin-bottom: 1rem;
}
</style scoped>