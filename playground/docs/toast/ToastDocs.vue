<script setup lang="ts">
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
import Toast from 'lib/components/toast/Toast.vue';
import Button from 'lib/components/button/Button.vue';
import { useToast } from 'lib/utils/';

const toast = useToast();

const openToast = (message: string, isError?: boolean): void => {
  toast.add({ message, error: isError, life: 0 });
};
</script>

<template>
  <Toast />

  <Card>
    <template #header>
      <DocTitle name="Toast" />
    </template>
    <template #content>
      <div
        class="w-[400px] flex flex-col gap-3 h-[65px] p-4 relative bg-[#f8f7ee] rounded-[5px] border-2 border-dashed border-[#9747ff]"
      >
        <div class="flex gap-3">
          <Button
            @click="openToast('Perubahan telah disimpan.')"
            label="Success Toast"
            severity="success"
          />
          <Button
            @click="openToast('Group soal gagal dihapus.', true)"
            label="Error Toast"
            severity="danger"
          />
          <Button
            @click="
              toast.add({
                icon: 'check-double-fill',
                iconClass: 'text-white',
              })
            "
            label="Custom Toast"
            severity="success"
          />
        </div>
      </div>
    </template>
  </Card>
</template>
