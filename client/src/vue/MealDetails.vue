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

    } catch (err) {
        console.error(err.message);
        errorMessage.value = 'Error fetching meal details. Please try again.'
    }
});
</script>

<template>
    <Navbar />
    <div class="container">
        <div class="row mt-3">
            <div class="container col col-md-8" v-if="meal">
                <div class="row justify-content-between align-items-center">
                    <div class="col">
                        <h1 class="fw-bold">{{ meal.name }}</h1>
                    </div>
                    <div class="col"><button class="btn btn-primary  float-end">Edit</button></div>
                </div>
                <p>
                    <span v-for="(tag, index) in meal.tags" :key="index"
                        class="badge bg-secondary me-2 d-inline-flex align-items-center px-2 py-1">
                        {{ tag }}
                    </span>
                </p>
                <h4 class="fw-bold">Ingredients:</h4>
                <ul>
                    <li v-for="ingredient in meal.ingredients" :key="ingredient">{{ ingredient.amount }} {{ ingredient.unit }} {{ ingredient.name }}</li>
                </ul>
                <h4 class="fw-bold">Steps:</h4>
                <ol>
                    <li v-for="(step, index) in meal.steps" :key="index">
                        {{ step }}
                    </li>
                </ol>
            </div>
            <p v-else class="text-danger">{{ errorMessage }}</p>
        </div>
        
    </div>
    <!-- <Footer /> -->
</template>

<style scoped>

</style>