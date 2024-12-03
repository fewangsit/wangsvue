<script lang="ts" setup>
import { navigateToUrl } from 'single-spa';
import { computed } from 'vue';
import {
  goToAccountMember,
  goToProject,
  goToProjectList,
  goToQC,
} from './helpers/goToDetail.helper';
import {
  NotificationItemEmits,
  NotificationItemProps,
  NotificationItemType,
} from './NotificationItem.vue.d';
import { formatDateReadable, useToast } from 'lib/utils';
import { WangsIcons } from '../icon/Icon.vue.d';
import Icon from '../icon/Icon.vue';
import UserName from '../username/UserName.vue';
import NotificationServices from 'lib/services/notification.service';

const toast = useToast();

const props = defineProps<NotificationItemProps>();

const emit = defineEmits<NotificationItemEmits>();

const bgClass = computed<string>(() => {
  switch (props.notification.severity) {
    case 'danger':
      return 'bg-danger-500';
    case 'warning':
      return 'bg-warning-500';
    case 'success':
      return 'bg-success-500';
    case 'primary':
    case 'info':
      return 'bg-primary-500';
    default:
      return 'bg-grayscale-900';
  }
});

const icon = computed<WangsIcons>(() => {
  switch (props.notification.category) {
    case 'barricade':
      return 'barricade-line';
    case 'bug':
      return 'bug-2-line';
    case 'delete':
      return 'delete-bin';
    default:
      return props.notification.category;
  }
});

const onClickNotification = async (
  notification: NotificationItemType,
): Promise<void> => {
  if (notification.isRead && notification.isReadOnly) {
    return;
  }
  try {
    let read = true;
    if (!notification.isRead) read = await readNotification(notification._id);
    if (read) {
      if (notification.isReadOnly) {
        emit('read', notification._id);
      } else {
        goToDetail(notification);
        emit('close');
      }
    }
  } catch (error) {
    console.error(error);
    toast.add({
      error,
      message: 'Gagal pindah ke halaman detail notifikasi.',
    });
  }
};

const readNotification = async (id: string): Promise<boolean> => {
  try {
    await NotificationServices.readNotification(id);
    return true;
  } catch (error) {
    console.error(error);
    toast.add({ error, message: 'Gagal membaca notifikasi.' });
    return false;
  }
};

const goToDetail = (notification: NotificationItemType): void => {
  let showDetailTask: boolean;
  switch (notification.module) {
    case 'Account Member':
      goToAccountMember(notification);
      break;
    case 'API & Server ':
      navigateToUrl('/proyek/detail-proyek/api-server');
      break;
    case 'Project':
      goToProjectList(notification);
      break;
    case 'Quality Control':
      goToQC(notification);
      break;
    default:
      showDetailTask = goToProject(notification);
      if (showDetailTask) {
        emit('read', notification._id);
        emit('openTask', notification.data.taskId, notification.data.projectId);
      }
  }
};
</script>

<template>
  <div
    :style="{
      cursor: !(notification.isRead && notification.isReadOnly)
        ? 'pointer'
        : 'default',
    }"
    @click="onClickNotification(notification)"
    class="rounded-[8px] w-full bg-primary-50 border border-primary-100 py-3 px-3.5 flex gap-3.5"
    data-wv-name="notif-item-container"
  >
    <!-- Notification Icon -->
    <div class="flex items-center">
      <div
        :class="bgClass"
        class="flex size-[30px] rounded-full justify-center items-center border border-general relative"
      >
        <Icon :icon="icon" class="text-base text-white" />
        <div
          v-if="!notification.isRead"
          class="size-[10px] border border-white rounded-full bg-success-500 absolute top-0 -left-[3px]"
          data-wv-name="green-dot"
        />
      </div>
    </div>

    <!-- Notification Content -->
    <div class="flex flex-col gap-0.5 w-full">
      <h5 data-wv-name="notif-item-title">{{ notification.title }}</h5>
      <p data-wv-name="notif-item-detail">{{ notification.detail }}</p>
      <UserName
        v-if="notification.data?.user"
        :user="notification.data.user"
        @click.stop
        data-wv-name="notif-item-user"
        type="icon"
      />
      <div
        v-if="notification.data?.description"
        class="text-xs font-medium"
        data-wv-name="notif-item-description"
      >
        {{ notification.data.description }}
      </div>
      <span
        class="text-grayscale-700 text-[10px] text-nowrap"
        data-wv-name="notif-item-time"
      >
        {{ formatDateReadable(new Date(notification.createdAt)) }}
      </span>
    </div>

    <!-- Notification Arrow -->
    <div
      v-if="!notification.isReadOnly"
      class="max-h-full flex flex-col justify-center"
    >
      <Icon class="text-2xl" icon="arrow-right" />
    </div>
  </div>
</template>
