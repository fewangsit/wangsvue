<script setup lang="ts">
import { ref, shallowRef } from 'vue';
import { NotificationItemType } from 'lib/components/notificationitem/NotificationItem.vue.d';
import { data } from './notification.json';
import DocTitle from '../DocTitle.vue';
import Card from 'lib/components/card/Card.vue';
import NotificationItem from 'lib/components/notificationitem/NotificationItem.vue';
import Toast from 'lib/components/toast/Toast.vue';
import TaskDetail from 'lib/components/taskdetail/TaskDetail.vue';
import DialogImprovementTask from 'lib/components/dialogimprovementtask/DialogImprovementTask.vue';
import Button from 'lib/components/button/Button.vue';
import OverlayPanel from 'lib/components/overlaypanel/OverlayPanel.vue';

const notifications = ref(data.data as NotificationItemType[]);
const showDetailTask = shallowRef<boolean>(false);
const showImprovementTask = shallowRef<boolean>(false);
const currentTaskId = shallowRef<string>();
const currentProjectId = shallowRef<string>();
const currentNotificationId = shallowRef<string>();
const notificationPanel = ref<{
  toggle: (event?: Event, target?: unknown) => void;
}>();

const onRead = (id: string): void => {
  const index = notifications.value.findIndex(
    (notification) => notification._id === id,
  );
  if (index > -1) {
    notifications.value[index].isRead = true;
    notifications.value[index].isActioned = true;
  }
};

const onOpenTask = (taskId?: string, projectId?: string): void => {
  currentTaskId.value = taskId;
  currentProjectId.value = projectId;
  showDetailTask.value = true;
};

const onOpenTaskImprovement = (
  taskId?: string,
  projectId?: string,
  notificationId?: string,
): void => {
  currentTaskId.value = taskId;
  currentProjectId.value = projectId;
  currentNotificationId.value = notificationId;
  showImprovementTask.value = true;
};
</script>

<!-- eslint-disable vue/html-quotes -->
<template>
  <TaskDetail
    v-model:visible="showDetailTask"
    :project-id="currentProjectId"
    :task-id="currentTaskId"
  />

  <DialogImprovementTask
    v-model:visible="showImprovementTask"
    :notification-id="currentNotificationId"
    :project-id="currentProjectId"
    :task-id="currentTaskId"
    @close="onRead"
  />

  <Card>
    <template #header>
      <DocTitle name="Notification Item" />
    </template>
    <template #content>
      <Button
        @click="notificationPanel?.toggle($event)"
        class="relative bg-white !overflow-visible"
        data-wv-name="toggle-notif-btn"
        icon="notification"
        severity="secondary"
        text
      />
      <div
        v-if="notifications?.length"
        class="w-full flex flex-col gap-2 justify-center"
      >
        <NotificationItem
          :key="notif._id"
          v-for="notif in notifications"
          :notification="notif"
          @open-task="onOpenTask"
          @open-task-improvement="onOpenTaskImprovement"
          @read="onRead"
          data-wv-name="notif-item"
          long-notif
        />
      </div>
    </template>
  </Card>

  <OverlayPanel ref="notificationPanel" :dismissable-overlay="false">
    <div
      v-if="notifications?.length"
      class="w-full flex flex-col gap-2 justify-center"
    >
      <NotificationItem
        :key="notif._id"
        v-for="notif in notifications"
        :notification="notif"
        @open-task="onOpenTask"
        @open-task-improvement="onOpenTaskImprovement"
        @read="onRead"
        data-wv-name="notif-item"
        long-notif
      />
    </div>
  </OverlayPanel>
  <Toast />
</template>
