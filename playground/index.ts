import { Component } from 'vue';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: '/',
    redirect: '/button',
    children: [
      {
        path: 'button',
        name: 'ButtonDocs',
        component: (): Promise<Component> =>
          import('./docs/button/ButtonDocs.vue'),
      },
      {
        path: 'typo',
        name: 'Typography Docs',
        component: (): Promise<Component> =>
          import('./docs/typography/TypographyDocs.vue'),
      },
      {
        path: 'card',
        name: 'Card Docs',
        component: (): Promise<Component> => import('./docs/card/CardDocs.vue'),
      },
      {
        path: 'tabmenu',
        name: 'Tab Menu Docs',
        component: (): Promise<Component> =>
          import('./docs/tabmenu/TabMenuDocs.vue'),
      },
      {
        path: 'menu',
        name: 'Menu Docs',
        component: (): Promise<Component> => import('./docs/menu/MenuDocs.vue'),
      },
      {
        path: 'filtercontainer',
        name: 'Filter Container Docs',
        component: (): Promise<Component> =>
          import('./docs/filtercontainer/FilterContainerDocs.vue'),
      },
      {
        path: 'breadcrumb',
        name: 'Breadcrumb Docs',
        component: (): Promise<Component> =>
          import('./docs/breadcrumb/BreadcrumbDocs.vue'),
      },
      {
        path: 'dialogconfirm',
        name: 'Dialog Confirmation Docs',
        component: (): Promise<Component> =>
          import('./docs/dialog/DialogConfirmDocs.vue'),
      },
      {
        path: 'datatable',
        name: 'DataTable Docs',
        component: (): Promise<Component> =>
          import('./docs/datatable/DataTableDocs.vue'),
      },
      {
        path: 'checkbox',
        name: 'Checbox Docs',
        component: (): Promise<Component> =>
          import('./docs/checkbox/CheckboxDocs.vue'),
      },
      {
        path: 'toast',
        name: 'Toast Docs',
        component: (): Promise<Component> =>
          import('./docs/toast/ToastDocs.vue'),
      },
      {
        path: 'inputtext',
        name: 'InputText Docs',
        component: (): Promise<Component> =>
          import('./docs/inputtext/InputTextDocs.vue'),
      },
      {
        path: 'badge',
        name: 'Badge Docs',
        component: (): Promise<Component> =>
          import('./docs/badge/BadgeDocs.vue'),
      },
      {
        path: 'username',
        name: 'UserName Docs',
        component: (): Promise<Component> =>
          import('./docs/username/UserNameDocs.vue'),
      },
      {
        path: 'form',
        name: 'Form Docs',
        component: (): Promise<Component> => import('./docs/form/FormDocs.vue'),
      },
      {
        path: 'dialogform',
        name: 'Dialog Form Docs',
        component: (): Promise<Component> =>
          import('./docs/dialog/DialogFormDocs.vue'),
      },
      {
        path: 'calendar',
        name: 'Calendar Docs',
        component: (): Promise<Component> =>
          import('./docs/calendar/CalendarDocs.vue'),
      },
      {
        path: 'multiselect',
        name: 'MultiSelect Docs',
        component: (): Promise<Component> =>
          import('./docs/multiselect/MultiSelectDocs.vue'),
      },
      {
        path: 'inputrangenumber',
        name: 'Input Range Number Docs',
        component: (): Promise<Component> =>
          import('./docs/inputrangenumber/InputRangeNumberDocs.vue'),
      },
      {
        path: 'inputnumber',
        name: 'Input Number Docs',
        component: (): Promise<Component> =>
          import('./docs/inputnumber/InputNumberDocs.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory((import.meta.env || process.env).BASE_URL),
  routes,
});

export default router;
