<script setup>
import { ref } from 'vue';
import LoginForm from '@/vue/LoginForm.vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import Navbar from '@/vue/Navbar.vue';
import Footer from './Footer.vue';

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
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-sm-6 col-md-4 col-12 container mt-5">
                <LoginForm @login="handleLogin" />
                <p v-if="message">{{ message }}</p>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>