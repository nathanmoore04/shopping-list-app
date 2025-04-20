<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const email = ref(authStore.email);
const name = ref(authStore.userName);
const errorMessage = ref('');
const successMessage = ref('');

const token = authStore.token;

const updateInfo = async () => {
    errorMessage.value = '';

    const userData = {
        email: email.value,
        name: name.value
    }

    try {
        const response = axios.put('http://127.0.0.1:3000/user', userData, {
            headers: { Authorization: `Bearer ${token}` }
        });

        authStore.updateName(name.value);

        successMessage.value = "Successfully updated user data!";
    } catch (err) {
        errorMessage.value = 'Error updating user data. Please try again.';
        console.error(err);
    }
};

const deleteUser = async () => {
    errorMessage.value = '';

    try {
        axios.delete('http://127.0.0.1:3000/user', {
            headers: { Authorization: `Bearer ${token}` }
        });

        authStore.logout();
        router.push("/");
    } catch (err) {
        errorMessage.value = 'Error deleting user data. Please try again.';
        console.error(err);
    }
};
</script>

<template>
<div class="container-lg mt-5">
    <div class="row justify-content-center">
        <div class="col-md-6 col-12">
            <h3 class="fw-bold">Account details</h3>
            <p class="text-danger" v-if="errorMessage">{{ errorMessage }}</p>
            <div class="mb-3">
                <label for="title" class="mb-1">Email address</label>
                <input type="text" class="form-control" v-model="email" disabled>
            </div>
            <div class="mb-3">
                <label for="title" class="mb-1">First name</label>
                <input type="text" class="form-control" v-model="name">
            </div>
            <div class="row mb-3 align-items-center">
                <div class="col-12 col-md-6">
                    <button class="btn btn-success w-100 mb-2" @click="updateInfo">Update info</button>
                </div>
                <div class="col-12 col-md-6">
                    <button class="btn btn-outline-danger w-100 mb-2" @click="deleteUser">Delete account</button>
                </div>
            </div>
            <p v-if="successMessage" class="text-success">{{ successMessage }}</p>
        </div>
    </div>
</div>
</template>

<style scoped>

</style>