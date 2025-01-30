<script setup>
import { ref } from 'vue';

// Store form elements for validation
const form = ref({
    email: '',
    password: '',
    confirmPassword: ''
});

// Store errors to be displayed
const errors = ref({});

// Define emits, to be used by SignupPage
const emit = defineEmits(['signup'])

// Form validation
const validateForm = () => {
    errors.value = {};

    if (!form.value.email) errors.value.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.value.email)) errors.value.email = 'Invalid email format.';

    if (!form.value.password) errors.value.password = 'Password is required.'
    else if (form.value.password.length < 8) errors.value.password = 'Minimum password length is 8 characters.';
    else if (form.value.password !== form.value.confirmPassword) errors.value.password = 'Passwords do not match.';

    if (errors.value.email || errors.value.password) return;    
    else {
        emit('signup', {
            email: form.value.email,
            password: form.value.password
        });
    }
};
</script>

<template>
    <form @submit.prevent="validateForm" class="signup-form">
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
        <p v-if="errors.email" class="error-message">{{ errors.email }}</p>
        <p v-if="errors.password" class="error-message">{{ errors.password }}</p>
        <button type="submit" class="btn btn-primary">Sign up</button>
    </form>
</template>

<style scoped>

</style>