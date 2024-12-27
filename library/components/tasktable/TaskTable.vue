<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue';
import { MenuItem } from '../menuitem';
import QuickFilter from '../quickfilter/QuickFilter.vue';
import FilterContainer from '../filtercontainer/FilterContainer.vue';
import ButtonSearch from '../buttonsearch/ButtonSearch.vue';
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
import {
  FetchOptionResponse,
  FilterField,
} from '../filtercontainer/FilterContainer.vue.d';
import { MultiSelectOption } from 'lib/types/options.type';
import DataTable from '../datatable/DataTable.vue';
import { TaskOptions } from '../dialogdetailpbi/DialogDetailPbi.vue.d';
import { TaskServices, TaskChecklistServices } from 'wangsit-api-services';
import {
  TaskTableEmits,
  TaskTablePage,
  TaskTableProps,
  TaskTableTab,
} from './TaskTable.vue.d';
import { User } from 'lib/types/user.type';
import { TaskTableItem, TaskTableOptionQuery } from 'lib/types/task.type';
import Badge from '../badge/Badge.vue';
import { formatISODate, isIntersect, useToast } from 'lib/utils';
import DependencyCol from './DependencyCol.vue';
import Button from '../button/Button.vue';
import TaskDetail from '../taskdetail/TaskDetail.vue';
import DialogConfirmDeleteTask from '../taskdetail/blocks/common/DialogConfirmDeleteTask.vue';
import DialogAssignMember from '../taskdetail/blocks/common/DialogAssignMember.vue';
import DialogReviewLeader from '../taskdetail/blocks/sections/Review/DialogReviewLeader.vue';
import DialogFinishReview from '../taskdetail/blocks/sections/Review/DialogFinishReview.vue';
import { useLoadingStore } from 'lib/build-entry';
import DialogConfirmFinishTask from '../taskdetail/blocks/common/DialogConfirmFinishTask.vue';
import UserGroup from '../usergroup/UserGroup.vue';
import ButtonBulkAction from '../buttonbulkaction/ButtonBulkAction.vue';
import DialogConfirmRestoreTask from './DialogConfirmRestoreTask.vue';
import DialogConfirmDeleteTaskPermanently from './DialogConfirmDeleteTaskPermanently.vue';
import DialogSelectProject from './DialogSelectProject.vue';

const toast = useToast();
const { setLoading } = useLoadingStore();

const props = defineProps<TaskTableProps>();

defineEmits<TaskTableEmits>();

type CustomFilterField = FilterField & {
  visible: boolean;
};

const userData = JSON.parse(localStorage.getItem('user') as string) as User;
const taskStatuses: string[] = [
  'Selesai',
  'Pending Review Leader',
  'Sprint',
  'Fixing Bug',
  'Reported Bug',
  'Penyesuaian',
];

const showFilter = shallowRef<boolean>(false);
const dialogSelectProject = shallowRef<boolean>(false);
const dialogNewTask = shallowRef<boolean>(false);
const dialogDetailTask = shallowRef<boolean>(false);
const dialogAssignMember = shallowRef<boolean>(false);
const dialogAssignMemberBulk = shallowRef<boolean>(false);
const dialogConfirmDeleteTask = shallowRef<boolean>(false);
const dialogConfirmDeleteTaskBulk = shallowRef<boolean>(false);
const dialogConfirmFinishTask = shallowRef<boolean>(false);
const dialogReview = shallowRef<boolean>(false);
const dialogFinishReview = shallowRef<boolean>(false);
const dialogConfirmRestoreTask = shallowRef<boolean>(false);
const dialogConfirmRestoreTaskBulk = shallowRef<boolean>(false);
const dialogConfirmDeleteTaskPermanently = shallowRef<boolean>(false);
const dialogConfirmDeleteTaskPermanentlyBulk = shallowRef<boolean>(false);

const selectedTask = ref<TaskTableItem>();

const selectedTasks = ref<TaskTableItem[]>([]);

