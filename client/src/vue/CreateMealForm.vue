<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const router = useRouter();

const mealName = ref('');
const newTag = ref('');
const tags = ref([])
const errorMessage = ref([]);
const ingredients = ref([]);
const newIngredient = ref({
    name: '',
    amount: null,
    unit: ''
});
const steps = ref('');
const imageFile = ref(null);
const imagePreview = ref(null);
const fileInput = ref(null);

const addTag = () => {
    if (newTag.value.trim() && !tags.value.includes(newTag.value.trim())) {
        tags.value.push(newTag.value.trim());
        newTag.value = '';
    }
}

const removeTag = (index) => {
    tags.value.splice(index, 1);
}

const addIngredient = () => {
    if (newIngredient.value.name.trim() && newIngredient.value.amount > 0) {
        ingredients.value.push({
            name: newIngredient.value.name,
            amount: newIngredient.value.amount,
            unit: newIngredient.value.unit
        });

        newIngredient.value = {
            name: '',
            amount: null,
            unit: ''
        }
    }
}

const removeIngredient = (index) => {
    ingredients.value.splice(index, 1);
}

const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        imageFile.value = file;
        imagePreview.value = URL.createObjectURL(file); // Preview the image
    }
}

const removeImage = () => {
    imageFile.value = null;
    imagePreview.value = null;

    if (fileInput.value) fileInput.value.value = '';
};

const submitMeal = async () => {
    // Form validation
    errorMessage.value = [];
    if (!mealName.value) errorMessage.value.push('Meal name is required.');

    if (ingredients.value.length === 0) errorMessage.value.push('Meal requires at least 1 ingredient.');

    if (!steps.value) errorMessage.value.push('Steps can\'t be empty.');

    if (errorMessage.value.length !== 0) return;

    // Construct form data object to be sent to server
    const formData = new FormData();

    formData.append("name", mealName.value);
    formData.append("tags", JSON.stringify(tags.value));
    formData.append("ingredients", JSON.stringify(ingredients.value));

    if (imageFile) formData.append("image", imageFile.value);

    formData.append("steps", steps.value);

    // Send form data to server
    const authStore = useAuthStore();
    const token = authStore.token;

    // Log contents
    for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
    }

    try {
        const response = await axios.post('http://127.0.0.1:3000/recipes', formData, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true
        });

        console.log(response.data);

        const mealId = response.data.id;

        router.push(`/meals/${mealId}`);
    } catch (err) {
        errorMessage.value.push('Error adding meal. Please try again.');
    }
}
</script>

<template>
    <div class="container-lg mt-5">
        <div class="row justify-content-center">
            <div class="col-md-6 col-12">
                <h1 class="fw-bold">Create a new meal</h1>
                <form @submit.prevent="submitMeal" @keydown.enter.prevent>
                    <div class="mb-3">
                        <label for="title" class="form-label fw-semibold">Meal title</label>
                        <input type="text" class="form-control" id="title" v-model="mealName" placeholder="Meal title">
                    </div>
                    <!-- <div class="mb-3">
                        <label class="form-label fw-semibold">Upload Image<span class="fw-light">
                                (optional)</span></label>
                        <input ref="fileInput" type="file" class="form-control" @change="handleImageUpload"
                            accept="image/*">
                        <div v-if="imagePreview" class="row mt-2 d-flex justify-content-start align-items-center">
                            <div class="col-4"><img :src="imagePreview" class="img-fluid rounded"
                                    style="max-height: 200px;"></div>
                            <div @click="removeImage" class="col" style="cursor: pointer;"><i
                                    class="bi bi-x text-danger"></i></div>
                        </div>
                    </div> -->
                    <div class="mb-3">
                        <label for="tags" class="form-label my-0 fw-semibold">Tags<span class="fw-light">
                                (optional)</span></label>
                        <div class="form-text mb-1">Add tags to better organize your meals and find them easily.</div>
                        <div class="d-flex input-group">
                            <input type="text" class="form-control" v-model="newTag" @keyup.enter="addTag"
                                placeholder="Type a tag and press Enter">
                            <button type="button" class="btn btn-primary" @click="addTag">Add</button>
                        </div>
                        <div class="mt-2">
                            <span v-for="(tag, index) in tags" :key="index"
                                class="badge bg-secondary me-2 d-inline-flex align-items-center px-2 py-1">
                                {{ tag }}
                                <button type="button" class="btn-close btn-close-white ms-1"
                                    @click="removeTag(index)"></button>
                            </span>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-semibold my-0">Ingredients</label>
                        <div class="form-text mb-1">Add at least one. You can always edit this list later.
                        </div>
                        <div class="input-group mb-2">
                            <input type="number" class="form-control" v-model.number="newIngredient.amount"
                                placeholder="Amount" min="1" />
                            <select class="form-select" v-model="newIngredient.unit">
                                <option value="" disabled selected>Unit</option>
                                <option value="">(no unit)</option>
                                <option value="g">g</option>
                                <option value="kg">kg</option>
                                <option value="oz">oz</option>
                                <option value="lb">lb</option>
                                <option value="cup">cup</option>
                                <option value="tbsp">tbsp</option>
                                <option value="tsp">tsp</option>
                            </select>
                            <input type="text" class="form-control" v-model="newIngredient.name"
                                placeholder="Ingredient name" @keyup.enter="addIngredient">
                            <button type="button" class="btn btn-primary" @click="addIngredient">Add</button>
                        </div>
                        <ul class="list-group">
                            <li v-for="(ingredient, index) in ingredients" :key="index"
                                class="list-group-item d-flex justify-content-between align-items-center border-0">
                                {{ ingredient.amount }} {{ ingredient.unit }} {{ ingredient.name }}
                                <div @click="removeIngredient(index)" style="cursor: pointer;"><i
                                        class="bi bi-x text-danger"></i></div>
                            </li>
                        </ul>
                    </div>
                    <div class="mb-1">
                        <label for="steps" class="form-label fw-semibold my-0">Steps</label>
                        <div class="form-text mb-1">Describe how to make your dish.</div>
                        <textarea class="form-control" v-model="steps"></textarea>
                    </div>
                    <p v-for="(message) in errorMessage" class="text-danger my-0">{{ message }}</p>
                    <button type="submit" class="btn btn-success w-100 mt-2">Save Meal</button>
                </form>
            </div>
        </div>
    </div>
</template>