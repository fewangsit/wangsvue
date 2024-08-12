<script setup lang="ts">
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
import Calendar from 'lib/components/calendar/Calendar.vue';
</script>

<template>
  <Card>
    <template #header> <DocTitle name="Calendar" /> </template>
    <template #content>
      <div class="grid grid-cols-4">
        <Calendar mode="range" />
      </div>
    </template>
  </Card>
</template>
