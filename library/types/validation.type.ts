import { FieldContext } from 'vee-validate';
import { Nullable } from 'primevue/ts-helpers';
import { Ref } from 'vue';

export type Condition = 'empty' | 'exceed' | 'invalidFormat';

export type CustomValidation = Partial<Record<Condition, string>>;

type FieldValue =
  | Nullable<string>
  | Nullable<number>
  | string
  | string[]
  | number
  | number[]
  | boolean
  | undefined
  | null
  | object;

export type FieldValidation<T = FieldValue | undefined> =
  | {
      value: T;
      errorMessage?: Ref<string | undefined>;
      setErrors?: (errors?: string | string[]) => void;
      handleReset?: () => void;
    }
  | (Omit<FieldContext, 'value'> & {
      value: T;
    });
