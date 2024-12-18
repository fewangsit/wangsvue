<script setup lang="ts">
import TaskTable from 'lib/components/tasktable/TaskTable.vue';
import DocTitle from '../DocTitle.vue';
import Card from 'lib/components/card/Card.vue';
import Toast from 'lib/components/toast/Toast.vue';
import Button from 'lib/components/button/Button.vue';
import TaskDetail from 'lib/components/taskdetail/TaskDetail.vue';
import { ref } from 'vue';

const projectId = sessionStorage.getItem('projectId') ?? '';

const dialogDetailTask = ref(false);
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
          <span class="text-xl font-semibold">Task > All > My</span>
          <TaskTable page="task" sub-tab="myTask" tab="all" />
        </div>
        <div class="flex flex-col gap-2">
          <span class="text-xl font-semibold">Task > All > Related</span>
          <TaskTable page="task" sub-tab="relatedTask" tab="all" />
        </div>
        <div class="flex flex-col gap-2">
          <span class="text-xl font-semibold">
            Project (Shopea) > Task > All > My Task
          </span>
          <TaskTable
            page="project-task"
            project-id="6745365361c91ef9b2fb7a62"
            sub-tab="myTask"
            tab="all"
          />
          <div class="">
            <Button @click="dialogDetailTask = true" label="Open Approval" />
            <TaskDetail
              v-model:visible="dialogDetailTask"
              approval-id="675163826a20cedef1e69413"
              project-id="6745365361c91ef9b2fb7a62"
              task-id="675163826a20cedef1e6940d"
            />
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <span class="text-xl font-semibold">
            Project - Module > All > My Tasks
          </span>
          <TaskTable
            :project-id="projectId"
            module-id="6706205a9bdcad72db25715f"
            page="project-module"
            sub-tab="myTask"
            tab="all"
          />
        </div>
        <div class="flex flex-col gap-2">
          <span class="text-xl font-semibold">
            Project - Sub Module (Sub Module MT) > All > My Tasks
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
          <span class="text-xl font-semibold">
            Project - Sub Module (Sub Module MT2) > All > My Tasks
          </span>
          <TaskTable
            :project-id="projectId"
            module-id="670620dd3be0c0a2ed7edcc4"
            page="project-subModule"
            sub-module-id="6706216f872d8431a33e69a3"
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
