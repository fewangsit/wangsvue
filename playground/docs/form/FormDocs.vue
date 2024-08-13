<script setup lang="ts">
import Card from 'lib/components/card/Card.vue';
import DocTitle from '../DocTitle.vue';
import Form from 'lib/components/form/Form.vue';
import Button from 'lib/components/button/Button.vue';
import { FormValue } from 'lib/components/form/Form.vue.d';
import { ref } from 'vue';
import InputText from 'lib/components/inputtext/InputText.vue';

const formValues = ref<(FormValue | null)[]>([null, null, null, null]);
const showResult = ref<boolean[]>([]);

const clear = (): void => alert('Field Dibersihkan!');

const apply = (
  e: {
    formValues: FormValue;
    stayAfterSubmit: boolean;
  },
  index: number,
): void => {
  formValues.value[index] = e.formValues;
};
</script>
<template>
  <Card>
    <template #header>
      <DocTitle name="Form" />
    </template>
    <template #subtitle>Auto placement grid system</template>
    <template #content>
      <template :key="index" v-for="(_, index) of Array.from({ length: 4 })">
        <span class="text-base font-medium text-grayscale-900 mt-4">
          {{ index + 1 }} Field Layout
        </span>

        <Form
          :buttons-template="['cancel', 'clear', 'submit']"
          :column-per-row="index + 1"
          @clear="clear"
          @submit="apply($event, index)"
        >
          <template #fields>
            <InputText
              :field-name="`username${[index]}`"
              :validator-message="{
                exceed: 'Max char 30',
                empty: 'Should not empty',
              }"
              label="Username"
              mandatory
              placeholder="Use custom placholder"
              use-validator
            />
            <InputText
              :field-name="`firstname${[index]}`"
              :validator-message="{
                exceed: 'Max char 30',
                empty: 'Should not empty',
              }"
              label="Nama Depan"
              mandatory
              use-validator
            />
            <InputText
              :field-name="`lastname${[index]}`"
              :validator-message="{
                exceed: 'Max char 30',
                empty: 'Should not empty',
              }"
              label="Nama Belakang"
              mandatory
              use-validator
            />
            <InputText
              :field-name="`nationality${[index]}`"
              disabled
              label="Kewarganegaraan"
              use-validator
              value="Indonesia"
            />
          </template>
        </Form>
        <Button
          :label="
            showResult[index] !== true
              ? 'Click to Show Form Values'
              : 'Click to Hide Form Values'
          "
          @click="showResult[index] = !showResult[index]"
        />
        <template v-if="showResult[index] === true && formValues">
          <pre>{{ formValues[index] }}</pre>
        </template>
      </template>
    </template>
  </Card>
</template>
