<template>
  <div class="categories-container mt-header">
    <header class="categories-header">
      <h1 class="title-gothic">Nuestras <span class="text-accent">Especialidades</span></h1>
      <p>Explora el atuendo perfecto para cada ocasión.</p>
    </header>

    <div class="categories-grid">
      <!-- Categoría 1: Hombre/Sastrería -->
      <RouterLink to="/productos?cat=sastreria" class="category-card large">
        <img src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800" alt="Sastrería">
        <div class="category-info">
          <h3>Sastrería</h3>
          <span>Ver Colección †</span>
        </div>
      </RouterLink>

      <!-- Categoría 2: Mujer/Vestidos -->
      <RouterLink to="/productos?cat=vestidos" class="category-card">
        <img src="https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=800" alt="Vestidos">
        <div class="category-info">
          <h3>Vestidos y Sedas</h3>
          <span>Explorar</span>
        </div>
      </RouterLink>

      <!-- Categoría 3: Accesorios -->
      <RouterLink to="/productos?cat=accesorios" class="category-card">
        <img src="https://images.unsplash.com/photo-1630019019621-01389ac3f472?q=80&w=800" alt="Accesorios">
        <div class="category-info">
          <h3>Reliquias y Accesorios</h3>
          <span>Descubrir</span>
        </div>
      </RouterLink>

      <!-- Categoría 4: Calzado -->
      <RouterLink to="/productos?cat=calzado" class="category-card wide">
        <img src="https://images.unsplash.com/photo-1638247025967-b4e38f787b76?q=80&w=800" alt="Calzado">
        <div class="category-info">
          <h3>Calzado de Gala</h3>
          <span>Caminar en sombras</span>
        </div>
      </RouterLink>
    </div>
  </div>
</template>
<style scoped>
.categories-container {
  padding: 4rem 10%;
  background: var(--bg-dark);
}

.categories-header {
  text-align: center;
  margin-bottom: 4rem;
}

.categories-header p {
  color: var(--text-secondary);
  font-family: var(--font-elegant);
  letter-spacing: 2px;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: 300px;
  gap: 1.5rem;
}

/* Clases para variar el tamaño y dar dinamismo */
.category-card.large { grid-row: span 2; }
.category-card.wide { grid-column: span 2; }

.category-card {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-light);
  transition: var(--transition);
}

.category-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.5) sepia(0.2); /* Efecto envejecido/oscuro */
  transition: var(--transition);
}

.category-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem;
  background: linear-gradient(transparent, rgba(0,0,0,0.9));
  text-align: center;
}

.category-info h3 {
  font-family: var(--font-gothic);
  color: #fff;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
}

.category-info span {
  color: var(--accent-bright);
  font-family: var(--font-elegant);
  font-size: 0.8rem;
  letter-spacing: 3px;
  text-transform: uppercase;
  opacity: 0.8;
}

/* Hover Effects */
.category-card:hover {
  border-color: var(--accent-bright);
  box-shadow: 0 0 30px var(--accent-glow);
}

.category-card:hover img {
  transform: scale(1.05);
  filter: brightness(0.8);
}

@media (max-width: 768px) {
  .categories-grid { grid-template-columns: 1fr; }
  .category-card.large, .category-card.wide { grid-row: auto; grid-column: auto; }
}
</style>