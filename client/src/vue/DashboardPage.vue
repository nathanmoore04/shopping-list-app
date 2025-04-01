<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';
import Navbar from './Navbar.vue';
import Footer from './Footer.vue';
import MealCard from './MealCard.vue';
import PlanCard from './PlanCard.vue';

const authStore = useAuthStore();

const errorMessage = ref('');
const meals = ref([]);
const plans = ref([]);

const userName = ref('');

const parseDate = (dateString) => {
    const shortenedDateString = dateString.split('T')[0];
    const dateComponents = shortenedDateString.split('-');

    const day = dateComponents[2].replace(/^0+/, '');
    const month = dateComponents[1].replace(/^0+/, '');
    const year = dateComponents[0];

    return month + '/' + day + '/' + year;
}

onMounted(async () => {
    const token = authStore.token;
    errorMessage.value = '';

    if (authStore.userName) userName.value = authStore.userName;

    try {

        // Get all meals for user
        const mealResponse = await axios.get('http://127.0.0.1:3000/recipes', {
            headers: { Authorization: `Bearer ${token}` }
        });

        meals.value = mealResponse.data.slice(0, 4);

        const planResponse = await axios.get('http://127.0.0.1:3000/plans', {
            headers: { Authorization: `Bearer ${token}` }
        });

        plans.value = planResponse.data.slice(0, 4);

        for (const plan of plans.value) {
            plan.start_date = parseDate(plan.start_date);
            plan.end_date = parseDate(plan.end_date);
        }
    } catch (err) {
        errorMessage.value = 'Error fetching user data. Please try again.';
        console.error(err);
    }
});
</script>

<template>
    <Navbar />
    <p v-if="errorMessage" class="text-danger">{{ errorMessage }}</p>
    <div class="container text-center py-5">
        <h1 class="fw-bold">Hello<span v-if="userName">, {{ userName }}!</span><span v-else>!</span>
        </h1>
        <h3 class="fw-light">Message of the day</h3>
        <div class="row justify-content-center mt-3">
            <div class="col col-md-3">
                <RouterLink class="btn btn-outline-primary btn float-end" to="/meals/create">Create a new meal
                </RouterLink>
            </div>
            <div class="col col-md-3">
                <RouterLink class="btn btn-primary btn float-start" to="/plans/create">Create a new plan</RouterLink>
            </div>
        </div>
    </div>
    <div class="container">
        <div class="row mt-2 justify-content-between align-items-center">
            <div class="col-3">
                <h3 class="fw-bold">Dashboard</h3>
            </div>
            <div class="col-8 col-md-4">
                <form class="d-flex pt-2" role="search">
                    <input class="form-control me-2" type="search" placeholder="Search by keyword or #tags..."
                        aria-label="Search">
                    <button class="btn btn-primary" type="submit"><i class="bi bi-search"></i></button>
                </form>
            </div>
        </div>

        <div class="row mt-2">
            <div class="col-8">
                <h4 class="fw-bold">Your recent meals</h4>
            </div>
            <div class="col">
                <a href="#" class="btn btn-outline-primary float-end">See all meals <i
                        class="bi bi-arrow-right"></i></a>
            </div>
        </div>

        <div v-if="meals.length > 0" class="row align-items-start mt-2">
            <MealCard v-for="meal in meals" :key="meal.id" :meal="meal" />
        </div>
        <p v-else>No meals to display. Why not create one?</p>

        <div class="row mt-2">
            <div class="col">
                <h4 class="fw-bold">Your recent plans</h4>
            </div>
            <div class="col">
                <a href="#" class="btn btn-outline-primary float-end">See all plans <i
                        class="bi bi-arrow-right"></i></a>
            </div>
        </div>

        <div v-if="plans.length > 0" class="row align-items-start mt-2">
            <PlanCard v-for="plan in plans" :key="plan.id" :plan="plan" />
        </div>
        <p v-else>No plans to display. Why not create one?</p>

    </div>
    <Footer />
</template>

<style scoped></style>