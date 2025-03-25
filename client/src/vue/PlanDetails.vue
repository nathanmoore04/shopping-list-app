<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import Navbar from '@/vue/Navbar.vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const route = useRoute();
const plan = ref(null);
const errorMessage = ref('');

const dialogAllowed = ref(true);

// User token
const authStore = useAuthStore();
const token = authStore.token;

onMounted(async () => {
    try {
        const response = await axios.get(`http://127.0.0.1:3000/plans/${route.params.id}`, 
            { headers: { Authorization: `Bearer ${token}` } }
        );
        plan.value = response.data;

        console.log(plan.value);

    } catch (err) {
        console.error(err.message);
        errorMessage.value = 'Error fetching plan details. Please try again.'
    }
});
</script>

<template>
    <Navbar />
    <div class="container">
        <div class="row mt-3">
            <div class="container col col-md-8" v-if="plan">
                <div class="row justify-content-between align-items-center">
                    <div class="col">
                        <h1 class="fw-bold">{{ plan.name }}</h1>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- <Footer /> -->
</template>

<style scoped></style>