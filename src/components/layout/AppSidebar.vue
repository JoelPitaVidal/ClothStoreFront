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
  background: var(--bg-secondary);
  border-right: 1px solid var(--border);
}
</style>