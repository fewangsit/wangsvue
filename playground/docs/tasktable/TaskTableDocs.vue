<script setup lang="ts">
import TaskTable from 'lib/components/tasktable/TaskTable.vue';
import DocTitle from '../DocTitle.vue';
import Card from 'lib/components/card/Card.vue';
import Toast from 'lib/components/toast/Toast.vue';

const projectId = sessionStorage.getItem('projectId') ?? '';
</script>

<template>
  <Toast />

  <Card>
    <template #header>
      <DocTitle name="Task Table" />
    </template>
    <template #content>
      <div class="flex flex-col gap-10">
        <div class="flex flex-col gap-2">
          <span class="text-xl font-semibold">Task > Backlog</span>
          <TaskTable page="task" tab="backlog" />
        </div>
        <div class="flex flex-col gap-2">
          <span class="text-xl font-semibold">Task > All</span>
          <TaskTable page="task" sub-tab="myTask" tab="all" />
        </div>
        <div class="flex flex-col gap-2">
          <span class="text-xl font-semibold">
            Project - Module > All > My Tasks
          </span>
          <TaskTable
            :project-id="projectId"
            module-id="670620dd3be0c0a2ed7edcc4"
            page="project-module"
            sub-tab="myTask"
            tab="all"
          />
        </div>
        <div class="flex flex-col gap-2">
          <span class="text-xl font-semibold">
            Project - Sub Module > All > My Tasks
          </span>
          <TaskTable
            :project-id="projectId"
            module-id="670620dd3be0c0a2ed7edcc4"
            page="project-subModule"
            sub-module-id="6706211e872d8431a33e68b4"
            sub-tab="myTask"
            tab="all"
          />
        </div>
        <div class="flex flex-col gap-2">
          <span class="text-xl font-semibold"> Member Detail (Dzul) </span>
          <TaskTable
            page="member-detail"
            tab="all"
            user-id="66e90991e64712c4e5eb10a4"
          />
        </div>
        <div class="flex flex-col gap-2">
          <span class="text-xl font-semibold"> My Profile > Active </span>
          <TaskTable page="my-profile" tab="active" />
        </div>
        <div class="flex flex-col gap-2">
          <span class="text-xl font-semibold">
            Task > History > Related Task
          </span>
          <TaskTable page="task" sub-tab="relatedTask" tab="history" />
        </div>
        <div class="flex flex-col gap-2">
          <span class="text-xl font-semibold"> Task > Deleted </span>
          <TaskTable page="task" tab="deleted" />
        </div>
      </div>
    </template>
  </Card>
</template>
