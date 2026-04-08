<template>
  <main class="home-page">
    <section class="hero-split">
      <!-- Lado del contenido -->
      <div class="hero-text-side">
        <div class="hero-content">
          <h1 class="fade-in">Elegancia Atemporal en <span class="text-accent">Midnight Attire</span></h1>
          <p class="hero-subtitle">
            Descubra nuestra colección exclusiva de alta costura gótica. 
            Diseños artesanales donde la sobriedad y el estilo convergen en la oscuridad.
          </p>
          <div class="hero-actions">
            <RouterLink to="/productos" class="btn-primary">Explorar Catálogo</RouterLink>
            <RouterLink to="/categorias" class="btn-ghost">Colecciones</RouterLink>
          </div>
        </div>
      </div>

      <!-- Lado de la imagen -->
      <div class="hero-image-side">
        <div class="image-overlay"></div>
        <img src="https://images.unsplash.com/photo-1515462277126-2dd0c162007a?q=80&w=2000" alt="Midnight Fashion">
      </div>
      
      <div class="hero-scroll-indicator">
        <div class="mouse-icon"></div>
      </div>
    </section>

    <!-- SECCIÓN DE CARACTERÍSTICAS -->
    <section class="features">
      <div class="feature-card">
        <span class="icon">♰</span>
        <h3>Diseño Exclusivo</h3>
        <p>Prendas con identidad propia, inspiradas en la estética clásica y contemporánea.</p>
      </div>
      <div class="feature-card">
        <span class="icon">✦</span>
        <h3>Calidad de Confección</h3>
        <p>Materiales de alta gama seleccionados para garantizar una durabilidad excepcional.</p>
      </div>
      <div class="feature-card">
        <span class="icon">📦</span>
        <h3>Envío Especializado</h3>
        <p>Cada pedido incluye un packaging premium diseñado para proteger su inversión.</p>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* CONTENEDOR PRINCIPAL */
.home-page {
  /* Usamos las variables globales de tu proyecto */
  background-color: var(--bg-dark);
  overflow-x: hidden;
  /* Transición suave para que el cambio de modo sea elegante */
  transition: background-color 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.hero-split {
  display: flex;
  height: 100vh;
  width: 100%;
  margin-top: -75px; /* Ajuste para que el hero suba tras el header */
  position: relative;
}

.hero-text-side {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5%;
  background: var(--bg-dark); /* Dinámico */
  z-index: 2;
  transition: background 0.5s ease;
}

.hero-image-side {
  flex: 1;
  position: relative;
  overflow: hidden;
  background: #000; /* Fondo base para la imagen */
}

.hero-image-side img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* Filtro sutil para que no desentone con el estilo gótico */
  filter: grayscale(0.2) brightness(0.8);
  transition: filter 0.5s ease;
}

/* En modo claro, damos un poco más de luz a la imagen */
:global(body.light-mode) .hero-image-side img {
  filter: grayscale(0.1) brightness(0.95);
}

.image-overlay {
  position: absolute;
  inset: 0;
  /* El degradado ahora se funde con el color de fondo dinámico */
  background: linear-gradient(
    to right,
    var(--bg-dark) 0%,
    transparent 30%,
    transparent 70%,
    rgba(129, 33, 208, 0.05) 100%
  );
  z-index: 1;
  transition: background 0.5s ease;
}

.hero-content {
  max-width: 550px;
}

.hero-content h1 {
  font-family: 'Cinzel', serif;
  font-size: 3.2rem;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  color: var(--text-primary); /* Blanco en Dark, Negro en Light */
  letter-spacing: 1px;
  transition: color 0.5s ease;
}

.text-accent {
  color: #8121d0; /* Tu color de marca gótica */
  display: block;
}

.hero-subtitle {
  font-family: 'Quicksand', sans-serif;
  color: var(--text-secondary); /* Grisáceo/Púrpura suave */
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 2.5rem;
  transition: color 0.5s ease;
}

/* BOTONES */
.btn-primary {
  background: #8121d0;
  color: #fff; /* Siempre blanco para contraste sobre morado */
  padding: 1rem 2.2rem;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  transition: all 0.3s ease;
  display: inline-block;
  border: none;
  cursor: pointer;
}

.btn-primary:hover {
  background: var(--text-primary);
  color: var(--bg-dark);
  transform: translateY(-2px);
}

.btn-ghost {
  background: transparent;
  color: var(--text-primary);
  padding: 1rem 2.2rem;
  text-decoration: none;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  border: 1px solid var(--border-light); /* Dinámico */
  transition: all 0.3s ease;
  display: inline-block;
}

.btn-ghost:hover {
  border-color: #8121d0;
  color: #8121d0;
  background: rgba(129, 33, 208, 0.05);
}

/* SECCIÓN DE CARACTERÍSTICAS (FEATURES) */
.features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  background: var(--bg-dark);
  border-top: 1px solid var(--border-light);
  transition: background-color 0.5s ease, border-color 0.5s ease;
}

.feature-card {
  text-align: center;
  padding: 6rem 2rem;
  border-right: 1px solid var(--border-light);
  transition: all 0.4s ease;
}

.feature-card:last-child { border-right: none; }

.feature-card:hover {
  /* En modo claro usa el blanco de card, en oscuro el negro suave */
  background: var(--bg-card);
  transform: translateY(-5px);
}

.feature-card .icon {
  font-size: 2.2rem;
  color: #8121d0;
  margin-bottom: 1.5rem;
  display: block;
}

.feature-card h3 {
  font-family: 'Cinzel', serif;
  font-size: 1rem;
  color: var(--text-primary);
  margin-bottom: 1rem;
  letter-spacing: 2px;
}

.feature-card p {
  color: var(--text-secondary);
  font-size: 0.9rem;
  max-width: 280px;
  margin: 0 auto;
  font-family: 'Quicksand', sans-serif;
}

/* RESPONSIVE */
@media (max-width: 1024px) {
  .hero-content h1 { font-size: 2.5rem; }
  .features { grid-template-columns: 1fr; }
  .feature-card { border-right: none; border-bottom: 1px solid var(--border-light); padding: 4rem 2rem; }
}

@media (max-width: 768px) {
  .hero-split { flex-direction: column; height: auto; margin-top: 0; }
  .hero-image-side { height: 50vh; order: -1; }
  .hero-text-side { padding: 4rem 1.5rem; min-height: 50vh; }
  .hero-content h1 { font-size: 2.2rem; }
  .hero-actions { display: flex; flex-direction: column; gap: 1rem; }
  .hero-actions a { text-align: center; }
}

/* ANIMACIONES */
.fade-in {
  animation: fadeIn 1.5s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>