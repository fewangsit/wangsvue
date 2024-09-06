import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import TreeTableDocs from './docs/datatable/TreeTableDocs.vue';
import DropdownDocs from './docs/dropdown/DropdownDocs.vue';
import CalendarDocs from './docs/calendar/CalendarDocs.vue';
import ProjectSummaryDocs from './docs/projectsummary/ProjectSummaryDocs.vue';
import InputURLDocs from './docs/inputurl/InputURLDocs.vue';
import UserNameDocs from './docs/username/UserNameDocs.vue';
import DialogFormDocs from './docs/dialog/DialogFormDocs.vue';
import EditorDocs from './docs/editor/EditorDocs.vue';
import DialogConfirmDocs from './docs/dialog/DialogConfirmDocs.vue';
import ButtonDocs from './docs/button/ButtonDocs.vue';
import TimeLineDocs from './docs/timeline/TimeLineDocs.vue';
import ImageCompressorDocs from './docs/image/ImageCompressorDocs.vue';
import TypographyDocs from './docs/typography/TypographyDocs.vue';
import CardDocs from './docs/card/CardDocs.vue';
import TabMenuDocs from './docs/tabmenu/TabMenuDocs.vue';
import MenuDocs from './docs/menu/MenuDocs.vue';
import FilterContainerDocs from './docs/filtercontainer/FilterContainerDocs.vue';
import QuickFilterDocs from './docs/quickfilter/QuickFilterDocs.vue';
import BreadcrumbDocs from './docs/breadcrumb/BreadcrumbDocs.vue';
import DataTableDocs from './docs/datatable/DataTableDocs.vue';
import CheckboxDocs from './docs/checkbox/CheckboxDocs.vue';
import ToastDocs from './docs/toast/ToastDocs.vue';
import InputTextDocs from './docs/inputtext/InputTextDocs.vue';
import ImageDocs from './docs/image/ImageDocs.vue';
import BadgeDocs from './docs/badge/BadgeDocs.vue';
import FormDocs from './docs/form/FormDocs.vue';
import WorkCalendarDocs from './docs/calendar/WorkCalendarDocs.vue';
import MultiSelectDocs from './docs/multiselect/MultiSelectDocs.vue';
import InputRangeNumberDocs from './docs/inputrangenumber/InputRangeNumberDocs.vue';
import InputNumberDocs from './docs/inputnumber/InputNumberDocs.vue';
import InputPhoneNumberDocs from './docs/inputphonenumber/InputPhoneNumberDocs.vue';
import InputEmailDocs from './docs/inputemail/InputEmailDocs.vue';
import ButtonToggleDocs from './docs/buttontoggle/ButtonToggleDocs.vue';
import InputPasswordDocs from './docs/inputpassword/InputPasswordDocs.vue';
import IconDocs from './docs/icon/IconDocs.vue';
import ChangelogDocs from './docs/changelog/ChangelogDocs.vue';
import ChangelogPageDocs from './docs/changelogpage/ChangelogPageDocs.vue';
import CodeSnippetDocs from './docs/codesnippet/CodeSnippetDocs.vue';
import InputRepositoryNameDocs from './docs/inputrepositoryname/InputRepositoryNameDocs.vue';
import TextareaDocs from './docs/textarea/TextareaDocs.vue';

