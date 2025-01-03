<script setup lang="ts">
import { onMounted } from 'vue';
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
import Toast from 'lib/components/toast/Toast.vue';
import DetailSprint from 'lib/components/detailsprint/DetailSprint.vue';

onMounted(() => {
  sessionStorage.setItem('projectId', '6763d977d628f99ad72a8e32');
});
</script>

<template>
  <Card>
    <template #header> <DocTitle name="Detail Sprint" /> </template>
    <template #content>
      <DetailSprint
        :is-approving="false"
        sprint-id="676a1b99b6999c14a8b8dd24"
      />
    </template>
  </Card>
  <Toast />
</template>
