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

const dialogAllowed = ref(true);

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
        <div class="modal fade" id="exampleModal" tabindex="-1" v-if="dialogAllowed">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Heads up!</h1>
                    </div>
                    <div class="modal-body">
                        Are you sure you want to delete your account? This will also delete all of your meals and plans, and can't be undone!
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-danger" data-bs-dismiss="modal"
                            @click="deleteUser">Confirm</button>
                    </div>
                </div>
            </div>
        </div>
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
                        <button class="btn btn-outline-danger w-100 mb-2" data-bs-toggle="modal" data-bs-target="#exampleModal">Delete account</button>
                    </div>
                </div>
                <p v-if="successMessage" class="text-success">{{ successMessage }}</p>
            </div>
        </div>
    </div>
</template>

<style scoped></style>