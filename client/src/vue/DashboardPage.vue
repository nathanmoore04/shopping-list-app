<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';
import Navbar from './Navbar.vue';
import Footer from './Footer.vue';
import MealCard from './MealCard.vue';

const authStore = useAuthStore();

const errorMessage = ref('');
const meals = ref([]);

onMounted(async () => {
    const token = authStore.token;
    errorMessage.value = '';

    try {
        // Get all meals for user
        const response = await axios.get('http://127.0.0.1:3000/recipes/', {
            headers: { Authorization: `Bearer ${token}` },
        });

        meals.value = response.data;
    } catch (err) {
        errorMessage.value = 'Error fetching user data. Please try again.';
        console.error(err);
    }
})
</script>

<template>
    <Navbar />
    <p v-if="errorMessage" class="text-danger">{{ errorMessage }}</p>
    <div class="container text-center py-5">
        <h1 class="fw-bold">Hello, [user name]</h1>
        <h3 class="fw-light">Message of the day</h3>
        <div class="row justify-content-center mt-3">
            <div class="col-3"><RouterLink class="btn btn-outline-primary btn-lg float-end" to="/meals/create">Create a new meal</RouterLink></div>
            <div class="col-3"><RouterLink class="btn btn-primary btn-lg float-start" to="/plans/create">Create a new plan</RouterLink></div>
        </div>
    </div>
    <div class="container">
        <div class="row mt-2 justify-content-between">
            <div class="col-3">
                <h3 class="fw-bold">Dashboard</h3>
            </div>
            <div class="col-4">
                <form class="d-flex pt-2" role="search">
                    <input class="form-control me-2" type="search" placeholder="Search by keyword or #tags..." aria-label="Search">
                    <button class="btn btn-primary" type="submit"><i class="bi bi-search"></i></button>
                </form>
            </div>
        </div>

        <div class="row mt-2">
            <div class="col-8">
                <h4 class="fw-bold">Your recent meals</h4>
            </div>
            <div class="col">
                <a href="#" class="btn btn-outline-primary float-end">See all meals <i class="bi bi-arrow-right"></i></a>
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
                <a href="#" class="btn btn-outline-primary float-end">See all plans <i class="bi bi-arrow-right"></i></a>
            </div>
        </div>

        <div class="row align-items-start mt-2">
            <div class="col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center">
                <div class="card" style="width: 18rem;">
                    <div class="card-body">
                        <h5 class="card-title fw-semibold">Plan title</h5>
                        <p class="card-text text-body-secondary fw-light">[num] meals &#8226; Last used MM/DD/YY</p>
                        <ul class="card-text">
                            <li>Meal 1</li>
                            <li>Meal 2</li>
                            <li>Meal 3</li>
                            <li>and [num] more...</li>
                        </ul>
                        <div class="row d-flex justify-content-center">
                            <div class="col"><a href="#" class="btn btn-outline-primary">Reuse plan</a></div>
                            <div class="col"><a href="#" class="btn btn-primary">Details</a></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center">
                <div class="card" style="width: 18rem;">
                    <div class="card-body">
                        <h5 class="card-title fw-semibold">Plan title</h5>
                        <p class="card-text text-body-secondary fw-light">[num] meals &#8226; Last used MM/DD/YY</p>
                        <ul class="card-text">
                            <li>Meal 1</li>
                            <li>Meal 2</li>
                            <li>Meal 3</li>
                            <li>and [num] more...</li>
                        </ul>
                        <div class="row d-flex justify-content-center">
                            <div class="col"><a href="#" class="btn btn-outline-primary">Reuse plan</a></div>
                            <div class="col"><a href="#" class="btn btn-primary">Details</a></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center">
                <div class="card" style="width: 18rem;">
                    <div class="card-body">
                        <h5 class="card-title fw-semibold">Plan title</h5>
                        <p class="card-text text-body-secondary fw-light">[num] meals &#8226; Last used MM/DD/YY</p>
                        <ul class="card-text">
                            <li>Meal 1</li>
                            <li>Meal 2</li>
                            <li>Meal 3</li>
                            <li>and [num] more...</li>
                        </ul>
                        <div class="row d-flex justify-content-center">
                            <div class="col"><a href="#" class="btn btn-outline-primary">Reuse plan</a></div>
                            <div class="col"><a href="#" class="btn btn-primary">Details</a></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center">
                <div class="card" style="width: 18rem;">
                    <div class="card-body">
                        <h5 class="card-title fw-semibold">Plan title</h5>
                        <p class="card-text text-body-secondary fw-light">[num] meals &#8226; Last used MM/DD/YY</p>
                        <ul class="card-text">
                            <li>Meal 1</li>
                            <li>Meal 2</li>
                            <li>Meal 3</li>
                            <li>and [num] more...</li>
                        </ul>
                        <div class="row d-flex justify-content-center">
                            <div class="col"><a href="#" class="btn btn-outline-primary">Reuse plan</a></div>
                            <div class="col"><a href="#" class="btn btn-primary">Details</a></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Footer />
</template>

<style scoped></style>