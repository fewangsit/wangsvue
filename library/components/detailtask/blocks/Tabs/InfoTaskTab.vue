<script setup lang="ts">
import { ComputedRef, inject } from 'vue';

import Button from 'lib/components/button/Button.vue';

const isNewTask = inject<ComputedRef<boolean>>('isNewTask');
</script>

<template>
  <div data-wv-section="detailtask-info-task-tab">
    <div class="flex flex-col gap-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Button
            :disabled="isNewTask"
            class="!w-[150px] !h-[30px] !text-left !rounded"
            icon="user"
            label="Member"
            severity="success"
          />
          <Button
            :disabled="isNewTask"
            class="!w-[150px] !h-[30px] !text-left !rounded pointer-events-none"
            icon="team"
            label="Tim"
            severity="success"
          />
        </div>
        <Button
          :disabled="isNewTask"
          class="!w-[150px] !h-[30px] !text-left !rounded pointer-events-none"
          icon="timer"
          label="Durasi"
          severity="warning"
        />
      </div>
    </div>
  </div>
</template>
