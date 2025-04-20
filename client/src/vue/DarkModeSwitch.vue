<script setup>
import { ref, onMounted, watch } from 'vue';

const isDarkMode = ref(false);

// Check localStorage and set initial state
onMounted(() => {
  const storedPreference = localStorage.getItem('darkMode');
  if (storedPreference !== null) {
    isDarkMode.value = storedPreference === 'true';
  }
  // Apply the theme
  applyTheme();
});

// Watch for changes and save preference
watch(isDarkMode, (newVal) => {
  localStorage.setItem('darkMode', newVal);
  applyTheme();
});

function toggleDarkMode() {
  isDarkMode.value = !isDarkMode.value;
}

function applyTheme() {
    document.documentElement.setAttribute('data-bs-theme', isDarkMode.value ? 'dark' : 'light');
}

</script>

<template>
    <div class="form-check form-switch">
        <input @click="toggleDarkMode" class="form-check-input" type="checkbox" :checked="isDarkMode" role="switch" id="switcher">
        <label class="form-check-label" for="switcher">
            <i v-if="!isDarkMode" class="bi bi-sun" alt="Light mode"></i>
            <i v-else class="bi bi-moon" alt="Dark mode"></i>
        </label>
    </div>
</template>

<style scoped>
.form-check-input {
    border-color: gray;
}

.form-check-input:checked {
    border-color: gray;
}

.form-check-input:focus {
    color: gray;
    border-color: #808080;
}

.v-enter-active {
    transition: all 0.5s;
}

.v-enter-from {
    opacity: 0;
}
</style>