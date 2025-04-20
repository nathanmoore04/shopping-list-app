<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';
import Navbar from './Navbar.vue';
import Footer from './Footer.vue';
import MealCard from './MealCard.vue';
import PlanCard from './PlanCard.vue';

const authStore = useAuthStore();

const showMotd = ref(false);
const motdBackground = ref('');

const errorMessage = ref('');
const meals = ref([]);
const plans = ref([]);

const userName = ref('');

const motd = ref('');
const randomMessages = [
    "A little planning today saves a lot of stress tomorrow. Happy meal prepping!",
    "Great meals start with great plans. What’s cooking this week?",
    "Healthy eating doesn’t have to be hard—your meal plan is your roadmap!",
    "Spend less time wondering what to eat and more time enjoying your food!",
    "A well-planned meal is half the work done. Keep up the great work!",
    "Good food brings people together—what’s on your table this week?",
    "Meal planning today means stress-free dining all week long!",
    "Your future self will thank you for today’s meal planning efforts!",
    "No more 'What’s for dinner?' panic—your plan has it covered!",
    "Plan your meals, shop with purpose, and enjoy stress-free cooking!",
];

const greeting = ref('');

const parseDate = (dateString) => {
    const shortenedDateString = dateString.split('T')[0];
    const dateComponents = shortenedDateString.split('-');

    const day = dateComponents[2].replace(/^0+/, '');
    const month = dateComponents[1].replace(/^0+/, '');
    const year = dateComponents[0];

    return month + '/' + day + '/' + year;
}

const getMOTD = () => {
    if (meals.value.length === 0) motd.value = "It looks like you don't have any meals. Why not create one now?";
    else if (plans.value.length === 0) motd.value = "It looks like you haven't made a plan yet. Why not make one now?";
    else {
        motd.value = randomMessages[Math.floor(Math.random() * randomMessages.length)];
    }
};

const getGreeting = () => {
    const d = new Date();

    if (d.getHours() < 11) {
        greeting.value = "Good morning";
        motdBackground.value = 'images/background-4.jpg';
    } else if (d.getHours() < 17) {
        greeting.value = "Good afternoon";
        motdBackground.value = 'images/background-1.jpg';
    } else {
        greeting.value = "Good evening";
        motdBackground.value = 'images/background-3.jpg';
    }
};

onMounted(async () => {
    const token = authStore.token;
    errorMessage.value = '';
    showMotd.value = true;

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

    getMOTD();
    getGreeting();
});
</script>

<template>
    <p v-if="errorMessage" class="text-danger">{{ errorMessage }}</p>
    <Transition name="fade-slide-in">
        <div v-if="showMotd" class="text-center motd" :style="{
            backgroundImage: `url(${motdBackground})`
        }">
            <div class="motd-overlay py-5 text-light">
                <h1 class="fw-bold">{{ greeting }}<span v-if="userName">, {{ userName }}</span>!
                </h1>
                <h3>{{ motd }}</h3>
                <div class="row justify-content-center mt-3">
                    <div class="col col-md-3">
                        <RouterLink class="btn btn-outline-primary btn float-end text-light" to="/meals/create">Create a new meal
                        </RouterLink>
                    </div>
                    <div class="col col-md-3">
                        <RouterLink class="btn btn-primary btn float-start" to="/plans/create">Create a new plan
                        </RouterLink>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
    <Transition name="fade">
        <div v-if="showMotd" class="container">
            <div class="row mt-3 justify-content-between align-items-center">
                <div class="col-3">
                    <h3 class="fw-bold">Dashboard</h3>
                </div>
            </div>
            <div class="row mt-2">
                <div class="col-8">
                    <h4 class="fw-bold">Your recent meals</h4>
                </div>
                <div class="col">
                    <RouterLink class="btn btn-outline-primary float-end" to="/meals">
                        See all meals <i class="bi bi-arrow-right"></i>
                    </RouterLink>
                </div>
            </div>
            <div v-if="meals.length > 0" class="row align-items-start mt-2">
                <MealCard v-for="(meal, index) in meals" :key="meal.id" :meal="meal" />
            </div>
            <p v-else>No meals to display.</p>
            <div class="row mt-2">
                <div class="col">
                    <h4 class="fw-bold">Your recent plans</h4>
                </div>
                <div class="col">
                    <RouterLink class="btn btn-outline-primary float-end" to="/plans">
                        See all plans <i class="bi bi-arrow-right"></i>
                    </RouterLink>
                </div>
            </div>
            <div v-if="plans.length > 0" class="row align-items-start mt-2">
                <PlanCard v-for="plan in plans" :key="plan.id" :plan="plan" />
            </div>
            <p v-else>No plans to display.</p>
        </div>
    </Transition>
</template>

<style scoped>
.motd {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

.motd-overlay {
    background-color: rgba(0, 0, 0, 0.5);
    /* adjustable darkness */
    padding: 1.5rem 2rem;
    width: 100%;
    height: 100%;
    text-align: center;
}

.fade-slide-in-enter-from {
    opacity: 0;
    transform: translateX(-20px)
}

.fade-slide-in-enter-active {
    transition: all 0.6s ease;
}

.fade-enter-from {
    opacity: 0;
}

.fade-enter-to {
    transition: all 1s ease;
}
</style>