<script setup lang="ts">
import TaskTable from 'lib/components/tasktable/TaskTable.vue';
import DocTitle from '../DocTitle.vue';
import Card from 'lib/components/card/Card.vue';
</script>

<template>
  <Card>
    <template #header>
      <DocTitle name="Task Table" />
    </template>
    <template #content>
      <div class="flex flex-col gap-10">
        <div class="flex flex-col gap-2">
          <span class="text-xl font-semibold">All > My Tasks</span>
          <TaskTable sub-tab="myTask" tab="all" />
        </div>
        <div class="flex flex-col gap-2">
          <span class="text-xl font-semibold">All > Related Tasks</span>
          <TaskTable sub-tab="relatedTask" tab="all" />
        </div>
        <div class="flex flex-col gap-2">
          <span class="text-xl font-semibold">Active > My Tasks</span>
          <TaskTable sub-tab="myTask" tab="active" />
        </div>
      </div>
    </template>
  </Card>
</template>
