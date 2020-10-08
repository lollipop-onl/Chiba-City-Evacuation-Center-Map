import { createRouter, createWebHistory } from 'vue-router';
import { PAGES } from './const';

export const routerHistory = createWebHistory();

export const route = createRouter({
  history: routerHistory,
  routes: [
    {
      path: PAGES.LANDING_PAGE,
      component: () => import('./containers/LandingPage.vue'),
    },
    {
      path: PAGES.MAP,
      component: () => import('./containers/MapPage.vue'),
    },
    {
      path: PAGES.MAP_MENU,
      component: () => import('./containers/MapPage.vue'),
    },
    {
      path: PAGES.MAP_SHELTER,
      component: () => import('./containers/MapPage.vue'),
    },
  ],
});