const selectedProjectId = shallowRef<string>();

const filters = ref<any>({
  global: { value: undefined, matchMode: FilterMatchMode.CONTAINS },
});

const tableName = computed(() =>
  props.subTab ? `task-table-${props.tab}-${props.subTab}` : props.tab,
);

const tableColumns = computed<TableColumn[]>(() => {
  return [
    {
      field: 'project.name',
      header: 'Proyek',
      sortable: true,
      fixed: true,
      visible: (
        ['task', 'member-detail', 'my-profile'] as TaskTablePage[]
      ).includes(props.page),
    },
    {
      field: 'module.name',
      header: 'Modul',
      sortable: true,
      fixed: true,
      visible: (
        [
          'task',
          'member-detail',
          'my-profile',
          'project-task',
          'project-productBacklogItem',
        ] as TaskTablePage[]
      ).includes(props.page),
    },
    {
      field: 'subModule.name',
      header: 'Sub Modul',
      sortable: true,
      fixed: props.page === 'project-productBacklogItem',
      visible: (
        [
          'task',
          'member-detail',
          'my-profile',
          'project-task',
          'project-module',
          'project-productBacklogItem',
        ] as TaskTablePage[]
      ).includes(props.page),
    },
    {
      field: 'process.name',
      header: 'Proses',
      sortable: true,
      fixed: props.page === 'project-productBacklogItem',
      visible: true,
    },
    {
      field: 'name',
      header: 'Task',
      sortable: true,
      fixed: true,
      visible: true,
    },
    {
      field: 'status',
      header: 'Status',
      sortable: true,
      fixed: props.page !== 'project-productBacklogItem',
      bodyComponent: (data: TaskTableItem): TableCellComponent => {
        return {
          component: Badge,
          props: {
            label: data.status,
            format: 'nowrap',
            severity:
              data.status === 'Waiting for Approval' ? 'warning' : undefined,
          },
        };
      },
      visible: true,
    },
    {
      field: 'priority',
      header: 'Nilai Prioritas',
      sortable: true,
      visible: props.page !== 'project-productBacklogItem',
    },
    {
      field: 'team',
      header: 'Tim',
      sortable: true,
      bodyTemplate: (data: TaskTableItem): string =>
        data.team.map((t) => t).join(', '),
      visible: props.page !== 'project-productBacklogItem',
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
      visible: true,
    },
    {
      field: 'childTask',
      header: 'Child Task',
      sortable: true,
      bodyTemplate: (data: TaskTableItem): string =>
        data.childTask ? data.childTask.toString() : '-',
      visible: props.page !== 'project-productBacklogItem',
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
      visible: props.page !== 'project-productBacklogItem',
    },
    {
      field: 'timeReportedBug',
      header: 'Reported Bug',
      sortable: true,
      bodyTemplate: (data: TaskTableItem): string =>
        data.timeReportedBug ? data.timeReportedBug.toString() + ' Kali' : '-',
      visible: props.page !== 'project-productBacklogItem',
    },
    {
      field: 'lastUpdatedAt',
      header: 'Last Modified Status',
      sortable: true,
      bodyTemplate: (data: TaskTableItem): string => {
        if (props.page !== 'project-productBacklogItem')
          return data.lastUpdatedAt;
        return formatISODate(data.lastUpdatedAt);
      },
      visible: true,
    },
  ];
});

/**
 * Generate quick filter fields based on task table page and tab.
 *
 * Quick filter fields:
 * - Nilai Prioritas (always visible)
 * - Member (based on tab, sub tab, and user role)
 * - Proyek (only for task, member-detail, my-profile pages)
 * - Modul (only for task, member-detail, my-profile, project-task pages)
 * - Task (always visible)
 * - Status (only for all, active, deleted tabs)
 */
