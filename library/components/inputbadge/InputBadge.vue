<script setup lang="ts">
import {
  computed,
  shallowRef,
  reactive,
  onMounted,
  watch,
  ref,
  inject,
  nextTick,
} from 'vue';
import { useField } from 'vee-validate';
import { cloneDeep } from 'lodash';
import { FieldValidation } from '../form/Form.vue.d';
import { InputBadgeProps, InputBadgeEmits } from './InputBadge.vue.d';

import Badge from '../badge/Badge.vue';
import FieldWrapper from '../fieldwrapper/FieldWrapper.vue';
import ValidatorMessage from '../validatormessage/ValidatorMessage.vue';
import OverlayPanel from '../overlaypanel/OverlayPanel.vue';
import OverlayPanelClass from '../overlaypanel/OverlayPanel.vue.d';
import Icon from '../icon/Icon.vue';

const props = withDefaults(defineProps<InputBadgeProps>(), {
  fieldName: 'inputBadge',
  showValidatorMessage: true,
  type: 'text',
});

const emit = defineEmits<InputBadgeEmits>();

onMounted(() => {
  if (props.useValidator) {
    Object.assign(
      field,
      useField(props.fieldName, (value?: string[]) => {
        return nextTick(() => {
          return setValidatorMessage(value);
        }); // Waits props.invalid changed
      }),
    );

    if (props.initialValue?.length) field.value = props.initialValue;
    else if (props.modelValue?.length) field.value = props.modelValue;
  }
});

const Preset = inject<Record<string, any>>('preset', {}).inputbadge;
const badgeInput = ref<HTMLInputElement | null>(null);
const op = ref<OverlayPanelClass>();
const newLabel = shallowRef<string>();
const field = reactive<FieldValidation<string[]>>({
  value: props.initialValue ?? props.modelValue ?? [],
});

const inputId = computed(() => {
  return props.label?.toLowerCase + '-badge-input';
});

const invalidMessage = computed(() => {
  if (props.invalid && typeof props.validatorMessage === 'string') {
    return props.validatorMessage;
  }
  return field.errorMessage;
});

const inputPlaceholder = computed(() => {
  if (props.placeholder) return props.placeholder;
  else if (props.type === 'email') return 'Enter valid email';
  return 'Enter value';
});

const setValidatorMessage = (values?: string[]): boolean | string => {
  if (typeof props.validatorMessage === 'string' && props.invalid) {
    return props.validatorMessage;
  } else if (typeof props.validatorMessage !== 'string') {
    const { empty, exist } = props.validatorMessage ?? {};

    if (!values?.length && props.mandatory) {
      return empty ?? true;
    } else if (props.existingValues?.length || exist) {
      let validator: boolean | string = true;

      values.forEach((each) => {
        // Filter existing in inputed value (check for double value)
        const matchExist = values.filter((value) => value === each);

        if (props.existingValues.includes(each) || matchExist.length > 1) {
          validator = exist;
        }
      });

      return validator;
    }
  }
  return true;
};

/**
 * Computed property that returns true if the input in the new label field is invalid.
 *
 * The input is considered invalid if it is a string and has no length.
 *
 * The initial value is undefined, so it will not invalid on mounted.
 * On after user enter some text and delete, the input value will be empty string.
 * It will become invalid input.
 */
const invalidInput = computed(() => {
  return (
    props.invalid ||
    !!field.errorMessage ||
    (!field.value?.length &&
      typeof newLabel.value === 'string' &&
      !newLabel.value.length)
  );
});

const isValidEmail = (email: string): boolean => {
  const emailRegexp = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  return emailRegexp.test(email);
};

/**
 * A method that adds a new label to the badge labels array.
 * The new label is only added if it has a value.
 */
const addNewLabel = (): void => {
  if (newLabel.value) {
    field.value = [...(field.value ?? []), newLabel.value];
    newLabel.value = undefined; // Sets to undefined to make the input not invalid.
    emit('update:modelValue', field.value);
  }
};

/**
 * Validate email before addnewlabel
 */
const onBeforeAddLabel = (event: Event): void => {
  if (props.type === 'email') {
    if (badgeInput.value && op.value && newLabel.value) {
      if (!isValidEmail(newLabel.value)) {
        op.value.toggle(event, badgeInput.value);

        return;
      }
    }
  }

  addNewLabel();
};

/**
 * A method that removes a badge from the badge labels array.
 * The badge to remove is specified by its index in the array.
 */
const removeBadge = (index: number): void => {
  field.value?.splice(index, 1);
  field.value = cloneDeep(field.value);
};

/**
 * A method that handles the keydown event on the new label input.
 *
 * If the user presses the backspace key and the input is empty,
 * the last badge label is removed and its value is set as the input value.
 */
const onKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'Backspace' && !newLabel.value) {
    event.preventDefault(); // Prevent the last char deleted.
    if (props.type === 'text') newLabel.value = field.value?.pop() as string;
    else field.value?.pop(); // On type email, press backspace remove the entire badge, not enter edit state
    field.value = cloneDeep(field.value);
  }
};

const onEditBadge = (text: string | null, index: number): void => {
  if (field.value && text) {
    field.value[index] = text;
    field.value = cloneDeep(field.value);
    emit('update:modelValue', field.value);
  }
};

watch(
  () => props.initialValue,
  (value) => {
    if (value) field.value = value;
  },
  { once: true },
);

watch(
  () => props.modelValue,
  (value) => {
    if (value) field.value = value;
  },
);
</script>
<template>
  <FieldWrapper
    :info="fieldInfo"
    :label="props.label"
    :mandatory="props.mandatory"
  >
    <div
      v-bind="Preset?.root({ context: { invalidInput, disabled } })"
      data-wv-name="inputbadge"
      data-wv-section="root"
    >
      <template :key="label" v-for="(label, index) in field.value">
        <Badge
          :label="label"
          @remove="
            () => {
              badgeInput?.focus();
              removeBadge(index);
            }
          "
          @update:label="onEditBadge($event, index)"
          editable
          format="nowrap"
          removable
          severity="dark"
        />
      </template>
      <form
        @submit.prevent="onBeforeAddLabel"
        class="flex-1"
        data-wv-section="form-input"
      >
        <input
          :id="inputId"
          ref="badgeInput"
          v-model="newLabel"
          v-bind="
            Preset?.input({
              context: { disabled, value: field.value },
              parent: $parent,
              props,
            })
          "
          :disabled="disabled"
          :placeholder="inputPlaceholder"
          @blur="onBeforeAddLabel"
          @focus="op?.hide()"
          @input="op?.hide()"
          @keydown="onKeydown"
          data-wv-section="input"
          type="text"
        />

        <OverlayPanel ref="op" v-bind="Preset.erroroverlaypanel">
          <Icon v-bind="Preset.erroricon" icon="error" />
          Email format is incorrect
        </OverlayPanel>
      </form>
    </div>
    <ValidatorMessage
      v-if="props.showValidatorMessage && props.label"
      :message="invalidMessage"
    />
  </FieldWrapper>
</template>
