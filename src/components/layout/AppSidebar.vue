<template>
  <aside class="sidebar" :class="{ open }">
  </aside>
</template>

<script setup>
defineProps({ open: Boolean })
defineEmits(['close'])
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: var(--header-height);
  left: 0;
  width: var(--sidebar-width);
  height: calc(100vh - var(--header-height));
  /* USAMOS LAS VARIABLES GLOBALES */
  background: var(--bg-panel); 
  border-right: 1px solid var(--border-light);
  transition: background 0.4s ease, border-color 0.4s ease;
  z-index: 100;
}
</style>