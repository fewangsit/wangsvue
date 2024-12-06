<script setup lang="ts">
import { computed } from 'vue';
import { BadgeProps } from 'lib/components/badge/Badge.vue.d';
import { TaskStatus } from 'lib/types/wangsStatus.type';
import { getStatusSeverity } from 'lib/utils';

import Badge from 'lib/components/badge/Badge.vue';

const props = defineProps<{ status: TaskStatus }>();

const badgeSeverity = computed((): Pick<BadgeProps, 'severity'> => {
  return getStatusSeverity(props.status) as Pick<BadgeProps, 'severity'>;
});
</script>
<template>
  <Badge
    :label="props.status"
    :severity="badgeSeverity.severity"
    format="nowrap"
  />
</template>
