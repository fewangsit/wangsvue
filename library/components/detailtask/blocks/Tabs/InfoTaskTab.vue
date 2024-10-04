<script setup lang="ts">
import { computed, inject, Ref, ref } from 'vue';

import Button from 'lib/components/button/Button.vue';
import DialogAssignMember from '../Dialog/DialogAssignMember.vue';
import DialogSetDuration from '../Dialog/DialogSetDuration.vue';
import { TaskDetail } from 'lib/types/task.type';
import TaskDependency from '../TaskDependency.vue';
import TaskList from '../TaskList.vue';
import TicketList from '../TicketList.vue';
import DialogCustomDependency from '../Dialog/DialogCustomDependency.vue';

const isNewTask = inject<Ref<boolean>>('isNewTask');
const taskDetail = inject<Ref<TaskDetail>>('taskDetail');

const showDialogAssignMember = ref<boolean>(false);
const showDialogSetDuration = ref<boolean>(false);
const showDialogCustomDependency = ref<boolean>(false);

const memberNicknames = computed(() =>
  taskDetail.value.assignedTo.map((member) => member.nickName).join(', '),
);

const memberTeams = computed(() => taskDetail.value.team.join(', '));
</script>

<template>
  <div data-wv-section="detailtask-info-task-tab">
    <DialogAssignMember v-model:visible="showDialogAssignMember" />
    <DialogSetDuration v-model:visible="showDialogSetDuration" />
    <DialogCustomDependency v-model:visible="showDialogCustomDependency" />
    <div class="flex flex-col gap-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Button
            :disabled="isNewTask"
            :label="
              taskDetail?.assignedTo.length > 0 ? memberNicknames : 'Member'
            "
            @click="showDialogAssignMember = true"
            class="!min-w-[150px] !h-[30px] !text-left !rounded"
            icon="user"
            severity="success"
          />
          <Button
            :disabled="isNewTask"
            :label="taskDetail?.team.length > 0 ? memberTeams : 'Tim'"
            class="!w-[150px] !h-[30px] !text-left !rounded pointer-events-none"
            icon="team"
            severity="success"
          />
        </div>
        <Button
          :disabled="isNewTask"
          @click="showDialogSetDuration = true"
          class="!w-[150px] !h-[30px] !text-left !rounded"
          icon="timer"
          label="Durasi"
          severity="warning"
        />
      </div>
      <!-- TODO: Assign data from task detail -->
      <div class="flex items-center justify-between">
        <TaskDependency :task-dependency="[]" />
        <Button
          :disabled="
            isNewTask || (taskDetail && taskDetail.status === 'Selesai')
          "
          @click="showDialogCustomDependency = true"
          icon="add"
          label="Custom"
          severity="secondary"
        />
      </div>
      <TicketList :tickets="[]" />
      <TaskList :tasks="[]" type="child" />
      <TaskList :tasks="[]" type="parent" />
    </div>
  </div>
</template>
