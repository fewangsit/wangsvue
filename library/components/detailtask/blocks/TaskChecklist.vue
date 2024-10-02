<script setup lang="ts">
import Button from 'lib/components/button/Button.vue';
import Icon from 'lib/components/icon/Icon.vue';
import { ref } from 'vue';

const showDialogAddChecklist = ref<boolean>(false);
</script>

<template>
  <div class="flex flex-col gap-2" data-wv-section="detailtask-task-checklist">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Icon class="w-6 h-6" icon="check" />
        <div class="text-xs font-semibold">Ceklis</div>
      </div>
      <div class="flex items-center gap-2">
        <!-- TODO: Handle task link changelog on click -->
        <Button
          icon="file-history"
          icon-class="!w-6 !h-6"
          severity="secondary"
          text
        />
        <Button
          @click="showDialogAddChecklist = true"
          icon="add"
          label="Ceklis"
          severity="secondary"
        />
      </div>
    </div>
  </div>
</template>
