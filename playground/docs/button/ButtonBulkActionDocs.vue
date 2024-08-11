<script setup lang="ts">
import Card from 'wangsvue/card';
import DocTitle from '../DocTitle.vue';
import ButtonBulkAction from 'lib/components/buttonbulkaction/ButtonBulkAction.vue';
</script>

<template>
  <Card class="!px-0">
    <template #header>
      <DocTitle name="Bulk Action" />
    </template>
    <template #content>
      <ButtonBulkAction
        :options="[{ label: 'Action' }]"
        :selected-data="[{}, {}, {}]"
        :total-records="10"
      />
    </template>
  </Card>
</template>
