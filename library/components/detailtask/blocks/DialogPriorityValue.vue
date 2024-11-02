<script setup lang="ts">
import { inject, Ref, ref, watch } from 'vue';

import InputNumber from 'lib/components/inputnumber/InputNumber.vue';
import Button from 'lib/components/button/Button.vue';
import Dialog from 'lib/components/dialog/Dialog.vue';
import ValidatorMessage from 'lib/components/validatormessage/ValidatorMessage.vue';
import { useToast } from 'lib/utils';
import useLoadingStore from 'lib/components/loading/store/loading.store';
import TaskList from './Tabs/InfoTask/TaskList/TaskList.vue';
import { EditTaskDTO } from 'lib/dto/task.dto';
import TaskServices from 'lib/services/task.service';
import eventBus from 'lib/event-bus';

const DialogPreset = inject<Record<string, any>>('preset', {}).dialog;
const taskId = inject<Ref<string>>('taskId');

const { loading, setLoading } = useLoadingStore();
const toast = useToast();

const visible = defineModel<boolean>('visible', { required: true });

const priorityValue = ref<number>();
const priorityValueMessage = ref<string>();
const priorityValueInvalid = ref<boolean>(false);

const handleSubmit = async (): Promise<void> => {
  try {
    setLoading(true);
    const body: EditTaskDTO = {
      priority: priorityValue.value,
    };

    const { data } = await TaskServices.putEditTask(taskId.value, body);

    if (data) {
      toast.add({
        message: 'Nilai prioritas telah disimpan.',
        severity: 'success',
      });

      eventBus.emit('detail-task:update', { taskId: taskId.value });

      visible.value = false;
    }
  } catch (error) {
    /*
     * TODO: Adjust error message from backend later.
     * if (error.message === 'Priority value taken') {
     *   priorityValueMessage.value = 'Nilai prioritas sudah ada';
     *   priorityValueInvalid.value = true;
     * }
     */

    toast.add({
      message: 'Nilai prioritas gagal disimpan.',
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
          '!w-[500px]',
        ],
        'data-wv-name': 'dialog-nilai-prioritas',
      }),
      header: {
        class: [...DialogPreset.header.class],
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
      <div class="flex items-start gap-3">
        <div class="w-full">
          <InputNumber
            v-model="priorityValue"
            :invalid="priorityValueInvalid"
            :max="9999"
            :max-digit="4"
            :min="0"
            :value="priorityValue"
            class="!w-full"
            label="Tambah Nilai Prioritas"
            mandatory
            placeholder=""
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
      <TaskList />
    </template>
  </Dialog>
</template>
