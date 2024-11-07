<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import Badge from '../badge/Badge.vue';
import Dialog from '../dialog/Dialog.vue';
import Icon from '../icon/Icon.vue';
import { ApproverInfoProps } from './ApproverInfo.vue.d';
import { BadgeProps } from '../badge/Badge.vue.d';

const props = defineProps<ApproverInfoProps>();

const showApprovalPopUp = shallowRef<boolean>(false);

const approverData = computed<{ name?: string; date?: string }>(() => {
  let levelValue!: number;
  let index!: number;

  props.approvals?.forEach((level) => {
    index = level.approvers.findIndex((approver) => !!approver.actionTimeStamp);
    levelValue = index === -1 ? 0 : level.level - 1;
    index = index === -1 ? 0 : index;
  });

  return {
    name: props.approvals?.[levelValue]?.approvers[index]?.userFullName,
    date: props.approvals?.[levelValue]?.approvers[index]?.actionTimeStamp,
  };
});

const getSeverity = (status?: string): BadgeProps['severity'] => {
  let severity: BadgeProps['severity'];

  switch (status) {
    case 'approve':
      severity = 'success';
      break;
    case 'ditolak':
    case 'reject':
      severity = 'danger';
      break;
    default:
      severity = 'warning';
  }

  return severity;
};
</script>

<template>
  <div
    class="flex justify-end gap-1 items-center pb-1 flex-wrap whitespace-nowrap"
    data-wv-name="approver-info"
  >
    <span>Approver:</span>
    <template v-if="approvals?.length">
      <Icon class="!text-general-200 !text-base" icon="user" />
      <span class="text-primary-500">{{ approverData.name }}</span>
      <span class="text-general-800">
        {{ approverData.date }}
      </span>
      <span
        @click="showApprovalPopUp = true"
        class="text-primary-500 hover:cursor-pointer"
      >
        more
      </span>
    </template>
    <span v-else>-</span>
  </div>
  <Dialog
    v-model:visible="showApprovalPopUp"
    class="min-w-[400px]"
    header="Approval List"
    modal
  >
    <div class="flex flex-col gap-3 justify-between">
      <template :key="approval._id" v-for="approval in approvals">
        <div class="flex justify-between">
          <span class="text-general-800 text-xs font-medium">
            Level {{ approval.level }} ({{ approval.type.toLowerCase() }})
          </span>
          <Badge
            v-if="approval.status === 'Selesai'"
            label="selesai"
            severity="success"
          />
        </div>
        <div
          :key="approver.userId"
          v-for="approver in approval.approvers"
          class="flex justify-between"
        >
          <div class="flex justify-between items-center">
            <Icon class="!text-general-200 !text-base" icon="user" />
            <span class="text-primary-500 font-medium text-xs">{{
              approver.userFullName
            }}</span>
          </div>
          <span
            v-if="approval.status === 'Selesai' && !approver.action"
            class="text-general-800 font-normal text-xs"
          >
            Tidak terlibat
          </span>
          <div v-else class="flex gap-1 justify-end items-center">
            <span class="text-general-800 font-normal text-xs">{{
              approver.actionTimeStamp
                ? approver.actionTimeStamp
                : 'Menunggu approval...'
            }}</span>
            <Badge
              v-if="approver.action"
              :label="approver.action === 'approve' ? 'menyetujui' : 'menolak'"
              :severity="getSeverity(approver.action)"
            />
          </div>
        </div>
      </template>
    </div>
  </Dialog>
</template>
