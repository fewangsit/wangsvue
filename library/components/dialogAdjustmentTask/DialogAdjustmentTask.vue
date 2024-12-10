<script setup lang="ts">
import { ref, shallowRef, watch } from 'vue';
import { useToast } from 'lib/utils';
import { QueryParams } from '../datatable/DataTable.vue.d';
import { FormPayload } from '../form/Form.vue.d';
import {
  AssignedTo,
  DialogAdjustmentTaskBulkActionType,
  DialogAdjustmentTaskEmits,
  DialogAdjustmentTaskProps,
  DialogAdjustmentTaskSingleActionType,
  Task,
  TaskListResponse,
  UpdateTaskMemberItemLocal,
} from './DialogAdjustmentTask.vue.d';
import { Member } from 'lib/dto/member.dto';
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
import Icon from '../icon/Icon.vue';
import TaskDetail from '../taskdetail/TaskDetail.vue';
import SubModuleServices from 'lib/services/submodule.service';

const toast = useToast();

const props = withDefaults(defineProps<DialogAdjustmentTaskProps>(), {
  autoClose: false,
  preventAppear: false,
  closeOnSubmit: true,
  header: 'Assign Task',
});

const visibility = defineModel('visibility');
const emit = defineEmits<DialogAdjustmentTaskEmits>();
const actionType = shallowRef<'single' | 'bulk' | 'submitAll'>();

const selectedData = ref<Task[]>();
const singleSelectedData = shallowRef<Task>();

const unassignNewMember = ref<UpdateTaskMemberItemLocal[]>([]);
const memberListData =
  shallowRef<
    Pick<
      Member,
      '_id' | 'key' | 'nickName' | 'profilePictureBig' | 'progress'
    >[]
  >();

const dialogVisibility = shallowRef<boolean>(false);
const assignNewMemberVisbility = shallowRef<boolean>(false);
const dialogConfirmAssignVisibility = shallowRef<boolean>(false);
const dialogDetailTaskVisibility = shallowRef<boolean>(false);

