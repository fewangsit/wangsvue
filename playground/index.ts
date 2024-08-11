import { Component } from 'vue';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: '/wangsvue/button',
    name: 'ButtonDocs',
    component: (): Promise<Component> => import('./docs/button/ButtonDocs.vue'),
  },
  {
    path: '/wangsvue/typo',
    name: 'Typography Docs',
    component: (): Promise<Component> =>
      import('./docs/typography/TypographyDocs.vue'),
  },
  {
    path: '/wangsvue/card',
    name: 'Card Docs',
    component: (): Promise<Component> => import('./docs/card/CardDocs.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
