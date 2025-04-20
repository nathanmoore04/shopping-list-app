<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import MealCard from './MealCard.vue';
import { Modal } from 'bootstrap';

const router = useRouter();
const route = useRoute();
const plan = ref(null);
const errorMessage = ref('');

const dialogAllowed = ref(true);

// User token
const authStore = useAuthStore();
const token = authStore.token;

const availableMeals = ref([]);

// Refs to track the current replacement context:
const replaceModalRef = ref(null);
let modalInstance = null;

const currentDayDate = ref('');
const currentMealIndex = ref(null);
const selectedReplacementMealId = ref(null);

const changedDays = ref([]);

const emit = defineEmits(['list']);

onMounted(async () => {
    try {
        const response = await axios.get(`http://127.0.0.1:3000/plans/${route.params.id}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        plan.value = response.data;

        const mealResponse = await axios.get('http://127.0.0.1:3000/recipes',
            { headers: { Authorization: `Bearer ${token}` } }
        );

        availableMeals.value = mealResponse.data;
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
                const ingredientName = ingredient.name.toLowerCase();
                const key = `${ingredientName}-${ingredient.unit}`; // Unique key per ingredient-unit pair

                if (ingredientMap[key]) {
                    ingredientMap[key].amount += ingredient.amount;
                } else {
                    ingredientMap[key] = {
                        name: ingredientName,
                        amount: ingredient.amount,
                        unit: ingredient.unit
                    };
                }
            });
        });
    });

    emit('list', ingredientMap, plan.value.title);
}

// Open the modal for replacing a meal:
const openReplaceModal = (dayDate, mealIndex) => {
    currentDayDate.value = dayDate;
    currentMealIndex.value = mealIndex;
    selectedReplacementMealId.value = null;

    if (replaceModalRef.value) {
        modalInstance = new Modal(replaceModalRef.value, { backdrop: 'static' });
        modalInstance.show();
    }
};

const closeReplaceModal = () => {
    // Reset current context after modal is closed
    if (modalInstance) {
        modalInstance.hide();
    }

    currentDayDate.value = '';
    currentMealIndex.value = null;
    selectedReplacementMealId.value = null;
};

// Apply the replacement once the user selects a new meal:
const applyReplacementMeal = () => {
    if (!selectedReplacementMealId.value) return;

    // Find the day object for the given date
    const dayIndex = plan.value.days.findIndex(d => d.date === currentDayDate.value);

    if (dayIndex !== -1 && currentMealIndex.value !== null) {
        // Find the meal in availableMeals to ensure we have full meal details
        const newMeal = availableMeals.value.find(m => m.id === selectedReplacementMealId.value);
        if (newMeal && newMeal.id !== plan.value.days[dayIndex].meals[currentMealIndex.value].id) {
            // Replace the meal at the given index
            plan.value.days[dayIndex].meals.splice(currentMealIndex.value, 1, newMeal);
            changedDays.value.push({
                date: plan.value.days[dayIndex].date.split('T')[0],
                meals: plan.value.days[dayIndex].meals
            });
        }
    }
    closeReplaceModal();
};

// Save the updated plan to the backend
const savePlanChanges = async () => {
    errorMessage.value = '';

    try {
        await axios.put(`http://127.0.0.1:3000/plans/${route.params.id}`, changedDays.value, {
            headers: { 
                Authorization: `Bearer ${token}`, 
                'Content-Type': 'application/json'
            }
        });

        changedDays.value = [];
        router.push(`/plans/${route.params.id}`);
    } catch (err) {
        console.error(err);
        errorMessage.value = 'Error updating plan. Please try again.';
    }
};

const deletePlan = async () => {
    errorMessage.value = '';

    try {
        await axios.delete(`http://127.0.0.1:3000/plans/${route.params.id}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        dialogAllowed.value = false;
        router.push('/dashboard');
    } catch (err) {
        console.error(err);
        errorMessage.value = 'Error deleting plan. Please try again.';
        dialogAllowed.value = true;
    }
}

</script>

<template>
    <p v-if="errorMessage" class="text-danger">{{ errorMessage }}</p>
    <div class="container mt-2" v-if="plan">
        <div class="row justify-content-between align-items-center">
            <div class="col">
                <h1 class="fw-bold">{{ plan.title }}</h1>
            </div>
            <div class="col">
                <button class="btn btn-primary float-end mb-1" @click="generateShoppingList">Generate Shopping List</button>
                <button class="btn btn-danger float-end me-1" data-bs-toggle="modal"
                    data-bs-target="#exampleModal">Delete Plan</button>
            </div>
        </div>

        <!-- Modal code as-is -->
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
                        <button type="button" class="btn btn-danger" data-bs-dismiss="modal"
                            @click="deletePlan">Confirm</button>
                    </div>
                </div>
            </div>
        </div>

        <p>{{ parseDate(plan.start_date) }} to {{ parseDate(plan.end_date) }}</p>
        <h4 class="fw-bold mb-0">Plan meals</h4>

        <div v-for="(day, dayIndex) in plan.days" :key="day.date" class="plan-day">
            <h6>{{ parseDate(day.date) }}</h6>
            <div class="row align-items-start mt-2">
                <MealCard v-for="meal in day.meals" :key="meal.id" :meal="meal" :replace-button="true"
                    @replace="openReplaceModal(day.date, day.meals.findIndex(m => m.id === meal.id))" />
            </div>
        </div>

        <!-- Replacement Meal Selection Modal -->
        <div class="modal fade" id="replaceMealModal" tabindex="-1" ref="replaceModalRef"
            aria-labelledby="replaceMealModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="replaceMealModalLabel">Select a Replacement Meal</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                            @click="closeReplaceModal"></button>
                    </div>
                    <div class="modal-body">
                        <select v-model="selectedReplacementMealId" class="form-select">
                            <option v-for="meal in availableMeals" :key="meal.id" :value="meal.id">
                                {{ meal.name }}
                            </option>
                        </select>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
                            @click="closeReplaceModal">Cancel</button>
                        <button type="button" class="btn btn-primary" @click="applyReplacementMeal">Apply</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="container">
        <p>Loading plan details...</p>
    </div>
    <Transition name="save">
        <div class="sticky-bottom text-center bg-secondary py-2" style="--bs-bg-opacity: .5;" v-if="changedDays.length > 0">
            <h6 class="fw-bold">You have unsaved changes.</h6>
            <button class="btn btn-success" @click="savePlanChanges">Save changes</button>
        </div>
    </Transition>
</template>


<style scoped>
.save-enter-from, .save-leave-to {
    opacity: 0;
}

.save-enter-active, .save-leave-active {
    transition: opacity 0.1s ease-in-out;
}
</style>