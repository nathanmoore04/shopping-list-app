<script setup>
import Navbar from './Navbar.vue';
import Footer from './Footer.vue';
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import MealCard from './MealCard.vue';
import axios from 'axios';

const authStore = useAuthStore();
const token = authStore.token;

const searchQuery = ref('');
const selectedTag = ref('');

const meals = ref([]);
const tags = ref([]);
const errorMessage = ref('');
const searched = ref(false);

onMounted(async () => {
    const token = authStore.token;
    errorMessage.value = '';

    try {
        // Get all meals for user
        const mealResponse = await axios.get('http://127.0.0.1:3000/recipes', {
            headers: { Authorization: `Bearer ${token}` }
        });

        meals.value = mealResponse.data;

        for (const meal of meals.value) {
            for (const tag of meal.tags) {
                if (!tags.value.find(t => t === tag)) tags.value.push(tag);
            }
        }
    } catch (err) {
        errorMessage.value = 'Error fetching user data. Please try again.';
        console.error(err);
    }
});

const fetchResults = async () => {
    errorMessage.value = '';

    try {
        const response = await axios.get('http://127.0.0.1:3000/recipes/search', {
            params: { q: searchQuery.value },
            headers: { Authorization: `Bearer ${token}` }
        });

        meals.value = response.data;

        searched.value = true;
    } catch (err) {
        errorMessage.value = 'Error searching plans. Please try again.';
        console.error(err);
    }
};
</script>

<template>
    <p v-if="errorMessage" class="text-danger">{{ errorMessage }}</p>
    <div class="container">
        <div class="row mt-2 justify-content-between align-items-center">
            <div class="col-6 col-md-3">
                <h3 class="fw-bold">Your meals</h3>
            </div>
            <div class="col-8 col-md-6">
                <form class="d-flex pt-2" role="search" @submit.prevent>
                    <div class="input-group">
                        <input v-model="searchQuery" type="search" class="form-control"
                            placeholder="Search meals by title or tags..." 
                            style="min-width: 60%;"/>
                        <button class="btn btn-primary" @click="fetchResults"><i class="bi bi-search"></i></button>
                    </div>
                </form>
            </div>
            <div class="col-12 col-md-2">
                <RouterLink class="btn btn-outline-primary float-end" to="/plans/create">
                    Create new meal <i class="bi bi-arrow-right"></i>
                </RouterLink>
            </div>
        </div>
        <Transition name="fade">
            <div v-if="meals.length > 0" class="row align-items-start mt-2">
                <MealCard v-for="meal in meals" :key="meal.id" :meal="meal" />
            </div>
        </Transition>
        <p v-if="!searched && meals.length === 0">No meals to display. Why not create one?</p>
        <p v-if="searched && meals.length === 0">No meals match your search query.</p>
    </div>
</template>

<style scoped>
.fade-enter-from {
    opacity: 0;
}

.fade-enter-to {
    transition: all 0.6s ease;
}
</style>