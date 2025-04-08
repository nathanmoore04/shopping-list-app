<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
    meal: Object,
    replaceButton: Boolean
});

const emit = defineEmits(['replace']);

const viewMeal = () => {
    router.push(`/meals/${props.meal.id}`);
}

</script>

<template>
    <div class="col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center mb-1">
        <div class="card">
            <img :src="meal.image" class="card-img-top" alt="..." v-if="meal.image">
            <div class="card-body">
                <h5 class="card-title fw-semibold">{{ meal.name }}</h5>
                <p v-if="meal.tags.length">
                    <span v-for="(tag, index) in meal.tags" :key="index"
                        class="badge bg-secondary me-2 d-inline-flex align-items-center px-2 py-1">
                        {{ tag }}
                    </span>
                </p>
                <p class="card-text">
                    {{ meal.ingredients.length }} ingredients
                </p>
                <button class="btn btn-primary me-1" @click="viewMeal">View details</button>
                <button v-if="replaceButton" class="btn btn-primary" @click="emit('replace')">Replace meal</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card {
    transition: transform 0.2s ease-in-out;
    min-width: 18rem;
}

.card:hover {
    transform: scale(1.02);
}
</style>