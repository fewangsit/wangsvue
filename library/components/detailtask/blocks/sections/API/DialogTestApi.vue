<script setup lang="ts">
import Button from 'lib/components/button/Button.vue';
import Dialog from 'lib/components/dialog/Dialog.vue';

const visible = defineModel<boolean>('visible', { required: true });
</script>

<template>
  <Dialog
    v-model:visible="visible"
    :closable="false"
    class="w-[800px]"
    header="Tes API"
    modal
  >
    <template #header>
      <div class="flex justify-between items-center w-full">
        <span class="text-lg font-semibold leading-4">Tes API</span>
        <Button
          @click="visible = false"
          class="!p-0.5 !text-general-200 dark:!text-general-200"
          data-wv-section="closebutton"
          icon="close"
          icon-class="w-[22px] h-[22px]"
          severity="secondary"
          text
        />
      </div>
    </template>
  </Dialog>
</template>
