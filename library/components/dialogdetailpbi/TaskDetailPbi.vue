<script setup lang="ts">
import { computed, onMounted, shallowRef } from 'vue';
import TaskDetailUnassignedPbi from './TaskDetailUnassignedPbi.vue';
import AssignMember from './AssignMember.vue';
import taskFilterFields from './options/taskFilterFields';
import {
  TableColumn,
  TableCellComponent,
  FetchResponse,
  QueryParams,
} from '../datatable/DataTable.vue.d';
import { MenuItem } from '../menuitem';
import {
  AssignedMember,
  DialogDetailPbiProps,
  Task,
} from './DialogDetailPbi.vue.d';
import {
  getImageURL,
  getUser,
  getUserPermission,
  isIntersect,
} from 'lib/utils';
import Badge from '../badge/Badge.vue';
import UserName from '../username/UserName.vue';
import Button from '../button/Button.vue';
import UserGroup from '../usergroup/UserGroup.vue';
import FilterContainer from '../filtercontainer/FilterContainer.vue';
import DataTable from '../datatable/DataTable.vue';
import ButtonSearch from '../buttonsearch/ButtonSearch.vue';
import ButtonFilter from '../buttonfilter/ButtonFilter.vue';
import SprintServices from 'lib/services/sprint.service';
import TaskServices from 'lib/services/task.service';

const props = defineProps<DialogDetailPbiProps>();

const projectId = sessionStorage.getItem('projectId') as string;
const userId = getUser()._id;

const defaultAssignedQuery: Record<string, string> = {
  project: `["${projectId}"]`,
  pbi: `["${props.selectedPbi?._id}"]`,
};

const taskColumns: TableColumn[] = [
  {
    field: 'module.initial',
    header: 'Modul',
    fixed: true,
    sortable: true,
  },
  {
    field: 'subModule.name',
    header: 'Sub Modul',
    fixed: true,
    sortable: true,
  },
  {
    field: 'process.name',
    header: 'Proses',
    fixed: true,
    sortable: true,
  },
  {
    field: 'name',
    header: 'Task',
    fixed: true,
    sortable: true,
  },
  {
    field: 'assignedTo.0',
    header: 'Assign',
    fixed: true,
    sortable: true,
    bodyComponent: (data: Task): TableCellComponent => {
      return {
        component: UserName,
        props: {
          user: {
            ...data.assignedTo[0],
            profilePicture: getImageURL(data.assignedTo[0]?.profilePictureBig),
          },
          emptyable: true,
        },
      };
    },
  },
  {
    field: 'status',
    header: 'Status',
    sortable: true,
    bodyComponent: (data: Task): TableCellComponent => {
      return {
        component: Badge,
        props: {
          label: data.status,
        },
      };
    },
  },
  {
    field: 'lastUpdatedAt',
    header: 'Last Modified Status',
    sortable: true,
    bodyTemplate: (data: Task): string => {
      return new Date(data.lastUpdatedAt)
        .toISOString()
        .slice(0, 19)
        .replace('T', ' ');
    },
  },
];

onMounted(() => {
  getPbiAssignedMembers();
});

const assignedMembers = shallowRef<AssignedMember[]>();
const selectedTask = shallowRef<Task>();
const visibleUnassignedTask = shallowRef<boolean>(false);
const visibleAssignMembers = shallowRef<boolean>(false);

const canAssignTask = computed<boolean | 0 | undefined>(() => {
  return (
    assignedMembers.value?.length &&
    !['Selesai', 'Pending Testing'].includes(props.selectedPbi?.status ?? '') &&
    ((assignedMembers.value?.map((member) => member._id).includes(userId) ||
      getUserPermission().update) ??
      false) &&
    props.editable
  );
});

const singleAction = computed<MenuItem[]>(() => [
  {
    label: 'Tandai Selesai',
    icon: 'check-double-fill',
    visible:
      selectedTask.value?.assignedTo
        .map((member) => member._id)
        .includes(userId) && selectedTask.value?.status === 'Sprint',
  },
  {
    label: 'Review',
    icon: 'chat-check-line',
    visible:
      selectedTask.value?.status === 'Pending Review Leader' &&
      isIntersect(selectedTask.value.team, props.project?.leaders ?? []),
  },
  {
    label: 'Assign Member',
    icon: 'user-received-2-line',
    visible:
      selectedTask.value?.status === 'Backlog' &&
      getUserPermission(props.project, selectedTask.value.team).update,
  },
  {
    label: 'Detail Task',
    icon: 'file-copy-2-line',
  },
  {
    label: 'Hapus',
    icon: 'delete-bin',
    class: 'text-danger-500',
    visible:
      selectedTask.value?.status === 'Backlog' &&
      (selectedTask.value?.assignedTo
        .map((member) => member._id)
        .includes(userId) ||
        getUserPermission(props.project, selectedTask.value.team).delete),
  },
]);

const getPbiAssignedMembers = async (): Promise<void> => {
  try {
    const { data } = await SprintServices.getPbiAssignedMembers(
      projectId,
      props.selectedPbi?._id ?? '',
      true,
      {},
    );
    assignedMembers.value = data.data.data;
  } catch (error) {
    console.error(error);
  }
};

const getPbiTasks = async (
  query: QueryParams,
): Promise<FetchResponse<Task> | undefined> => {
  try {
    const { data } = await TaskServices.getTasks(query);
    return data;
  } catch (error) {
    console.error(error);
  }
};
</script>

<!-- eslint-disable vue/html-indent -->
<template>
  <div class="flex flex-col gap-2">
    <div class="flex place-items-center">
      Member :&nbsp;
      <UserGroup
        v-if="assignedMembers?.length"
        :limit="5"
        :users="assignedMembers"
        profile-picture-field="imageUrl"
      />
      <Button
        v-if="
          !['Selesai', 'Pending Testing'].includes(
            props.selectedPbi?.status ?? '',
          ) &&
          getUserPermission().update &&
          props.editable
        "
        @click="visibleAssignMembers = true"
        icon="edit"
        label="Edit"
        severity="secondary"
        text
      />
    </div>
    <div class="flex justify-end gap-3">
      <ButtonSearch :table-name="`list-pbi-task-table-${selectedPbi?._id}`" />
      <ButtonFilter :table-name="`list-pbi-task-table-${selectedPbi?._id}`" />
      <div class="flex gap-2">
        <Button
          v-if="canAssignTask"
          @click="visibleUnassignedTask = true"
          label="Ambil Task"
          severity="secondary"
        />
        <Button v-if="canAssignTask" label="+ Task Baru" severity="secondary" />
      </div>
    </div>
    <FilterContainer
      :fields="taskFilterFields(selectedPbi)"
      :table-name="`list-pbi-task-table-${selectedPbi?._id}`"
    />
    <DataTable
      :columns="taskColumns"
      :default-query-params="defaultAssignedQuery"
      :fetch-function="getPbiTasks"
      :options="singleAction"
      :table-name="`list-pbi-task-table-${selectedPbi?._id}`"
      @toggle-option="selectedTask = $event"
      lazy
      selection-type="none"
      use-paginator
    />
    <TaskDetailUnassignedPbi
      v-model:visible="visibleUnassignedTask"
      :assigned-members="assignedMembers"
      :selected-pbi="selectedPbi"
    />
    <AssignMember
      v-model:visible="visibleAssignMembers"
      :pbi-body="selectedPbi"
      @add="getPbiAssignedMembers"
    />
  </div>
</template>
