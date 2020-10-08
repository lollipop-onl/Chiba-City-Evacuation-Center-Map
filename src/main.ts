import { createApp } from 'vue';
import firebase from 'firebase';
import { debounce } from 'throttle-debounce';
import App from './App.vue';
import { route } from './router';
import 'firebase/analytics';
import 'reset-css';
import './assets/styles/main.scss';

firebase.initializeApp({
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
});

const analytics = firebase.analytics();

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

const app = createApp(App);

app.use(route);
app.mount('#app');

route.beforeEach((from, to, next) => {
  if (from.path === to.path) {
    return;
  }

  analytics.logEvent('screen_view', {
    app_name: location.host,
    screen_name: to.path,
  });

  next();
});
