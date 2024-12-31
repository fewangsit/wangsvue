<script setup lang="ts">
import { computed, ComputedRef, inject, Ref, shallowRef } from 'vue';

import Button from 'lib/components/button/Button.vue';
import { TaskDetailData } from 'lib/types/task.type';
import Calendar from 'lib/components/calendar/Calendar.vue';
import { TaskServices } from 'wangsit-api-services';
import { EditTaskDTO } from 'lib/dto/task.dto';
import eventBus from 'lib/event-bus';
import { formatISODate, useToast } from 'lib/utils';
import { TaskLegendForm } from '../common/Legend.vue';
import DialogAssignMember from '../common/DialogAssignMember.vue';
import DialogSetDuration from '../common/DialogSetDuration.vue';
import TaskDependency from '../sections/TaskDependency/TaskDependency.vue';
import TaskList from '../sections/TaskList/TaskList.vue';
import Ticket from '../sections/Ticket/Ticket.vue';
import DialogCustomDependency from '../sections/TaskDependency/DialogCustomDependency.vue';
import { ProjectDetail } from 'lib/types/project.type';

const toast = useToast();

const isNewTask = inject<Ref<boolean>>('isNewTask');
const taskDetail = inject<Ref<TaskDetailData>>('taskDetail');
const projectDetail = inject<Ref<ProjectDetail>>('projectDetail');
const isMember = inject<Ref<boolean>>('isMember');
const userType =
  inject<ComputedRef<'member' | 'admin' | 'pm' | 'teamLeader'>>('userType');
const legendForm = inject<Ref<TaskLegendForm>>('legendForm');
const taskId = inject<Ref<string>>('taskId');
const isApproverHasAccess = inject<Ref<string>>('isApproverHasAccess');

const showDialogAssignMember = shallowRef<boolean>(false);
const showDialogSetDuration = shallowRef<boolean>(false);
const showDialogCustomDependency = shallowRef<boolean>(false);

const startDate = shallowRef<number>();

const startDateLabel = computed(() =>
  taskDetail.value?.startDate
    ? formatISODate(taskDetail.value?.startDate)
    : 'Tanggal Mulai',
);

const durationLabel = computed(() => {
  const { duration } = taskDetail.value ?? {}; // 'duration' field is in minutes
  if (duration) {
    return getDuration(duration);
  }
  return 'Durasi';
});

const isContinousDuration = computed(() =>
  ['Pengonsepan', 'Diagram', 'Wireframe', 'API Spec'].includes(
    taskDetail.value?.process?.name,
  ),
);

const continousDurationLabel = computed(() => {
  if (isContinousDuration.value && taskDetail.value?.startDate) {
    const today = new Date().getTime();
    const timerStartedat = new Date(taskDetail.value?.timerStartedAt).getTime();
    const timeDiff = today - timerStartedat;
    if (timeDiff > 0) {
      const minuteDiff = timeDiff / 60000;
      const durationInMinutes =
        minuteDiff + taskDetail.value?.timerStartedValue;
      return getDuration(durationInMinutes);
    }
    return 'Durasi';
  }
  return 'Durasi';
});

const memberNicknames = computed(() =>
  taskDetail.value.assignedTo.length > 1
    ? taskDetail.value.assignedTo[0].nickName + ' dkk'
    : taskDetail.value.assignedTo[0].nickName,
);

const memberTeams = computed(() => taskDetail.value.team.join(', '));

/**
 * If the task is new and the user is a member or a guest,
 * then the member label should be the user's nickname.
 * Otherwise, it should be the nicknames of the assigned members.
 * If no member is assigned, then the label should be 'Member'.
 */
const memberLabel = computed(() => {
  if (isNewTask.value && ['member', 'guest'].includes(userType.value)) {
    /*
     * If the task is new and the user is a team leader or a member or a guest,
     * then get the user's nickname from local storage.
     */
    const { nickName } = JSON.parse(localStorage.getItem('user') || '{}');
    return nickName;
  }
  /*
   * If the task is not new or the user is not a team leader or a member,
   * then the member label should be the nicknames of the assigned members.
   * If no member is assigned, then the label should be 'Member'.
   */
  return taskDetail?.value?.assignedTo.length > 0
    ? memberNicknames.value
    : 'Member';
});

const teamLabel = computed(() => {
  if (legendForm.value?.process?.team[0]?.initial && isNewTask.value)
    return legendForm.value?.process?.team[0]?.initial;
  return taskDetail.value?.team.length > 0 ? memberTeams.value : 'Tim';
});

/**
 * Computed property to determine if the member setting is disabled.
 *
 * The member setting is considered disabled if:
 * - The user type is not 'admin', 'pm', or 'teamLeader', and the approver does not have access.
 * - The task detail's process name is 'API Spec'.
 *
 * @returns {boolean} - True if the member setting is disabled, false otherwise.
 */
const isMemberSettingDisabled = computed(
  () =>
    (!['admin', 'pm', 'teamLeader'].includes(userType.value) &&
      !isApproverHasAccess.value) ||
    taskDetail.value?.process?.name === 'API Spec',
);

