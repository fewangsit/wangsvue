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
import Button from '../button/Button.vue';
import UserName from '../username/UserName.vue';
import NotificationServices from 'lib/services/notification.service';

const toast = useToast();

const props = defineProps<NotificationItemProps>();

const emit = defineEmits<NotificationItemEmits>();

const notifActionMessage = computed<string>(() => {
  switch (props.notification.module) {
    case 'Task Improvement':
      return 'Apakah ada penyesuaian pada task yang lain?';
    default:
      return undefined;
  }
});

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

const readNotif = async (): Promise<void> => {
  const read = await readNotification();
  if (read) emit('read', props.notification._id);
};

const onClickNotification = async (
  notification: NotificationItemType,
): Promise<void> => {
  if (notification.isRead && notification.isReadOnly) return;
  try {
    let read = true;
    if (!notification.isRead && notification.isActioned)
      read = await readNotification();
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

const readNotification = async (): Promise<boolean> => {
  try {
    await NotificationServices.readNotification(props.notification._id);
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
        if (notification.isActioned) emit('read', notification._id);
        emit('openTask', notification.data.taskId, notification.data.projectId);
      }
  }
};
</script>

<template>
  <div
    :class="{ 'justify-between': longNotif }"
    :style="{
      cursor: !(notification.isRead && notification.isReadOnly)
        ? 'pointer'
        : 'default',
    }"
    @click="onClickNotification(notification)"
    class="rounded-[8px] bg-primary-50 border border-primary-100 py-3 px-3.5 flex text-xs"
    data-wv-name="notif-item-container"
  >
    <div :class="{ 'w-full': !longNotif }" class="flex gap-3.5">
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
        <template v-if="!notification.isActioned">
          {{ notifActionMessage }}
          <div v-if="!longNotif" class="flex flex-row gap-2 mt-2 ml-auto">
            <Button
              @click.stop="readNotif"
              label="Tidak"
              outlined
              severity="secondary"
            />
            <Button
              @click.stop="
                $emit(
                  'openTaskImprovement',
                  notification.data.taskId,
                  notification.data.projectId,
                  notification._id,
                )
              "
              label="Ya, Ada"
              severity="secondary"
            />
          </div>
        </template>
        <span
          class="text-grayscale-700 text-[10px] text-nowrap"
          data-wv-name="notif-item-time"
        >
          {{ formatDateReadable(new Date(notification.createdAt)) }}
        </span>
      </div>
    </div>

    <!-- Notification Arrow -->
    <div v-if="!notification.isReadOnly" class="flex place-items-center">
      <div v-if="!notification.isActioned && longNotif" class="flex gap-2">
        <Button
          @click.stop="readNotif"
          label="Tidak"
          outlined
          severity="secondary"
        />
        <Button
          @click.stop="
            $emit(
              'openTaskImprovement',
              notification.data.taskId,
              notification.data.projectId,
              notification._id,
            )
          "
          label="Ya, Ada"
          severity="secondary"
        />
      </div>
      <Icon class="flex justify-center ml-2 text-2xl" icon="arrow-right" />
    </div>
  </div>
</template>
