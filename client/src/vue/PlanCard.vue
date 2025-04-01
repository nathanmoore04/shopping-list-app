<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
    plan: Object,
});

const viewMeal = () => {
    router.push(`/plans/${props.plan.id}`);
}

</script>

<template>
    <div class="col-sm-6 col-md-4 col-lg-3 mb-1 d-flex justify-content-center">
        <div class="card">
            <div class="card-body">
                <h5 class="card-title fw-semibold">{{ plan.title }}</h5>
                <h6 class="card-subtitle text-body-secondary mb-2">{{ plan.start_date }} - {{ plan.end_date }}</h6>
                <p class="card-text">
                    {{ plan.meals.length }} meals
                </p>
                <button class="btn btn-primary" @click="viewMeal">View details</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card {
    transition: all 0.3s ease-in-out;
    min-width: 18rem;
}

.card:hover {
    transform: scale(1.02);
}
</style>