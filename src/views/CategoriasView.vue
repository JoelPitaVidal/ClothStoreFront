<template>
  <div class="categories-view-wrapper">
    <div class="categories-container">
      <header class="categories-header">
        <h1 class="title-gothic">Nuestras <span class="text-accent">Especialidades</span></h1>
        <p>Explora el atuendo perfecto para cada ocasión.</p>
      </header>

      <div class="categories-grid">
        <!-- Sastrería -->
        <RouterLink to="/productos?cat=sastreria" class="category-card large">
          <img src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800" alt="Sastrería">
          <div class="category-info">
            <h3>Sastrería</h3>
            <span>Ver Colección †</span>
          </div>
        </RouterLink>

        <!-- Vestidos -->
        <RouterLink to="/productos?cat=vestidos" class="category-card">
          <img src="https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=800" alt="Vestidos">
          <div class="category-info">
            <h3>Vestidos y Sedas</h3>
            <span>Explorar</span>
          </div>
        </RouterLink>

        <!-- Accesorios -->
        <RouterLink to="/productos?cat=accesorios" class="category-card">
<img src="https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=800" alt="Accesorios">          <div class="category-info">
            <h3>Joyas y Accesorios</h3>
            <span>Descubrir</span>
          </div>
        </RouterLink>

        <!-- Calzado -->
        <RouterLink to="/productos?cat=calzado" class="category-card wide">
          <img src="https://images.unsplash.com/photo-1638247025967-b4e38f787b76?q=80&w=800" alt="Calzado">
          <div class="category-info">
            <h3>Calzado de Gala</h3>
            <span>Caminar en sombras</span>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Contenedor externo para anular cualquier herencia de margen */
.categories-view-wrapper {
  background: var(--bg-dark); /* Asegura que el fondo sea negro incluso detrás */
  margin: 0;
  padding: 0;
}

.categories-container {
  /* FUERZA EL PEGADO: Eliminamos mt-header y usamos margen superior negativo 
     si hay algún residuo de espacio del componente padre */
  margin-top: -1px !important; 
  padding: 0 10% 4rem 10%;
  background: var(--bg-dark);
  min-height: 100vh;
  position: relative;
  top: 0;
}

.categories-header {
  text-align: center;
  /* Controlamos el espacio visual interno para que no se pegue el TEXTO, 
     pero el fondo ya está pegado arriba */
  padding-top: 5rem; 
  margin-bottom: 4rem;
}

/* --- RESTO DEL CSS (GRID Y CARDS) --- */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: 300px;
  gap: 1.5rem;
}

.category-card.large { grid-row: span 2; }
.category-card.wide { grid-column: span 2; }

.category-card {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-light);
  transition: var(--transition);
  background: #000;
}

.category-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.4) sepia(0.1);
  transition: var(--transition);
}

.category-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem;
  background: linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4) 100%);
  text-align: center;
}

.category-info h3 {
  font-family: var(--font-gothic);
  color: #fff;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.category-info span {
  color: var(--accent-bright);
  font-family: var(--font-elegant);
  letter-spacing: 3px;
  text-transform: uppercase;
  font-size: 0.8rem;
}

.category-card:hover {
  border-color: var(--accent-bright);
  box-shadow: 0 0 30px var(--accent-glow);
}

.category-card:hover img {
  transform: scale(1.05);
  filter: brightness(0.7) sepia(0);
}

@media (max-width: 768px) {
  .categories-grid { grid-template-columns: 1fr; }
  .category-card.large, .category-card.wide { grid-row: auto; grid-column: auto; }
}
</style>