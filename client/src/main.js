import { createApp } from 'vue';
import App from '@/vue/App.vue';
import router from '@/router';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

createApp(App).use(router).mount('#app');
