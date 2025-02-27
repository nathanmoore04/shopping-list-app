import { createApp } from 'vue';
import App from '@/vue/App.vue';
import router from '@/router';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap'
import '../node_modules/bootstrap-icons/font/bootstrap-icons.min.css';
import { createPinia } from 'pinia';

const pinia = createPinia();
const app = createApp(App);

app.use(router);
app.use(pinia);
app.mount('#app');
