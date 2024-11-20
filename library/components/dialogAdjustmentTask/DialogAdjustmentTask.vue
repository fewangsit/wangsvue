<script setup lang="ts">
import { ref, shallowRef, watch } from 'vue';
import { QueryParams } from '../datatable/DataTable.vue.d';
import { UpdateTaskMemberDTO, UpdateTaskMemberItem } from 'lib/dto/task.dto';
import { FormPayload } from '../form/Form.vue.d';
import { DropdownOption } from 'lib/types/options.type';
import {
  DialogAdjustmentTaskBulkActionType,
  DialogAdjustmentTaskEmits,
  DialogAdjustmentTaskProps,
  DialogAdjustmentTaskSingleActionType,
  Task,
  TaskListResponse,
} from './DialogAdjustmentTask.vue.d';
import { dialogAdjustmentTaskTableColumn } from './options/dialogAdjustmentTaskTableColumn';
import { dialogAdjustmentTaskSingleAction } from './options/dialogAdjustmentTaskSingleAction';

import TaskServices from 'lib/services/task.service';
import DialogForm from '../dialogform/DialogForm.vue';
import DialogAddjustmentTaskHeader from './DialogAdjustmentTaskHeader.vue';
import DataTable from '../datatable/DataTable.vue';
import MemberServices from 'lib/services/member.service';
import Dropdown from '../dropdown/Dropdown.vue';
import eventBus from 'lib/event-bus';
import DialogConfirm from '../dialogconfirm/DialogConfirm.vue';

const props = withDefaults(defineProps<DialogAdjustmentTaskProps>(), {
  autoClose: false,
  preventAppear: false,
  closeOnSubmit: true,
});

const visibility = defineModel('visibility');
const emit = defineEmits<DialogAdjustmentTaskEmits>();
const actionType = shallowRef<'single' | 'bulk'>();

const selectedData = ref<Task[]>();
const singleSelectedData = shallowRef<Task>();

const unassignNewMember = ref<UpdateTaskMemberItem[]>([]);
const memberListData = shallowRef<DropdownOption[]>();
const newMemberPayload = shallowRef<string>();

const dialogVisibility = shallowRef<boolean>(false);
const assignNewMemberVisbility = shallowRef<boolean>(false);
const dialogConfirmAssignVisibility = shallowRef<boolean>(false);

const singleActionEmitter = (
  singleActipnType: DialogAdjustmentTaskSingleActionType,
): void => {
  actionType.value = 'single';
  selectedData.value = undefined;
  switch (singleActipnType) {
    case 'assign-new-member': {
      unassignNewMember.value = [];
      getMemberList(singleSelectedData.value.team);
      assignNewMemberVisbility.value = true;
      break;
    }
    case 'unassign-new-member': {
      unassignNewMember.value.push({
        task: singleSelectedData.value._id,
        member: '',
      });
      refreshDataTable();
      break;
    }
    case 'detail-task': {
      break;
    }
  }
};

const bulkActionEmitter = (
  bulkActionType: DialogAdjustmentTaskBulkActionType,
): void => {
  actionType.value = 'bulk';
  singleSelectedData.value = undefined;
  switch (bulkActionType) {
    case 'assign-new-member': {
      unassignNewMember.value = [];
      getMemberList(
        Array.from(new Set(selectedData.value.flatMap((item) => item.team))),
      );
      assignNewMemberVisbility.value = true;
      break;
    }
    case 'unassign-new-member': {
      selectedData.value.forEach((item) => {
        unassignNewMember.value.push({
          task: item._id,
          member: '',
        });
      });
      refreshDataTable();
      break;
    }
  }
};

const getTaskList = async (
  params?: QueryParams,
  preventAppear?: boolean,
): Promise<TaskListResponse> => {
  try {
    const { data } = await TaskServices.getTaskList({
      ...params,
      member: JSON.stringify(props.members.map((item) => item._id)),
    });
    const taskListData = data as TaskListResponse;

    if (taskListData?.data?.data?.length > 0) {
      visibility.value = true;
      dialogVisibility.value = true;
      return findUnassignMember(taskListData);
    }

    if (preventAppear) {
      dialogVisibility.value = false;
      visibility.value = false;
      emit('emptyList');
    }
    return findUnassignMember(taskListData);
  } catch (error) {
    console.error(error);
  }
};

const putNewAssign = async (payload: UpdateTaskMemberDTO): Promise<void> => {
  try {
    await TaskServices.updateTaskMember(payload);
    refreshDataTable();
    emit('successAssignUnAssign');
  } catch (error) {
    emit('failedAssignUnAssign');
    console.error(error);
  }
};

