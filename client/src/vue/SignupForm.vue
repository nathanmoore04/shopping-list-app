<script setup>
import { ref } from 'vue';

// Store form elements for validation
const form = ref({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
});

// Store errors to be displayed
const errors = ref([]);

// Define emits, to be used by SignupPage
const emit = defineEmits(['signup'])

// Form validation
const validateForm = () => {
    errors.value = [];

    if (!form.value.name) errors.value.push('First name is required.');

    if (!form.value.email) errors.value.push('Email is required.');
    else if (!/\S+@\S+\.\S+/.test(form.value.email)) errors.value.push('Invalid email format.');

    if (!form.value.password) errors.value.push('Password is required.');
    else if (form.value.password.length < 8) errors.value.push('Minimum password length is 8 characters.');
    else if (form.value.password !== form.value.confirmPassword) errors.value.push('Passwords do not match.');

    if (errors.value) return;    
    else {
        emit('signup', {
            name: form.value.name,
            email: form.value.email,
            password: form.value.password
        });
    }
};
</script>

<template>
    <form @submit.prevent="validateForm" class="signup-form">
        <h1 class="fw-bold text-center">Sign up</h1>
        <div class="mb-3">
            <label for="name" class="form-label">First name</label>
            <input type="text" class="form-control" id="name" v-model="form.name">
        </div>
        <div class="mb-3">
            <label for="emailInput" class="form-label">Email address</label>
            <input type="email" class="form-control" id="emailInput" v-model="form.email">
            <div class="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div class="mb-3">
            <label for="passwordInput" class="form-label">Password</label>
            <input type="password" class="form-control" id="passwordInput" v-model="form.password">
        </div>
        <div class="mb-3">
            <label for="confirmPasswordInput" class="form-label">Confirm password</label>
            <input type="password" class="form-control" id="confirmPasswordInput" v-model="form.confirmPassword">
        </div>
        <p v-for="error in errors" class="text-danger">{{ error }}</p>
        <button type="submit" class="btn btn-primary w-100">Sign up</button>
        <p class="text-center mt-1">Already have an account? <RouterLink to="/login">Log in here</RouterLink>.</p>
    </form>
</template>

<style scoped>

</style>