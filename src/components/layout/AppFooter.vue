<template>
  <footer class="footer">
    <div class="footer-container">
      <!-- Columna 1: Branding -->
      <div class="footer-section">
        <h2 class="footer-logo title-gothic">Midnight Attire</h2>
        <p class="footer-description">
          Excelencia y durabilidad en cada pieza.
        </p>
      </div>

      <!-- Columna 2: Navegación -->
      <div class="footer-section">
        <h3 class="section-title">Navegación</h3>
        <ul class="footer-links">
          <li><RouterLink to="/productos">Catálogo de Productos</RouterLink></li>
          <li><RouterLink to="/sobre-nosotros">Sobre Nosotros</RouterLink></li>
          <li><RouterLink to="/contacto">Contacto</RouterLink></li>
        </ul>
      </div>

      <!-- Columna 3: Legal -->
      <div class="footer-section">
        <h3 class="section-title">Información Legal</h3>
        <ul class="footer-links">
          <li><a href="#">Términos y Condiciones</a></li>
          <li><a href="#">Política de Privacidad</a></li>
          <li><a href="#">Política de Devoluciones</a></li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; 2026 Midnight Attire. Todos los derechos reservados.</p>
    </div>
  </footer>
</template>

<script setup>
// No necesitamos importar Supabase ni Stores aquí.
</script>

<style scoped>
.footer {
  padding: 4rem 2rem 2rem;
  background-color: var(--bg-panel);      /* ✅ era --bg-secondary */
  border-top: 1px solid var(--border-light); /* ✅ era --border */
  color: var(--text-secondary);           /* ✅ era --text-soft */
  transition: background-color 0.4s ease, color 0.4s ease;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  gap: 4rem;
}

.footer-logo {
  color: var(--accent);                   /* ✅ era --gothic-purple */
  font-size: 2rem;
  margin-bottom: 1.2rem;
  letter-spacing: 4px;
  font-weight: bold;
}

.footer-description {
  font-size: 0.9rem;
  line-height: 1.7;
  max-width: 320px;
  color: var(--text-secondary);
}

.section-title {
  color: var(--text-primary);             /* ✅ era 'white' hardcodeado */
  font-size: 1.1rem;
  margin-bottom: 1.8rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  font-family: var(--font-gothic);
}

.footer-links {
  list-style: none;
  padding: 0;
}

.footer-links li {
  margin-bottom: 1rem;
}

.footer-links a {
  color: var(--text-secondary);           /* ✅ era --text-soft */
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.footer-links a:hover {
  color: var(--accent);                   /* ✅ era --gothic-purple */
  padding-left: 8px;
}

.footer-bottom {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-light); /* ✅ era --border */
  text-align: center;
  font-size: 0.8rem;
  color: var(--text-secondary);
  opacity: 0.6;
}

@media (max-width: 900px) {
  .footer-container {
    grid-template-columns: 1fr;
    text-align: center;
  }
  .footer-description { margin: 0 auto; }
}
</style>