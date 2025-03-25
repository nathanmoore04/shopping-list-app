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
</script>

<template>
    <Navbar />
    <div class="container">
        <div class="row mt-3">
            <div class="container col col-md-8" v-if="plan">
                <div class="row justify-content-between align-items-center">
                    <div class="col">
                        <h1 class="fw-bold">{{ plan.title }}</h1>
                        <p>{{ parseDate(plan.start_date) }} to {{ parseDate(plan.end_date) }}</p>
                        <ul>
                            <div v-for="day in plan.days">
                                <li>{{ parseDate(day.date) }}</li>
                                <ul>
                                    <li v-for="meal in day.meals">{{ meal.name }}</li>
                                </ul>
                            </div>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- <Footer /> -->
</template>

<style scoped></style>