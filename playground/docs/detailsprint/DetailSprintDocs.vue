<script setup lang="ts">
import { onMounted } from 'vue';
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
import Toast from 'lib/components/toast/Toast.vue';
import DetailSprint from 'lib/components/detailsprint/DetailSprint.vue';

onMounted(() => {
  sessionStorage.setItem('projectId', '6722dfe34b50d65e441a2537');
});
</script>

<template>
  <Card>
    <template #header> <DocTitle name="Detail Sprint" /> </template>
    <template #content>
      <DetailSprint
        :is-approving="false"
        sprint-id="673a9ec2d951839b9a137917"
      />
    </template>
  </Card>
  <Toast />
</template>
