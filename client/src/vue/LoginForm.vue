<script setup>
import { ref } from 'vue';

// Store form elements for validation
const form = ref({
    email: '',
    password: '',
});

// Store errors to be displayed
const errors = ref({});

// Define emits, to be used by SignupPage
const emit = defineEmits(['login'])

// Form validation
const validateForm = () => {
    errors.value = {};

    if (!form.value.email) errors.value.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.value.email)) errors.value.email = 'Invalid email format.';

    if (!form.value.password) errors.value.password = 'Password is required.'

    if (errors.value.email || errors.value.password) return;    
    else {
        emit('login', {
            email: form.value.email,
            password: form.value.password
        });
    }
};
</script>

<template>
    <form @submit.prevent="validateForm">
        <h1 class="fw-bold text-center">Log in</h1>
        <div class="mb-3">
            <label for="emailInput" class="form-label">Email address</label>
            <input type="email" class="form-control" id="emailInput" v-model="form.email">
        </div>
        <div class="mb-3">
            <label for="passwordInput" class="form-label">Password</label>
            <input type="password" class="form-control" id="passwordInput" v-model="form.password">
        </div>
        <p v-if="errors.email" class="error-message">{{ errors.email }}</p>
        <p v-if="errors.password" class="error-message">{{ errors.password }}</p>
        <button type="submit" class="btn btn-primary w-100">Log in</button>
        <p class="text-center mt-1">Don't have an account? <RouterLink to="/signup">Create one here</RouterLink>.</p>
    </form>
</template>

<style scoped>

</style>