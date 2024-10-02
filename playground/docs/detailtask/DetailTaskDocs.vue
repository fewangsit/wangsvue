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

const toast = useToast();

onMounted(() => {
  setJWTToken();
});

onUnmounted(() => {
  localStorage.clear();
});

const showDetailTask = ref<boolean>(false);
const showNewTask = ref<boolean>(false);
const invalidTaskInput = ref<boolean>(false);
const invalidTokenInput = ref<boolean>(false);
const invalidMessage = ref<CustomValidation>();

const taskId = ref<string>('66fb6b394374e14b8768debf');
const jwtToken = ref<string>(
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZDE3NzFjMWViZTUzNDRiYzJiOWRhYiIsImlhdCI6MTcyNjU0MjI3Nn0.euXnP_TUc5kv2236kGv2zsFvwgp6ZlT8QCdY8nUaypk',
);

const handleShowTask = (): void => {
  if (!jwtToken.value) {
    invalidTokenInput.value = true;
    invalidMessage.value = {
      empty: 'JWT Token harus diisi.',
    };
  }

  if (!taskId.value) {
    invalidTaskInput.value = true;
    invalidMessage.value = {
      empty: 'Task ID harus diisi.',
    };
  }

  if (!jwtToken.value || !taskId.value) return;

  showDetailTask.value = true;
};

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

  eventBus.emit('data-table:update', { tableName: 'task-table' });
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

watch(taskId, () => {
  invalidTaskInput.value = false;
  invalidMessage.value = undefined;
});

watch(jwtToken, () => {
  invalidTokenInput.value = false;
  invalidMessage.value = undefined;
});
</script>

<template>
  <Toast />
  <DetailTask v-model:visible="showDetailTask" :task-id="taskId" />
  <DetailTask v-model:visible="showNewTask" />
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
                v-model="taskId"
                :invalid="invalidTaskInput"
                :validator-message="invalidMessage"
                label="Task ID"
                mandatory
                placeholder="Paste Task ID"
                use-validator
              />
            </div>
            <Button
              @click="handleShowTask"
              label="Show Detail Task"
              severity="secondary"
            />
          </div>
          <div class="flex justify-start gap-3">
            <Button
              @click="showNewTask = true"
              label="Show Detail Task (New Task)"
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
          :use-option="false"
          data-key="_id"
          selection-type="none"
          table-name="task-table"
        />
      </div>
    </template>
  </Card>
</template>
