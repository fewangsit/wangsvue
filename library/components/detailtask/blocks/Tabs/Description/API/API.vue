<script setup lang="ts">
import { inject, onMounted, ref, Ref } from 'vue';
import Icon from 'lib/components/icon/Icon.vue';
import Changelog from 'lib/components/changelog/Changelog.vue';
import Button from 'lib/components/button/Button.vue';
import TaskApiItem from './APIItem.vue';
import DialogAddEditApi from './DialogAddEditApi.vue';
import TaskApiServices from 'lib/services/taskApi.service';
import { TaskAPIFormDataCustom } from 'lib/types/task.type';
import { useToast } from 'lib/utils';

const toast = useToast();

onMounted(() => {
  getTaskAPIs();
});

const taskId = inject<Ref<string>>('taskId');

const dialogAddApi = ref(false);
const dialogEditApi = ref(false);
const taskApis = ref<TaskAPIFormDataCustom[]>();
const selectedTaskApi = ref<TaskAPIFormDataCustom>();

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
        <Changelog object="objects" />
        <Button
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
        @deleted="getTaskAPIs"
        @open-edit="openRenameDialog(index)"
        @updated="getTaskAPIs"
      />
    </div>
  </div>

  <DialogAddEditApi
    v-model:visible="dialogAddApi"
    @updated="getTaskAPIs"
    type="add"
  />
  <DialogAddEditApi
    v-model:visible="dialogEditApi"
    :task-api="selectedTaskApi"
    @updated="getTaskAPIs"
    type="edit"
  />
</template>
