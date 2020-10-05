import { createApp } from 'vue';
import App from './App.vue';
import { route } from './router';
import 'reset-css';
import './assets/styles/main.scss';

const app = createApp(App)

app.use(route);

app.mount('#app');
