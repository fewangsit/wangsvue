<script setup lang="ts">
import Calendar from 'lib/components/calendar/Calendar.vue';
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
</script>

<template>
  <Card>
    <template #header> <DocTitle name="Calendar" /> </template>
    <template #content>
      <div class="grid grid-cols-4 items-end justify-end gap-3">
        <Calendar mode="range" />
        <Calendar label="Calendar" mode="range" use-validator />
        <Calendar disabled label="Calendar Disabled" mode="range" />
        <Calendar label="Calendar Time" mode="range" show-time />
      </div>
    </template>
  </Card>
</template>
