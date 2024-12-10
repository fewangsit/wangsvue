<script setup lang="ts">
import { shallowRef } from 'vue';
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
import Button from 'lib/components/button/Button.vue';
import DialogAdjustmentTask from 'lib/components/dialogAdjustmentTask/DialogAdjustmentTask.vue';

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
        :custom-member-options="[
          {
            _id: '66d1771c1ebe5344bc2b9dab',
            nickName: 'Super Admin',
            key: 24,
            profilePictureBig: '/members/1731906347509-big.webp',
            progress: '22.14% (29/131)',
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
            _id: '66d1771c1ebe5344bc2b9dab',
            nickName: 'Super Admin',
            key: 24,
          },
        ]"
        prevent-appear
      />
    </template>
  </Card>
</template>
