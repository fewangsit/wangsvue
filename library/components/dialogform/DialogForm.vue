<script setup lang="ts">
import { ref, useSlots, withDefaults } from 'vue';
import Form from '../form/Form.vue';
import Dialog from 'primevue/dialog';
import Button from '../button/Button.vue';
import DialogPreset from 'lib/preset/dialog';
import ValidatorMessage from '../validatormessage/ValidatorMessage.vue';
import FormInstance, { FormPayload } from '../form/Form.vue.d';
import Checkbox from '../checkbox/Checkbox.vue';
import Icon from '../icon/Icon.vue';
import { convertToArrayClass } from 'lib/utils';

import {
  DialogFormEmits,
  DialogFormProps,
  DialogFormSlots,
} from '../dialogform/DialogForm.vue.d';

const props = withDefaults(defineProps<DialogFormProps>(), {
  showStayCheckbox: undefined,
  useClearBtn: true,
  useActionBtn: true,
  closable: true,
  closeOnSubmit: true,
  resetAfterSubmit: true,
  width: 'small',
  columnPerRow: 1,
});

const emit = defineEmits<DialogFormEmits>();
defineSlots<DialogFormSlots>();

const slots = useSlots();

const form = ref<FormInstance>();
const dialogForm = ref<Dialog>();
const fieldsKey = ref<number>(0);
const showConfirm = ref<boolean>(false);
const formPayload = ref<FormPayload>({
  stayAfterSubmit: false,
  formValues: {},
});

const closeDialog = (): void => {
  emit('update:visible', false);
  emit('close');
};

/**
 * Callback function for submit button click.
 */
const onButtonSubmitClicked = (): void => {
  if (form.value && !props.invalid && !props.validatorMessage) {
    form.value.submit();
  }
};

/**
 * Callback function for clear button click.
 *
 * @returns {void}
 */
const clearField = (): void => {
  if (form.value) {
    form.value.clearField();
  }

  emit('clear');
};

/**
 * Callback function for Form component's submit event.
 * Once all fields within Form component is valid, runs the aditional validation.
 *
 * The validation should change the invalid state.
 *
 * Once the invalid state become false, the emit 'submit' will be fired and this callback will be executed.
 *
 * @param {FormPayload} formPayload - The payload object containing the form data and options.
 * @returns {void}
 */
const onSubmitDialogForm = async (payload: FormPayload): Promise<void> => {
  if (props.validationFunction) {
    /**
     * This function will change the props.invalid value that will determine the next step.
     */
    await props.validationFunction();
  }

  /**
   * Prevent submit callback executed if the form is still invalid.
   */
  if (!props.invalid && !props.validatorMessage) {
    formPayload.value = payload;

    if (slots['confirm']) showConfirm.value = true;
    else onFormValidated();
  }
};

const onFormValidated = async (
  submitFunction?: (value: FormPayload) => Promise<void> | void,
): Promise<void> => {
  const { stayAfterSubmit } = formPayload.value;

  /**
   * Only close dialog if the form valid and stayAfterSubmit not checked.
   */
  if (!stayAfterSubmit && props.closeOnSubmit) {
    emit('update:visible', false);
  }

  /**
   * If using confirmation on submit, the form should not be resets on submit clicked.
   * Resets the form if user confirmed the Confirm Dialog.
   *
   * The clear field should await the submitFunction succed.
   */
  if (slots['confirm']) {
    try {
      await submitFunction?.(formPayload.value);
    } catch (error) {
      console.error(error);
    }
  } else {
    emit('submit', formPayload.value);
  }

  if (props.resetAfterSubmit) clearField();
};

defineExpose({ form, clearField });
</script>

<template>
  <Dialog
    ref="dialogForm"
    :class="props.class"
    :closable="closable"
    :draggable="false"
    :header="header"
    :pt="{
      root: {
        class: [
          ...DialogPreset.root({ state: {} }).class,
          'max-w-[90vw]',
          {
            '!w-[400px]': props.width === 'small',
            '!w-[500px]': props.width === 'medium',
            '!w-[572px]': props.width === 'large',
            '!w-[600px]': props.width === 'semi-xlarge',
            '!w-[800px]': props.width === 'xlarge',
          },
        ],
      },
      header: {
        'class': [...DialogPreset.header.class],
        'data-ts-section': 'dialog-form-header',
      },
      content: {
        'class': [
          ...DialogPreset.content({ state: {}, instance: {} }).class,
          ...convertToArrayClass(contentClass),
        ],
        'data-ts-section': 'dialog-form-content',
      },
      footer: {
        'class': [
          ...DialogPreset.footer.class,
          'flex flex-col !items-end justify-end !gap-1',
        ],
        'data-ts-section': 'dialog-form-footer',
      },
    }"
    :visible="visible"
    @update:visible="emit('update:visible', !!$event)"
    data-ts-section="dialog-form"
    modal
  >
    <template #header>
      <slot name="header">
        <Icon
          v-if="headerIcon"
          :icon="headerIcon"
          :severity="severity"
          aria-label="Header Icon"
          class="text-2xl"
          data-ts-section="headericon"
        />
        <h3
          class="text-grayscale-900 dark:text-general-100 text-center text-[0.9rem] leading-[1.125rem] font-bold tracking-[0.28px]"
          data-ts-section="dialog-form-title"
        >
          {{ header }}
        </h3>
      </slot>
    </template>

    <template #closeicon>
      <Icon
        @click="closeDialog"
        class="w-[22px] h-[22px]"
        data-ts-section="close-icon"
        icon="close"
        severity="secondary"
      />
    </template>

    <Form
      ref="form"
      :buttons-template="buttonsTemplate"
      :column-per-row="columnPerRow"
      :reset-after-submit="resetAfterSubmit"
      @submit="onSubmitDialogForm"
      hide-footer
    >
      <template #fields="{ formValues }">
        <slot :key="fieldsKey" :form-values="formValues" name="fields" />
      </template>
    </Form>

    <slot
      :hide="() => (showConfirm = false)"
      :submit="onFormValidated"
      :visible="showConfirm"
      name="confirm"
    />

    <template #footer>
      <Checkbox
        v-if="showStayCheckbox"
        :model-value="form?.stayAfterSubmit"
        @update:model-value="form && (form.stayAfterSubmit = $event)"
        label="Stay on this form after submitting"
      />
      <ValidatorMessage
        v-show="invalid && validatorMessage"
        :format="false"
        :message="validatorMessage"
      />
      <div
        v-if="props.buttonsTemplate.length"
        class="flex gap-1 items-center justify-end"
        data-ts-section="footer-button"
      >
        <slot :submit="onButtonSubmitClicked" name="actionButtons">
          <Button
            v-if="props.buttonsTemplate?.includes('cancel')"
            @click="emit('close'), emit('update:visible', false)"
            data-ts-section="cancel-btn"
            label="Batal"
            severity="dark"
            text
          />
          <Button
            v-if="props.buttonsTemplate?.includes('clear')"
            :label="clearBtnLabel ?? 'Bersihkan Field'"
            @click="clearField"
            data-ts-section="clear-field"
            text
          />
          <Button
            v-if="props.buttonsTemplate?.includes('submit')"
            :label="submitBtnLabel ?? 'Simpan'"
            :severity="props.severity === 'primary' ? undefined : 'success'"
            @click="onButtonSubmitClicked"
            data-ts-section="save-submit-button"
          />
        </slot>
      </div>
    </template>
  </Dialog>
</template>