const quickFilterFields = computed<CustomFilterField[]>(() => [
  {
    fields: ['minPriority', 'maxPriority'],
    type: 'rangenumber',
    placeholder: '0',
    tooltip: 'Nilai Prioritas',
    visible: true,
  },
  {
    field: 'member',
    type: 'multiselect',
    placeholder: 'Pilih member',
    fetchOptionFn: (): Promise<MultiSelectOption[]> =>
      getTaskOptions('memberOptions'),
    visible:
      /*
       * Conditions for member filter be visible :
       * - The sub tab is 'myTask' and the user is a team leader
       * - The tab is 'backlog' or 'deleted' and the user is a team leader
       * - The sub tab is 'relatedTask'
       *
       * The member filter will be hidden if the user is not a team leader and
       * (the sub tab is 'myTask' or the tab is 'backlog' | 'deleted')
       */
      ((props.subTab === 'myTask' ||
        ['backlog', 'deleted'].includes(props.tab)) &&
        userData.isTeamLeader) ||
      props.subTab === 'relatedTask',
  },
  {
    field: 'project',
    type: 'multiselect',
    placeholder: 'Pilih proyek',
    fetchOptionFn: (): Promise<MultiSelectOption[]> =>
      getTaskOptions('projectOptions'),
    visible: (
      ['task', 'member-detail', 'my-profile'] as TaskTablePage[]
    ).includes(props.page),
  },
  {
    field: 'module',
    type: 'multiselect',
    placeholder: 'Pilih modul',
    fetchOptionFn: (): Promise<MultiSelectOption[]> =>
      getTaskOptions('moduleOptions'),
    visible: (
      ['task', 'member-detail', 'my-profile', 'project-task'] as TaskTablePage[]
    ).includes(props.page),
  },
  {
    field: 'task',
    type: 'multiselect',
    placeholder: 'Pilih task',
    fetchOptionFn: (): Promise<MultiSelectOption[]> =>
      getTaskOptions('taskOptions'),
    visible: true,
  },
  {
    field: 'status',
    type: 'multiselect',
    placeholder: 'Pilih status',
    fetchOptionFn: (): MultiSelectOption[] =>
      taskStatuses.map((status) => ({
        label: status,
        value: status,
      })),
    visible: (['all', 'active', 'deleted'] as TaskTableTab[]).includes(
      props.tab,
    ),
  },
]);

/**
 * Generate custom filter fields based on task table page.
 *
 * Filter fields:
 * - Sub Modul (only for task, member-detail, my-profile, project-task, project-module pages)
 * - Proses (always visible)
 * - Dependensi (always visible)
 * - Reported Bug (Kali) (always visible)
 * - Last Modified Status (always visible)
 */
const filterFields = computed<CustomFilterField[]>(() => [
  {
    label: 'Modul',
    field: 'module',
    type: 'multiselect',
    placeholder: 'Pilih modul',
    fetchOptionFn: (): Promise<MultiSelectOption[]> =>
      getTaskOptions('moduleOptions'),
    visible: props.page === 'project-productBacklogItem',
  },
  {
    label: 'Sub Modul',
    field: 'subModule',
    type: 'multiselect',
    placeholder: 'Pilih sub modul',
    fetchOptionFn: (): Promise<MultiSelectOption[]> =>
      getTaskOptions('subModuleOptions'),
    visible: (
      [
        'task',
        'member-detail',
        'my-profile',
        'project-task',
        'project-module',
        'project-productBacklogItem',
      ] as TaskTablePage[]
    ).includes(props.page),
  },
  {
    label: 'Proses',
    field: 'process',
    type: 'multiselect',
    placeholder: 'Pilih proses',
    fetchOptionFn: (): Promise<MultiSelectOption[]> =>
      getTaskOptions('processOptions'),
    visible: true,
  },
  {
    label: 'Task',
    field: 'task',
    type: 'multiselect',
    placeholder: 'Pilih task',
    fetchOptionFn: (): Promise<MultiSelectOption[]> =>
      getTaskOptions('taskOptions'),
    visible: props.page === 'project-productBacklogItem',
  },
  {
    label: 'Assign',
    field: 'member',
    type: 'multiselect',
    placeholder: 'Pilih member',
    fetchOptionFn: (): Promise<MultiSelectOption[]> =>
      getTaskOptions('memberOptions'),
    visible: props.page === 'project-productBacklogItem',
  },
  {
    label: 'Status',
    field: 'status',
    type: 'multiselect',
    placeholder: 'Pilih Status',
    fetchOptionFn: (): MultiSelectOption[] =>
      [...taskStatuses, 'Backlog', 'Waiting for Approval'].map((status) => ({
        label: status,
        value: status,
      })),
    visible: props.page === 'project-productBacklogItem',
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
    visible: props.page !== 'project-productBacklogItem',
  },
  {
    label: 'Reported Bug (Kali)',
    fields: ['minTimeReportedBug', 'maxTimeReportedBug'],
    type: 'rangenumber',
    placeholder: '0',
    visible: props.page !== 'project-productBacklogItem',
  },
  {
    label: 'Last Modified Status',
    type: 'calendar',
    field: 'lastUpdatedAt',
    placeholder: 'Pilih tanggal',
    visible: true,
  },
]);

