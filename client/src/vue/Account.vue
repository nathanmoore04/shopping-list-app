<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Navbar from './Navbar.vue';
import Footer from './Footer.vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const email = ref(authStore.email);
const name = ref(authStore.userName);
</script>

<template>
<Navbar />
<div class="container-lg w-50 mt-5">
    <h3 class="fw-bold">Account details</h3>
    <div class="mb-3">
        <label for="title" class="mb-1">Email address</label>
        <input type="text" class="form-control" v-model="email" disabled>
    </div>
    <div class="mb-3">
        <label for="title" class="mb-1">First name</label>
        <input type="text" class="form-control" v-model="name">
    </div>
    <div class="row mb-3 align-items-center">
        <div class="col col-md-6">
            <button class="btn btn-success w-100">Update info</button>
        </div>
        <div class="col col-md-6">
            <button class="btn btn-outline-danger w-100">Delete account</button>
        </div>
    </div>
</div>
<Footer />
</template>

<style scoped>

</style>