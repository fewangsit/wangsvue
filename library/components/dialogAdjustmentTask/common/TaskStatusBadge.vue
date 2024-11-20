<script setup lang="ts">
import { computed } from 'vue';
import { TaskStatus } from '../DialogAdjustmentTask.vue.d';
import { BadgeProps } from 'lib/components/badge/Badge.vue.d';

import Badge from 'lib/components/badge/Badge.vue';

const props = defineProps<{ status: TaskStatus }>();

const badgeSeverity = computed((): Pick<BadgeProps, 'severity'> => {
  switch (props.status) {
    case 'Pending Review Leader':
    case 'Sprint':
      return {
        severity: 'primary',
      };
    case 'Penyesuaian':
      return {
        severity: 'warning',
      };
    case 'Backlog':
      return {
        severity: 'dark',
      };
    default:
      return {
        severity: 'danger',
      };
  }
});
</script>
<template>
  <Badge
    :label="props.status"
    :severity="badgeSeverity.severity"
    format="nowrap"
  />
</template>
