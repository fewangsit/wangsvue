<script setup lang="ts">
import { shallowRef } from 'vue';
import { WorkCalendarState } from 'lib/components/workcalendar/WorkCalendar.vue.d';
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
import WorkCalendar from 'lib/components/workcalendar/WorkCalendar.vue';
import Button from 'lib/components/button/Button.vue';
const calendarState = shallowRef<WorkCalendarState>('view');
</script>

<template>
  <Card>
    <template #header> <DocTitle name="Work Calendar" /> </template>
    <template #content>
      <WorkCalendar :state="calendarState" />
    </template>
    <template #footer>
      <Button
        :label="calendarState === 'edit' ? 'Simpan' : 'Edit'"
        :severity="calendarState === 'edit' ? 'success' : 'secondary'"
        @click="calendarState = calendarState === 'edit' ? 'view' : 'edit'"
        class="ml-auto"
      />
    </template>
  </Card>
</template>
