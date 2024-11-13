<script setup lang="ts">
import { computed, ref } from 'vue';
import { MenuItem } from '../menuitem';
import QuickFilter from '../quickfilter/QuickFilter.vue';
import FilterContainer from '../filtercontainer/FilterContainer.vue';
import ButtonSearch from '../buttonsearch/ButtonSearch.vue';
import ButtonDownload from '../buttondownload/ButtonDownload.vue';
import ButtonFilter from '../buttonfilter/ButtonFilter.vue';
import eventBus from 'lib/event-bus';
import {
  FetchResponse,
  QueryParams,
  ShortFetchResponse,
  TableCellComponent,
  TableColumn,
} from '../datatable/DataTable.vue.d';
import { FilterMatchMode } from '../datatable/helpers/filter.helper';
import { FilterField } from '../filtercontainer/FilterContainer.vue.d';
import { MultiSelectOption } from 'lib/types/options.type';
import DataTable from '../datatable/DataTable.vue';
import TaskServices from 'lib/services/task.service';
import { TaskTableProps } from './TaskTable.vue.d';
import { TaskTableItem, TaskTableOptionQuery } from 'lib/types/task.type';
import Badge from '../badge/Badge.vue';
import { useToast } from 'lib/utils';
import DependencyCol from './DependencyCol.vue';
import Button from '../button/Button.vue';
import TaskDetail from '../taskdetail/TaskDetail.vue';
import DialogConfirmDeleteTask from '../taskdetail/blocks/common/DialogConfirmDeleteTask.vue';
import DialogAssignMember from '../taskdetail/blocks/common/DialogAssignMember.vue';
import DialogReviewLeader from '../taskdetail/blocks/sections/Review/DialogReviewLeader.vue';
import DialogFinishReview from '../taskdetail/blocks/sections/Review/DialogFinishReview.vue';
import TaskChecklistServices from 'lib/services/taskChecklist.service';
import { useLoadingStore } from 'lib/build-entry';
import DialogConfirmFinishTask from '../taskdetail/blocks/common/DialogConfirmFinishTask.vue';
import UserGroup from '../usergroup/UserGroup.vue';
import ButtonBulkAction from '../buttonbulkaction/ButtonBulkAction.vue';

const toast = useToast();
const { setLoading } = useLoadingStore();

const props = defineProps<TaskTableProps>();

const quickFilterField: FilterField[] = [
  {
    fields: ['minPriority', 'maxPriority'],
    type: 'rangenumber',
    placeholder: '0',
    tooltip: 'Nilai Prioritas',
  },
  {
    field: 'member',
    type: 'multiselect',
    placeholder: 'Pilih member',
    fetchOptionFn: () => getTaskOptionsByTab('memberOptions'),
  },
  {
    field: 'project',
    type: 'multiselect',
    placeholder: 'Pilih proyek',
    fetchOptionFn: () => getTaskOptionsByTab('projectOptions'),
  },
  {
    field: 'module',
    type: 'multiselect',
    placeholder: 'Pilih modul',
    fetchOptionFn: () => getTaskOptionsByTab('moduleOptions'),
  },
  {
    field: 'task',
    type: 'multiselect',
    placeholder: 'Pilih task',
    fetchOptionFn: () => getTaskOptionsByTab('taskOptions'),
  },
  {
    field: 'status',
    type: 'multiselect',
    placeholder: 'Pilih Status',
    fetchOptionFn: (): MultiSelectOption[] => [
      {
        label: 'Selesai',
        value: 'Selesai',
      },
      {
        label: 'Pending Review Leader',
        value: 'Pending Review Leader',
      },
      {
        label: 'Sprint',
        value: 'Sprint',
      },
      {
        label: 'Fixing Bug',
        value: 'Fixing Bug',
      },
      {
        label: 'Reported Bug',
        value: 'Reported Bug',
      },
      {
        label: 'Penyesuaian',
        value: 'Penyesuaian',
      },
    ],
  },
];