const getMemberList = async (team: string[]): Promise<void> => {
  try {
    const { data } = await MemberServices.getMemberList({
      team: JSON.stringify(team),
    });
    memberListData.value = data.data.data.map((item) => {
      return {
        label: item.nickName,
        value: item._id,
      };
    });
  } catch (error) {
    console.error(error);
  }
};

const refreshDataTable = (): void => {
  eventBus.emit('data-table:update', {
    tableName: 'dialog-addjustment-task',
  });
};

const findUnassignMember = (
  taskListData: TaskListResponse,
): TaskListResponse => {
  if (unassignNewMember?.value?.length <= 0) {
    return taskListData;
  }
  return {
    data: {
      data: taskListData.data.data.map((item) => {
        const unassignNewMemberUnique = Array.from(
          new Set(unassignNewMember.value),
        );
        if (unassignNewMemberUnique.some((d) => d.task === item._id)) {
          return {
            ...item,
            assignedTo: [],
          };
        }
        return item;
      }),
      totalRecords: taskListData.data.totalRecords,
    },
    message: taskListData.message,
    status: taskListData.status,
  };
};

watch(
  visibility,
  (newValue: boolean) => {
    if (newValue) {
      if (props.preventAppear) {
        getTaskList({}, true);
        return;
      }
      dialogVisibility.value = true;
      return;
    }
    dialogVisibility.value = false;
  },
  {
    immediate: true,
  },
);

watch(
  dialogVisibility,
  (newValue: boolean) => {
    if (!newValue) {
      visibility.value = false;
      unassignNewMember.value = [];
    }
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <!-- Main Dialog adjustment -->
  <DialogForm
    v-if="dialogVisibility"
    v-model:visible="dialogVisibility"
    :buttons-template="['cancel', 'submit']"
    :close-on-submit="closeOnSubmit"
    @submit="
      () => {
        putNewAssign({
          data: unassignNewMember,
        });
      }
    "
    closable
    header=""
    width="xlarge"
  >
    <template #header>
      <div class="flex flex-col gap-3">
        <p class="!text-base !leading-4 !font-semibold">Assign Task</p>
        <p class="!text-xs !leading-4">
          Member Awal: {{ members?.map((item) => item?.nickName)?.join(', ') }}
        </p>
      </div>
    </template>
    <template #fields>
      <div class="flex flex-col gap-2">
        <DialogAddjustmentTaskHeader
          :bulk-action-emitter="bulkActionEmitter"
          :member-ids="props.members.map((item) => item._id)"
        />
        <DataTable
          v-model:selected-data="selectedData"
          :columns="dialogAdjustmentTaskTableColumn"
          :fetch-function="getTaskList"
          :options="dialogAdjustmentTaskSingleAction(singleActionEmitter)"
          @toggle-option="singleSelectedData = $event"
          table-name="dialog-addjustment-task"
          use-option
          use-paginator
        />
      </div>
    </template>
  </DialogForm>

  <!-- Dialog To Assign New Member  -->
  <DialogForm
    v-model:visible="assignNewMemberVisbility"
    :buttons-template="['cancel', 'submit']"
    @submit="
      (payload: FormPayload<{ dropdown: string }>) => {
        dialogConfirmAssignVisibility = true;
        newMemberPayload = payload.formValues.dropdown;
        refreshDataTable();
      }
    "
    header="Assign Member Baru"
    submit-btn-label="Simpan"
  >
    <template #fields>
      <Dropdown
        :initial-value="singleSelectedData?.assignedTo?.[0]?._id"
        :options="memberListData"
        label="Member"
        mandatory
        option-label="label"
        option-value="value"
        use-validator
        validator-message="Member harus diisi"
      />
    </template>
  </DialogForm>

  <!-- Dialog Confirm Make User Aware assign member to task -->
  <DialogConfirm
    v-model:visible="dialogConfirmAssignVisibility"
    @confirm="
      () => {
        if (actionType === 'single') {
          putNewAssign({
            data: [
              {
                member: newMemberPayload,
                task: singleSelectedData._id,
              },
            ],
          });
          return;
        }
        putNewAssign({
          data: selectedData.map((item) => ({
            member: newMemberPayload,
            task: item._id,
          })),
        });
      }
    "
    close-label="Tetap di halaman ini"
    confirm-label="Lanjutkan"
    header="Pengalihan Task"
    message="Task yang sudah di-assign ke member baru akan langsung dialihkan dan task yang belum di-assign ke member baru akan menjadi Backlog. Apakah kamu yakin ingin melanjutkannya?"
    severity="success"
  />
</template>
