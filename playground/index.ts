import { Component } from 'vue';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: '/',
    redirect: '/table',
    children: [
      {
        path: 'table', // X
        name: 'Tree Table Docs',
        component: (): Promise<Component> =>
          import('./docs/datatable/TreeTableDocs.vue'),
      },
      {
        path: 'dropdown',
        name: 'Dropdown Docs',
        component: (): Promise<Component> =>
          import('./docs/dropdown/DropdownDocs.vue'),
      },
      {
        path: 'calendar',
        name: 'Calendar Docs',
        component: (): Promise<Component> =>
          import('./docs/calendar/CalendarDocs.vue'),
      },
      {
        path: 'projectsummary',
        name: 'Project Summary Docs',
        component: (): Promise<Component> =>
          import('./docs/projectsummary/ProjectSummaryDocs.vue'),
      },
      {
        path: 'inputurl',
        name: 'Input URL Docs',
        component: (): Promise<Component> =>
          import('./docs/inputurl/InputURLDocs.vue'),
      },
      {
        path: 'username',
        name: 'UserName Docs',
        component: (): Promise<Component> =>
          import('./docs/username/UserNameDocs.vue'),
      },
      {
        path: 'dialogform',
        name: 'Dialog Form Docs',
        component: (): Promise<Component> =>
          import('./docs/dialog/DialogFormDocs.vue'),
      },
      {
        path: 'editor',
        name: 'Editor Docs',
        component: (): Promise<Component> =>
          import('./docs/editor/EditorDocs.vue'),
      },
      {
        path: 'dialogconfirm',
        name: 'Dialog Confirmation Docs',
        component: (): Promise<Component> =>
          import('./docs/dialog/DialogConfirmDocs.vue'),
      },

      {
        path: 'button',
        name: 'ButtonDocs',
        component: (): Promise<Component> =>
          import('./docs/button/ButtonDocs.vue'),
      },
      {
        path: 'timeline',
        name: 'TimelineDocs',
        component: (): Promise<Component> =>
          import('./docs/timeline/TimeLineDocs.vue'),
      },

      {
        path: 'imagecompressor',
        name: 'Image Docs',
        component: (): Promise<Component> =>
          import('./docs/image/ImageCompressorDocs.vue'),
      },
      /*
       * {
       *   path: 'button',
       *   name: 'ButtonDocs',
       *   component: (): Promise<Component> =>
       *     import('./docs/button/ButtonDocs.vue'),
       * },
       * {
       *   path: 'typo',
       *   name: 'Typography Docs',
       *   component: (): Promise<Component> =>
       *     import('./docs/typography/TypographyDocs.vue'),
       * },
       * {
       *   path: 'card',
       *   name: 'Card Docs',
       *   component: (): Promise<Component> => import('./docs/card/CardDocs.vue'),
       * },
       * {
       *   path: 'tabmenu',
       *   name: 'Tab Menu Docs',
       *   component: (): Promise<Component> =>
       *     import('./docs/tabmenu/TabMenuDocs.vue'),
       * },
       * {
       *   path: 'menu',
       *   name: 'Menu Docs',
       *   component: (): Promise<Component> => import('./docs/menu/MenuDocs.vue'),
       * },
       * {
       *   path: 'filtercontainer',
       *   name: 'Filter Container Docs',
       *   component: (): Promise<Component> =>
       *     import('./docs/filtercontainer/FilterContainerDocs.vue'),
       * },
       * {
       *   path: 'quickfilter',
       *   name: 'Quick Filter Container Docs',
       *   component: (): Promise<Component> =>
       *     import('./docs/quickfilter/QuickFilterDocs.vue'),
       * },
       * {
       *   path: 'breadcrumb',
       *   name: 'Breadcrumb Docs',
       *   component: (): Promise<Component> =>
       *     import('./docs/breadcrumb/BreadcrumbDocs.vue'),
       * },
       * {
       *   path: 'dialogconfirm',
       *   name: 'Dialog Confirmation Docs',
       *   component: (): Promise<Component> =>
       *     import('./docs/dialog/DialogConfirmDocs.vue'),
       * },
       * {
       *   path: 'dialog',
       *   name: 'Dialog Docs',
       *   component: (): Promise<Component> =>
       *     import('./docs/dialog/DialogDocs.vue'),
       * },
       * {
       *   path: 'datatable', // X
       *   name: 'DataTable Docs',
       *   component: (): Promise<Component> =>
       *     import('./docs/datatable/DataTableDocs.vue'),
       * },
       * {
       *   path: 'table', // X
       *   name: 'Tree Table Docs',
       *   component: (): Promise<Component> =>
       *     import('./docs/datatable/TreeTableDocs.vue'),
       * },
       * {
       *   path: 'checkbox',
       *   name: 'Checbox Docs',
       *   component: (): Promise<Component> =>
       *     import('./docs/checkbox/CheckboxDocs.vue'),
       * },
       * {
       *   path: 'toast',
       *   name: 'Toast Docs',
       *   component: (): Promise<Component> =>
       *     import('./docs/toast/ToastDocs.vue'),
       * },
       * {
       *   path: 'inputtext',
       *   name: 'InputText Docs',
       *   component: (): Promise<Component> =>
       *     import('./docs/inputtext/InputTextDocs.vue'),
       * },
       * {
       *   path: 'image', // X
       *   name: 'Image Docs',
       *   component: (): Promise<Component> =>
       *     import('./docs/image/ImageDocs.vue'),
       * },
       * {
       *   path: 'imagecompressor',
       *   name: 'Image Docs',
       *   component: (): Promise<Component> =>
       *     import('./docs/image/ImageCompressorDocs.vue'),
       * },
       * {
       *   path: 'badge',
       *   name: 'Badge Docs',
       *   component: (): Promise<Component> =>
       *     import('./docs/badge/BadgeDocs.vue'),
       * },
       * {
       *   path: 'username',
       *   name: 'UserName Docs',
       *   component: (): Promise<Component> =>
       *     import('./docs/username/UserNameDocs.vue'),
       * },
       * {
       *   path: 'form',
       *   name: 'Form Docs',
       *   component: (): Promise<Component> => import('./docs/form/FormDocs.vue'),
       * },
       * {
       *   path: 'calendar',
       *   name: 'Calendar Docs',
       *   component: (): Promise<Component> =>
       *     import('./docs/calendar/CalendarDocs.vue'),
       * },
       * {
       *   path: 'workcalendar',
       *   name: 'Work Calendar Docs',
       *   component: (): Promise<Component> =>
       *     import('./docs/calendar/WorkCalendarDocs.vue'),
       * },
       * {
       *   path: 'multiselect',
       *   name: 'MultiSelect Docs',
       *   component: (): Promise<Component> =>
       *     import('./docs/multiselect/MultiSelectDocs.vue'),
       * },
       * {
       *   path: 'inputrangenumber',
       *   name: 'Input Range Number Docs',
       *   component: (): Promise<Component> =>
       *     import('./docs/inputrangenumber/InputRangeNumberDocs.vue'),
       * },
       * {
       *   path: 'dropdown',
       *   name: 'Dropdown Docs',
       *   component: (): Promise<Component> =>
       *     import('./docs/dropdown/DropdownDocs.vue'),
       * },
       * {
       *   path: 'inputnumber',
       *   name: 'Input Number Docs',
       *   component: (): Promise<Component> =>
       *     import('./docs/inputnumber/InputNumberDocs.vue'),
       * },
       * {
       *   path: 'inputphonenumber',
       *   name: 'Input Phone Number Docs',
       *   component: (): Promise<Component> =>
       *     import('./docs/inputphonenumber/InputPhoneNumberDocs.vue'),
       * },
       * {
       *   path: 'inputemail',
       *   name: 'Input Email Docs',
       *   component: (): Promise<Component> =>
       *     import('./docs/inputemail/InputEmailDocs.vue'),
       * },
       * {
       *   path: 'toggle',
       *   name: 'ButtonToggle Docs',
       *   component: (): Promise<Component> =>
       *     import('./docs/buttontoggle/ButtonToggleDocs.vue'),
       * },
       * {
       *   path: 'inputpassword',
       *   name: 'Input Password Docs',
       *   component: (): Promise<Component> =>
       *     import('./docs/inputpassword/InputPasswordDocs.vue'),
       * },
       * {
       *   path: 'icon',
       *   name: 'Icon Docs',
       *   component: (): Promise<Component> => import('./docs/icon/IconDocs.vue'),
       * },
       * {
       *   path: 'changelog', // X
       *   name: 'Changelog Docs',
       *   component: (): Promise<Component> =>
       *     import('./docs/changelog/ChangelogDocs.vue'),
       * },
       */
    ],
  },
];

const router = createRouter({
  history: createWebHistory((import.meta.env || process.env).BASE_URL),
  routes,
});

export default router;
