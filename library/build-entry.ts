import type { App, MaybeRef, MaybeRefOrGetter } from 'vue';

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

import {
  Badge,
  BadgeGroup,
  Button,
  ButtonBulkAction,
  Breadcrumb,
  Card,
  DataTable,
  TabMenu,
  Toast,
  UserName,
  Icon,
  ButtonDownload,
  ButtonFilter,
  FilterContainer,
  DialogConfirm,
  Checkbox,
  Menu,
  ButtonSearch,
  InputRangeNumber,
  Calendar,
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
    app.component('ButtonBulkAction', ButtonBulkAction);
    app.component('ButtonDownload', ButtonDownload);
    app.component('ButtonFilter', ButtonFilter);
    app.component('FilterContainer', FilterContainer);
    app.component('DialogConfirm', DialogConfirm);
    app.component('Checkbox', Checkbox);
    app.component('Menu', Menu);
    app.component('ButtonSearch', ButtonSearch);
    app.component('Calendar', Calendar);
    app.component('InputRangeNumber', InputRangeNumber);
    app.component('Breadcrumb', Breadcrumb);
    app.component('Card', Card);
    app.component('DataTable', DataTable);
    app.component('Icon', Icon);
    app.component('TabMenu', TabMenu);
    app.component('Toast', Toast);
    app.component('UserName', UserName);

    app.directive('tooltip', Tooltip);
  },
};

export {
  // Config
  WangsVue,
  ToastService,
  Preset,

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
  Breadcrumb,
  Card,
  DataTable,
  Icon,
  TabMenu,
  Toast,
  UserName,
};