/**
 * Computed property to determine if the duration setting should be disabled.
 *
 * The duration setting is disabled if any of the following conditions are met:
 * - The task has a continuous duration.
 * - The task status is not 'Backlog' or 'Waiting for Approval'.
 * - The user type is not 'admin', 'pm', or 'teamLeader', and the user does not have approver access, and the user is not a member.
 *
 * @returns {boolean} - True if the duration setting should be disabled, false otherwise.
 */
const isDurationSettingDisabled = computed(
  () =>
    isContinousDuration.value ||
    !['Backlog', 'Waiting for Approval'].includes(taskDetail.value?.status) ||
    (!['admin', 'pm', 'teamLeader'].includes(userType.value) &&
      !isApproverHasAccess &&
      !isMember),
);

/**
 * Computed property to determine if the start date setting should be disabled.
 *
 * The start date setting is disabled if any of the following conditions are met:
 * - The method of project task is sprint.
 * - The task is not a continuous duration and its duration is not defined yet.
 * - The task process name is 'API Spec'.
 * - The task have sub module.
 * - The task status is not 'Backlog' or 'Waiting for Approval'.
 * - The user is not an 'admin', 'pm', or 'teamLeader', and does not have approver access, and is not a member.
 *
 * @returns {boolean} - True if the start date setting should be disabled, false otherwise.
 */
const isStartDateSettingDisabled = computed(
  () =>
    projectDetail.value?.method === 'Sprint' ||
    (!isContinousDuration.value && durationLabel.value === 'Durasi') ||
    taskDetail.value?.process?.name === 'API Spec' ||
    taskDetail.value?.subModule ||
    !['Backlog', 'Waiting for Approval'].includes(taskDetail.value?.status) ||
    (!['admin', 'pm', 'teamLeader'].includes(userType.value) &&
      !isApproverHasAccess.value &&
      !isMember.value),
);

const openCalendar = (): void => {
  const el: HTMLElement = document.querySelector('#startDateOfTaskDetail div');
  if (el) {
    el.click();
  }
};

const updateStartDate = async (): Promise<void> => {
  try {
    const body: EditTaskDTO = {
      startDate: new Date(startDate.value).toISOString(),
    };

    const { data } = await TaskServices.putEditTask(taskId.value, body);
    if (data) {
      eventBus.emit('detail-task:update', { taskId: taskId.value });
      toast.add({
        message: 'Tanggal mulai telah disimpan.',
        severity: 'success',
      });
    }
  } catch (error) {
    toast.add({
      message: 'Tanggal mulai gagal disimpan.',
      error,
    });
  }
};

const getDuration = (duration: number): string => {
  const totalMinutesInDay = 9 * 60; // 9 hours in a day
  const days = Math.floor(duration / totalMinutesInDay); // Full 9-hour days
  const hours = Math.floor((duration % totalMinutesInDay) / 60); // Remaining hours
  const remainingMinutes = Math.floor(duration % 60); // Remaining minutes

  return `${days}h ${hours}j ${remainingMinutes}m`;
};
</script>

<template>
  <div data-wv-section="detailtask-info-task-tab">
    <DialogAssignMember
      v-model:visible="showDialogAssignMember"
      @saved="eventBus.emit('detail-task:update', { taskId: taskId })"
    />
    <DialogSetDuration v-model:visible="showDialogSetDuration" />
    <DialogCustomDependency v-model:visible="showDialogCustomDependency" />
    <div class="flex flex-col gap-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Button
            :class="[
              '!min-w-[150px] !h-[30px] !text-left !rounded',
              { 'pointer-events-none': isMemberSettingDisabled },
            ]"
            :disabled="isNewTask"
            :label="memberLabel"
            @click="showDialogAssignMember = true"
            icon="user"
            severity="success"
          />
          <Button
            :disabled="isNewTask"
            :label="teamLabel"
            class="!w-[150px] !h-[30px] !text-left !rounded pointer-events-none"
            icon="team"
            severity="success"
          />
        </div>
        <div class="flex gap-2">
          <Button
            :class="[
              '!w-[150px] !h-[30px] !text-left !rounded',
              {
                'pointer-events-none': isDurationSettingDisabled,
              },
            ]"
            :disabled="isNewTask"
            :label="
              isContinousDuration ? continousDurationLabel : durationLabel
            "
            @click="showDialogSetDuration = true"
            icon="timer"
            severity="warning"
          />
          <div class="">
            <Button
              :class="[
                '!w-[165px] !h-[30px] !text-left !rounded',
                { 'pointer-events-none': isStartDateSettingDisabled },
              ]"
              :disabled="isNewTask"
              :label="startDateLabel"
              @click="openCalendar"
              icon="calendar"
              severity="warning"
            />
            <Calendar
              id="startDateOfTaskDetail"
              v-model="startDate"
              :date-value="
                taskDetail?.startDate
                  ? new Date(taskDetail?.startDate).getTime()
                  : undefined
              "
              :min-date="new Date()"
              @update:model-value="updateStartDate"
              class="!h-[0.000000001px] !w-[0.0000000001px]"
              show-time
            />
          </div>
        </div>
      </div>
      <TaskDependency />
      <TaskList child />
      <Ticket />
      <TaskList />
    </div>
  </div>
</template>
