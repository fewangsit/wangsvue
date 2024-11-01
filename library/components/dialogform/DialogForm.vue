<script setup lang="ts">
import Dialog from 'primevue/dialog';
import { computed, inject, ref, shallowRef, useSlots } from 'vue';
import Button from '../button/Button.vue';
import Form from '../form/Form.vue';

import Checkbox from '../checkbox/Checkbox.vue';
import FormInstance, { FormPayload } from '../form/Form.vue.d';
import Icon from '../icon/Icon.vue';
import ValidatorMessage from '../validatormessage/ValidatorMessage.vue';

const DialogPreset = inject<Record<string, any>>('preset', {}).dialog;
const DialogFormPreset = inject<Record<string, any>>('preset', {}).dialogform;

import {
  DialogFormEmits,
  DialogFormProps,
  DialogFormSlots,
} from '../dialogform/DialogForm.vue.d';

const props = withDefaults(defineProps<DialogFormProps>(), {
  cancelBtnLabel: 'Batal',
  clearBtnLabel: 'Bersihkan Field',
  submitBtnLabel: 'Simpan',
  asideRightWidth: 260,
  closable: true,
  closeOnSubmit: true,
  columnPerRow: 1,
  resetAfterSubmit: true,
  showStayCheckbox: undefined,
  stayCheckboxLabel: 'Tetap di halaman ini',
  useActionBtn: true,
  useClearBtn: true,
  width: 'small',
});

const emit = defineEmits<DialogFormEmits>();
defineSlots<DialogFormSlots>();

const slots = useSlots();

const form = ref<FormInstance>();
const dialogForm = ref<Dialog>();
const fieldsKey = shallowRef<number>(0);
const showConfirm = shallowRef<boolean>(false);
const expanded = shallowRef<boolean>(false);
const formPayload = ref<FormPayload>({
  stayAfterSubmit: false,
  formValues: {},
});

const computedWidth = computed(() => {
  const asideRightWidth =
    slots['aside-right'] && expanded.value ? props.asideRightWidth : 0;
  const baseWidth = {
    'small': 400,
    'medium': 500,
    'large': 572,
    'semi-xlarge': 600,
    'xlarge': 800,
  }[props.width];

  return `calc(${baseWidth}px + ${asideRightWidth}px)`;
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
    v-bind="DialogFormPreset?.root"
    :class="props.class"
    :closable="closable"
    :draggable="false"
    :header="header"
    :pt="{
      root: {
        class: [
          ...DialogPreset?.root({ state: {} }).class,
          ...DialogFormPreset?.root.class,
        ],
        style: DialogFormPreset?.root.style(computedWidth),
      },
    }"
    :visible="visible"
    @hide="emit('hide')"
    @show="emit('show')"
    @update:visible="emit('update:visible', !!$event)"
    modal
  >
    <template #container>
      <div v-bind="DialogFormPreset?.container(expanded)">
        <section v-bind="DialogFormPreset?.mainsection" id="main">
          <div v-bind="DialogFormPreset?.header">
            <slot name="header">
              <Icon
                v-if="headerIcon"
                v-bind="DialogFormPreset?.headericon"
                :icon="headerIcon"
                :severity="severity"
                aria-label="Header Icon"
              />
              <h3 v-bind="DialogFormPreset?.headertitle">
                {{ header }}
              </h3>

              <Button
                v-if="$slots['aside-right']"
                v-bind="DialogFormPreset?.expandasidebutton"
                :label="expanded ? 'Tutup <' : 'Lihat data yang ada >'"
                @click="expanded = !expanded"
                text
              />

              <Button
                v-if="closable"
                @click="closeDialog"
                v-bind="DialogFormPreset?.closedialog"
                icon="close"
                icon-class="w-[22px] h-[22px]"
                severity="secondary"
                text
              />
            </slot>
          </div>

          <Form
            v-bind="DialogFormPreset?.form"
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

          <div v-bind="DialogFormPreset?.footer">
            <Checkbox
              v-if="showStayCheckbox"
              :label="stayCheckboxLabel"
              :model-value="form?.stayAfterSubmit"
              @update:model-value="form && (form.stayAfterSubmit = $event)"
            />
            <ValidatorMessage
              v-show="invalid && validatorMessage"
              :format="false"
              :message="validatorMessage"
            />
            <div
              v-if="props.buttonsTemplate.length"
              v-bind="DialogFormPreset?.footerbutton"
            >
              <slot :submit="onButtonSubmitClicked" name="actionButtons">
                <Button
                  v-if="props.buttonsTemplate?.includes('cancel')"
                  v-bind="DialogFormPreset?.cancelbtn"
                  :label="cancelBtnLabel"
                  @click="emit('close'), emit('update:visible', false)"
                  severity="dark"
                  text
                />
                <Button
                  v-if="props.buttonsTemplate?.includes('clear')"
                  v-bind="DialogFormPreset?.clearfield"
                  :label="clearBtnLabel"
                  @click="clearField"
                  class="whitespace-nowrap"
                  text
                />
                <Button
                  v-if="props.buttonsTemplate?.includes('submit')"
                  v-bind="DialogFormPreset?.savesubmitbutton"
                  :label="submitBtnLabel"
                  :severity="
                    props.severity === 'primary' ? undefined : 'success'
                  "
                  @click="onButtonSubmitClicked"
                />
              </slot>
            </div>
          </div>
        </section>

        <aside
          v-if="$slots['aside-right']"
          v-bind="DialogFormPreset?.asidesection(expanded, asideRightWidth)"
        >
          <slot name="aside-right" />
        </aside>
      </div>
    </template>
  </Dialog>
</template>
