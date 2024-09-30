<script setup lang="ts">
import { shallowRef, watch } from 'vue';

import InputNumber from 'lib/components/inputnumber/InputNumber.vue';
import Button from 'lib/components/button/Button.vue';
import Dialog from 'lib/components/dialog/Dialog.vue';
import DialogPreset from 'lib/preset/dialog';
import { TaskLegend } from '../Legend.vue';
import ValidatorMessage from 'lib/components/validatormessage/ValidatorMessage.vue';
import { useToast } from 'lib/utils';
import useLoadingStore from 'lib/components/loading/store/loading.store';
import LegendList from '../LegendList.vue';
import TaskList from '../TaskList.vue';

const { loading, setLoading } = useLoadingStore();
const toast = useToast();

const visible = defineModel<boolean>('visible', { required: true });

const props = defineProps<{
  /**
   * The Task's Legend
   */
  legend: TaskLegend;

  /**
   * The Task's parent(s) Legend
   */
  parentTask: TaskLegend[];
}>();

const priorityValue = shallowRef<number>();
const priorityValueMessage = shallowRef<string>();
const priorityValueInvalid = shallowRef<boolean>(false);

// TODO: Handle Nilai Prioritas Submit
const handleSubmit = async (): Promise<void> => {
  try {
    setLoading(true);

    toast.add({
      message: 'Nilai prioritas telah disimpan.',
      severity: 'success',
    });
  } catch (error) {
    if (error instanceof Error) {
      // TODO: Adjust error message from backend later.
      if (error.message === 'Priority value taken') {
        priorityValueMessage.value = 'Nilai prioritas sudah ada';
        priorityValueInvalid.value = true;
      }
    }

    toast.add({
      message: 'Nilai prioritas gagal disimpan.',
      severity: 'error',
      error,
    });
  } finally {
    setLoading(false);
  }
};

watch(priorityValue, () => {
  priorityValueMessage.value = undefined;
  priorityValueInvalid.value = false;
});
</script>

<template>
  <Dialog
    v-model:visible="visible"
    :closable="false"
    :pt="{
      root: ({ state }) => ({
        'class': [
          ...DialogPreset.root({ state }).class,

          // Customs
          '!gap-0',
          '!w-[600px]',
        ],
        'data-wv-name': 'dialog-nilai-prioritas',
      }),
      header: {
        'class': [...DialogPreset.header.class],
        'data-wv-section': 'detailtask-header',
      },
      content: {
        class: [
          ...DialogPreset.content({ state: {}, instance: {} }).class,

          // Customs
          '!p-0 !m-0',
          '!py-3',
        ],
      },
      footer: {
        class: [...DialogPreset.footer.class],
      },
    }"
    header="Nilai Prioritas"
  >
    <template #header>
      <div class="flex justify-between items-center w-full">
        <span class="text-lg font-semibold leading-4">Nilai Prioritas</span>
        <Button
          @click="visible = false"
          class="!p-0.5 !text-general-200 dark:!text-general-200"
          data-wv-section="closebutton"
          icon="close"
          icon-class="w-[22px] h-[22px]"
          severity="secondary"
          text
        />
      </div>
    </template>
    <template #default>
      <LegendList :legend="props.legend" bold />
      <div class="flex items-start gap-3">
        <div>
          <InputNumber
            v-model="priorityValue"
            :invalid="priorityValueInvalid"
            :max="9999"
            :max-digit="4"
            :min="0"
            :value="priorityValue"
            class="!w-[160px]"
            input-number-class="[&_input]:!text-center"
            label="Tambah Nilai Prioritas"
            mandatory
            placeholder=""
            show-buttons
            use-validator
          />
          <ValidatorMessage
            :invalid="priorityValueInvalid"
            :message="priorityValueMessage"
          />
        </div>
        <div class="flex flex-col gap-1">
          <span class="invisible">Simpan</span>
          <Button
            :disabled="loading"
            @click="handleSubmit"
            label="Simpan"
            severity="success"
          />
        </div>
      </div>
      <TaskList :parent-task="props.parentTask" />
    </template>
  </Dialog>
</template>
