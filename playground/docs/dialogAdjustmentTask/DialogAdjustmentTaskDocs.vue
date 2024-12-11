<script setup lang="ts">
import { shallowRef } from 'vue';
import { useToast } from 'lib/utils';
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
import Button from 'lib/components/button/Button.vue';
import DialogAdjustmentTask from 'lib/components/dialogAdjustmentTask/DialogAdjustmentTask.vue';
import Toast from 'lib/components/toast/Toast.vue';

const toast = useToast();

const includeStatuses = [
  'Pending Review Leader',
  'Sprint',
  'Fixing Bug',
  'Reported Bug',
  'Penyesuaian',
  'Backlog',
  'Waiting for Approval',
];
const customQueryParams = {
  subModule: '["6706211e872d8431a33e68b4"]',
  excludeApiSpec: true,
  status: `["${includeStatuses.join('","')}"]`,
};

const visibility = shallowRef<boolean>(true);
</script>
<template>
  <Card>
    <template #header>
      <DocTitle name="Dialog Adjusment Task" />
    </template>
    <template #content>
      <Button @click="visibility = true" label="Show Dialog" />
      <DialogAdjustmentTask
        v-model:visibility="visibility"
        :custom-member-options="[
          {
            _id: '66eb8ea2b3bb95576adbe790',
            nickName: 'Faris',
            key: 36,
            profilePictureBig: '/members/1731906347509-big.webp',
            progress: '0% (0/1)',
          },
        ]"
        :custom-query-params="customQueryParams"
        :custom-status-filter="
          includeStatuses.map((status) => ({
            label: status,
            value: status,
          }))
        "
        :members="[
          {
            _id: '66f7daf1772818078b060e85',
            nickName: 'El Gasing',
            key: 41,
          },
        ]"
        @failed-assign-un-assign="
          toast.add({
            message: 'Task gagal dialihkan.',
            error: $event,
          })
        "
        @success-assign-un-assign="
          toast.add({
            message: 'Task telah dialihkan.',
            severity: 'success',
          })
        "
      />
    </template>
  </Card>
  <Toast />
</template>
