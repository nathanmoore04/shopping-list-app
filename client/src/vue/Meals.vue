<script setup>
import Navbar from './Navbar.vue';
import Footer from './Footer.vue';
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import MealCard from './MealCard.vue';
import axios from 'axios';

const authStore = useAuthStore();

const meals = ref([]);
const errorMessage = ref('');

onMounted(async () => {
    const token = authStore.token;
    errorMessage.value = '';

    try {
        // Get all meals for user
        const mealResponse = await axios.get('http://127.0.0.1:3000/recipes', {
            headers: { Authorization: `Bearer ${token}` }
        });

        meals.value = mealResponse.data;
    } catch (err) {
        errorMessage.value = 'Error fetching user data. Please try again.';
        console.error(err);
    }
});
</script>

<template>
<Navbar />
<p v-if="errorMessage" class="text-danger">{{ errorMessage }}</p>
<div class="container">
    <div class="row mt-2 justify-content-between align-items-center">
            <div class="col-3">
                <h3 class="fw-bold">Your meals</h3>
            </div>
            <!-- <div class="col-8 col-md-4">
                <form class="d-flex pt-2" role="search">
                    <input class="form-control me-2" type="search" placeholder="Search by keyword or #tags..."
                        aria-label="Search">
                    <button class="btn btn-primary" type="submit"><i class="bi bi-search"></i></button>
                </form>
            </div> -->
        </div>
    <div v-if="meals.length > 0" class="row align-items-start mt-2">
        <MealCard v-for="meal in meals" :key="meal.id" :meal="meal" />
    </div>
    <p v-else>No meals to display. Why not create one?</p>
</div>

<Footer />
</template>

<style scoped>

</style>