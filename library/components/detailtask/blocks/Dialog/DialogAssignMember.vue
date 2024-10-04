<script setup lang="ts">
import { computed, inject, Ref, ref, watch } from 'vue';

import DialogForm from 'lib/components/dialogform/DialogForm.vue';
import Dropdown from 'lib/components/dropdown/Dropdown.vue';
import useLoadingStore from 'lib/components/loading/store/loading.store';
import eventBus from 'lib/event-bus';
import MemberServices from 'lib/services/member.service';
import { DropdownOption } from 'lib/types/options.type';
import { TaskDetail } from 'lib/types/task.type';
import { useToast } from 'lib/utils';
import TaskServices from 'lib/services/task.service';
import { EditTaskDTO } from 'lib/dto/task.dto';
import { FormPayload } from 'lib/components/form/Form.vue.d';

const toast = useToast();
const { setLoading } = useLoadingStore();

const visible = defineModel<boolean>('visible', { required: true });

const taskId = inject<Ref<string>>('taskId');
const taskDetail = inject<Ref<TaskDetail>>('taskDetail');

const memberOptions = ref<DropdownOption[]>();
const memberLoading = ref<boolean>(false);

const initialMemberValue = computed(() => {
  if (taskDetail.value?.assignedTo.length === 1) {
    return taskDetail.value.assignedTo[0]._id;
  }

  return undefined;
});

const getMemberOptions = async (): Promise<void> => {
  try {
    memberLoading.value = true;

    // TODO: Filter berdasarkan team, module, dan submodule dari task yang dipilih
    const { data } = await MemberServices.getMemberList({
      team: JSON.stringify(taskDetail.value.team),
    });

    memberOptions.value = data.data.data.map((d) => ({
      label: d.nickName,
      value: d._id,
    }));
  } catch (error) {
    console.error(error);
    toast.add({
      message: 'Data Member gagal diambil.',
      severity: 'error',
      error,
    });
  } finally {
    memberLoading.value = false;
  }
};

const handleSubmit = async (payload: FormPayload): Promise<void> => {
  try {
    setLoading(true);

    const dataDTO: EditTaskDTO = {
      assignedTo: [payload.formValues.member] as unknown as string[],
    };

    await TaskServices.putEditTask(taskId.value, dataDTO);

    eventBus.emit('detail-task:update', { taskId: taskId.value });

    toast.add({
      message: 'Member telah di-assign.',
      severity: 'success',
    });
  } catch (error) {
    console.error(error);
    toast.add({
      message: 'Member gagal di-assign.',
      severity: 'error',
      error,
    });
  } finally {
    setLoading(false);
  }
};

watch(
  taskDetail,
  () => {
    // Set the initial member options
    memberOptions.value = taskDetail.value.assignedTo.map((member) => ({
      label: member.nickName,
      value: member._id,
    }));
  },
  { deep: true },
);
</script>

<template>
  <DialogForm
    v-model:visible="visible"
    :buttons-template="['cancel', 'submit']"
    :closable="false"
    :show-stay-checkbox="false"
    :use-clear-btn="false"
    @submit="handleSubmit"
    data-wv-name="dialog-assign-member"
    header="Member"
  >
    <template #fields>
      <Dropdown
        :initial-value="initialMemberValue"
        :loading="memberLoading"
        :options="memberOptions"
        @show="getMemberOptions"
        field-name="member"
        label="Member"
        mandatory
        option-label="label"
        option-value="value"
        placeholder="Pilih member"
        use-validator
        validator-message="Member harus dipilih."
      />
    </template>
  </DialogForm>
</template>
