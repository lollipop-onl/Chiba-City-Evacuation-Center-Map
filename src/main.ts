import { createApp } from 'vue';
import { debounce } from 'throttle-debounce';
import App from './App.vue';
import { route } from './router';
import 'reset-css';
import './assets/styles/main.scss';

const setBaseVh = debounce(100, (): void => {
  const vh = window.innerHeight * 0.01;
  const { documentElement } = document;

  if (documentElement instanceof HTMLElement) {
    documentElement.style.setProperty('--vh', `${vh}px`);
  }
});

window.addEventListener('resize', setBaseVh);
setBaseVh();

window.addEventListener('load', () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
});

const app = createApp(App)

app.use(route);

app.mount('#app');
