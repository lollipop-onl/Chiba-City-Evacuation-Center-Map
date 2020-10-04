import { createRouter, createWebHistory } from 'vue-router';
import { PAGES } from './const';
import LandingPage from '@/containers/LandingPage.vue';

export const routerHistory = createWebHistory();

export const route = createRouter({
  history: routerHistory,
  routes: [
    {
      path: PAGES.LANDING_PAGE,
      component: LandingPage
    },
  ],
});
