<script setup lang="ts">
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
import WorkCalendar from 'lib/components/workcalendar/WorkCalendar.vue';
</script>

<template>
  <Card>
    <template #header> <DocTitle name="Work Calendar" /> </template>
    <template #content>
      <WorkCalendar />
    </template>
  </Card>
</template>
