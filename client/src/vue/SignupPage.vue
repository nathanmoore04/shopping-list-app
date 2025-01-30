<script setup>
import { ref } from 'vue';
import SignupForm from './SignupForm.vue';
import axios from 'axios';

const message = ref('');

const handleSignup = async (userData) => {
    try {
        const response = await axios.post('http://127.0.0.1:3000/signup', userData, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: false
        });

        message.value = response.data.message || 'Signed up successfully!';
    } catch (err) {
        message.value = err.response?.data?.message || 'Signup failed. Please try again.';
    }
};
</script>

<template>
    <div class="container-lg mt-5 w-50">
        <SignupForm @signup="handleSignup" />
    </div>
</template>

<style scoped>

</style>