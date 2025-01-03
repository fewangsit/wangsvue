<script setup lang="ts">
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
import ButtonRadio from 'lib/components/buttonradio/ButtonRadio.vue';
import { shallowRef } from 'vue';

const model = shallowRef();
</script>

<template>
  <Card>
    <template #header>
      <DocTitle name="Toggle" />
    </template>
    <template #content>
      <div
        class="w-[111px] flex flex-col gap-3 h-auto p-4 relative bg-white rounded-[5px] border-2 border-dashed border-[#9747ff]"
      >
        Model: {{ model }}
        <ButtonRadio v-model="model" invalid label="A" value="a" />
        <ButtonRadio v-model="model" label="B" value="b" />
      </div>
    </template>
  </Card>
</template>
