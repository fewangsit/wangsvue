<script setup lang="ts">
import Card from 'lib/components/card/Card.vue';
import ButtonSearch from 'lib/components/buttonsearch/ButtonSearch.vue';
import DocTitle from '../DocTitle.vue';
import { shallowRef } from 'vue';

const query = shallowRef();
</script>

<template>
  <Card class="!px-0">
    <template #header>
      <DocTitle name="Search" />
    </template>
    <template #content>
      <ButtonSearch @search="query = $event" />
      Text you have entered: {{ query }}
    </template>
  </Card>
</template>
