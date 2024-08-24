<script setup lang="ts">
import { ref } from 'vue';
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
import Checkbox from 'lib/components/checkbox/Checkbox.vue';
import Form from 'lib/components/form/Form.vue';

const formValues = ref();
const checkboxValue = ref();
</script>

<template>
  <Card>
    <template #header>
      <DocTitle name="Checkbox" />
    </template>
    <template #content>
      <div
        class="w-[324px] flex flex-col gap-3 h-[116px] p-4 relative bg-[#f8f7ee] rounded-[5px] border-2 border-dashed border-[#9747ff]"
      >
        <div class="flex gap-3">
          <Checkbox :model-value="false" label="Label" tooltip="Info" />
          <Checkbox
            :model-value="false"
            disabled
            label="Label"
            tooltip="Info"
          />
          <Checkbox :model-value="true" label="Label" tooltip="Info" />
          <Checkbox :model-value="true" disabled label="Label" tooltip="Info" />
        </div>
        <Checkbox
          :model-value="false"
          label="Label"
          tooltip="Within Table"
          within-table
        />
      </div>

      <Checkbox
        v-model="checkboxValue"
        class="mt-6"
        label="Check this to change the value of 'Checkbox with validation'"
      />

      <Form
        :buttons-template="['submit']"
        @submit="formValues = $event.formValues"
        class="mt-6"
      >
        <template #fields>
          <Checkbox
            :value="checkboxValue"
            @update:model-value="console.log"
            label="Checkbox with validation"
            use-validator
          />
        </template>
      </Form>
      Form values: {{ formValues }}
    </template>
  </Card>
</template>
