<script setup lang="ts">
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
import Toast from 'lib/components/toast/Toast.vue';
import DetailSprint from 'lib/components/detailsprint/DetailSprint.vue';
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