const routes: Readonly<RouteRecordRaw[]> = [
  {
    path: '/',
    redirect: '/table',
    children: [
      {
        path: 'table',
        name: 'Tree Table Docs',
        component: TreeTableDocs,
      },
      {
        path: 'dropdown',
        name: 'Dropdown Docs',
        component: DropdownDocs,
      },
      {
        path: 'calendar',
        name: 'Calendar Docs',
        component: CalendarDocs,
      },
      {
        path: 'projectsummary',
        name: 'Project Summary Docs',
        component: ProjectSummaryDocs,
      },
      {
        path: 'inputurl',
        name: 'Input URL Docs',
        component: InputURLDocs,
      },
      {
        path: 'username',
        name: 'UserName Docs',
        component: UserNameDocs,
      },
      {
        path: 'dialogform',
        name: 'Dialog Form Docs',
        component: DialogFormDocs,
      },
      {
        path: 'editor',
        name: 'Editor Docs',
        component: EditorDocs,
      },
      {
        path: 'dialogconfirm',
        name: 'Dialog Confirmation Docs',
        component: DialogConfirmDocs,
      },
      {
        path: 'button',
        name: 'ButtonDocs',
        component: ButtonDocs,
      },
      {
        path: 'timeline',
        name: 'TimelineDocs',
        component: TimeLineDocs,
      },
      {
        path: 'imagecompressor',
        name: 'Image Compressor Docs',
        component: ImageCompressorDocs,
      },
      {
        path: 'typo',
        name: 'Typography Docs',
        component: TypographyDocs,
      },
      {
        path: 'card',
        name: 'Card Docs',
        component: CardDocs,
      },
      {
        path: 'tabmenu',
        name: 'Tab Menu Docs',
        component: TabMenuDocs,
      },
      {
        path: 'tabmenu/second-link',
        name: 'Tab Menu Second Link Docs',
        component: TabMenuDocs,
      },
      {
        path: 'menu',
        name: 'Menu Docs',
        component: MenuDocs,
      },
      {
        path: 'filtercontainer',
        name: 'Filter Container Docs',
        component: FilterContainerDocs,
      },
      {
        path: 'quickfilter',
        name: 'Quick Filter Container Docs',
        component: QuickFilterDocs,
      },
      {
        path: 'breadcrumb',
        name: 'Breadcrumb Docs',
        component: BreadcrumbDocs,
      },
      {
        path: 'datatable',
        name: 'DataTable Docs',
        component: DataTableDocs,
      },
      {
        path: 'checkbox',
        name: 'Checbox Docs',
        component: CheckboxDocs,
      },
      {
        path: 'codesnippet',
        name: 'Code Snippet Docs',
        component: CodeSnippetDocs,
      },
      {
        path: 'toast',
        name: 'Toast Docs',
        component: ToastDocs,
      },
      {
        path: 'inputtext',
        name: 'InputText Docs',
        component: InputTextDocs,
      },
      {
        path: 'image',
        name: 'Image Docs',
        component: ImageDocs,
      },
      {
        path: 'badge',
        name: 'Badge Docs',
        component: BadgeDocs,
      },
      {
        path: 'form',
        name: 'Form Docs',
        component: FormDocs,
      },
      {
        path: 'workcalendar',
        name: 'Work Calendar Docs',
        component: WorkCalendarDocs,
      },
      {
        path: 'multiselect',
        name: 'MultiSelect Docs',
        component: MultiSelectDocs,
      },
      {
        path: 'inputrangenumber',
        name: 'Input Range Number Docs',
        component: InputRangeNumberDocs,
      },
      {
        path: 'inputnumber',
        name: 'Input Number Docs',
        component: InputNumberDocs,
      },
      {
        path: 'inputphonenumber',
        name: 'Input Phone Number Docs',
        component: InputPhoneNumberDocs,
      },
      {
        path: 'inputemail',
        name: 'Input Email Docs',
        component: InputEmailDocs,
      },
      {
        path: 'toggle',
        name: 'ButtonToggle Docs',
        component: ButtonToggleDocs,
      },
      {
        path: 'inputpassword',
        name: 'Input Password Docs',
        component: InputPasswordDocs,
      },
      {
        path: 'icon',
        name: 'Icon Docs',
        component: IconDocs,
      },
      {
        path: 'changelog',
        name: 'Changelog Docs',
        component: ChangelogDocs,
      },
      {
        path: 'changelogpage',
        name: 'ChangelogPage Docs',
        component: ChangelogPageDocs,
      },
      {
        path: 'inputrepositoryname',
        name: 'InputRepositoryName Docs',
        component: InputRepositoryNameDocs,
      },
      {
        path: 'textarea',
        name: 'Textarea Docs',
        component: TextareaDocs,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory((import.meta.env || process.env).BASE_URL),
  routes,
});

export default router;
