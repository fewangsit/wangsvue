<script setup lang="ts">
import { ref } from 'vue';
import { CurrencyValue } from 'lib/components/inputcurrency/InputCurrency.vue.d';
import { formatCurrency } from 'lib/components/inputcurrency/helpers/currency.helper';

import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
import InputCurrency from 'lib/components/inputcurrency/InputCurrency.vue';
import InputNumber from 'lib/components/inputnumber/InputNumber.vue';

const currValue = ref<CurrencyValue>({});
</script>

<template>
  <Card>
    <template #header>
      <DocTitle name="Input Currency" />
    </template>
    <template #content>
      <div
        class="flex flex-col gap-3 p-4 relative bg-[#fff] rounded-[5px] border-2 border-dashed border-[#9747ff]"
      >
        <InputCurrency v-model="currValue" label="Currency" />
        {{ currValue }}
        <span class="py-1">
          Formatted Currency: {{ formatCurrency(currValue.value) }}
        </span>

        <br />
        Using InputNumber Component
        <InputNumber
          :allow-empty-value="false"
          :min="0"
          currency="IDR"
          locale="id-ID"
          mode="currency"
          use-grouping
        />

        Using InputNumber Component with prefix
        <InputNumber prefix="Rp" use-grouping />
      </div>
    </template>
  </Card>
</template>
