import type { App, MaybeRef, MaybeRefOrGetter } from 'vue';
import eventBus from './event-bus';

// Style
import './assets/css/main.css';

// PrimeVue
import WangsVue from 'primevue/config';
import ToastService from 'primevue/toastservice';

// Vee-validate
import {
  FormContext as VeeFormContext,
  useForm as veeUseForm,
  useField as veeUseField,
  FieldContext,
  RuleExpression,
  FieldOptions,
} from 'vee-validate';

interface FormContext<T> {
  values: T;
  handleSubmit: VeeFormContext['handleSubmit'];
  setValues: VeeFormContext['setValues'];
  setFieldValue: VeeFormContext['setFieldValue'];
}

const useForm = <T>(): FormContext<T> => {
  const { values, handleSubmit, setValues, setFieldValue } = veeUseForm();
  return {
    values: values as unknown as T,
    handleSubmit,
    setValues,
    setFieldValue,
  };
};

const useField = <T>(
  path: MaybeRefOrGetter<string>,
  rules?: MaybeRef<RuleExpression<T>>,
  opts?: Partial<FieldOptions<T>>,
): FieldContext<T> => {
  const context = veeUseField<T>(path, rules, opts);

  return context;
};

// Preset
import Preset from 'lib/preset';

// Utils
import { useToast, getNestedProperyValue } from 'lib/utils';

// Directives
import Tooltip from 'primevue/tooltip';

import useLoadingStore from './components/loading/store/loading.store';

import {
  Badge,
  BadgeGroup,
  Button,
  ButtonToggle,
  ButtonBulkAction,
  Breadcrumb,
  Card,
  Changelog,
  DataTable,
  Dropdown,
  MultiSelect,
  TabMenu,
  Toast,
  UserName,
  Icon,
  ButtonDownload,
  ButtonFilter,
  FilterContainer,
  DialogConfirm,
  Checkbox,
  QuickFilter,
  Menu,
  ButtonSearch,
  InputRangeNumber,
  Calendar,
  InputText,
  Form,
  DialogForm,
  InputNumber,
  InputEmail,
  WorkCalendar,
  Dialog,
  InputInitialName,
  ImageCompressor,
  InputPhoneNumber,
  InputPassword,
  TreeTable,
  Loading,
} from './components';

export default {
  install: (app: App): void => {
    app.use(WangsVue, {
      unstyled: true,
      pt: Preset,
    });

    app.use(ToastService);

    app.component('Badge', Badge);
    app.component('BadgeGroup', BadgeGroup);
    app.component('Button', Button);
    app.component('ButtonToggle', ButtonToggle);
    app.component('ButtonBulkAction', ButtonBulkAction);
    app.component('ButtonDownload', ButtonDownload);
    app.component('ButtonFilter', ButtonFilter);
    app.component('FilterContainer', FilterContainer);
    app.component('Dialog', Dialog);
    app.component('InputInitialName', InputInitialName);
    app.component('DialogConfirm', DialogConfirm);
    app.component('Checkbox', Checkbox);
    app.component('Menu', Menu);
    app.component('ButtonSearch', ButtonSearch);
    app.component('Calendar', Calendar);
    app.component('InputPhoneNumber', InputPhoneNumber);
    app.component('Changelog', Changelog);
    app.component('WorkCalendar', WorkCalendar);
    app.component('InputRangeNumber', InputRangeNumber);
    app.component('QuickFilter', QuickFilter);
    app.component('Breadcrumb', Breadcrumb);
    app.component('Card', Card);
    app.component('DataTable', DataTable);
    app.component('Dropdown', Dropdown);
    app.component('Icon', Icon);
    app.component('InputText', InputText);
    app.component('MultiSelect', MultiSelect);
    app.component('TabMenu', TabMenu);
    app.component('ImageCompressor', ImageCompressor);
    app.component('Toast', Toast);
    app.component('UserName', UserName);
    app.component('Form', Form);
    app.component('DialogForm', DialogForm);
    app.component('InputNumber', InputNumber);
    app.component('InputEmail', InputEmail);
    app.component('InputPassword', InputPassword);
    app.component('Loading', Loading);
    app.component('TreeTable', TreeTable);

    app.directive('tooltip', Tooltip);
  },
};

export {
  // Config
  WangsVue,
  ToastService,
  Preset,
  eventBus,

  // Directives
  Tooltip,
  useForm,
  useField,

  // Utils
  getNestedProperyValue,
  useToast,

  // Components
  Badge,
  BadgeGroup,
  Button,
  ButtonToggle,
  ButtonBulkAction,
  Breadcrumb,
  Card,
  Changelog,
  InputInitialName,
  Dialog,
  DataTable,
  Dropdown,
  MultiSelect,
  TabMenu,
  Toast,
  UserName,
  Icon,
  InputPassword,
  ButtonDownload,
  ButtonFilter,
  InputPhoneNumber,
  FilterContainer,
  ImageCompressor,
  DialogConfirm,
  Checkbox,
  Menu,
  QuickFilter,
  ButtonSearch,
  InputRangeNumber,
  Calendar,
  WorkCalendar,
  InputText,
  Form,
  DialogForm,
  InputNumber,
  InputEmail,
  TreeTable,

  // Component store
  useLoadingStore,
};
