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
  { 
    path: '/', 
    component: HomePage
  },
  { 
    path: '/login', 
    component: LoginPage,
    meta: {
      title: 'SmartMeal — Login'
    }
  },
  { 
    path: '/signup', 
    component: SignupPage,
    meta: {
      title: 'SmartMeal — Sign Up'
    }
  },
  {
    path: '/dashboard', 
    component: DashboardPage,
    // Protected route
    meta: { 
      requiresAuth: true,
      title: 'SmartMeal — Dashboard'
    }
  },
  {
    path: '/meals/create',
    component: CreateMealPage,
    meta: { 
      requiresAuth: true,
      title: 'SmartMeal — Create Meal'
    }
  },
  {
    path: '/meals/:id',
    component: MealDetails,
    meta: { 
      requiresAuth: true,
      title: 'SmartMeal — Meal Details'
    }
  },
  {
    path: '/meals/edit/:id',
    component: EditMeal,
    meta: { 
      requiresAuth: true,
      title: 'SmartMeal — Edit Meal'
    }
  },
  {
    path: '/plans/create',
    component: CreatePlan,
    meta: { 
      requiresAuth: true,
      title: 'SmartMeal — Create Plan'
    }
  },
  {
    path: '/plans/:id',
    component: PlanDetailsParent,
    meta: { 
      requiresAuth: true,
      title: 'SmartMeal — Plan Details'
    }
  },
  {
    path: '/meals',
    component: Meals,
    meta: { 
      requiresAuth: true,
      title: 'SmartMeal — Meals'
    }
  },
  {
    path: '/plans',
    component: Plans,
    meta: { 
      requiresAuth: true,
      title: 'SmartMeal — Plans'
    }
  },
  {
    path: '/plans/edit/:id',
    component: EditPlan,
    meta: { 
      requiresAuth: true,
      title: 'SmartMeal — Edit Plan'
    }
  },
  {
    path: '/account',
    component: Account,
    meta: { 
      requiresAuth: true,
      title: 'SmartMeal — Account'
    }
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

router.afterEach((to) => {
  const defaultTitle = 'SmartMeal';
  document.title = to.meta.title || defaultTitle;
});

export default router;