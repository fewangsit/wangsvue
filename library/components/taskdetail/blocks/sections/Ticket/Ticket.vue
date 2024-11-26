<script setup lang="ts">
import Icon from 'lib/components/icon/Icon.vue';
import { TicketTaskId } from 'lib/types/ticket.type';
import { inject, onMounted, Ref, shallowRef } from 'vue';
import BadgeTicketStatus from './BadgeTicketStatus.vue';
import TicketServices from 'lib/services/ticket.service';

const taskId = inject<Ref<string>>('taskId');

const ticketDatas = shallowRef<TicketTaskId[]>();

const getTicketList = async (): Promise<void> => {
  try {
    const { data } = await TicketServices.getTicketTaskId(taskId.value);
    ticketDatas.value = data.data;
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  getTicketList();
});
</script>

<template>
  <div data-wv-section="detailtask-ticket-list">
    <div class="flex items-center gap-2">
      <Icon class="w-6 h-6" icon="ticket" />
      <div class="text-xs font-semibold">Ticket</div>
    </div>
    <ul v-if="ticketDatas" class="pl-12 list-disc">
      <li :key="index" v-for="(pTask, index) in ticketDatas">
        <div class="flex gap-2 items-center my-1">
          <p>{{ pTask.ticketId }}</p>
          <BadgeTicketStatus :status="pTask.status" />
        </div>
      </li>
    </ul>
  </div>
</template>
