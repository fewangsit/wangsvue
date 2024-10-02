<script setup lang="ts">
import Icon from 'lib/components/icon/Icon.vue';

const props = defineProps<{
  // TODO: Ticket Type
  tickets: unknown[];
}>();
</script>

<template>
  <div data-wv-section="detailtask-ticket-list">
    <div class="flex items-center gap-2">
      <Icon class="w-6 h-6" icon="ticket" />
      <div class="text-xs font-semibold">Ticket</div>
    </div>
    <ul v-if="props.tickets" class="pl-12 list-disc">
      <li :key="index" v-for="(pTask, index) in props.tickets">
        <!-- TODO: Ticket Design -->
      </li>
    </ul>
  </div>
</template>
