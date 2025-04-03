<script setup>
import Navbar from './Navbar.vue';
import Footer from './Footer.vue';
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import PlanCard from './PlanCard.vue';
import axios from 'axios';

const authStore = useAuthStore();

const plans = ref([]);
const errorMessage = ref('');

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

    try {
        // Get all meals for user
        const planResponse = await axios.get('http://127.0.0.1:3000/plans', {
            headers: { Authorization: `Bearer ${token}` }
        });

        plans.value = planResponse.data;

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
<div class="container">
    <div class="row mt-2 justify-content-between align-items-center">
            <div class="col-3">
                <h3 class="fw-bold">Your plans</h3>
            </div>
            <!-- <div class="col-8 col-md-4">
                <form class="d-flex pt-2" role="search">
                    <input class="form-control me-2" type="search" placeholder="Search by keyword or #tags..."
                        aria-label="Search">
                    <button class="btn btn-primary" type="submit"><i class="bi bi-search"></i></button>
                </form>
            </div> -->
        </div>
    <div v-if="plans.length > 0" class="row align-items-start mt-2">
            <PlanCard v-for="plan in plans" :key="plan.id" :plan="plan" />
        </div>
        <p v-else>No plans to display. Why not create one?</p>
</div>

<Footer />
</template>

<style scoped>

</style>