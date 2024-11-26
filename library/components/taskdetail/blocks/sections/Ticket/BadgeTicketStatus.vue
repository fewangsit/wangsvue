<script setup lang="ts">
import { computed } from 'vue';
import { BadgeStatus } from 'lib/types/ticket.type';

import Badge from 'lib/components/badge/Badge.vue';

const props = defineProps<{
  status?: BadgeStatus;
}>();

const badgeSeverityStatus = computed<
  'success' | 'danger' | 'warning' | 'dark' | 'primary'
>(() => {
  switch (props.status) {
    case 'Closed':
      return 'success';
    case 'Need Confirmation':
      return 'primary';
    case 'On Progress':
      return 'warning';
    case 'On Verification':
      return 'dark';
    case 'Open':
      return 'dark';
    default:
      return 'dark';
  }
});
</script>
<template>
  <Badge
    :label="status ?? '-'"
    :severity="badgeSeverityStatus"
    format="nowrap"
  />
</template>