/**
 * Generate table actions based on task status and user type.
 *
 * Table actions:
 * - Assign Member (only for Admin/PM/Leader and task status is Backlog)
 * - Review (only for Leader and task status is Pending Review Leader)
 * - Detail Task (only for Admin/PM/Leader/Member and task type is parent/dependency)
 * - Hapus (only for Admin/PM/Leader/Member and task status is Backlog/Sprint)
 * - Pulihkan (only if props.tab is 'deleted' )
 * - Hapus Permanen (only if props.tab is 'deleted')
 */
const tableActions = computed<MenuItem[]>(() => {
  const commonTableActions: MenuItem[] = [
    {
      label: 'Detail Task',
      icon: 'file-copy-2-line',
      visible:
        ['parent', 'dependency'].includes(selectedTask.value?.taskType) &&
        isIntersect(['admin', 'pm', 'teamLeader', 'member'], userType.value),
      command: (): void => {
        dialogDetailTask.value = true;
      },
    },
  ];

  const otherTableActions: MenuItem[] = [
    {
      label: 'Assign Member',
      icon: 'user-received-2-line',
      visible:
        selectedTask.value?.status === 'Backlog' &&
        selectedTask.value?.taskType === 'parent' &&
        isIntersect(['admin', 'pm', 'teamLeader'], userType.value),
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
        userType.value.includes('teamLeader'),
      command: openReviewDialog,
    },
    ...commonTableActions,
    {
      label: 'Hapus',
      icon: 'delete-bin',
      danger: true,
      visible:
        ['Backlog', 'Sprint'].includes(selectedTask.value?.status) &&
        selectedTask.value?.taskType === 'parent' &&
        isIntersect(['admin', 'pm', 'teamLeader', 'member'], userType.value),
      command: (): void => {
        dialogConfirmDeleteTask.value = true;
      },
    },
  ];

  const deletedTabActions: MenuItem[] = [
    ...commonTableActions,
    {
      label: 'Pulihkan',
      icon: 'history',
      visible:
        selectedTask.value?.taskType === 'parent' && props.tab === 'deleted',
      command: (): void => {
        dialogConfirmRestoreTask.value = true;
      },
    },
    {
      label: 'Hapus Permanen',
      icon: 'delete-bin',
      danger: true,
      visible:
        selectedTask.value?.taskType === 'parent' && props.tab === 'deleted',
      command: (): void => {
        dialogConfirmDeleteTaskPermanently.value = true;
      },
    },
  ];

  return props.tab === 'deleted' ? deletedTabActions : otherTableActions;
});

/**
 * Generate bulk actions for task table based on user type.
 *
 * Bulk actions:
 * - Assign Member (only visible if Admin/PM/Leader & every tasks has the same project and team)
 * - Hapus (only visible if Admin/PM/Leader or every task is assigned to current user)
 * - Pulihkan (only visible if props.tab is 'deleted' )
 * - Hapus Permanen (only visible if props.tab is 'deleted')
 */
