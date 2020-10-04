import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from './containers/LandingPage.vue';

export const routerHistory = createWebHistory();

export const route = createRouter({
  history: routerHistory,
  routes: [
    {
      path: '/',
      component: LandingPage
    },
  ],
});
