<script setup lang="ts">
import { ref } from 'vue';
import { OptionValue } from 'lib/types/options.type';
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
import MultiSelect from 'lib/components/multiselect/MultiSelect.vue';
import Button from 'lib/components/button/Button.vue';

const model = ref<OptionValue[]>();
const objectValueModel = ref<OptionValue[]>([
  { _id: '1', status: 'Waiting for Approval' },
]);
const items = ref(
  Array.from({ length: 100000 }, (_, i) => ({ label: `Item #${i}`, value: i })),
);

const selectedProcess = {
  _id: '67106aecb1cbb5ebd3760575',
  name: 'hhhhhh',
  team: [{ _id: '66beef9f787cdd8139a71515', teamInitial: 'UIUX' }],
  processPosition: 'Di luar Deployment',
  reviewLeader: true,
  active: true,
  nonactivable: false,
  default: false,
  dependencies: [
    { _id: '6707a73a2492eb56557b6bab', name: 'Repositori BE' },
    {
      _id: '6707a73a2492eb56557b6bac',
      name: 'Repositori FE',
    },
  ],
  parentsOf: [],
  createdAt: '2024-10-17 01:39:56',
};

const dependenciesOptions = [
  { _id: '6707a73a2492eb56557b6bab', name: 'Repositori BE' },
  {
    _id: '6707a73a2492eb56557b6bac',
    name: 'Repositori FE',
  },
  { _id: '6707a73a2492eb56557b6bad', name: 'Repositori Mobile' },
  {
    _id: '6707a73a2492eb56557b6bae',
    name: 'Pengonsepan',
  },
  { _id: '6707a73a2492eb56557b6baf', name: 'Diagram' },
  {
    _id: '6707a73a2492eb56557b6bb0',
    name: 'Wireframe',
  },
  { _id: '6707a73a2492eb56557b6bb1', name: 'Komponen Web' },
  {
    _id: '6707a73a2492eb56557b6bb2',
    name: 'Komponen Mobile',
  },
  { _id: '6707a73a2492eb56557b6bb3', name: 'API Spec' },
  {
    _id: '6707a73a2492eb56557b6bb4',
    name: 'Database',
  },
  { _id: '6707a73a2492eb56557b6bb5', name: 'Create API' },
  {
    _id: '6707a73a2492eb56557b6bb6',
    name: 'Slicing Komponen Web',
  },
  { _id: '6707a73a2492eb56557b6bb7', name: 'Slicing Web' },
  {
    _id: '6707a73a2492eb56557b6bb8',
    name: 'Slicing Komponen Mobile',
  },
  { _id: '6707a73a2492eb56557b6bb9', name: 'Slicing Mobile' },
  {
    _id: '6707a73a2492eb56557b6bba',
    name: 'IOT',
  },
  { _id: '6707a73a2492eb56557b6bbb', name: 'Dokumentasi API' },
  {
    _id: '6707a73a2492eb56557b6bbc',
    name: 'User Manual Web',
  },
  { _id: '6707a73a2492eb56557b6bbd', name: 'User Manual Mobile' },
  {
    _id: '6707a73a2492eb56557b6bbe',
    name: 'Detailing',
  },
  { _id: '6707a73a2492eb56557b6bbf', name: 'Connect API Web' },
  {
    _id: '6707a73a2492eb56557b6bc0',
    name: 'Connect API Mobile',
  },
];
</script>

<template>
  <Card>
    <template #header>
      <DocTitle name="MultiSelect" />
    </template>
    <template #content>
      <div
        class="w-[300px] flex flex-col gap-3 h-auto p-4 relative bg-white rounded-[5px] border-2 border-dashed border-[#9747ff]"
      >
        <div class="flex flex-col gap-1">
          <MultiSelect
            v-model="model"
            :options="items"
            :show-optional-text="false"
            label="Status"
            option-label="label"
            option-value="value"
            placeholder="Pilih status"
          />
          <MultiSelect
            v-model="objectValueModel"
            :invalid="true"
            :options="[
              { _id: '1', status: 'Waiting for Approval' },
              { _id: '2', status: 'Waiting for Handover' },
            ]"
            label="Status"
            option-label="status"
          />

          {{ selectedProcess?.dependencies }}
          <hr />
          {{
            dependenciesOptions.filter((option) =>
              selectedProcess?.dependencies.some(
                (dep) => dep.name === option.name,
              ),
            )
          }}
          <MultiSelect
            :disabled="!!selectedProcess?.default"
            :initial-value="selectedProcess?.dependencies"
            :options="dependenciesOptions"
            data-key="_id"
            field-name="dependencies"
            label="Dependensi"
            option-label="name"
            use-validator
          />

          <Button @click="model = undefined" label="Empty Model" />
        </div>
      </div>

      <MultiSelect
        :options="['Waiting for Approval', 'Waiting for Handover']"
        controls
        label="Multi Select Controls"
      />
    </template>
  </Card>
</template>
