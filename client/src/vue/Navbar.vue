<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import DarkModeSwitch from '@/vue/DarkModeSwitch.vue';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};

</script>

<template>
  <nav class="navbar navbar-expand-sm navbar-light bg-light-subtle sticky-top">
    <div class="container-lg">
      <RouterLink class="navbar-brand" to="/">MealPlanner</RouterLink>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item mx-1 pt-2"><DarkModeSwitch /></li>
          <li class="nav-item mx-1">
            <RouterLink v-if="authStore.isAuthenticated" to="/dashboard" class="nav-link">Dashboard</RouterLink>
          </li>
          <li class="nav-item mx-1">
            <RouterLink v-if="authStore.isAuthenticated" to="/meals" class="nav-link">Meals</RouterLink>
          </li>
          <li class="nav-item mx-1">
            <RouterLink v-if="authStore.isAuthenticated" to="/plans" class="nav-link">Plans</RouterLink>
          </li>
          <li class="nav-item mx-1">
            <RouterLink v-if="authStore.isAuthenticated" to="/account" class="nav-link">Account</RouterLink>
          </li>
        </ul>
        <button v-if="authStore.isAuthenticated" @click="handleLogout" class="btn btn-outline-primary">Logout</button>
        <RouterLink v-else to="/login" class="btn btn-primary">Login</RouterLink>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
    box-shadow: 0;
    transition: box-shadow 0.3s ease-in-out;
}

.navbar:hover {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.nav-link {
    position: relative;
}
</style>