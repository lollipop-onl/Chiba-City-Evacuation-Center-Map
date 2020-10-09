import { createApp } from 'vue';
import firebase from 'firebase/app';
import { debounce } from 'throttle-debounce';
import App from './App.vue';
import { router } from './router';
import 'firebase/analytics';
import 'reset-css';
import './assets/styles/main.scss';

firebase.initializeApp({
  apiKey: 'AIzaSyDY_r9YTM7pk7Vo4lIKGS1hc5BamwGrH6g',
  authDomain: 'chiba-shelter-map.firebaseapp.com',
  databaseURL: 'https://chiba-shelter-map.firebaseio.com',
  projectId: 'chiba-shelter-map',
  storageBucket: 'chiba-shelter-map.appspot.com',
  messagingSenderId: '1015192757918',
  appId: '1:1015192757918:web:f82d0962c418770b1c7d8f',
  measurementId: 'G-737K8N5Q2X',
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

router.beforeEach((to, from, next) => {
  if (from.matched.length > 0 && from.path === to.path) {
    return;
  }

  analytics.logEvent('screen_view', {
    app_name: location.host,
    screen_name: to.path,
    environment: import.meta.env.MODE,
  });

  next();
});

app.use(router);
app.mount('#app');
