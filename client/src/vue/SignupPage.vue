<script setup>
import { ref } from 'vue';
import SignupForm from './SignupForm.vue';
import axios from 'axios';
import Navbar from './Navbar.vue';
import Footer from './Footer.vue';
import { useRouter } from 'vue-router';

const message = ref('');
const router = useRouter();

const handleSignup = async (userData) => {
    try {
        const response = await axios.post('http://127.0.0.1:3000/signup', userData, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: false
        });

        message.value = response.data.message || 'Signed up successfully!';
        router.push('/dashboard');
    } catch (err) {
        message.value = err.response?.data?.message || 'Signup failed. Please try again.';
    }
};
</script>

<template>
    <Navbar />
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-sm-6 col-md-4 col-12 container mt-5">
                <SignupForm @signup="handleSignup" />
                <p v-if="message">{{ message }}</p>
            </div>
        </div>
    </div>
    <Footer />
</template>

<style scoped>

</style>