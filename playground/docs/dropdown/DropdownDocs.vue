<script setup lang="ts">
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
import Dropdown from 'lib/components/dropdown/Dropdown.vue';
import { ref } from 'vue';
import { OptionValue } from 'lib/types/options.type';
import Form from 'lib/components/form/Form.vue';
import Badge from 'lib/components/badge/Badge.vue';

const model = ref<OptionValue>();

const items = ref(
  Array.from({ length: 100000 }, (_, i) => ({ label: `Item #${i}`, value: i })),
);
</script>

<template>
  <Card>
    <template #header>
      <DocTitle name="Dropdown" />
    </template>
    <template #content>
      <div
        class="w-[300px] flex flex-col gap-3 h-auto p-4 relative bg-white rounded-[5px] border-2 border-dashed border-[#9747ff]"
      >
        <div class="flex flex-col gap-1">
          <Dropdown
            :options="items"
            field-name="status24"
            label="Status"
            option-label="label"
            option-value="value"
            placeholder="Pilih status"
          />
          <Dropdown
            :initial-value="{
              _id: '6721bfeba8a17fbc05abe894',
              name: 'Heimdal',
              sku: 'HEM',
              type: 'Subscribe',
              isElsa: false,
              standardPrice: 600000,
              standardDiscount: { type: 'percentage', value: 10 },
            }"
            :options="[
              {
                label: 'Heimdal',
                value: {
                  _id: '6721bfeba8a17fbc05abe894',
                  brand: 'Heimdal',
                  name: 'Heimdal',
                  unit: 'device',
                  subscribeTimeUnit: 'Tahun',
                  type: 'Subscribe',
                  sku: 'HEM',
                  standardPrice: 600000,
                  standardDiscount: {
                    type: 'percentage',
                    productType: 'Subscribe',
                    subscribeValue: [10, 15],
                  },
                  status: 'aktif',
                  onApprovalProcess: false,
                  isElsa: false,
                  proratedProduct: false,
                },
              },
              {
                label: 'IOT Defense Force-ELSA',
                value: {
                  _id: '6743e1dbaa2bd68205d1823d',
                  brand: 'Heimdal',
                  name: 'IOT Defense Force-ELSA',
                  unit: 'Unit',
                  subscribeTimeUnit: 'Tahun',
                  type: 'Subscribe',
                  sku: 'Heimdal-IOT-DF',
                  standardPrice: 500000,
                  standardDiscount: {
                    type: 'percentage',
                    productType: 'Subscribe',
                    subscribeValue: [10, 5],
                  },
                  status: 'aktif',
                  onApprovalProcess: true,
                  isElsa: true,
                  proratedProduct: false,
                },
              },
            ]"
            data-key="_id"
            field-name="dropdownDataKey"
            label="Dropdown dengan implementasi datakey"
            option-label="label"
            option-value="value"
            placeholder="Pilih produk"
          />
        </div>
      </div>

      Dropdown with validation

      <Form :buttons-template="['submit']" @submit="console.log">
        <template #fields>
          <Dropdown
            :options="[
              { label: 'Waiting for Approval', value: 'Approval' },
              { label: 'Waiting for Handover', value: 'Handover' },
            ]"
            field-name="status12"
            initial-value="Approva"
            label="Status"
            loading
            mandatory
            option-label="label"
            option-value="value"
            placeholder="Pilih status"
            use-validator
            validator-message="Ga boleh kosong"
          />
          <Dropdown
            :badge-value-props="{ severity: 'primary', format: 'nowrap' }"
            :options="[
              { label: 'Waiting for Approval', value: 'Approval' },
              { label: 'Waiting for Handover', value: 'Handover' },
            ]"
            class="w-max"
            field-name="status23"
            input-border="none"
            label="Status"
            mandatory
            option-label="label"
            placeholder="Pilih status"
            use-validator
            validator-message="Ga boleh kosong"
            value-type="badge"
          />
          <Dropdown
            :initial-value="{ text: 'Approval', _id: 'id' }"
            :options="[
              {
                label: 'Waiting for Approval',
                value: { text: 'Approval', _id: 'id1' },
              },
              {
                label: 'Waiting for Handover',
                value: { text: 'Handover', _id: 'id2' },
              },
            ]"
            @update:model-value="console.log"
            class="w-max"
            field-name="status213"
            input-border="none"
            label="Status 213"
            loading
            mandatory
            option-label="label"
            option-value="value"
            placeholder="Pilih status"
            use-validator
            validator-message="Ga boleh kosong"
          >
            <template #value="{ value }">
              <Badge :label="value" />
            </template>
          </Dropdown>
          <Dropdown
            :options="[
              {
                label: 'Waiting for Approval',
                value: { text: 'Approval', _id: 'id1' },
              },
              {
                label: 'Waiting for Handover',
                value: { text: 'Handover', _id: 'id2' },
              },
            ]"
            @update:model-value="console.log"
            class="w-max"
            field-name="status2"
            input-border="none"
            label="Status"
            mandatory
            option-label="label"
            option-value="value"
            placeholder="Pilih status"
            use-validator
            validator-message="Ga boleh kosong"
          />
          <Dropdown
            v-model="model"
            :filter="false"
            :options="['Waiting for Approval', 'Waiting for Handover']"
            field-name="status29"
            label="Dropdown No Filter"
            placeholder="Pilih status"
          />
        </template>
      </Form>
    </template>
  </Card>
</template>