const filterFields: FilterField[] = [
  {
    label: 'Sub Modul',
    field: 'subModule',
    type: 'multiselect',
    placeholder: 'Pilih sub modul',
    fetchOptionFn: () => getTaskOptionsByTab('subModuleOptions'),
  },
  {
    label: 'Proses',
    field: 'process',
    type: 'multiselect',
    placeholder: 'Pilih proses',
    fetchOptionFn: () => getTaskOptionsByTab('processOptions'),
  },
  {
    label: 'Dependensi',
    field: 'dependencyStatus',
    type: 'multiselect',
    placeholder: 'Pilih dependensi status',
    fetchOptionFn: (): MultiSelectOption[] => [
      {
        label: 'Tidak Ada',
        value: 'Tidak Ada',
      },
      {
        label: 'Belum Selesai',
        value: 'Belum Selesai',
      },
      {
        label: 'Selesai',
        value: 'Selesai',
      },
    ],
  },
  {
    label: 'Reported Bug (Kali)',
    fields: ['minTimeReportedBug', 'maxTimeReportedBug'],
    type: 'rangenumber',
    placeholder: '0',
  },
  {
    label: 'Last Modified Status',
    type: 'calendar',
    field: 'lastUpdatedAt',
    placeholder: 'Pilih tanggal',
  },
];

const userData = JSON.parse(localStorage.getItem('user') as string);

const showFilter = ref(false);
const dialogNewTask = ref(false);
const dialogDetailTask = ref(false);
const dialogAssignMember = ref(false);
const dialogConfirmDeleteTask = ref(false);
const dialogConfirmFinishTask = ref(false);
const dialogReview = ref(false);
const dialogFinishReview = ref(false);

const selectedTask = ref<TaskTableItem>();

const selectedTasks = ref<TaskTableItem[]>([]);

const filters = ref<any>({
  global: { value: undefined, matchMode: FilterMatchMode.CONTAINS },
});

const tableColumns = computed<TableColumn[]>(() => {
  return [
    {
      field: 'module.name',
      header: 'Modul',
      sortable: true,
      fixed: true,
    },
    {
      field: 'subModule.name',
      header: 'Sub Modul',
      sortable: true,
    },
    {
      field: 'process.name',
      header: 'Proses',
      sortable: true,
    },
    {
      field: 'name',
      header: 'Task',
      sortable: true,
      fixed: true,
    },
    {
      field: 'status',
      header: 'Status',
      sortable: true,
      fixed: true,
      bodyComponent: (data: TaskTableItem): TableCellComponent => {
        return {
          component: Badge,
          props: {
            label: data.status,
            format: 'nowrap',
          },
        };
      },
    },
    {
      field: 'priority',
      header: 'Nilai Prioritas',
      sortable: true,
    },
    {
      field: 'team',
      header: 'Tim',
      sortable: true,
      bodyTemplate: (data: TaskTableItem): string =>
        data.team.map((t) => t).join(', '),
    },
    {
      field: 'assignedTo',
      header: 'Assign',
      sortable: true,
      fixed: true,
      arrayValueField: 'nickName',
      exportField: 'assignedTo',
      bodyComponent: (data: TaskTableItem): TableCellComponent => {
        return {
          component: UserGroup,
          props: {
            users: data.assignedTo,
            profilePictureField: 'profilePictureBig',
            withDialogDetail: true,
            dialogHeaderLabel: 'Assigned To',
          },
        };
      },
    },
    {
      field: 'childTask',
      header: 'Child Task',
      sortable: true,
      bodyTemplate: (data: TaskTableItem): string =>
        data.childTask ? data.childTask.toString() : '-',
    },
    {
      field: 'dependency',
      header: 'Dependensi',
      sortable: true,
      exportField: 'exportDependencyField',
      bodyComponent: (data: TaskTableItem): TableCellComponent => {
        return {
          component: DependencyCol,
          props: {
            dependency: data.dependency,
          },
        };
      },
    },
    {
      field: 'timeReportedBug',
      header: 'Reported Bug',
      sortable: true,
      bodyTemplate: (data: TaskTableItem): string =>
        data.timeReportedBug ? data.timeReportedBug.toString() + ' Kali' : '-',
    },
    {
      field: 'lastUpdatedAt',
      header: 'Last Modified Status',
      sortable: true,
    },
  ];
});

const tableName = computed(() =>
  props.subTab ? `task-table-${props.tab}-${props.subTab}` : props.tab,
);

/**
 * Generate table actions based on task status and user type.
 *
 * Table actions:
 * - Assign Member (only for Admin/PM/Leader and task status is Backlog)
 * - Review (only for Leader and task status is Pending Review Leader)
 * - Tandai Selesai (only for Member and task status is Sprint/Fixing Bug/Penyesuaian)
 * - Detail Task (only for Admin/PM/Leader/Member and task type is parent/dependency)
 * - Hapus (only for Admin/PM/Leader/Member and task status is Backlog/Sprint)
 */
