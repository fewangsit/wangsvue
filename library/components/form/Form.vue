<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { GenericObject, useForm } from 'vee-validate';
import Button from '../button/Button.vue';
import ValidatorMessage from '../validatormessage/ValidatorMessage.vue';
import Checkbox from '../checkbox/Checkbox.vue';

import type {
  FormProps,
  FormEmits,
  FormSlots,
  FormPayload,
} from './Form.vue.d';

const props = withDefaults(defineProps<FormProps>(), {
  resetAfterSubmit: true,
});

const emit = defineEmits<FormEmits>();
defineSlots<FormSlots>();

onMounted(() => {
  if (fieldsWrapper.value) {
    const chilren = fieldsWrapper.value.children;
    const childCount = fieldsWrapper.value.childElementCount;
    const colCount = props.columnPerRow ?? 1;

    fieldsWrapper.value.style.gridTemplateColumns = `repeat(${colCount}, minmax(0, 1fr))`;

    let [rowPos, colPos] = [1, 1];
    for (const i in Array.from({ length: childCount })) {
      chilren[i].setAttribute('style', `grid-area: ${rowPos}/${colPos}`);

      if (++colPos > colCount) {
        colPos = 1;
        rowPos++;
      }
    }

    setOuterFieldsWrapperHeight();
    if (props.stickyButtons) setDialogClass();
  }
});

const { handleSubmit, values, resetForm, errors } = useForm();

const formElement = ref<HTMLFormElement>();
const showValidator = ref<boolean>(false);
const validated = ref<boolean>(false);
const fieldsKey = ref<number>(0);
const footer = ref<HTMLDivElement>();

const fieldsWrapper = ref<HTMLDivElement | null>(null);
const outerFieldsWrapper = ref<HTMLDivElement | null>(null);
const stayAfterSubmit = ref<boolean>(false);

const setOuterFieldsWrapperHeight = (): void => {
  if (footer.value) {
    const footerHeight = footer.value?.offsetHeight;

    if (outerFieldsWrapper.value)
      outerFieldsWrapper.value.style.height = `calc(100% + ${
        footerHeight + 20
      }px)`;
  }
};

const setDialogClass = (): void => {
  const dialog = document.querySelector('.p-dialog') as HTMLDivElement;
  if (dialog) dialog.classList.add('form-dialog-sticky-buttons');
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
  errors,
});
</script>

<template>
  <form
    ref="formElement"
    :class="['ts-form', { 'sticky-buttons': props.stickyButtons }]"
    @input="showValidator = false"
    @submit.prevent="submit"
  >
    <div ref="outerFieldsWrapper" class="ts-form-fields-outer-wrapper">
      <div
        ref="fieldsWrapper"
        class="grid gap-y-3 gap-x-6"
        data-pc-section="form-fields"
      >
        <slot :key="fieldsKey" :form-values="values" name="fields" />
      </div>
    </div>

    <div ref="footer" v-if="!hideFooter" class="ts-form-footer">
      <div v-if="!hideStayCheckbox" class="ts-form-stay-checkbox">
        <Checkbox v-model="stayAfterSubmit" label="Tetap di halaman ini" />
      </div>

      <div class="ts-form-action-buttons">
        <div class="button-wrapper">
          <Button
            v-if="props.buttonsTemplate?.includes('cancel')"
            @click="$emit('cancel')"
            data-test="cancel-button"
            label="Batal"
            severity="secondary"
            text
            type="button"
          />
          <Button
            v-if="props.buttonsTemplate?.includes('clear')"
            :label="clearBtnLabel ?? 'Bersihkan Field'"
            @click="clearField"
            data-test="clear-button"
            text
            type="button"
          />
          <Button
            v-if="props.buttonsTemplate?.includes('submit')"
            :label="submitBtnLabel ?? 'Simpan'"
            @click="onSubmitClicked"
            data-test="submit-button"
            severity="success"
            type="submit"
          />
        </div>
        <ValidatorMessage
          v-show="showValidator || props.invalid"
          :message="validatorMessage ?? 'Please input all required field!'"
          class="ts-form-validator-message"
        />
      </div>
    </div>
  </form>
</template>

<style lang="css">
@import './style/Form.css';
</style>
