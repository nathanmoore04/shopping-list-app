import { defineStore } from "pinia";

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user')) || null
    }),
    getters: {
        isAuthenticated: (state) => !!state.user,
        token: (state) => state.user.token || null,
        email: (state) => state.user.email || null,
        userName: (state) => state.user.name || null
    },
    actions: {
        login(userData) {
            this.user = userData;
            localStorage.setItem('user', JSON.stringify(userData)); // Persist login
        },
        logout() {
            this.user = null;
            localStorage.removeItem('user');
        }
    } 
});