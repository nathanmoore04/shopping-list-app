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

const parseDate = (dateString) => {
    const shortenedDateString = dateString.split('T')[0];
    const dateComponents = shortenedDateString.split('-');

    const day = dateComponents[2].replace(/^0+/, '');
    const month = dateComponents[1].replace(/^0+/, '');
    const year = dateComponents[0];

    return month + '/' + day + '/' + year;
}

const generateShoppingList = () => {
    let ingredientMap = {}

    plan.value.days.forEach(day => {
        day.meals.forEach(meal => {
            meal.ingredients.forEach(ingredient => {
                const key = `${ingredient.name}-${ingredient.unit}`; // Unique key per ingredient-unit pair

                if (ingredientMap[key]) {
                    ingredientMap[key].amount += ingredient.amount;
                } else {
                    ingredientMap[key] = {
                        name: ingredient.name,
                        amount: ingredient.amount,
                        unit: ingredient.unit
                    };
                }
            });
        });
    });

    console.log(Object.values(ingredientMap));
}

const openMealDetails = (mealId) => {
    router.push(`/meals/${mealId}`);
}

</script>

<template>
    <Navbar />
    <div class="container">
        <div class="row mt-3">
            <div class="container col col-md-8" v-if="plan">
                <div class="row justify-content-between align-items-center">
                    <div class="col">
                        <h1 class="fw-bold">{{ plan.title }}</h1>
                    </div>
                    <div class="col">
                        <button class="btn btn-primary float-end" @click="generateShoppingList">Generate Shopping List</button>
                        <button class="btn btn-primary float-end" @click="editMeal">Edit Plan</button>
                        <button class="btn btn-danger float-end me-1" data-bs-toggle="modal" data-bs-target="#exampleModal">Delete Plan</button>
                    </div>
                </div>

                <div class="modal fade" id="exampleModal" tabindex="-1" v-if="dialogAllowed">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5" id="exampleModalLabel">Heads up!</h1>
                            </div>
                            <div class="modal-body">
                                Are you sure you want to delete this plan? This action can't be undone!
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="deletePlan">Confirm</button>
                            </div>
                        </div>
                    </div>
                </div>

                <p>{{ parseDate(plan.start_date) }} to {{ parseDate(plan.end_date) }}</p>
                <h4 class="fw-bold mb-0">Plan meals</h4>
                <p class="text-body-tertiary fst-italic mt-0 mb-1">Click each meal for more details</p>
                <ul>
                    <div v-for="day in plan.days">
                        <li>{{ parseDate(day.date) }}</li>
                        <ul>
                            <li v-for="meal in day.meals"><a class="link-body-emphasis" @click="openMealDetails(meal.id)">{{ meal.name }}</a></li>
                        </ul>
                    </div>
                </ul>
            </div>
        </div>
    </div>
    <!-- <Footer /> -->
</template>

<style scoped>
.link-body-emphasis {
    cursor: pointer;
}
</style>