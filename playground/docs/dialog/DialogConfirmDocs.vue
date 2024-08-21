<script setup lang="ts">
import { shallowRef } from 'vue';
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
import DialogConfirm from 'lib/components/dialogconfirm/DialogConfirm.vue';
import Button from 'lib/components/button/Button.vue';
const showSuccess = shallowRef<boolean>(false);
const showDanger = shallowRef<boolean>(false);
</script>

<template>
  <Card>
    <template #header> <DocTitle name="Dialog Confirmation" /> </template>
    <template #content>
      <div class="flex gap-2">
        <Button
          @click="showSuccess = true"
          icon="eye"
          label="Show Success Confirmation"
          severity="success"
        />
        <Button
          @click="showDanger = true"
          icon="eye"
          label="Show Danger Confirmation"
          severity="danger"
        />
      </div>
      <DialogConfirm
        v-model:visible="showSuccess"
        close-label="Hilangkan"
        confirm-label="Simpan"
        header="Simpan Data"
        message="Apakah kamu yakin ingin menyimpan data ini?"
        severity="success"
      />
      <DialogConfirm
        v-model:visible="showDanger"
        :list="[
          'PT. ABC Indonesia - Return Only',
          'PT. ABC Indonesia - Exchange',
          'PT. DEF Indonesia - Return Only',
        ]"
        confirm-label="Hapus"
        header="Hapus Data"
        message="Apakah kamu yakin ingin menghapusnya?"
        severity="danger"
      />
    </template>
  </Card>
</template>
