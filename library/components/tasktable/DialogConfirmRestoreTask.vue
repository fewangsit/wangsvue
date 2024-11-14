<script setup lang="ts">
import DialogConfirm from 'lib/components/dialogconfirm/DialogConfirm.vue';

const visible = defineModel<boolean>('visible', { required: true });
</script>

<template>
  <DialogConfirm
    v-model:visible="visible"
    confirm-label="Simpan"
    header="Pulihkan Task"
    message="Task ini akan kembali menjadi aktif dan berstatus backlog. Apakah kamu yakin ingin memulihkannya?"
    severity="success"
  />
</template>