const tableBulkActions = computed<MenuItem[]>(() => {
  const otherBulkActions: MenuItem[] = [
    {
      label: 'Assign Member',
      icon: 'user-received-2-line',
      visible:
        (selectedTasks.value?.every(
          (task) => task.isProjectManager || task.isTeamLeader,
        ) ||
          userData?.permission?.manageProject) &&
        selectedTasks.value?.every(
          (task) =>
            selectedTasks.value?.[0].project._id === task.project._id &&
            JSON.stringify(selectedTasks.value?.[0].team) ===
              JSON.stringify(task.team),
        ),
      command: (): void => {
        dialogAssignMemberBulk.value = true;
      },
    },
    {
      label: 'Hapus',
      icon: 'delete-bin',
      danger: true,
      visible:
        selectedTasks.value?.every(
          (task) => task.isProjectManager || task.isTeamLeader,
        ) ||
        userType.value.includes('admin') ||
        selectedTasks.value?.every((task) =>
          task.assignedTo.some(
            (assignedUser) => assignedUser._id === userData?._id,
          ),
        ),
      command: (): void => {
        dialogConfirmDeleteTaskBulk.value = true;
      },
    },
  ];

  const deletedBulkActions: MenuItem[] = [
    {
      label: 'Pulihkan',
      icon: 'history',
      visible: true,
      command: (): void => {
        dialogConfirmRestoreTaskBulk.value = true;
      },
    },
    {
      label: 'Hapus Permanen',
      icon: 'delete-bin',
      danger: true,
      visible: true,
      command: (): void => {
        dialogConfirmDeleteTaskPermanentlyBulk.value = true;
      },
    },
  ];

  return props.tab === 'deleted' ? deletedBulkActions : otherBulkActions;
});

const canAssignPbiTask = computed<boolean>(
  () =>
    props.assignedPbiMembers?.length &&
    !['Selesai', 'Pending Testing'].includes(props.selectedPbi?.status ?? '') &&
    isIntersect(['admin', 'pm', 'teamLeader', 'member'], userType.value) &&
    props.editablePbi,
);

const userType = computed<string[]>(() => {
  const returnArray: string[] = [];
  const isAdmin = Object.values(
    userData?.permission?.manageProject || {},
  ).every((value) => value === true);

  const memberType = selectedTask.value?.assignedTo.find(
    (t) => t._id === userData?._id,
  )
    ? 'member'
    : 'guest';

  if (isAdmin) returnArray.push('admin');
  if (selectedTask.value?.isProjectManager) returnArray.push('pm');
  if (selectedTask.value?.isTeamLeader) returnArray.push('teamLeader');
  return [memberType, ...returnArray];
});

const queryParamsByPage = computed(() => ({
  project: props.page.includes('project')
    ? JSON.stringify([props.projectId])
    : undefined,
  module: props.page.toLowerCase().includes('module')
    ? JSON.stringify([props.moduleId])
    : undefined,
  subModule: props.page.includes('subModule')
    ? JSON.stringify([props.subModuleId])
    : undefined,
  pbi: props.page.includes('productBacklogItem')
    ? JSON.stringify([props.selectedPbi?._id])
    : undefined,
}));

const onClickCreateTask = (): void => {
  if (props.page === 'task') {
    dialogSelectProject.value = true;
  } else {
    dialogNewTask.value = true;
  }
};

