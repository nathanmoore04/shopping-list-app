<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import Navbar from '@/vue/Navbar.vue';
import Footer from '@/vue/Footer.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const meal = ref(null);
const errorMessage = ref('');

onMounted(async () => {
    try {
        const response = await axios.get(`http://127.0.0.1:3000/recipes/${route.params.id}`);
        meal.value = response.data;

        console.log(meal.value);

        meal.value.ingredients = JSON.parse(meal.value.ingredients);

        console.log(meal.value);
    } catch (err) {
        console.error(err.message);
        errorMessage.value = 'Error fetching meal details. Please try again.'
    }
});
</script>

<template>
    <Navbar />
    <div class="container" v-if="meal">
        <h1>{{ meal.name }}</h1>
        <p>
            <span v-for="(tag, index) in meal.tags" :key="index"
                class="badge bg-secondary me-2 d-inline-flex align-items-center px-2 py-1">
                {{ tag }}
            </span>
        </p>
        <p><strong>Ingredients:</strong></p>
        <ul>
            <li v-for="ingredient in meal.ingredients" :key="ingredient">{{ ingredient.amount }} {{ ingredient.unit }} {{ ingredient.name }}</li>
        </ul>
        <p><strong>Steps:</strong></p>
        <p>{{ meal.steps }}</p>
    </div>
    <p v-else>{{ errorMessage }}</p>
    <Footer />
</template>

<style scoped>

</style>