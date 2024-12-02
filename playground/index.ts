import { Component } from 'vue';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: '/',
    redirect: '/table',
    children: [
      {
        path: 'table',
        name: 'Tree Table Docs',
        component: (): Promise<Component> =>
          import('./docs/datatable/TreeTableDocs.vue'),
      },
      {
        path: 'secondarytable',
        name: 'Data Table Secondary Docs',
        component: (): Promise<Component> =>
          import('./docs/datatable/DataTableSecondaryDocs.vue'),
      },
      {
        path: 'progressbar',
        name: 'ProgressBarDocs',
        component: (): Promise<Component> =>
          import('./docs/progressbar/ProgressBarDocs.vue'),
      },
      {
        path: 'animation',
        name: 'Lottie Animation Docs',
        component: (): Promise<Component> =>
          import('./docs/animation/AnimationDocs.vue'),
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
        path: 'dialog',
        name: 'Dialog Docs',
        component: (): Promise<Component> =>
          import('./docs/dialog/DialogDocs.vue'),
      },
      {
        path: 'dialogconfirm',
        name: 'Dialog Confirmation Docs',
        component: (): Promise<Component> =>
          import('./docs/dialog/DialogConfirmDocs.vue'),
      },
      {
        path: 'dialogdetailpbi',
        name: 'Dialog Detail PBI Docs',
        component: (): Promise<Component> =>
          import('./docs/dialogdetailpbi/DialogDetailPbiDocs.vue'),
      },
      {
        path: 'button',
        name: 'ButtonDocs',
        component: (): Promise<Component> =>
          import('./docs/button/ButtonDocs.vue'),
      },
      {
        path: 'buttondownload',
        name: 'ButtonDownloadDocs',
        component: (): Promise<Component> =>
          import('./docs/buttondownload/ButtonDownloadDocs.vue'),
      },
      {
        path: 'buttonradio',
        name: 'ButtonRadioDocs',
        component: (): Promise<Component> =>
          import('./docs/buttonradio/ButtonRadioDocs.vue'),
      },
      {
        path: 'timeline',
        name: 'TimelineDocs',
        component: (): Promise<Component> =>
          import('./docs/timeline/TimeLineDocs.vue'),
      },
      {
        path: 'imagecompressor',
        name: 'Image Compressor Docs',
        component: (): Promise<Component> =>
          import('./docs/image/ImageCompressorDocs.vue'),
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
        path: 'tabmenu/second-link',
        name: 'Tab Menu Second Link Docs',
        component: (): Promise<Component> =>
          import('./docs/tabmenu/TabMenuDocs.vue'),
        redirect: '/tabmenu/second-link/children',
        children: [
          {
            path: 'children',
            name: 'Tab Menu Second Link > Children Docs',
          },
          {
            path: 'children-2',
            name: 'Tab Menu Second Link > Children Docs 2',
          },
        ],
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
        path: 'quickfilter',
        name: 'Quick Filter Container Docs',
        component: (): Promise<Component> =>
          import('./docs/quickfilter/QuickFilterDocs.vue'),
      },
      {
        path: 'breadcrumb',
        name: 'Breadcrumb Docs',
        component: (): Promise<Component> =>
          import('./docs/breadcrumb/BreadcrumbDocs.vue'),
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
        path: 'codesnippet',
        name: 'Code Snippet Docs',
        component: (): Promise<Component> =>
          import('./docs/codesnippet/CodeSnippetDocs.vue'),
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
        path: 'inputbadge',
        name: 'InputBadgeDocs',
        component: (): Promise<Component> =>
          import('./docs/inputbadge/InputBadgeDocs.vue'),
      },
      {
        path: 'image',
        name: 'Image Docs',
        component: (): Promise<Component> =>
          import('./docs/image/ImageDocs.vue'),
      },
      {
        path: 'badge',
        name: 'Badge Docs',
        component: (): Promise<Component> =>
          import('./docs/badge/BadgeDocs.vue'),
      },
      {
        path: 'form',
        name: 'Form Docs',
        component: (): Promise<Component> => import('./docs/form/FormDocs.vue'),
      },
      {
        path: 'formatdate',
        name: 'Format Date Docs',
        component: (): Promise<Component> =>
          import('./docs/formatdate/FormatDateDocs.vue'),
      },
      {
        path: 'workcalendar',
        name: 'Work Calendar Docs',
        component: (): Promise<Component> =>
          import('./docs/calendar/WorkCalendarDocs.vue'),
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
      {
        path: 'inputcurrency',
        name: 'Input Currency Docs',
        component: (): Promise<Component> =>
          import('./docs/inputcurrency/InputCurrencyDocs.vue'),
      },
      {
        path: 'inputphonenumber',
        name: 'Input Phone Number Docs',
        component: (): Promise<Component> =>
          import('./docs/inputphonenumber/InputPhoneNumberDocs.vue'),
      },
      {
        path: 'inputemail',
        name: 'Input Email Docs',
        component: (): Promise<Component> =>
          import('./docs/inputemail/InputEmailDocs.vue'),
      },
      {
        path: 'toggle',
        name: 'ButtonToggle Docs',
        component: (): Promise<Component> =>
          import('./docs/buttontoggle/ButtonToggleDocs.vue'),
      },
      {
        path: 'inputpassword',
        name: 'Input Password Docs',
        component: (): Promise<Component> =>
          import('./docs/inputpassword/InputPasswordDocs.vue'),
      },
      {
        path: 'icon',
        name: 'Icon Docs',
        component: (): Promise<Component> => import('./docs/icon/IconDocs.vue'),
      },
      {
        path: 'changelog',
        name: 'Changelog Docs',
        component: (): Promise<Component> =>
          import('./docs/changelog/ChangelogDocs.vue'),
      },
      {
        path: 'changelogpage',
        name: 'ChangelogPage Docs',
        component: (): Promise<Component> =>
          import('./docs/changelogpage/ChangelogPageDocs.vue'),
      },
      {
        path: 'inputrepositoryname',
        name: 'InputRepositoryName Docs',
        component: (): Promise<Component> =>
          import('./docs/inputrepositoryname/InputRepositoryNameDocs.vue'),
      },
      {
        path: 'textarea',
        name: 'Textarea Docs',
        component: (): Promise<Component> =>
          import('./docs/textarea/TextareaDocs.vue'),
      },
      {
        path: 'comment',
        name: 'Comment Docs',
        component: (): Promise<Component> =>
          import('./docs/comment/CommentDocs.vue'),
      },
      {
        path: 'fileupload',
        name: 'FileUploadDocs',
        component: (): Promise<Component> =>
          import('./docs/fileupload/FileUploadDocs.vue'),
      },
      {
        path: 'detailtask',
        name: 'Detail Task Docs',
        component: (): Promise<Component> =>
          import('./docs/detailtask/DetailTaskDocs.vue'),
      },
      {
        path: 'tasktable',
        name: 'Task Table Docs',
        component: (): Promise<Component> =>
          import('./docs/tasktable/TaskTableDocs.vue'),
      },
      {
        path: 'detailmember',
        name: 'Detail member Docs',
        component: (): Promise<Component> =>
          import('./docs/detailmember/DetailMemberDocs.vue'),
      },
      {
        path: 'detailsprint',
        name: 'Detail Sprint Docs',
        component: (): Promise<Component> =>
          import('./docs/detailsprint/DetailSprintDocs.vue'),
      },
      {
        path: 'dialogAdjustmentTask',
        name: 'Dialog Adjustment Task',
        component: (): Promise<Component> =>
          import('./docs/dialogAdjustmentTask/DialogAdjustmentTaskDocs.vue'),
      },
      {
        path: 'notificationitem',
        name: 'Notification Item Docs',
        component: (): Promise<Component> =>
          import('./docs/notificationitem/NotificationItemDocs.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory((import.meta.env || process.env).BASE_URL),
  routes,
});

export default router;