const tableActions = computed<MenuItem[]>(() => [
  {
    label: 'Assign Member',
    icon: 'user-received-2-line',
    visible:
      selectedTask.value?.status === 'Backlog' &&
      selectedTask.value?.taskType === 'parent' &&
      ['admin', 'pm', 'teamLeader'].includes(userType.value),
    command: (): void => {
      dialogAssignMember.value = true;
    },
  },
  {
    label: 'Review',
    icon: 'chat-check',
    visible:
      selectedTask.value?.status === 'Pending Review Leader' &&
      selectedTask.value?.taskType === 'parent' &&
      userType.value === 'teamLeader',
    command: (): void => {
      openReviewDialog();
    },
  },
  {
    label: 'Tandai Selesai',
    icon: 'check-double-fill',
    visible:
      ['Sprint', 'Fixing Bug', 'Penyesuaian'].includes(
        selectedTask.value?.status,
      ) &&
      selectedTask.value?.taskType === 'parent' &&
      userType.value === 'member',
    command: (): void => {
      dialogConfirmFinishTask.value = true;
    },
  },
  {
    label: 'Detail Task',
    icon: 'file-copy-2-line',
    visible:
      ['parent', 'dependency'].includes(selectedTask.value?.taskType) &&
      ['admin', 'pm', 'teamLeader', 'member'].includes(userType.value),
    command: (): void => {
      dialogDetailTask.value = true;
    },
  },
  {
    label: 'Hapus',
    icon: 'delete-bin',
    danger: true,
    visible:
      ['Backlog', 'Sprint'].includes(selectedTask.value?.status) &&
      selectedTask.value?.taskType === 'parent' &&
      ['admin', 'pm', 'teamLeader', 'member'].includes(userType.value),
    command: (): void => {
      dialogConfirmDeleteTask.value = true;
    },
  },
]);

/**
 * Generate bulk actions for task table based on user type.
 *
 * Bulk actions:
 * - Assign Member (only for Admin/PM/Leader)
 * - Hapus (only for Admin/PM/Leader or every task is assigned to current user)
 */
const tableBulkActions = computed<MenuItem[]>(() => [
  {
    label: 'Assign Member',
    icon: 'user-received-2-line',
    visible:
      selectedTasks.value?.every(
        (task) => task.isProjectManager || task.isTeamLeader,
      ) || userData?.permission?.manageProject,
  },
  {
    label: 'Hapus',
    icon: 'delete-bin',
    danger: true,
    visible:
      selectedTasks.value?.every(
        (task) => task.isProjectManager || task.isTeamLeader,
      ) ||
      userData?.permission?.manageProject ||
      selectedTasks.value?.every((task) =>
        task.assignedTo.some(
          (assignedUser) => assignedUser._id === userData?._id,
        ),
      ),
  },
]);

const userType = computed(() => {
  const isAdmin = Object.values(
    userData?.permission?.manageProject || {},
  ).every((value) => value === true);

  const memberType = selectedTask.value?.assignedTo.find(
    (t) => t._id === userData?._id,
  )
    ? 'member'
    : 'guest';

  if (isAdmin) {
    return 'admin';
  } else if (selectedTask.value?.isProjectManager) {
    return 'pm';
  } else if (selectedTask.value?.isTeamLeader) {
    return 'teamLeader';
  }
  return memberType;
});

const getTasksByTab = async (
  params: QueryParams,
): Promise<FetchResponse<TaskTableItem> | undefined> => {
  try {
    const { data } = await TaskServices.getTasksByTab({
      tab: props.tab,
      subTab: props.subTab,
      query: params,
    });
    const formattedData: FetchResponse<TaskTableItem> = {
      ...data,
      data: {
        ...data.data,
        data: data.data.data.map((task: TaskTableItem) => ({
          ...task,
          hasChildren:
            task.childTask > 0 ||
            Object.values(task.dependency).some((value) => value > 0),
          taskType: 'parent',
          exportDependencyField: `${task.dependency.done} selesai, ${task.dependency.onProgress} tidak selesai`,
        })),
      },
    };
    return formattedData;
  } catch (error) {
    toast.add({
      message: 'Data Task gagal dimuat.',
      error,
    });
  }
};

