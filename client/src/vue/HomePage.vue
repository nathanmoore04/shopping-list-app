<script setup>
import Navbar from './Navbar.vue';
import Footer from './Footer.vue';
import { ref, onMounted } from 'vue';

const show = ref(false);

onMounted(() => {
    setTimeout(() => {
        show.value = true;
    }, 100);
});
</script>

<template>
    <Navbar />
    <Transition name="hero">
        <div v-if="show" class="bg-body-secondary py-4">
            <div class="container">
                <h1 class="fw-bold" style="font-size: clamp(24pt, 8vw, 72pt);">Plan Smarter, Eat Better</h1>
                <h1 class="fw-light" style="font-size: clamp(16pt, 4vw, 24pt);">Your personal meal planner, recipe organizer,
                    and shopping list generator — all in one.</h1>
                <div class="row justify-content-start">
                    <RouterLink to="/signup" class="col-2 btn btn-primary btn-lg my-3 mx-3">Get started</RouterLink>
                    <!-- <a href="#learn-more" class="col-2 btn btn-outline-primary btn-lg ms-2 my-3">How it works</a> -->
                </div>
            </div>
        </div>
    </Transition>
    <Transition name="details" appear>
        <div v-if="show" class="container mt-5">
            <div class="row align-items-center">
                <p class="col col-md-6">Build custom meal plans, save your favorite recipes, and generate smart grocery
                    lists in seconds. Designed to simplify your planning and save you time.</p>
            </div>
            <div id="learn-more" class="row align-items-center">
                <h2 class="fw-bolder">How it works</h2>
                <h4>1. Create an account</h4>
                <p>Start by signing up to save your meals and plans.</p>
        
                <h4>2. Add your recipes</h4>
                <p>Add your favorite meals with ingredients and steps.  Optionally, add tags to organize and easily search for them later.</p>
                <h4>3. Build a meal plan</h4>
                <p>Set a date range, choose meals to include or exclude, skip days to eat out, and let us generate a customizable meal plan for you.</p>
                <h4>4. Generate your shopping list</h4>
                <p>Automatically get a shopping list with the combined ingredients for your plan — ready to print or use on your phone.</p>
            </div>
        </div>
    </Transition>
    <Transition name="footer">
        <Footer v-if="show"></Footer>
    </Transition>
</template>

<style scoped>
p {
    font-size: 14pt;
}

.hero-enter-active {
  transition: all 0.3s ease-out;
}

.details-enter-active {
    transition: all 0.6s ease-out;
}

.footer-enter-active {
    transition: all 0.8s ease-out;
}

.hero-enter-from, 
.details-enter-from {
    transform: translateX(-20px);
    opacity: 0;
}

.footer-enter-from {
    opacity: 0;
}
</style>