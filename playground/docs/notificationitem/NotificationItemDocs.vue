<script setup lang="ts">
import { NotificationItemType } from 'lib/components/notificationitem/NotificationItem.vue.d';
import { data } from './notification.json';
import DocTitle from '../DocTitle.vue';
import Card from 'lib/components/card/Card.vue';
import NotificationItem from 'lib/components/notificationitem/NotificationItem.vue';
import Toast from 'lib/components/toast/Toast.vue';

const notifications = data.data as NotificationItemType[];
</script>

<!-- eslint-disable vue/html-quotes -->
<template>
  <Card>
    <template #header>
      <DocTitle name="Notification Item" />
    </template>
    <template #content>
      <div
        v-if="notifications?.length"
        class="w-full flex flex-col gap-2 justify-center"
      >
        <NotificationItem
          :key="notif._id"
          v-for="notif in notifications"
          :notification="notif"
          data-wv-name="notif-item"
        />
      </div>
    </template>
  </Card>
  <Toast />
</template>
