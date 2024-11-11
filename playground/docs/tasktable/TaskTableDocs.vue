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
      <TaskTable sub-tab="myTask" tab="all" />
    </template>
  </Card>
</template>
