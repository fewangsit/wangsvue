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
      <ProgressBar :value="0" mode="determinate" />
      <ProgressBar :value="10" mode="determinate" value-position="left-side" />
      <ProgressBar
        :value="10"
        mode="determinate"
        severity="danger"
        value-position="left-side"
      />
      <ProgressBar
        :value="100"
        mode="determinate"
        severity="success"
        value-position="left-side"
      />

      <ProgressBar :value="100" mode="determinate" value-position="inside" />

      <span class="mt-2">Indeterminate</span>
      <ProgressBar mode="indeterminate" />
    </template>
  </Card>
</template>
