<script setup lang="ts">
import Button from 'lib/components/button/Button.vue';
import Icon from 'lib/components/icon/Icon.vue';
import DialogSetTaskLink from './Dialog/DialogSetTaskLink.vue';
import { ref } from 'vue';

const showDialogSetTaskLink = ref<boolean>(false);
</script>

<template>
  <div class="flex flex-col gap-2" data-wv-section="detailtask-task-link">
    <DialogSetTaskLink v-model:visible="showDialogSetTaskLink" />
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Icon class="w-6 h-6" icon="link" />
        <div class="text-xs font-semibold">Link Task</div>
      </div>
      <div class="flex items-center gap-2">
        <!-- TODO: Handle chat icon on click -->
        <Button
          icon="chat-1-line"
          icon-class="!w-6 !h-6"
          severity="secondary"
          text
        />
        <!-- TODO: Handle task link changelog on click -->
        <Button
          icon="file-history"
          icon-class="!w-6 !h-6"
          severity="secondary"
          text
        />
        <Button
          @click="showDialogSetTaskLink = true"
          icon="add"
          label="Link Task"
          severity="secondary"
        />
      </div>
    </div>
  </div>
</template>
