<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import Badge from '../badge/Badge.vue';
import Dialog from '../dialog/Dialog.vue';
import Icon from '../icon/Icon.vue';
import { ApproverInfoProps } from './ApproverInfo.vue.d';
import { BadgeProps } from '../badge/Badge.vue.d';
import { formatDate } from 'lib/utils';

const props = withDefaults(defineProps<ApproverInfoProps>(), {
  showShortInfo: true,
  useFormatDate: true,
});

const showApprovalPopUp = shallowRef<boolean>(false);

const approverData = computed<{ name?: string; date?: string }>(() => {
  let levelValue!: number;
  let index!: number;

  props.approvals?.forEach((level) => {
    index = level.approvers.findIndex((approver) => !!approver.actionAt);
    levelValue = index === -1 ? 0 : level.level - 1;
    index = index === -1 ? 0 : index;
  });

  return {
    name: props.approvals?.[levelValue]?.approvers[index]?.fullName,
    date: props.approvals?.[levelValue]?.approvers[index]?.actionAt,
  };
});

const getSeverity = (status?: string): BadgeProps['severity'] => {
  let severity: BadgeProps['severity'];

  switch (status) {
    case 'menyetujui':
      severity = 'success';
      break;
    case 'menolak':
      severity = 'danger';
      break;
    default:
      severity = 'warning';
  }

  return severity;
};

const getDate = (dateString?: string): string => {
  if (props.useFormatDate) {
    return dateString
      ? formatDate(new Date(dateString), {
          locale: 'id-ID',
          dateFormat: 'dd M yyyy',
          timeFormat: 'HH:mm:ss',
        })
      : '-';
  }
  return dateString;
};
</script>

<template>
  <div
    class="flex justify-end gap-1 items-center pb-1 flex-wrap whitespace-nowrap"
    data-wv-name="approver-info"
  >
    <template v-if="showShortInfo">
      <span>Approver:</span>
      <template v-if="approvals?.length">
        <Icon class="!text-general-200 !text-base" icon="user" />
        <span class="text-primary-500">{{ approverData.name }}</span>
        <span class="text-general-800">
          {{ getDate(approverData.date) }}
        </span>
        <span
          @click="showApprovalPopUp = true"
          class="text-primary-500 hover:cursor-pointer"
        >
          more
        </span>
      </template>
      <span v-else>-</span>
    </template>
    <template v-else>
      <span
        @click="showApprovalPopUp = true"
        class="text-primary-500 hover:cursor-pointer"
      >
        {{ label ?? 'Lihat Approval' }}
      </span>
    </template>
  </div>
  <Dialog
    v-model:visible="showApprovalPopUp"
    class="min-w-[400px]"
    header="List Approver"
    modal
  >
    <div class="flex flex-col gap-3 justify-between">
      <template :key="approval._id" v-for="approval in approvals">
        <div class="flex justify-between">
          <span class="text-general-800 text-xs font-medium">
            Level {{ approval.level }} ({{ approval.type.toLowerCase() }})
          </span>
          <Badge
            v-if="approval.status === 'selesai'"
            label="selesai"
            severity="success"
          />
        </div>
        <div
          :key="approver._id"
          v-for="approver in approval.approvers"
          class="flex justify-between"
        >
          <div class="flex justify-between items-center">
            <Icon class="!text-general-200 !text-base" icon="user" />
            <span class="text-primary-500 font-medium text-xs">{{
              approver.fullName
            }}</span>
          </div>
          <span
            v-if="approval.status === 'selesai' && !approver.action"
            class="text-general-800 font-normal text-xs"
          >
            Tidak terlibat
          </span>
          <div v-else class="flex gap-1 justify-end items-center">
            <span class="text-general-800 font-normal text-xs">{{
              approver.actionAt
                ? getDate(approver.actionAt)
                : 'Menunggu approval...'
            }}</span>
            <Badge
              v-if="approver.action"
              :label="approver.action"
              :severity="getSeverity(approver.action)"
            />
          </div>
        </div>
      </template>
    </div>
  </Dialog>
</template>
