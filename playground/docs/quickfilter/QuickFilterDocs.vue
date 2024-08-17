<script setup lang="ts">
import { ref } from 'vue';
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
import QuickFilter from 'lib/components/quickfilter/QuickFilter.vue';
import { quickFilterField } from './helpers/fields';

const filters = ref();
</script>

<template>
  <Card>
    <template #header>
      <DocTitle name="Quick Filter" />
    </template>
    <template #content>
      Filters: {{ filters }}
      <QuickFilter :fields="quickFilterField" @change="filters = $event" />
    </template>
  </Card>
</template>