const getTasks = async (
  params: QueryParams,
): Promise<FetchResponse<TaskTableItem> | undefined> => {
  try {
    let responseData: FetchResponse<TaskTableItem>;
    if (
      (['member-detail', 'my-profile'] as TaskTablePage[]).includes(props.page)
    ) {
      const response = await TaskServices.getTasksByUser({
        userId: props.page === 'my-profile' ? userData._id : props.userId,
        tab: props.tab,
        query: params,
      });
      responseData = response.data;
    } else if (props.page === 'project-productBacklogItem') {
      const response = await TaskServices.getTasks({
        ...queryParamsByPage.value,
        ...params,
      });
      responseData = response.data;
    } else {
      const response = await TaskServices.getTasksByTab({
        tab: props.tab,
        subTab: props.subTab,
        query: {
          ...queryParamsByPage.value,
          ...params,
        },
      });
      responseData = response.data;
    }

    return {
      ...responseData,
      data: {
        ...responseData.data,
        data: responseData.data?.data.map((task: TaskTableItem) => ({
          ...task,
          hasChildren:
            task.childTask > 0 ||
            Object.values(task.dependency).some((value) => value > 0),
          taskType: 'parent',
          exportDependencyField: `${task.dependency.done} selesai, ${task.dependency.onProgress} tidak selesai`,
        })),
      },
    };
  } catch (error) {
    console.error(error);
    toast.add({
      message: 'Data Task gagal dimuat.',
      error,
    });
  }
};

