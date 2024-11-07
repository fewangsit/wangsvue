<script setup lang="ts">
import { inject, Ref } from 'vue';

import DialogForm from 'lib/components/dialogform/DialogForm.vue';
import useLoadingStore from 'lib/components/loading/store/loading.store';
import { useToast } from 'lib/utils';
import InputText from 'lib/components/inputtext/InputText.vue';
import { FormPayload } from 'lib/components/form/Form.vue.d';
import TaskApiServices from 'lib/services/taskApi.service';
import { AddTaskApiDTO, UpdateTaskApiDTO } from 'lib/dto/taskApi.dto';
import { TaskAPI, TaskAPIFormDataCustom } from 'lib/types/task.type';

const { setLoading } = useLoadingStore();
const toast = useToast();

const taskId = inject<Ref<string>>('taskId');

const visible = defineModel<boolean>('visible', { required: true });

const props = defineProps<{
  type: 'add' | 'edit';
  taskApi?: TaskAPI | TaskAPIFormDataCustom;
}>();

const emit = defineEmits<{
  updated: [];
}>();

const handleSubmit = async (e: FormPayload): Promise<void> => {
  try {
    setLoading(true);

    let body: AddTaskApiDTO | UpdateTaskApiDTO;
    let toastMessage: string;

    if (props.type === 'add') {
      body = {
        name: e.formValues?.name as unknown as string,
        task: taskId?.value,
      };
      toastMessage = 'API telah ditambahkan.';
    } else {
      body = {
        name: e.formValues?.name as unknown as string,
      };
      toastMessage = 'API telah diubah.';
    }

    const { data } =
      props.type === 'add'
        ? await TaskApiServices.addTaskAPI(body as AddTaskApiDTO)
        : await TaskApiServices.updateTaskAPI(
            props.taskApi?._id,
            body as UpdateTaskApiDTO,
          );
    if (data) {
      toast.add({
        message: toastMessage,
        severity: 'success',
      });

      emit('updated');

      visible.value = false;
    }
  } catch (error) {
    toast.add({
      message:
        props.type === 'add' ? 'API gagal ditambahkan.' : 'API gagal diubah.',
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
    :buttons-template="['cancel', 'clear', 'submit']"
    :closable="false"
    :close-on-submit="false"
    :header="props.type === 'add' ? 'Tambah API' : 'Ubah Nama API'"
    :reset-after-submit="false"
    :show-stay-checkbox="false"
    :use-clear-btn="false"
    @submit="handleSubmit"
    data-wv-name="dialog-add-api"
  >
    <template #fields>
      <InputText
        v-focus
        :validator-message="{
          empty: 'Nama endpoint harus diisi.',
        }"
        :value="props.taskApi?.name"
        field-name="name"
        label="Nama Endpoint"
        mandatory
        placeholder="Tulis nama endpoint"
        use-validator
      />
    </template>
  </DialogForm>
</template>
