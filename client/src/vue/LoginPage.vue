<script setup>
import { ref } from 'vue';
import LoginForm from './LoginForm.vue';
import axios from 'axios';

const message = ref('');

const handleLogin = async (userData) => {
    try {
        const response = await axios.post('http://127.0.0.1:3000/login', userData, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: false
        });

        localStorage.setItem('token', response.data);

        message.value = response.data.message || 'Logged in successfully!';
    } catch (err) {
        message.value = err.response?.data?.message || 'Login failed. Please try again.';
    }
};
</script>

<template>
    <div class="container-lg mt-5 w-50">
        <LoginForm @login="handleLogin" />
        <p v-if="message">{{ message }}</p>
    </div>
</template>

<style scoped>

</style>