const singleActionEmitter = (
  singleActipnType: DialogAdjustmentTaskSingleActionType,
): void => {
  actionType.value = 'single';
  selectedData.value = undefined;
  switch (singleActipnType) {
    case 'assign-new-member': {
      getMemberList(singleSelectedData.value.team);
      assignNewMemberVisbility.value = true;
      break;
    }
    case 'unassign-new-member': {
      unassignNewMember.value.push({
        task: singleSelectedData.value,
        newMember: [],
      });
      refreshDataTable();
      break;
    }
    case 'detail-task': {
      dialogDetailTaskVisibility.value = true;
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
      getMemberList(
        Array.from(new Set(selectedData.value.flatMap((item) => item.team))),
      );
      assignNewMemberVisbility.value = true;
      break;
    }
    case 'unassign-new-member': {
      selectedData.value.forEach((item) => {
        unassignNewMember.value.push({
          task: item,
          newMember: [],
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
      ...props.customQueryParams,
      member: props.members.map((item) => item.key),
    });
    const taskListData = data as TaskListResponse;

    if (taskListData?.data?.data?.length > 0) {
      visibility.value = true;
      dialogVisibility.value = true;
      return findUnassignMember(taskListData);
    }

    emit('emptyList');
    if (preventAppear) {
      dialogVisibility.value = false;
      visibility.value = false;
    }
    return findUnassignMember(taskListData);
  } catch (error) {
    emit('failedGetTaskList');
    console.error(error);
  }
};

const putNewAssign = async (
  payload: UpdateTaskMemberItemLocal[],
): Promise<void> => {
  try {
    await TaskServices.updateTaskMember({
      data: payload.map((item) => ({
        member: item?.newMember?.[0]?._id ?? '',
        task: item.task._id,
      })),
    });

    try {
      await updateTimeTaskTransfer(payload);
    } catch (error) {
      console.error(error);
    }

    refreshDataTable();
    emit('successAssignUnAssign');
    toast.add({
      message: 'Task telah dialihkan.',
      severity: 'success',
    });
  } catch (error) {
    emit('failedAssignUnAssign');
    toast.add({
      message: 'Task gagal dialihkan.',
      severity: 'error',
      error,
    });
  }
};

const updateTimeTaskTransfer = async (
  payload: UpdateTaskMemberItemLocal[],
): Promise<void> => {
  try {
    await Promise.all(
      payload.map((item) => {
        if (
          item.task.status !== 'Waiting for Approval' &&
          item.task.status !== 'Selesai' &&
          item.task.status !== 'Backlog' &&
          item.newMember.length > 0
        ) {
          return SubModuleServices.putTimelineTaskTransfer(
            item?.task?.subModule?._id,
            {
              sourceMemberId: item.task?.assignedTo?.[0]?._id,
              targetMemberId: item?.newMember?.[0]?._id,
            },
          );
        }
      }),
    );
    try {
      await getTaskList({ limit: 10, page: 1 });
    } catch (error) {
      console.error(error);
    }
  } catch (error) {
    console.error(error);
  }
};

const getMemberList = async (team: string[]): Promise<void> => {
  try {
    if (props.customMemberOptions?.length > 0) {
      memberListData.value = props.customMemberOptions;
      return;
    }
    const { data } = await MemberServices.getMemberList({
      team: team,
    });
    memberListData.value = data.data.data;
  } catch (error) {
    console.error(error);
  }
};

const refreshDataTable = (): void => {
  eventBus.emit('data-table:clear-selected-data', {
    tableName: 'dialog-addjustment-task',
  });
  eventBus.emit('data-table:update', {
    tableName: 'dialog-addjustment-task',
  });
};

const findUnassignMember = (
  taskListData: TaskListResponse,
): TaskListResponse => {
  const uniqueObject = new Set(
    unassignNewMember.value.reverse().map((item) => item.task._id),
  );

  const temporaryUniquObject = [];

  Array.from(uniqueObject).map((item) => {
    temporaryUniquObject.push(
      unassignNewMember.value.find((newMember) => newMember.task._id === item),
    );
  });

  unassignNewMember.value = temporaryUniquObject;

  if (unassignNewMember?.value?.length <= 0) {
    return taskListData;
  }

  return {
    data: {
      data: taskListData.data.data.map((item) => {
        const checkedData = unassignNewMember.value.find(
          (d) => d.task._id === item._id,
        );
        if (checkedData) {
          return {
            ...item,
            assignedTo: checkedData.newMember,
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

const confirmAssignUnassignMember = (
  action: 'single' | 'bulk' | 'submitAll',
): void => {
  if (action === 'submitAll') {
    putNewAssign(unassignNewMember.value);
    unassignNewMember.value = [];
  }
};

const assignMember = (
  action: 'single' | 'bulk' | 'submitAll',
  newMember: Member,
): void => {
  switch (action) {
    case 'single': {
      unassignNewMember.value.push({
        task: singleSelectedData.value,
        newMember: [newMember],
      });
      break;
    }
    case 'bulk': {
      selectedData.value.forEach((item) => {
        unassignNewMember.value.push({
          task: item,
          newMember: [newMember],
        });
      });
      break;
    }
  }
  refreshDataTable();
};

watch(
  visibility,
  (newValue: boolean) => {
    if (newValue) {
      if (props.preventAppear) {
        getTaskList({ limit: 10, page: 1 }, true);
        return;
      }
      dialogVisibility.value = true;
      return;
    }
    unassignNewMember.value = [];
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
    v-model:visible="dialogVisibility"
    :buttons-template="['cancel', 'submit']"
    :close-on-submit="closeOnSubmit"
    @close="$emit('cancel')"
    @submit="
      () => {
        actionType = 'submitAll';
        dialogConfirmAssignVisibility = true;
      }
    "
    closable
    header=""
    width="xlarge"
  >
    <template #header>
      <div class="flex flex-col gap-3">
        <p class="!text-base !leading-4 !font-semibold">{{ props.header }}</p>
        <p class="!text-xs !leading-4">
          Member Awal: {{ members?.map((item) => item?.nickName)?.join(', ') }}
        </p>
      </div>
    </template>
    <template #fields>
      <div class="flex flex-col gap-2">
        <DialogAddjustmentTaskHeader
          :bulk-action-emitter="bulkActionEmitter"
          :custom-filter-option="{
            taskStatus: props.customStatusFilter,
          }"
          :custom-query-params="customQueryParams"
          :member-keys="props.members.map((item) => item.key)"
        />
        <DataTable
          v-model:selected-data="selectedData"
          :columns="dialogAdjustmentTaskTableColumn"
          :fetch-function="getTaskList"
          :options="dialogAdjustmentTaskSingleAction(singleActionEmitter)"
          @toggle-option="
            (event) => {
              singleSelectedData = event as Task;
            }
          "
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
      (payload: FormPayload<{ dropdown: Member }>) => {
        assignMember(actionType, payload.formValues.dropdown);
      }
    "
    header="Assign Member Baru"
    submit-btn-label="Simpan"
  >
    <template #fields>
      <Dropdown
        :initial-value="singleSelectedData?.assignedTo?.[0]"
        :options="memberListData"
        label="Member"
        mandatory
        option-label="nickName"
        use-validator
        validator-message="Member harus diisi"
      />

      <div class="flex justify-between">
        <span class="flex gap-1 font-normal">
          <Icon class="!text-base !text-primary-400" icon="check-double-fill" />
          Progress Task: 50% (100/200)
        </span>
        <span class="!flex !text-primary-400">
          Detail
          <Icon class="text-base" icon="arrow-right" />
        </span>
      </div>
    </template>
  </DialogForm>

  <!-- Dialog Confirm Make User Aware assign member to task -->
  <DialogConfirm
    v-model:visible="dialogConfirmAssignVisibility"
    @confirm="confirmAssignUnassignMember(actionType)"
    @hide="unassignNewMember = []"
    close-label="Tetap di halaman ini"
    confirm-label="Lanjutkan"
    header="Pengalihan Task"
    message="Task yang sudah di-assign ke member baru akan langsung dialihkan dan task yang belum di-assign ke member baru akan menjadi Backlog. Apakah kamu yakin ingin melanjutkannya?"
    severity="success"
  />

  <TaskDetail
    v-model:visible="dialogDetailTaskVisibility"
    :project-id="singleSelectedData?.project?._id"
    :task-id="singleSelectedData?._id"
  />
</template>
