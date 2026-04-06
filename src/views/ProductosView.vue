<template>
  <div class="shop-container mt-header">
    <aside class="filters">
      <h2 class="title-gothic">Filtros</h2>
      <div class="filter-group">
        <h4>Categorías</h4>
        <ul>
          <li><label><input type="checkbox"> Abrigos Largos</label></li>
          <li><label><input type="checkbox"> Vestidos</label></li>
          <li><label><input type="checkbox"> Accesorios</label></li>
        </ul>
      </div>
    </aside>

    <main class="products-grid">
      <!-- Tarjeta de Producto (Ejemplo) -->
      <div v-for="n in 6" :key="n" class="product-card">
        <div class="product-image">
          <img src="https://images.unsplash.com/photo-1515347619252-60a4bd4eff4f?q=80&w=500" alt="Producto">
          <div class="product-badge">Nuevo</div>
        </div>
        <div class="product-info">
          <h3 class="product-title">Capa Velvet "Midnight"</h3>
          <p class="product-price">120.00€</p>
          <button class="btn-add-cart">Añadir al Carrito 🛒</button>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.shop-container {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
  padding: 2rem 5%;
  min-height: 100vh;
}

/* Filtros */
.filters {
  border-right: 1px solid var(--border-light);
  padding-right: 1.5rem;
}

.filter-group h4 {
  font-family: var(--font-gothic);
  color: var(--accent-bright);
  margin: 1.5rem 0 0.5rem;
  font-size: 0.9rem;
}

/* Rejilla de Productos */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2.5rem;
}

/* La Tarjeta "Intensa" */
.product-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: var(--transition);
  position: relative;
}

.product-card:hover {
  transform: translateY(-10px);
  border-color: var(--accent);
  box-shadow: var(--shadow-intense);
}

.product-image {
  position: relative;
  aspect-ratio: 3/4;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
  filter: grayscale(0.3) brightness(0.8); /* Look Gótico */
}

.product-card:hover img {
  transform: scale(1.1);
  filter: grayscale(0) brightness(1);
}

.product-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: var(--accent);
  color: white;
  padding: 0.2rem 0.8rem;
  font-family: var(--font-gothic);
  font-size: 0.7rem;
  border-radius: 2px;
}

.product-info {
  padding: 1.5rem;
  text-align: center;
}

.product-title {
  font-family: var(--font-gothic);
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.product-price {
  color: var(--text-secondary);
  font-weight: bold;
  margin-bottom: 1.2rem;
}

.btn-add-cart {
  width: 100%;
  padding: 0.8rem;
  background: transparent;
  border: 1px solid var(--accent);
  color: var(--text-primary);
  font-family: var(--font-gothic);
  text-transform: uppercase;
  cursor: pointer;
  transition: var(--transition);
}

.btn-add-cart:hover {
  background: var(--accent);
  color: white;
  box-shadow: 0 0 15px var(--accent-glow);
}

@media (max-width: 768px) {
  .shop-container { grid-template-columns: 1fr; }
  .filters { display: none; } /* En móvil ocultamos filtros por ahora */
}
</style>