const getTaskOptionsByTab = async (
  field: keyof TaskTableOptionQuery,
): Promise<MultiSelectOption[]> => {
  try {
    const { data } = await TaskServices.getTaskOptionsByTab({
      tab: props.tab,
      subTab: props.subTab,
      query: { [field]: true },
    });
    return data.data[field];
  } catch (error) {
    toast.add({
      message: 'Data options gagal dimuat.',
      error,
    });
  }
};

const getTaskFamily = async (parentData: {
  _id: string;
}): Promise<ShortFetchResponse> => {
  try {
    const { data } = await TaskServices.getTaskFamily(parentData._id);

    const formattedData: ShortFetchResponse = {
      message: data.message,
      data: [
        {
          groupHeader: 'Task Dependensi',
          groupItems: data.data.dependencies.map((dep) => ({
            ...dep,
            taskType: 'dependency',
          })),
        },
        {
          groupHeader: 'Child Task',
          groupItems: data.data.children.map((child) => ({
            ...child,
            taskType: 'child',
          })),
        },
      ],
    };
    return formattedData;
  } catch (error) {
    toast.add({
      message: 'Data Task gagal dimuat.',
      error,
    });
  }
};

const refreshTable = (): void => {
  eventBus.emit('data-table:update', { tableName: tableName.value });
};

const openReviewDialog = async (): Promise<void> => {
  const checklists = await getChecklists();
  if (checklists.length) {
    dialogReview.value = true;
  } else {
    dialogFinishReview.value = true;
  }
};

const getChecklists = async (): Promise<any[]> => {
  try {
    setLoading(true);
    const { data } = await TaskChecklistServices.getTaskChecklists(
      selectedTask.value?._id,
    );
    return data?.data;
  } catch (error) {
    toast.add({
      message: 'Gagal memuat data ceklis.',
      error,
    });
    return [];
  } finally {
    setLoading(false);
  }
};
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex justify-end gap-4">
      <pre>{{ userType }}</pre>
      <ButtonBulkAction
        v-model:selected-data="selectedTasks"
        :options="tableBulkActions"
        :table-name="tableName"
        show-select-all-button
      />
      <ButtonSearch
        :table-name="tableName"
        @search="filters.global.value = $event"
        class="ml-auto"
      />
      <ButtonDownload :table-name="tableName" file-name="Download" />
      <ButtonFilter v-model:show-filter="showFilter" :table-name="tableName" />
      <Button
        v-if="props.tab === 'all'"
        @click="dialogNewTask = true"
        icon="add"
        label="Task"
        severity="secondary"
      />
    </div>

    <QuickFilter :fields="quickFilterField" :table-name="tableName" />

    <FilterContainer :fields="filterFields" :table-name="tableName" />

    <DataTable
      v-model:selected-data="selectedTasks"
      :child-table-props="{
        useColumnsHeader: false,
        useOption: true,
        fetchFunction: getTaskFamily,
      }"
      :columns="tableColumns"
      :fetch-function="getTasksByTab"
      :options="tableActions"
      :selection-type="props.tab === 'backlog' ? 'checkbox' : 'none'"
      :table-name="tableName"
      :tree-table="true"
      @toggle-option="selectedTask = $event"
      data-key="_id"
      excel-toast-error-message="Data task gagal diunduh."
      lazy
      use-option
      use-paginator
    />
  </div>

  <TaskDetail
    v-model:visible="dialogNewTask"
    @create="refreshTable"
    @delete="refreshTable"
    @update="refreshTable"
  />

  <TaskDetail
    v-model:visible="dialogDetailTask"
    :task-id="selectedTask?._id"
    @create="refreshTable"
    @delete="refreshTable"
    @update="refreshTable"
  />

  <DialogAssignMember
    v-model:visible="dialogAssignMember"
    :task-id-prop="selectedTask?._id"
  />

  <DialogReviewLeader
    v-model:visible="dialogReview"
    :task-detail-prop="selectedTask"
    :task-id-prop="selectedTask?._id"
    @saved="eventBus.emit('detail-task:update', { taskId: selectedTask?._id })"
  />

  <DialogFinishReview
    v-model:visible="dialogFinishReview"
    :task-id-prop="selectedTask?._id"
    @saved="eventBus.emit('detail-task:update', { taskId: selectedTask?._id })"
  />

  <DialogConfirmFinishTask
    v-model:visible="dialogConfirmFinishTask"
    :task-detail="selectedTask"
  />

  <DialogConfirmDeleteTask
    v-model:visible="dialogConfirmDeleteTask"
    :task-detail="selectedTask"
  />
</template>
