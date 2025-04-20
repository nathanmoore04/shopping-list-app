<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import Navbar from '@/vue/Navbar.vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const route = useRoute();
const meal = ref(null);
const errorMessage = ref('');

const dialogAllowed = ref(true);

// User token
const authStore = useAuthStore();
const token = authStore.token;

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

const editMeal = () => {
    router.push(`/meals/edit/${route.params.id}`);
}

const deleteMeal = async () => {
    errorMessage.value = '';

    try {
        await axios.delete(`http://127.0.0.1:3000/recipes/${route.params.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        dialogAllowed.value = false;
        router.push('/dashboard');
    } catch (err) {
        console.error(err);
        errorMessage.value = 'Error deleting meal. Please try again';
        dialogAllowed.value = true;
    }
};
</script>

<template>
    <div class="container">
        <div class="row mt-3">
            <div class="container col col-md-8" v-if="meal">
                <div class="row justify-content-between align-items-center">
                    <div class="col">
                        <h1 class="fw-bold">{{ meal.name }}</h1>
                    </div>
                    <div class="col">
                        <button class="btn btn-primary float-end" @click="editMeal">Edit Meal</button>
                        <button class="btn btn-danger float-end me-1" data-bs-toggle="modal" data-bs-target="#exampleModal">Delete Meal</button>
                    </div>
                </div>

                <div class="modal fade" id="exampleModal" tabindex="-1" v-if="dialogAllowed">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5" id="exampleModalLabel">Heads up!</h1>
                            </div>
                            <div class="modal-body">
                                Are you sure you want to delete this meal? This action can't be undone!
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="deleteMeal">Confirm</button>
                            </div>
                        </div>
                    </div>
                </div>



                <p>
                    <span v-for="(tag, index) in meal.tags" :key="index"
                        class="badge bg-secondary me-2 d-inline-flex align-items-center px-2 py-1">
                        {{ tag }}
                    </span>
                </p>
                <h4 class="fw-bold">Ingredients:</h4>
                <ul>
                    <li v-for="ingredient in meal.ingredients" :key="ingredient">{{ ingredient.amount }} {{
                        ingredient.unit }} {{ ingredient.name }}</li>
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

<style scoped></style>