<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';

import DocTitle from '../DocTitle.vue';
import DetailTask from 'lib/components/detailtask/DetailTask.vue';
import Button from 'lib/components/button/Button.vue';
import Card from 'lib/components/card/Card.vue';
import Toast from 'lib/components/toast/Toast.vue';
import InputText from 'lib/components/inputtext/InputText.vue';
import { CustomValidation } from 'lib/components/form/Form.vue.d';
import { useToast } from 'lib/utils';
import DataTable from 'lib/components/datatable/DataTable.vue';
import {
  FetchResponse,
  TableCellComponent,
} from 'lib/components/datatable/DataTable.vue.d';
import Badge from 'lib/components/badge/Badge.vue';
import TaskServices from 'lib/services/task.service';
import eventBus from 'lib/event-bus';
import { TaskDetail } from 'lib/types/task.type';

const toast = useToast();

onMounted(() => {
  setJWTToken();
});

onUnmounted(() => {
  localStorage.clear();
});

const selectedItem = ref<TaskDetail>();

const showDetailTask = ref<boolean>(false);
const showNewTask = ref<boolean>(false);
const invalidTaskInput = ref<boolean>(false);
const invalidTokenInput = ref<boolean>(false);
const invalidProjectInput = ref<boolean>(false);
const invalidMessage = ref<CustomValidation>();

const jwtToken = ref<string>(
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZDE3NzFjMWViZTUzNDRiYzJiOWRhYiIsImlhdCI6MTcyNjU0MjI3Nn0.euXnP_TUc5kv2236kGv2zsFvwgp6ZlT8QCdY8nUaypk',
);
const projectId = ref<string>('66e901c165b533fbe0c72c03');

const setJWTToken = (): void => {
  if (!jwtToken.value) {
    invalidTokenInput.value = true;
    invalidMessage.value = {
      empty: 'JWT Token harus diisi.',
    };

    return;
  }

  localStorage.setItem(
    'user',
    JSON.stringify({
      jwt: jwtToken.value,
    }),
  );

  toast.add({
    message: 'JWT Token berhasil disimpan.',
    severity: 'success',
  });

  refreshTable();
};

const setProjectId = (): void => {
  if (!jwtToken.value) {
    invalidProjectInput.value = true;
    invalidMessage.value = {
      empty: 'Project ID harus diisi.',
    };

    return;
  }

  sessionStorage.setItem('projectId', projectId.value);

  toast.add({
    message: 'Project ID berhasil disimpan.',
    severity: 'success',
  });

  refreshTable();
};

const getTaskList = async (
  params: Record<string, string>,
): Promise<FetchResponse | undefined> => {
  try {
    const { data } = await TaskServices.getTaskList(params);

    return data;
  } catch (error) {
    console.error(error);
    toast.add({
      message: 'Data Task gagal diambil.',
      severity: 'error',
      error,
    });
  }
};

const refreshTable = (): void => {
  eventBus.emit('data-table:update', { tableName: 'task-table' });
};

watch(jwtToken, () => {
  invalidTokenInput.value = false;
  invalidMessage.value = undefined;
});

watch(projectId, () => {
  invalidProjectInput.value = false;
  invalidMessage.value = undefined;
});
</script>

<template>
  <Toast />
  <DetailTask
    v-model:visible="showDetailTask"
    :task-id="selectedItem?._id ?? ''"
    @create="refreshTable"
    @update="refreshTable"
  />
  <DetailTask
    v-model:visible="showNewTask"
    @create="refreshTable"
    @update="refreshTable"
  />
  <Card>
    <template #header>
      <DocTitle name="Detail Task" />
    </template>
    <template #content>
      <div class="flex flex-col gap-6">
        <div
          :class="[
            {
              'items-end': !invalidTaskInput,
              'items-center': invalidTaskInput,
            },
          ]"
          class="flex justify-between"
        >
          <div
            :class="[
              {
                'items-end': !invalidTaskInput,
                'items-center': invalidTaskInput,
              },
            ]"
            class="flex gap-3"
          >
            <div>
              <InputText
                v-model="jwtToken"
                :invalid="invalidTokenInput"
                :validator-message="invalidMessage"
                label="JWT Token"
                mandatory
                placeholder="Paste JWT Token"
                use-validator
              />
            </div>
            <Button
              @click="setJWTToken"
              label="Set JWT Token"
              severity="success"
            />
            <div>
              <InputText
                v-model="projectId"
                :invalid="invalidProjectInput"
                :validator-message="invalidMessage"
                label="Project ID"
                mandatory
                placeholder="Paste Project ID"
                use-validator
              />
            </div>
            <Button
              @click="setProjectId"
              label="Set Project ID"
              severity="success"
            />
          </div>
          <div class="flex justify-start gap-3">
            <Button
              @click="showNewTask = true"
              label="Create Task"
              severity="secondary"
            />
          </div>
        </div>
        <DataTable
          :columns="[
            {
              header: 'Task ID',
              field: '_id',
              sortable: false,
              class: '!w-[300px] !max-w-[300px]',
            },
            {
              header: 'Task Name',
              field: 'name',
              sortable: false,
              class: '!w-[300px] !max-w-[300px] text-ellipsis',
            },
            {
              header: 'Task Status',
              field: 'status',
              sortable: false,
              bodyComponent(data: any): TableCellComponent {
                return {
                  component: Badge,
                  props: {
                    label: data.status,
                  },
                };
              },
            },
          ]"
          :custom-column="false"
          :fetch-function="getTaskList"
          :options="[
            {
              label: 'Detail Task',
              icon: 'file-copy-2-line',
              command: (): void => {
                showDetailTask = true;
              },
            },
          ]"
          @toggle-option="selectedItem = $event as TaskDetail"
          data-key="_id"
          selection-type="none"
          table-name="task-table"
        />
      </div>
    </template>
  </Card>
</template>
