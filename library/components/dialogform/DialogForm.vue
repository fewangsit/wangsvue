<script setup lang="ts">
import { computed, ref, shallowRef, useSlots, withDefaults } from 'vue';
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
const fieldsKey = shallowRef<number>(0);
const showConfirm = shallowRef<boolean>(false);
const expanded = shallowRef<boolean>(false);
const formPayload = ref<FormPayload>({
  stayAfterSubmit: false,
  formValues: {},
});

const computedWidth = computed(() => {
  const asideRightWidth = slots['aside-right'] && expanded.value ? 260 : 0;
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
    :class="props.class"
    :closable="closable"
    :draggable="false"
    :header="header"
    :pt="{
      root: {
        class: [...DialogPreset.root({ state: {} }).class, 'max-w-[90vw]'],
        style: `width: ${computedWidth}; transition: width 0.1s ease-in;`,
      },
      header: {
        'class': [...DialogPreset.header.class],
        'data-wv-section': 'dialog-form-header',
      },
      content: {
        'class': [
          ...DialogPreset.content({ state: {}, instance: {} }).class,
          ...convertToArrayClass(contentClass),
        ],
        'data-wv-section': 'dialog-form-content',
      },
      footer: {
        'class': [
          ...DialogPreset.footer.class,
          'flex flex-col !items-end justify-end !gap-1',
        ],
        'data-wv-section': 'dialog-form-footer',
      },
    }"
    :visible="visible"
    @update:visible="emit('update:visible', !!$event)"
    data-wv-section="dialog-form"
    modal
  >
    <template #container>
      <div :class="['flex', { 'gap-6': expanded }]">
        <main class="flex flex-col gap-3 w-full">
          <div class="flex items-center gap-2" data-wv-section="header">
            <slot name="header">
              <Icon
                v-if="headerIcon"
                :icon="headerIcon"
                :severity="severity"
                aria-label="Header Icon"
                class="text-2xl"
                data-wv-section="headericon"
              />
              <h3
                class="mr-auto text-grayscale-900 dark:text-general-100 text-center text-[0.9rem] leading-[1.125rem] font-bold tracking-[0.28px]"
                data-wv-section="dialog-form-title"
              >
                {{ header }}
              </h3>

              <Button
                v-if="$slots['aside-right']"
                :class="['!px-1.5 !py-1 -mr-1.5 !text-xs']"
                :label="expanded ? 'Tutup <' : 'Lihat data yang ada >'"
                @click="expanded = !expanded"
                data-wv-section="buttonselectall"
                text
              />

              <Button
                v-if="closable"
                @click="closeDialog"
                class="!p-0.5"
                data-wv-section="closebutton"
                icon="close"
                icon-class="w-[22px] h-[22px]"
                severity="secondary"
                text
              />
            </slot>
          </div>

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

          <div class="flex flex-col gap-3 items-end justify-center">
            <Checkbox
              v-if="showStayCheckbox"
              :model-value="form?.stayAfterSubmit"
              @update:model-value="form && (form.stayAfterSubmit = $event)"
              label="Tetap di halaman ini"
            />
            <ValidatorMessage
              v-show="invalid && validatorMessage"
              :format="false"
              :message="validatorMessage"
            />
            <div
              v-if="props.buttonsTemplate.length"
              class="flex gap-1 items-center justify-end"
              data-wv-section="footer-button"
            >
              <slot :submit="onButtonSubmitClicked" name="actionButtons">
                <Button
                  v-if="props.buttonsTemplate?.includes('cancel')"
                  @click="emit('close'), emit('update:visible', false)"
                  data-wv-section="cancel-btn"
                  label="Batal"
                  severity="dark"
                  text
                />
                <Button
                  v-if="props.buttonsTemplate?.includes('clear')"
                  :label="clearBtnLabel ?? 'Bersihkan Field'"
                  @click="clearField"
                  class="whitespace-nowrap"
                  data-wv-section="clear-field"
                  text
                />
                <Button
                  v-if="props.buttonsTemplate?.includes('submit')"
                  :label="submitBtnLabel ?? 'Simpan'"
                  :severity="
                    props.severity === 'primary' ? undefined : 'success'
                  "
                  @click="onButtonSubmitClicked"
                  data-wv-section="save-submit-button"
                />
              </slot>
            </div>
          </div>
        </main>

        <aside
          v-if="$slots['aside-right'] && expanded"
          :class="[
            'flex flex-col gap-3',
            { 'w-0 opacity-0': !expanded },
            { 'w-[236px] opacity-100': expanded },
          ]"
          style="transition: opacity 0.1s ease-in"
        >
          <slot name="aside-right" />
        </aside>
      </div>
    </template>
  </Dialog>
</template>
