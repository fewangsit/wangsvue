<script setup lang="ts">
import { GenericObject, useForm } from 'vee-validate';
import { inject, onMounted, ref, shallowRef } from 'vue';
import Button from '../button/Button.vue';
import Checkbox from '../checkbox/Checkbox.vue';
import ValidatorMessage from '../validatormessage/ValidatorMessage.vue';

import type {
  FormEmits,
  FormPayload,
  FormProps,
  FormSlots,
} from './Form.vue.d';

const props = withDefaults(defineProps<FormProps>(), {
  cancelBtnLabel: 'Batal',
  clearBtnLabel: 'Bersihkan Field',
  submitBtnLabel: 'Simpan',
  resetAfterSubmit: true,
  cancelBtnSeverity: 'secondary',
  submitBtnSeverity: 'success',
  stayCheckboxLabel: 'Tetap di halaman ini',
  validatorMessage: 'Please input all required field!',
});

const emit = defineEmits<FormEmits>();
defineSlots<FormSlots>();

onMounted(() => {
  if (fieldsWrapper.value) {
    const colCount = props.columnPerRow ?? 1;
    fieldsWrapper.value.style.gridTemplateColumns = `repeat(${colCount}, minmax(0, 1fr))`;

    setOuterFieldsWrapperHeight();
  }
});

const Preset = inject<Record<string, any>>('preset', {}).form;

const { handleSubmit, values, resetForm, errors, resetField } = useForm();

const stayAfterSubmit = shallowRef<boolean>(false);

const formElement = ref<HTMLFormElement>();
const showValidator = shallowRef<boolean>(false);
const validated = shallowRef<boolean>(false);
const fieldsKey = shallowRef<number>(0);
const footer = ref<HTMLDivElement>();

const fieldsWrapper = ref<HTMLDivElement | null>(null);
const outerFieldsWrapper = ref<HTMLDivElement | null>(null);

const setOuterFieldsWrapperHeight = (): void => {
  if (footer.value) {
    const footerHeight = footer.value?.offsetHeight;

    if (outerFieldsWrapper.value)
      outerFieldsWrapper.value.style.height = `calc(100% + ${
        footerHeight + 20
      }px)`;
  }
};

const onSubmitClicked = (): void => {
  if (!validated.value) showValidator.value = true;
};

const submit = handleSubmit((formValues) => {
  const formattedValues = trimValues(formValues);

  const payload: FormPayload = {
    stayAfterSubmit: stayAfterSubmit.value,
    formValues: formattedValues,
  };

  if (!props.invalid) {
    emit('submit', payload);
    showValidator.value = false;

    if (props.resetAfterSubmit) {
      fieldsKey.value += 1;
      resetForm();
    }
  }
});

const clearField = (): void => {
  resetForm();
  fieldsKey.value++;
  emit('clear');
};

const trimValues = (formValues: GenericObject): GenericObject => {
  const formattedValues = formValues;
  const keys = Object.keys(formattedValues);

  for (const key of keys) {
    if (typeof formattedValues[key] === 'string') {
      formattedValues[key] = formattedValues[key].trim();
    }
  }

  return formattedValues;
};

defineExpose({
  stayAfterSubmit,
  submit,
  showValidator,
  formElement,
  clearField,
  resetField,
  errors,
});
</script>

<template>
  <form
    ref="formElement"
    v-bind="Preset?.root({ props })"
    @input="showValidator = false"
    @submit.prevent="submit"
  >
    <div ref="outerFieldsWrapper">
      <div ref="fieldsWrapper" v-bind="Preset?.['fields-wrapper']">
        <slot :key="fieldsKey" :form-values="values" name="fields" />
      </div>
    </div>

    <div ref="footer" v-if="!hideFooter" v-bind="Preset?.footer">
      <div v-if="!hideStayCheckbox" v-bind="Preset?.staycheckbox">
        <Checkbox v-model="stayAfterSubmit" :label="stayCheckboxLabel" />
      </div>

      <div v-bind="Preset?.['action-buttons']">
        <div v-bind="Preset?.['button-wrapper']">
          <Button
            v-if="props.buttonsTemplate?.includes('cancel')"
            v-bind="Preset?.['cancel-button']"
            :label="cancelBtnLabel"
            :severity="cancelBtnSeverity"
            @click="$emit('cancel')"
            data-test="cancel-button"
            text
            type="button"
          />
          <Button
            v-if="props.buttonsTemplate?.includes('clear')"
            v-bind="Preset?.['clear-button']"
            :label="clearBtnLabel"
            @click="clearField"
            text
            type="button"
          />
          <Button
            v-if="props.buttonsTemplate?.includes('submit')"
            v-bind="Preset?.['submit-button']"
            :label="submitBtnLabel"
            :severity="submitBtnSeverity"
            @click="onSubmitClicked"
            type="submit"
          />
        </div>
        <ValidatorMessage
          v-show="showValidator || props.invalid"
          v-bind="Preset?.['validator-message']"
          :message="validatorMessage"
        />
      </div>
    </div>
  </form>
</template>
