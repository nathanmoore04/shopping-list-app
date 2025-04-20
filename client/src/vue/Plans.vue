<script setup>
import Navbar from './Navbar.vue';
import Footer from './Footer.vue';
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import PlanCard from './PlanCard.vue';
import axios from 'axios';

const authStore = useAuthStore();
const token = authStore.token;

const plans = ref([]);
const errorMessage = ref('');

const searchQuery = ref('');
const searched = ref(false);

const parseDate = (dateString) => {
    const shortenedDateString = dateString.split('T')[0];
    const dateComponents = shortenedDateString.split('-');

    const day = dateComponents[2].replace(/^0+/, '');
    const month = dateComponents[1].replace(/^0+/, '');
    const year = dateComponents[0];

    return month + '/' + day + '/' + year;
};

onMounted(async () => {
    const token = authStore.token;
    errorMessage.value = '';

    try {
        // Get all plans for user
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

const fetchResults = async () => {
    errorMessage.value = '';

    try {
        const response = await axios.get('http://127.0.0.1:3000/plans/search', {
            params: { q: searchQuery.value },
            headers: { Authorization: `Bearer ${token}` }
        });

        plans.value = response.data;

        for (const plan of plans.value) {
            plan.start_date = parseDate(plan.start_date);
            plan.end_date = parseDate(plan.end_date);
        }

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
                <h3 class="fw-bold">Your plans</h3>
            </div>
            <div class="col-8 col-md-6">
                <form class="d-flex pt-2" role="search" @submit.prevent>
                    <div class="input-group">
                        <input v-model="searchQuery" type="search" class="form-control" placeholder="Search plans..." />
                        <button class="btn btn-primary" @click="fetchResults"><i class="bi bi-search"></i></button>
                    </div>
                </form>
            </div>
            <div class="col-12 col-md-2">
                <RouterLink class="btn btn-outline-primary float-end" to="/plans/create">
                    Create new plan <i class="bi bi-arrow-right"></i>
                </RouterLink>
            </div>
        </div>
        <Transition name="fade">
            <div v-if="plans.length > 0" class="row align-items-start mt-2">
                <PlanCard v-for="plan in plans" :key="plan.id" :plan="plan" />
            </div>
        </Transition>
        <p v-if="!searched && plans.length === 0">No plans to display. Why not create one?</p>
        <p v-if="searched && plans.length === 0">No plans match your search query.</p>
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