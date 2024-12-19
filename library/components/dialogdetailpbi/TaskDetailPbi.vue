<script setup lang="ts">
import { onMounted, provide, shallowRef } from 'vue';
import { TaskDetailPbiProps } from './TaskDetailPbi.vue.d';
import { AssignedMember } from './DialogDetailPbi.vue.d';
import { getUser } from 'lib/utils';
import TaskDetailUnassignedPbi from './TaskDetailUnassignedPbi.vue';
import AssignMember from './AssignMember.vue';
import Button from '../button/Button.vue';
import UserGroup from '../usergroup/UserGroup.vue';
import TaskTable from '../tasktable/TaskTable.vue';
import { SprintServices } from 'wangsit-api-services';

const props = defineProps<TaskDetailPbiProps>();

const projectId = sessionStorage.getItem('projectId') as string;

onMounted(() => {
  getPbiAssignedMembers();
});

const assignedMembers = shallowRef<AssignedMember[]>();
const visibleUnassignedTask = shallowRef<boolean>(false);
const visibleAssignMembers = shallowRef<boolean>(false);

provide('assignedPbiMembers', assignedMembers);

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
          getUser().permission.manageProject.update &&
          props.editable
        "
        @click="visibleAssignMembers = true"
        icon="edit"
        label="Edit"
        severity="secondary"
        text
      />
    </div>

    <TaskTable
      :assigned-pbi-members="assignedMembers"
      :editable-pbi="editable"
      :project-id="projectId"
      :selected-pbi="selectedPbi"
      @show-unassigned-task="visibleUnassignedTask = true"
      page="project-productBacklogItem"
      tab="all"
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
