<script setup>
import Navbar from './Navbar.vue';
import Footer from './Footer.vue';
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const token = authStore.token;

const router = useRouter();

const meals = ref([]);

// Form data
const planTitle = ref('');

const startDate = ref('');
const endDate = ref('');
const mealsPerDay = ref(0);

const tempExcludedDate = ref('');
const excludedDates = ref([]);

const requiredMeals = ref([]);
const excludedMeals = ref([]);

const errorMessages = ref([]);

onMounted(async () => {
    errorMessages.value = [];

    try {
        const response = await axios.get('http://127.0.0.1:3000/recipes', {
            headers: { Authorization: `Bearer ${token}` }
        });

        meals.value = response.data;

        console.log(meals.value);

        if (meals.value.length === 0) {
            const modal = document.getElementById('noMealsModal');
            const modalInstance = new Modal(modal, {
                backdrop: 'static',
                keyboard: false
            });
            modalInstance.show();
        }

    } catch (err) {
        console.error(err);
        errorMessages.value.push('Error fetching meal details. Please try again.');
    }
});

const numDays = computed(() => {
    if (!startDate.value || !endDate.value) return 0;

    const start = new Date(startDate.value);
    const end = new Date(endDate.value);

    const interval = (end - start) / (1000 * 60 * 60 * 24); // Convert to days

    return interval >= 0 ? interval + 1 : 0;
});

const numMeals = computed(() => {
    return (numDays.value - excludedDates.value.length) * mealsPerDay.value;
});

const addExcludedDate = () => {
    if (tempExcludedDate.value && !excludedDates.value.includes(tempExcludedDate.value)) {

        const splitDate = tempExcludedDate.value.split('-');
        const date = splitDate[1] + ' / ' + splitDate[2] + ' / ' + splitDate[0];

        console.log(date);

        excludedDates.value.push(date);
        tempExcludedDate.value = '';
    }
};

const removeExcludedDate = (index) => {
    excludedDates.value.splice(index, 1);
};

const submitPlan = async () => {
    errorMessages.value = [];

    if (!planTitle.value) errorMessages.value.push('Plan title is required.');
    if (numDays.value < 1) errorMessages.value.push('End date must be after start date.');
    if (numMeals.value < 1) errorMessages.value.push('Plan requires at least 1 meal.');
    if (requiredMeals.value.some(meal => excludedMeals.value.includes(meal))) {
        errorMessages.value.push('A meal cannot be both required and excluded.');
    }

    const formData = {
        start_date: startDate.value,
        end_date: endDate.value,
        meals_per_day: mealsPerDay.value,
        excluded_dates: excludedDates.value
    }

    const token = authStore.token;

    if (errorMessages.value.length > 0) return;

    try {
        await axios.post('http://127.0.0.1:3000/plans', formData, {
            headers: { Authorization: `Bearer ${token}` }
        });

        router.push('/dashboard');
    } catch (err) {
        console.error(err);
        errorMessages.value.push('Error submitting plan. Please try again.')
    }
};

</script>

<template>
    <Navbar />

    <div class="container-lg mt-5">
        <div class="row justify-content-center">
            <div class="col-md-6 col-12">
                <h1 class="fw-bold">Create a new plan</h1>

                <div class="modal fade" id="noMealsModal" tabindex="-1">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5" id="noMealsModalLabel">Heads up!</h1>
                            </div>
                            <div class="modal-body">
                                It looks like you don't have any meals, so we can't create a plan. Do you want to create
                                a new meal now?
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal"
                                    @click="router.push('/dashboard')">Back to dashboard</button>
                                <button type="button" class="btn btn-primary" data-bs-dismiss="modal"
                                    @click="router.push('/meals/create')">Create new meal</button>
                            </div>
                        </div>
                    </div>
                </div>

                <form @submit.prevent="submitPlan">
                    <div class="mb-3">
                        <label for="title" class="mb-1">Plan title</label>
                        <input type="text" class="form-control" id="title" v-model="planTitle" placeholder="Plan title">
                    </div>
                    <div>
                        <div class="row align-items-center">
                            <div class="col">
                                <label for="startDate" class="mb-1">Start date</label>
                                <input id="startDate" class="form-control" type="date" v-model="startDate" />
                            </div>
                            <div class="col">
                                <label for="endDate" class="mb-1">End date</label>
                                <input id="endDate" class="form-control" type="date" v-model="endDate" />
                            </div>
                        </div>
                        <div v-if="numDays >= 0" class="form-text fs-6 text-center mb-0 planLength">
                            Plan Length: <span class="fw-bold">{{ numDays }}</span> days
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="excludedDates">Exclude dates</label>
                        <div class="form-text mb-1 mt-0">Add dates to exclude in plan generation. Take a night off!
                        </div>
                        <div class="d-flex input-group">
                            <input type="date" class="form-control" v-model="tempExcludedDate" :min="startDate"
                                :max="endDate" />
                            <button class="btn btn-primary" @click="addExcludedDate">Add</button>
                        </div>
                        <ul class="list-group">
                            <li v-for="(date, index) in excludedDates" :key="index"
                                class="list-group-item d-flex justify-content-between align-items-center border-0">
                                {{ date }}
                                <div @click="removeExcludedDate(index)" style="cursor: pointer;">
                                    <i class="bi bi-x text-danger"></i>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="mb-3">
                        <label for="numMeals" class="mb-1">Meals per day</label>
                        <div class="row align-items-center">
                            <div class="col-sm-6 col-12">
                                <input id="numMeals" class="form-control" type="number" v-model="mealsPerDay" />
                            </div>
                            <div class="col-sm-6 col-12">
                                <div class="form-text my-0">We'll generate a total of {{ numMeals }} meals</div>
                            </div>
                        </div>
                    </div>
                    <div class="row align-items-center mb-3">
                        <div class="col-md-6 col-12">
                            <label for="requiredMeals" class="form-label mb-0">Required Meals</label>
                            <div class="form-text mb-1 mt-0">Select the meals that should be included</div>
                            <div class="dropdown">
                                <button class="btn btn-secondary dropdown-toggle w-100" type="button" data-bs-toggle="dropdown"
                                    aria-expanded="false">
                                    Select required meals
                                </button>
                                <ul class="dropdown-menu w-100">
                                    <li v-for="meal in meals" :key="meal.id">
                                        <label class="dropdown-item">
                                            <input type="checkbox" v-model="requiredMeals" :value="meal.id">
                                            {{ meal.name }}
                                        </label>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="col-md-6 col-12">
                            <label for="excludedMeals" class="form-label mb-0">Excluded Meals</label>
                            <div class="form-text mb-1 mt-0">Select meals that should <span class="fw-bold">not</span> be included</div>
                            <div class="dropdown">
                                <button class="btn btn-secondary dropdown-toggle w-100" type="button" data-bs-toggle="dropdown"
                                    aria-expanded="false">
                                    Select excluded meals
                                </button>
                                <ul class="dropdown-menu w-100">
                                    <li v-for="meal in meals" :key="meal.id">
                                        <label class="dropdown-item">
                                            <input type="checkbox" v-model="excludedMeals" :value="meal.id">
                                            {{ meal.name }}
                                        </label>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <p v-for="error in errorMessages" class="text-danger my-0">
                        {{ error }}
                    </p>
                    <button type="submit" class="btn btn-success w-100 mt-3">Submit Plan</button>
                </form>

            </div>
        </div>
    </div>

    <Footer />
</template>

<style scoped>
.planLength {
    color: var(--bs-body-color);
    transition: all ease-in-out 0.1s;
}
</style>