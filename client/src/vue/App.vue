<script setup>
import Navbar from './Navbar.vue';
import Footer from './Footer.vue';
</script>

<template>
  <div class="app d-flex flex-column min-vh-100">
    <Navbar />
    <main class="flex-grow-1">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<style scoped>
.app {
  transition: all 0.3s;
}

@media print {
  nav, footer {
    display: none !important;  
  }
}
</style>
