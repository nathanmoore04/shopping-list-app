import { createWebHistory, createRouter } from 'vue-router';
import HomePage from '@/vue/HomePage.vue';
import LoginPage from '@/vue/LoginPage.vue';
import SignupPage from '@/vue/SignupPage.vue';
import DashboardPage from '@/vue/DashboardPage.vue';
import CreateMealPage from '@/vue/CreateMealPage.vue';
import MealDetails from '@/vue/MealDetails.vue';
import { useAuthStore } from '@/stores/auth';
import EditMeal from '@/vue/EditMeal.vue';
import CreatePlan from '@/vue/CreatePlan.vue';
import Meals from '@/vue/Meals.vue';
import Plans from '@/vue/Plans.vue';
import Account from '@/vue/Account.vue';
import EditPlan from '@/vue/EditPlan.vue';
import PlanDetailsParent from '@/vue/PlanDetailsParent.vue';

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
  {
    path: '/meals/create',
    component: CreateMealPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/meals/:id',
    component: MealDetails,
    meta: { requiresAuth: true }
  },
  {
    path: '/meals/edit/:id',
    component: EditMeal,
    meta: { requiresAuth: true }
  },
  {
    path: '/plans/create',
    component: CreatePlan,
    meta: { requiresAuth: true }
  },
  {
    path: '/plans/:id',
    component: PlanDetailsParent,
    meta: { requiresAuth: true }
  },
  {
    path: '/meals',
    component: Meals,
    meta: { requiresAuth: true }
  },
  {
    path: '/plans',
    component: Plans,
    meta: { requiresAuth: true }
  },
  {
    path: '/plans/edit/:id',
    component: EditPlan,
    meta: { requiresAuth: true }
  },
  {
    path: '/account',
    component: Account,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard to protect routes
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;

  if (to.meta.requiresAuth && !isAuthenticated) next('/login');
  else next();
});

export default router;