const getTaskOptions = async (
  field: keyof TaskTableOptionQuery,
): Promise<MultiSelectOption[]> => {
  try {
    let responseData: FetchOptionResponse<TaskOptions>;
    if (
      (['member-detail', 'my-profile'] as TaskTablePage[]).includes(props.page)
    ) {
      const response = await TaskServices.getTaskOptionsByUser({
        userId: props.page === 'my-profile' ? userData._id : props.userId,
        tab: props.tab,
        query: { ...queryParamsByPage.value, [field]: true },
      });
      responseData = response.data;
    } else if (props.page === 'project-productBacklogItem') {
      const response = await TaskServices.getTaskOptions({
        ...queryParamsByPage.value,
        [field]: true,
      });
      responseData = response.data;
    } else {
      const response = await TaskServices.getTaskOptionsByTab({
        tab: props.tab,
        subTab: props.subTab,
        query: { ...queryParamsByPage.value, [field]: true },
      });
      responseData = response.data;
    }

    return responseData.data[field];
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

const reloadTable = (): void => {
  selectedTasks.value = [];
  eventBus.emit('data-table:update', { tableName: tableName.value });
  eventBus.emit('data-table:clear-selected-data', {
    tableName: tableName.value,
  });
};

const openReviewDialog = async (): Promise<void> => {
  const checklists = await getChecklists();
  const checklistItems = checklists.flatMap((item) => item.checklistItems);
  if (checklistItems.length) {
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

const selectProject = (projectId: string): void => {
  selectedProjectId.value = projectId;
  dialogNewTask.value = true;
};
</script>

<!-- eslint-disable vue/html-indent -->
<template>
  <div class="flex flex-col gap-2">
    <div
      :class="[{ '!gap-2': page === 'project-productBacklogItem' }]"
      class="flex justify-end gap-4"
    >
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
      <ButtonFilter v-model:show-filter="showFilter" :table-name="tableName" />
      <Button
        v-if="page === 'project-productBacklogItem' && canAssignPbiTask"
        @click="$emit('showUnassignedTask')"
        label="Ambil Task"
        severity="secondary"
      />
      <Button
        v-if="
          (props.tab === 'all' &&
            (
              [
                'task',
                'project-task',
                'project-module',
                'project-subModule',
              ] as TaskTablePage[]
            ).includes(props.page)) ||
          (page === 'project-productBacklogItem' && canAssignPbiTask)
        "
        :label="page === 'project-productBacklogItem' ? 'Task Baru' : 'Task'"
        @click="onClickCreateTask"
        icon="add"
        severity="secondary"
      />
    </div>

    <QuickFilter
      v-if="page !== 'project-productBacklogItem'"
      :fields="quickFilterFields.filter((field) => field.visible)"
      :table-name="tableName"
    />

    <FilterContainer
      :fields="filterFields.filter((field) => field.visible)"
      :table-name="tableName"
    />

    <DataTable
      v-model:selected-data="selectedTasks"
      :child-table-props="{
        useColumnsHeader: false,
        useOption: true,
        fetchFunction: getTaskFamily,
      }"
      :columns="tableColumns"
      :fetch-function="getTasks"
      :options="tableActions"
      :selection-type="
        (['backlog', 'deleted'] as TaskTableTab[]).includes(props.tab)
          ? 'checkbox'
          : 'none'
      "
      :table-name="tableName"
      :tree-table="page !== 'project-productBacklogItem'"
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
    :initial-module="props.moduleId ? { _id: props.moduleId } : undefined"
    :initial-sub-module="
      props.subModuleId ? { _id: props.subModuleId } : undefined
    "
    :product-backlog-item-id="props.selectedPbi?._id"
    :project-id="props.page === 'task' ? selectedProjectId : props.projectId"
    @create="reloadTable"
    @delete="reloadTable"
    @update="reloadTable"
  />

  <TaskDetail
    v-model:visible="dialogDetailTask"
    :initial-module="props.moduleId ? { _id: props.moduleId } : undefined"
    :initial-sub-module="
      props.subModuleId ? { _id: props.subModuleId } : undefined
    "
    :product-backlog-item-id="props.selectedPbi?._id"
    :project-id="selectedTask?.project?._id"
    :task-id="selectedTask?._id"
    @create="reloadTable"
    @delete="reloadTable"
    @update="reloadTable"
  />

  <DialogSelectProject
    v-model:visible="dialogSelectProject"
    @saved="selectProject"
  />

  <DialogAssignMember
    v-model:visible="dialogAssignMember"
    :project-id-prop="selectedTask?.project?._id"
    :task-id-prop="[selectedTask?._id]"
    @saved="reloadTable"
  />

  <DialogAssignMember
    v-model:visible="dialogAssignMemberBulk"
    :project-id-prop="selectedTasks?.[0]?.project?._id"
    :task-id-prop="selectedTasks?.map((task) => task._id)"
    @saved="reloadTable"
  />

  <DialogReviewLeader
    v-model:visible="dialogReview"
    :task-detail-prop="selectedTask"
    :task-id-prop="selectedTask?._id"
    @saved="reloadTable"
  />

  <DialogFinishReview
    v-model:visible="dialogFinishReview"
    :process-name="selectedTask?.process?.name"
    :task-id-prop="selectedTask?._id"
    @saved="reloadTable"
  />

  <DialogConfirmFinishTask
    v-model:visible="dialogConfirmFinishTask"
    :task-detail="selectedTask"
    @saved="reloadTable"
  />

  <DialogConfirmDeleteTask
    v-model:visible="dialogConfirmDeleteTask"
    :page="page"
    :project-id="projectId"
    :selected-pbi-id="selectedPbi._id"
    :tasks="[selectedTask]"
    @saved="reloadTable"
  />

  <DialogConfirmDeleteTask
    v-model:visible="dialogConfirmDeleteTaskBulk"
    :page="page"
    :project-id="projectId"
    :selected-pbi-id="selectedPbi._id"
    :tasks="selectedTasks"
    @saved="reloadTable"
  />

  <DialogConfirmRestoreTask
    v-model:visible="dialogConfirmRestoreTask"
    :tasks="[selectedTask]"
    @saved="reloadTable"
  />

  <DialogConfirmRestoreTask
    v-model:visible="dialogConfirmRestoreTaskBulk"
    :tasks="selectedTasks"
    @saved="reloadTable"
  />

  <DialogConfirmDeleteTaskPermanently
    v-model:visible="dialogConfirmDeleteTaskPermanently"
    :tasks="[selectedTask]"
    @saved="reloadTable"
  />

  <DialogConfirmDeleteTaskPermanently
    v-model:visible="dialogConfirmDeleteTaskPermanentlyBulk"
    :tasks="selectedTasks"
    @saved="reloadTable"
  />
</template>
