<script setup lang="ts">
import {
  computed,
  ComputedRef,
  inject,
  onMounted,
  ref,
  Ref,
  shallowRef,
} from 'vue';
import Icon from 'lib/components/icon/Icon.vue';
import Button from 'lib/components/button/Button.vue';
import TaskApiItem from './APIItem.vue';
import DialogAddEditApi from './DialogAddEditApi.vue';
import { TaskApiServices } from 'wangsit-api-services';
import { TaskAPIFormDataCustom, TaskDetailData } from 'lib/types/task.type';
import { useToast } from 'lib/utils';
import { WangsitStatus } from 'lib/types/wangsStatus.type';
import { DetailTaskEmits } from 'lib/components/taskdetail/TaskDetail.vue.d';

const toast = useToast();

onMounted(() => {
  getTaskAPIs();
});

const userType =
  inject<ComputedRef<'member' | 'admin' | 'pm' | 'teamLeader' | 'guest'>>(
    'userType',
  );
const taskId = inject<Ref<string>>('taskId');
const taskDetail = inject<Ref<TaskDetailData>>('taskDetail');
const isApproverHasAccess = inject<Ref<boolean>>('isApproverHasAccess');
const refreshTaskHandler =
  inject<(eventName: keyof DetailTaskEmits, id?: string) => Promise<void>>(
    'refreshTaskHandler',
  );

const dialogAddApi = shallowRef<boolean>(false);
const dialogEditApi = shallowRef<boolean>(false);
const taskApis = ref<TaskAPIFormDataCustom[]>();
const selectedTaskApi = ref<TaskAPIFormDataCustom>();

const isDisabled = computed(() => {
  const disabledStatus = (
    ['Selesai', 'Reported Bug'] as WangsitStatus[]
  ).includes(taskDetail.value?.status);

  return (
    disabledStatus || (userType.value === 'guest' && !isApproverHasAccess.value)
  );
});

const getTaskAPIs = async (): Promise<void> => {
  try {
    const { data } = await TaskApiServices.getTaskAPIs(taskId.value);
    taskApis.value = data.data.map((d) => ({
      ...d,
      url: !d.url?.length ? undefined : d.url,
      anyChanges: false,
      formDataBody: d.formDataBody.map((body) => ({
        ...body,
        isMandatory: body?.isMandatory ? 'ya' : 'tidak',
      })),
    }));
  } catch (error) {
    toast.add({
      message: 'API gagal dimuat.',
      error,
    });
  }
};

const reloadTask = (): void => {
  refreshTaskHandler('update', taskId.value);
};

const onUpdatedTaskApi = async (): Promise<void> => {
  await getTaskAPIs();
  reloadTask();
};

const openRenameDialog = (index: number): void => {
  selectedTaskApi.value = taskApis.value[index];
  dialogEditApi.value = true;
};
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex justify-between items-center">
      <div class="flex items-center gap-2">
        <Icon class="text-2xl" icon="cloud-line" />
        <span class="text-xs font-semibold">API</span>
      </div>
      <div class="flex items-center gap-2">
        <Button
          :disabled="isDisabled"
          @click="dialogAddApi = true"
          icon="add"
          label="API"
          severity="secondary"
        />
      </div>
    </div>

    <div class="pl-8 grid gap-3">
      <TaskApiItem
        :key="api._id"
        v-for="(api, index) in taskApis"
        v-model:task-api="taskApis[index]"
        :disabled="isDisabled"
        :project="taskDetail.project"
        @deleted="onUpdatedTaskApi"
        @open-edit="openRenameDialog(index)"
        @updated="onUpdatedTaskApi"
      />
    </div>
  </div>

  <DialogAddEditApi
    v-model:visible="dialogAddApi"
    @updated="onUpdatedTaskApi"
    type="add"
  />
  <DialogAddEditApi
    v-model:visible="dialogEditApi"
    :task-api="selectedTaskApi"
    @updated="onUpdatedTaskApi"
    type="edit"
  />
</template>
