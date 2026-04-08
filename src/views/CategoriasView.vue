<template>
  <div class="categories-view-wrapper">
    <div class="categories-container">
      <header class="categories-header">
        <h1 class="title-gothic">Nuestras <span class="text-accent">Colecciones</span></h1>
        <p class="subtitle">Selecciones exclusivas para un estilo distintivo y atemporal.</p>
      </header>

      <div class="categories-grid">
        <!-- Sastrería -->
        <RouterLink to="/productos?cat=sastreria" class="category-card large">
          <img src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800" alt="Sastrería">
          <div class="category-info">
            <h3>Sastrería</h3>
            <span class="btn-text">Ver Colección</span>
          </div>
        </RouterLink>

        <!-- Vestidos -->
        <RouterLink to="/productos?cat=vestidos" class="category-card">
          <img src="https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=800" alt="Vestidos">
          <div class="category-info">
            <h3>Vestidos y Sedas</h3>
            <span class="btn-text">Explorar</span>
          </div>
        </RouterLink>

        <!-- Accesorios -->
        <RouterLink to="/productos?cat=accesorios" class="category-card">
          <img src="https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=800" alt="Accesorios">
          <div class="category-info">
            <h3>Joyas y Accesorios</h3>
            <span class="btn-text">Descubrir</span>
          </div>
        </RouterLink>

        <!-- Calzado -->
        <RouterLink to="/productos?cat=calzado" class="category-card wide">
          <img src="https://images.unsplash.com/photo-1638247025967-b4e38f787b76?q=80&w=800" alt="Calzado">
          <div class="category-info">
            <h3>Calzado de Gala</h3>
            <span class="btn-text">Ver Selección</span>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
<style scoped>
.categories-view-wrapper {
  /* CAMBIADO: Antes #050505 */
  background: var(--bg-dark);
  margin: 0;
  padding: 0;
  min-height: 100vh;
  transition: background 0.4s ease;
}

.categories-container {
  margin-top: -1px; 
  padding: 0 10% 6rem 10%;
  /* CAMBIADO: Antes #050505 */
  background: var(--bg-dark);
  transition: background 0.4s ease;
}

.categories-header {
  text-align: center;
  padding-top: 6rem; 
  margin-bottom: 5rem;
}

.title-gothic {
  font-family: 'Cinzel', serif;
  font-size: 2.5rem;
  /* CAMBIADO: Antes #fff */
  color: var(--text-primary);
  margin-bottom: 1rem;
  transition: color 0.4s ease;
}

.text-accent {
  color: #8121d0; /* Este se mantiene igual en ambos modos */
}

.subtitle {
  /* CAMBIADO: Antes #a394ac */
  color: var(--text-secondary);
  font-family: 'Quicksand', sans-serif;
  font-size: 1rem;
  letter-spacing: 1px;
}

/* GRID SYSTEM */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: 320px;
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.category-card.large { grid-row: span 2; }
.category-card.wide { grid-column: span 2; }

.category-card {
  position: relative;
  overflow: hidden;
  /* CAMBIADO: Borde dinámico */
  border: 1px solid var(--border-light);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  background: #000; /* Se mantiene negro por dentro para el contraste de la foto */
  text-decoration: none;
}

.category-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.6) grayscale(0.2);
  transition: all 0.7s ease;
}

.category-info {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding: 3rem 2rem;
  /* El degradado sobre la imagen se queda oscuro para que el texto blanco sea legible */
  background: linear-gradient(
    to top, 
    rgba(0,0,0,0.85) 0%, 
    rgba(0,0,0,0.3) 50%, 
    transparent 100%
  );
  z-index: 2;
}

.category-info h3 {
  font-family: 'Cinzel', serif;
  color: #fff; /* Siempre blanco porque está sobre el degradado oscuro de la foto */
  font-size: 1.8rem;
  margin-bottom: 0.8rem;
  letter-spacing: 2px;
}

.btn-text {
  color: #8121d0;
  font-family: 'Quicksand', sans-serif;
  letter-spacing: 4px;
  text-transform: uppercase;
  font-size: 0.7rem;
  font-weight: 600;
  opacity: 0.8;
  transition: 0.3s;
}

/* HOVER EFFECTS */
.category-card:hover {
  border-color: #8121d0;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

:global(body.light-mode) .category-card:hover {
  box-shadow: 0 10px 30px rgba(129, 33, 208, 0.1);
}

.category-card:hover img {
  transform: scale(1.05);
  filter: brightness(0.7) grayscale(0);
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .categories-header { padding-top: 4rem; margin-bottom: 3rem; }
  .categories-grid { grid-template-columns: 1fr; grid-auto-rows: 250px; }
  .category-card.large, .category-card.wide { grid-row: auto; grid-column: auto; }
  .title-gothic { font-size: 2rem; }
}
</style>