<script setup lang="ts">
import { inject, Ref, ref } from 'vue';

import InputNumber from 'lib/components/inputnumber/InputNumber.vue';
import { useToast } from 'lib/utils';
import useLoadingStore from 'lib/components/loading/store/loading.store';
import { EditTaskDTO } from 'lib/dto/task.dto';
import TaskServices from 'lib/services/task.service';
import eventBus from 'lib/event-bus';
import DialogForm from 'lib/components/dialogform/DialogForm.vue';
import { FormPayload } from 'lib/components/form/Form.vue.d';

const taskId = inject<Ref<string>>('taskId');

const { setLoading } = useLoadingStore();
const toast = useToast();

const visible = defineModel<boolean>('visible', { required: true });

const props = defineProps<{
  priorityValue?: number;
}>();

const priorityValueInvalid = ref<boolean>(false);

const handleSubmit = async (e: FormPayload): Promise<void> => {
  try {
    setLoading(true);

    const body: EditTaskDTO = {
      priority: e.formValues?.priorityValue as unknown as number,
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
</script>

<template>
  <DialogForm
    v-model:visible="visible"
    :buttons-template="['cancel', 'submit']"
    :closable="false"
    :show-stay-checkbox="false"
    :use-clear-btn="false"
    @submit="handleSubmit"
    data-wv-name="dialog-priority-value"
    header="Nilai Prioritas"
  >
    <template #fields>
      <InputNumber
        :invalid="priorityValueInvalid"
        :max="9999"
        :max-digit="4"
        :min="0"
        :value="props.priorityValue"
        class="!w-full"
        field-name="priorityValue"
        label="Tambah Nilai Prioritas"
        mandatory
        placeholder="0"
        use-validator
      />
    </template>
  </DialogForm>
</template>
