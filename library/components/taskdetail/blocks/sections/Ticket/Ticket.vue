<script setup lang="ts">
import {
  computed,
  ComputedRef,
  inject,
  ref,
  Ref,
  shallowRef,
  watch,
} from 'vue';
import { TicketStatus, TicketTaskId } from 'lib/types/ticket.type';
import { TicketServices } from 'wangsit-api-services';
import { useToast } from 'lib/utils';
import { TaskDetailData } from 'lib/types/task.type';
import Icon from 'lib/components/icon/Icon.vue';
import Dropdown from 'lib/components/dropdown/Dropdown.vue';
import eventBus from 'lib/event-bus';
import { WangsitStatus } from 'lib/types/wangsStatus.type';

const toast = useToast();

type RemainingTimeResult = {
  text: string;
  isOverdue: boolean;
};

const taskId = inject<Ref<string>>('taskId');
const taskDetail = inject<Ref<TaskDetailData>>('taskDetail');
const isNewTask = inject<Ref<boolean>>('isNewTask');
const isMember = inject<ComputedRef<boolean>>('isMember');

const tickets = ref<TicketTaskId[]>();
const ticketKey = shallowRef(0);

const taskStatus = computed(() => taskDetail.value?.status);

/**
 * The dropdown field is considered disabled if:
 * - The user is not a member (`!isMember.value`).
 * - The task status is either 'Pending Review Leader' or 'Selesai'.
 */
const isDisabled = computed(() => {
  return (
    !isMember.value ||
    (['Pending Review Leader', 'Selesai'] as WangsitStatus[]).includes(
      taskStatus.value,
    )
  );
});

const getTicketList = async (): Promise<void> => {
  if (taskId.value === undefined || isNewTask.value) {
    return;
  }
  try {
    const { data } = await TicketServices.getTicketTaskId(taskId.value);
    tickets.value = data.data.map((ticket) => ({
      ...ticket,
      ticketId: ticket.ticketId.slice(1),
    }));
  } catch (error) {
    console.error(error);
  }
};

const getRemainingTime = (deadline?: string): RemainingTimeResult => {
  if (!deadline) {
    return {
      isOverdue: false,
      text: '-',
    };
  }

  try {
    const dateNow = new Date();
    const dateDeadline = new Date(deadline);

    const seconds = (dateDeadline.getTime() - dateNow.getTime()) / 1000;
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days <= 0 && hours <= 0 && minutes <= 0) {
      const isOverdue = seconds < 0;
      return {
        isOverdue,
        text: `${isOverdue ? '- ' : ''}${Math.abs(days)}h ${Math.abs(hours)}j ${Math.abs(minutes)}m`,
      };
    }

    return {
      isOverdue: false,
      text: `${days}h ${hours}j ${minutes}m`,
    };
  } catch (error) {
    console.error(error);
    return {
      isOverdue: false,
      text: '-',
    };
  }
};

const getStatusOptions = (status: TicketStatus): TicketStatus[] => {
  switch (status) {
    case 'Open':
      return [
        'Open',
        'On Verification',
        'Request Cancel',
        'On Progress',
        'Need Confirmation',
      ];
    case 'On Verification':
      return ['On Verification', 'On Progress', 'Need Confirmation'];
    case 'Request Cancel':
      return ['Request Cancel'];
    case 'On Progress':
      return ['On Progress', 'Need Confirmation'];
    case 'Need Confirmation':
      return ['Need Confirmation'];
    case 'Closed':
      return ['Closed'];
    case 'Cancel Ticket':
      return ['Cancel Ticket'];
    default:
      return [];
  }
};

const updateKeyByInterval = (): void => {
  setInterval(() => {
    ticketKey.value++;
  }, 30000);
};

const updateTicketStatus = async (
  ticketId: string,
  status: TicketStatus,
): Promise<void> => {
  try {
    const body = { status };
    const { data } = await TicketServices.patchTicketStatusByTicketId(
      ticketId,
      body,
    );
    if (data) {
      reloadTask();
    }
  } catch (error) {
    console.error(error);
    toast.add({
      message: 'Tiket gagal diubah.',
      error,
    });
  } finally {
    await getTicketList();
  }
};

const reloadTask = (): void => {
  eventBus.emit('detail-task:update', { taskId: taskId.value });
};

watch(
  taskStatus,
  async (value) => {
    if (value) {
      await getTicketList();
      updateKeyByInterval();
    }
  },
  { immediate: true },
);
</script>

<template>
  <div data-wv-section="detailtask-ticket-list">
    <div class="flex items-center gap-2">
      <Icon class="w-6 h-6" icon="ticket" />
      <div class="text-xs font-semibold">Ticket</div>
    </div>
    <ul v-if="tickets" class="pl-12 list-disc">
      <li :key="index" v-for="(ticket, index) in tickets">
        <div class="flex gap-2 items-center my-1">
          <span>{{ ticket.ticketId }} {{ ticket.subject }}</span>
          <div class="!w-[154px]">
            <Dropdown
              v-model="ticket.status"
              :disabled="
                (
                  [
                    'Need Confirmation',
                    'Cancel Ticket',
                    'Closed',
                  ] as TicketStatus[]
                ).includes(ticket.status) || isDisabled
              "
              :initial-value="ticket.status"
              :options="getStatusOptions(ticket.status)"
              @update:model-value="
                updateTicketStatus(ticket._id, $event as TicketStatus)
              "
              placeholder="Pilih status"
            />
          </div>
          <span :key="ticketKey">
            Remaining Response Time :
            <span
              :class="
                getRemainingTime(ticket.deadline).isOverdue
                  ? 'text-danger-500'
                  : ''
              "
            >
              {{ getRemainingTime(ticket.deadline).text }}
            </span>
          </span>
        </div>
      </li>
    </ul>
  </div>
</template>
