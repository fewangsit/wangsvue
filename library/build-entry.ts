import type { App, MaybeRef, MaybeRefOrGetter } from 'vue';

// Style
import './assets/css/main.css';

// PrimeVue
import WangsVueConfig from 'primevue/config';
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

// Directives
import Tooltip from 'primevue/tooltip';

import { Button } from './components';

export default {
  install: (app: App): void => {
    app.use(WangsVueConfig, {
      unstyled: true,
      pt: Preset,
    });

    app.use(ToastService);

    // eslint-disable-next-line vue/no-reserved-component-names
    app.component('Button', Button);

    app.directive('tooltip', Tooltip);
  },
};

export {
  // Config
  WangsVueConfig,
  ToastService,
  Preset,

  // Directives
  Tooltip,
  useForm,
  useField,
  Button,
};
