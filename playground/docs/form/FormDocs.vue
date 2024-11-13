<script setup lang="ts">
import Button from 'lib/components/button/Button.vue';
import Card from 'lib/components/card/Card.vue';
import Form from 'lib/components/form/Form.vue';
import { FormValue } from 'lib/components/form/Form.vue.d';
import InputText from 'lib/components/inputtext/InputText.vue';
import InvisibleField from 'lib/components/invisiblefield/InvisibleField.vue';
import { ref } from 'vue';
import DocTitle from '../DocTitle.vue';
import FileUpload from 'lib/components/fileupload/FileUpload.vue';
import InputRangeNumber from 'lib/components/inputrangenumber/InputRangeNumber.vue';
import InputNumber from 'lib/components/inputnumber/InputNumber.vue';

const formValues = ref<(FormValue | null)[]>([null, null, null, null]);
const showResult = ref<boolean[]>([]);
const first = ref<string>();

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
              v-model="first"
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
            <FileUpload
              :max-file-size="1000000"
              :validator-message="{ empty: 'KOSONG' }"
              :with-upload="false"
              @error="console.log"
              accept=".pdf,.xlsx,.xls.docx"
              field-name="inifile"
              file-extensions=".pdf .xls .docx"
              mandatory
              use-validator
            />
            <FileUpload
              :max-file-size="1000000"
              :with-upload="false"
              @error="console.log"
              accept=".pdf,.xlsx,.xls.docx"
              field-name="iniwfile"
              file-extensions=".pdf .xls .docx"
              mandatory
              use-validator
            />
            <InvisibleField
              :field-name="`rahasia${[index]}`"
              value="Resep Rahasia"
            />
            <InputText
              v-if="first"
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
            <InputNumber
              :field-name="`angka${[index]}`"
              :validator-message="{
                empty: 'Isi gaji',
              }"
              label="Gaji"
              mandatory
              use-validator
            />
            <InputRangeNumber
              :max-field-name="`maxrange${[index]}`"
              :min-field-name="`minrange${[index]}`"
              :validator-message="{
                empty: 'Tebak dulu',
              }"
              label="Tebak umur"
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
