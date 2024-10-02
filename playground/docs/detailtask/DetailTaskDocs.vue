<script setup lang="ts">
import { ref } from 'vue';

import DocTitle from '../DocTitle.vue';
import DetailTask from 'lib/components/detailtask/DetailTask.vue';
import Button from 'lib/components/button/Button.vue';
import Card from 'lib/components/card/Card.vue';
import Toast from 'lib/components/toast/Toast.vue';
import InputText from 'lib/components/inputtext/InputText.vue';

const showDetailTask = ref<boolean>(false);
const showNewTask = ref<boolean>(false);

const taskId = ref<string>('66fb6b394374e14b8768debf');
</script>

<template>
  <Toast />
  <DetailTask v-model:visible="showDetailTask" :task-id="taskId" />
  <DetailTask v-model:visible="showNewTask" />
  <Card>
    <template #header>
      <DocTitle name="Detail Task" />
    </template>
    <template #content>
      <InputText v-model="taskId" label="Task ID" />
      <div class="flex justify-start gap-3">
        <Button
          :label="`Show Detail Task (Task ID: ${taskId})`"
          @click="showDetailTask = true"
        />
        <Button
          @click="showNewTask = true"
          label="Show Detail Task (New Task)"
        />
      </div>
    </template>
  </Card>
</template>
