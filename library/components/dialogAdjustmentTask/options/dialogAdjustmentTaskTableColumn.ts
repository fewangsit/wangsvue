import {
  TableCellComponent,
  TableColumn,
} from '../../datatable/DataTable.vue.d';
import { Task } from '../DialogAdjustmentTask.vue.d';
import TaskDependency from '../common/TaskDependency.vue';
import UserGroup from 'lib/components/usergroup/UserGroup.vue';
import TaskStatusBadge from '../common/TaskStatusBadge.vue';

export const dialogAdjustmentTaskTableColumn: TableColumn[] = [
  {
    field: 'project.name',
    header: 'Proyek',
    sortable: true,
    fixed: true,
  },
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
    fixed: false,
  },
  {
    field: 'process.name',
    header: 'Proses',
    sortable: true,
    fixed: false,
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
    bodyComponent: (data: Task): TableCellComponent => {
      return {
        component: TaskStatusBadge,
        props: {
          status: data.status,
        },
      };
    },
  },
  {
    field: 'priority',
    header: 'Nilai Prioritas',
    sortable: true,
    fixed: false,
  },
  {
    field: 'team',
    header: 'Tim',
    sortable: true,
    fixed: false,
    bodyTemplate: (data: Task): string => {
      return data?.team?.toString()?.replaceAll(',', ', ');
    },
  },
  {
    field: 'childTask',
    header: 'Child Task',
    sortable: true,
    fixed: false,
  },
  {
    field: 'dependency',
    header: 'Dependensi',
    sortable: true,
    fixed: false,
    bodyComponent: (data: Task): TableCellComponent => {
      return {
        component: TaskDependency,
        props: {
          done: data?.dependency?.done,
          onProgress: data?.dependency?.onProgress,
        },
      };
    },
  },
  {
    field: 'timeReportedBug',
    header: 'Reported Bug',
    sortable: true,
    fixed: false,
  },
  {
    field: 'lastUpdatedAt',
    header: 'Last Modified Status',
    sortable: true,
    fixed: false,
  },
  {
    field: 'assignedTo',
    header: 'Assign Ke',
    sortable: true,
    fixed: true,
    bodyComponent: (data: Task): TableCellComponent => {
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
];
