<script setup lang="ts">
import { shallowRef } from 'vue';

import DocTitle from '../DocTitle.vue';
import DetailTask from 'lib/components/detailtask/DetailTask.vue';
import Button from 'lib/components/button/Button.vue';
import Card from 'lib/components/card/Card.vue';
import Toast from 'lib/components/toast/Toast.vue';

const showDetailTask = shallowRef<boolean>(false);
</script>

<template>
  <Toast />
  <DetailTask v-model:visible="showDetailTask" task-id="id" />
  <Card>
    <template #header>
      <DocTitle name="Detail Task" />
    </template>
    <template #content>
      <div class="flex justify-start">
        <Button @click="showDetailTask = true" label="Show Detail Task" />
      </div>
    </template>
  </Card>
</template>
