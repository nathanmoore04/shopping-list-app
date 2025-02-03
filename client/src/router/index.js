import { createWebHistory, createRouter } from 'vue-router';
import HomePage from '../vue/HomePage.vue';
import LoginPage from '../vue/LoginPage.vue';
import SignupPage from '../vue/SignupPage.vue';
import DashboardPage from '../vue/DashboardPage.vue';

// Map Vue components to URLs
const routes = [
  { path: '/', component: HomePage },
  { path: '/login', component: LoginPage },
  { path: '/signup', component: SignupPage },
  {
    path: '/dashboard', 
    component: DashboardPage,
    // Protected route
    meta: { requiresAuth: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;