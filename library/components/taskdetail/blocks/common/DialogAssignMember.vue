<script setup lang="ts">
import { computed, inject, Ref, ref, shallowRef, watch } from 'vue';

import DialogForm from 'lib/components/dialogform/DialogForm.vue';
import Dropdown from 'lib/components/dropdown/Dropdown.vue';
import useLoadingStore from 'lib/components/loading/store/loading.store';
import { DropdownOption } from 'lib/types/options.type';
import { TaskDetailData } from 'lib/types/task.type';
import { useToast } from 'lib/utils';
import {
  TaskServices,
  ProjectTeamServices,
  SubModuleServices,
} from 'wangsit-api-services';
import { UpdateTaskMemberDTO } from 'lib/dto/task.dto';
import { FormPayload } from 'lib/components/form/Form.vue.d';
import { AssignedMember } from 'lib/components/dialogdetailpbi/DialogDetailPbi.vue.d';

const toast = useToast();
const { setLoading } = useLoadingStore();

const visible = defineModel<boolean>('visible', { required: true });

const props = defineProps<{
  /**
   * This task id prop is used in task table component, either single or bulk action.
   */
  taskIdProp?: string[];
  /**
   * This project id prop is used in task table component.
   */
  projectIdProp?: string;
}>();

const emit = defineEmits<{
  saved: [];
}>();

/**
 * This task id inject is used in task detail dialog.
 */
const taskIdFromInject = inject<Ref<string>>('taskId', undefined);
/**
 * This project id inject is used in task detail dialog.
 */
const projectIdFromInject = inject<Ref<string>>('projectId', undefined);

const taskDetail =
  inject<Ref<TaskDetailData>>('taskDetail', undefined) ?? ref<TaskDetailData>();

const assignedPbiMembers = inject<Ref<AssignedMember[]>>(
  'assignedPbiMembers',
  undefined,
);

const formKey = shallowRef<number>(0);

const memberOptions = ref<DropdownOption[]>();
const memberLoading = shallowRef<boolean>(false);

/**
 * Single task id, either props from task table or inject from task detail dialog.
 */
const taskId = computed(() => taskIdFromInject?.value ?? props.taskIdProp?.[0]);

const projectId = computed(
  () => projectIdFromInject?.value ?? props.projectIdProp,
);

const initialMemberValue = computed(() => {
  if (
    taskDetail?.value?.assignedTo?.length === 1 &&
    (props.taskIdProp?.length === 1 || taskIdFromInject?.value)
  ) {
    return taskDetail.value.assignedTo[0]._id;
  }

  return undefined;
});

const getDetailTask = async (): Promise<void> => {
  try {
    setLoading(true);

    const { data } = await TaskServices.getTaskDetail(taskId.value);

    taskDetail.value = data.data;
  } catch (error) {
    toast.add({
      message: 'Data Task Detail gagal diambil.',
      error,
    });
  } finally {
    formKey.value++;
    setLoading(false);
  }
};

const getMemberOptions = async (): Promise<void> => {
  if (taskDetail.value.subModule) {
    await getSubModuleTeamMembers();
  } else if (assignedPbiMembers?.value) {
    memberOptions.value = assignedPbiMembers?.value.map((member) => ({
      label: member.nickName,
      value: member._id,
    }));
  } else {
    await getProjectTeamMembers();
  }
};

const getProjectTeamMembers = async (): Promise<void> => {
  try {
    memberLoading.value = true;
    const { data } = await ProjectTeamServices.getProjectTeamMembers(
      projectId.value,
      taskDetail.value.team[0],
    );
    if (data.data?.length) {
      memberOptions.value = data.data[0].members.map((member) => ({
        label: member.nickName,
        value: member._id,
      }));
    }
  } catch (error) {
    toast.add({
      message: 'Data Member gagal dimuat.',
      error,
    });
  } finally {
    memberLoading.value = false;
  }
};

const getSubModuleTeamMembers = async (): Promise<void> => {
  try {
    memberLoading.value = true;

    const teamInitial = getTeamByInitial(taskDetail.value.team[0]);
    const params = {};
    params[teamInitial] = true;
    const { data } = await SubModuleServices.getSubmoduleOptions(
      projectId.value,
      params,
    );
    memberOptions.value = data.data[teamInitial];
  } catch (error) {
    toast.add({
      message: 'Data Member gagal dimuat.',
      error,
    });
  } finally {
    memberLoading.value = false;
  }
};

const getTeamByInitial = (initial: string): string => {
  switch (initial) {
    case 'FE':
      return 'frontend';
    case 'BE':
      return 'backend';
    case 'UIUX':
      return 'uiux';
    case 'MOB':
      return 'mobile';
    case 'IOT':
      return 'iot';
    case 'QC':
      return 'qc';
  }
};

const handleSubmit = async (payload: FormPayload): Promise<void> => {
  try {
    setLoading(true);

    const memberPayload = payload.formValues.member as unknown as string;

    const dataDTO: UpdateTaskMemberDTO = {
      data: props.taskIdProp?.length
        ? props.taskIdProp.map((id) => ({
            task: id,
            member: memberPayload,
          }))
        : [
            {
              task: taskId.value,
              member: memberPayload,
            },
          ],
    };

    await TaskServices.updateTaskMember(dataDTO);

    toast.add({
      message: 'Member telah di-assign.',
      severity: 'success',
    });

    emit('saved');
  } catch (error) {
    toast.add({
      message: 'Member gagal di-assign.',
      error,
    });
  } finally {
    setLoading(false);
  }
};

const setInitialMemberOptions = (): void => {
  memberOptions.value = taskDetail.value.assignedTo.map((member) => ({
    label: member.nickName,
    value: member._id,
  }));
};

watch(
  taskDetail,
  () => {
    setInitialMemberOptions();
  },
  { deep: true },
);

watch(visible, (value) => {
  if (value) {
    if (taskDetail.value?.assignedTo) {
      setInitialMemberOptions();
    }
    // Only load detail task if props.taskIdProp is defined
    if (props.taskIdProp?.length) {
      getDetailTask();
    }
  }
});
</script>

<template>
  <DialogForm
    :key="formKey"
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
