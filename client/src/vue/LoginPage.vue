<script setup>
import { ref } from 'vue';
import LoginForm from '@/vue/LoginForm.vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import Navbar from '@/vue/Navbar.vue';

const message = ref('');
const authStore = useAuthStore();
const router = useRouter();

const handleLogin = async (userData) => {
    try {
        const response = await axios.post('http://127.0.0.1:3000/login', userData, {
            headers: { 'Content-Type': 'application/json' }
        });

        authStore.login(response.data);
        router.push('/dashboard');
    } catch (err) {
        message.value = 'Invalid login credentials.';
    }
};
</script>

<template>
    <Navbar />
    <div class="container-lg mt-5 w-50">
        <LoginForm @login="handleLogin" />
        <p v-if="message">{{ message }}</p>
    </div>
</template>

<style scoped>

</style>