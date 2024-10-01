<script setup lang="ts">
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
import Dropdown from 'lib/components/dropdown/Dropdown.vue';
import { ref } from 'vue';
import { OptionValue } from 'lib/types/options.type';
import Form from 'lib/components/form/Form.vue';
import Badge from 'lib/components/badge/Badge.vue';

const model = ref<OptionValue>();
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
            v-model="model"
            :options="['Waiting for Approval', 'Waiting for Handover']"
            label="Status"
            placeholder="Pilih status"
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
            label="Status"
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
            field-name="status2"
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
            :options="[
              { label: 'Waiting for Approval', value: 'Approval' },
              { label: 'Waiting for Handover', value: 'Handover' },
            ]"
            class="w-max"
            field-name="status2"
            input-border="none"
            label="Status"
            mandatory
            option-label="label"
            placeholder="Pilih status"
            use-validator
            validator-message="Ga boleh kosong"
          >
            <template #value="{ value }">
              <Badge :label="value" />
            </template>
          </Dropdown>
          <Dropdown
            v-model="model"
            :options="['Waiting for Approval', 'Waiting for Handover']"
            label="Dropdown No Filter"
            :filter="false"
            placeholder="Pilih status"
          />
        </template>
      </Form>
    </template>
  </Card>
</template>
