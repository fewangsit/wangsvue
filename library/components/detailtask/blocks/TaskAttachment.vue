<script setup lang="ts">
import Button from 'lib/components/button/Button.vue';
import Icon from 'lib/components/icon/Icon.vue';
</script>

<template>
  <div class="flex flex-col gap-2" data-wv-section="detailtask-task-attachment">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Icon class="w-6 h-6" icon="attachment-2" />
        <div class="text-xs font-semibold">Attachment</div>
      </div>
      <div class="flex items-center gap-2">
        <!-- TODO: Handle attachment changelog on click -->
        <Button
          class="!p-1"
          icon="file-history"
          icon-class="!w-6 !h-6"
          severity="secondary"
          text
        />
        <!-- TODO: Handle add attachment -->
        <Button icon="add" label="Attachment" severity="secondary" />
      </div>
    </div>
  </div>
</template>
