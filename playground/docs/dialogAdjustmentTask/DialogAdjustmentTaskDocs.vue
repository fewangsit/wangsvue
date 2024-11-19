<script setup lang="ts">
import { ref } from 'vue';
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
import Button from 'lib/components/button/Button.vue';
import DialogAdjustmentTask from '../../../library/components/dialogAdjustmentTask/DialogAdjustmentTask.vue';

const visibility = ref<boolean>(false);
</script>
<template>
  <Card>
    <template #header>
      <DocTitle name="Dialog Addjusment Task" />
    </template>
    <template #content>
      <Button
        @click="
          () => {
            visibility = true;
          }
        "
        label="Show Dialog"
      />
      <DialogAdjustmentTask
        v-model:visibility="visibility"
        :members="[
          {
            _id: '66d1771c1ebe5344bc2b9dab',
            nickName: 'Cak Rudi',
          },
        ]"
        prevent-appear
      />
    </template>
  </Card>
</template>
