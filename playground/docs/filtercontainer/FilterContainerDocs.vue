<script setup lang="ts">
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
import FilterContainer from 'lib/components/filtercontainer/FilterContainer.vue';

const clear = (): void => alert('Field Dibersihkan!');
const apply = (): void => alert('Filter Diterapkan!');
</script>
<template>
  <Card>
    <template #header>
      <DocTitle name="Filter Container" />
    </template>
    <template #subtitle>Auto placement grid system</template>
    <template #content>
      <template :key="index" v-for="(_, index) of Array.from({ length: 8 })">
        <span class="text-base font-medium text-grayscale-900">
          {{ index + 1 }} Field Layout
        </span>

        <FilterContainer @apply="apply" @clear="clear">
          <div
            :key="fieldIndex"
            v-for="(el, fieldIndex) of Array.from({ length: index + 1 })"
            class="w-full ring-inset ring-1 ring-general-500 bg-white px-4 py-2 rounded-md"
          >
            Field {{ fieldIndex + 1 }}
          </div>
        </FilterContainer>
      </template>
    </template>
  </Card>
</template>
