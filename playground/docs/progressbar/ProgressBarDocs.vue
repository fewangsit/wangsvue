<script setup lang="ts">
import ProgressBar from 'lib/components/progressbar/ProgressBar.vue';
import DocTitle from '../DocTitle.vue';
import Card from '../../../library/components/card/Card.vue';
</script>

<template>
  <Card>
    <template #header>
      <DocTitle name="Progress Bar" />
    </template>

    <template #content>
      <span>Determinate</span>
      <ProgressBar mode="determinate" value="10" />
      <ProgressBar mode="determinate" value="10" value-position="left-side" />
      <ProgressBar mode="determinate" value="10" value-position="inside" />

      <span class="mt-2">Indeterminate</span>
      <ProgressBar mode="indeterminate" />
    </template>
  </Card>
</template>
