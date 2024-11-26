<script setup lang="ts">
import Button from 'lib/components/button/Button.vue';
import Icon from 'lib/components/icon/Icon.vue';
import { onMounted, ref, watch } from 'vue';

const props = withDefaults(
  defineProps<{ typeValue: 'text' | 'file'; initialValue: string }>(),
  {
    typeValue: 'text',
  },
);

const textInput = ref<string>();
const fileInput = ref();

const emit = defineEmits<{
  textInput: [value: string | undefined];
  fileInput: [value: File];
}>();

watch(fileInput, (newValue: File) => {
  emit('fileInput', newValue);
});

watch(textInput, (newValue) => {
  emit('textInput', newValue);
});

onMounted(() => {
  textInput.value = props.initialValue;
});
</script>
<template>
  <div>
    <template v-if="props.typeValue === 'text'">
      <span
        :contenteditable="true"
        @blur="
          (e: Event) => {
            textInput = (e.target as HTMLElement).innerText;
          }
        "
        class="focus:px-2 w-full inline-block py-2 focus:outline-grayscale-600 focus:outline-1"
      >
        {{ textInput }}
      </span>
    </template>

    <template v-if="props.typeValue === 'file'">
      <div class="relative flex flex-col">
        <template v-if="fileInput?.name === undefined">
          <Button
            class="w-full !rounded-md absolute"
            label="Pilih File"
            severity="secondary"
          />
          <input
            @change="
              (e: Event) => {
                fileInput = (e?.target as HTMLInputElement).files?.[0];
              }
            "
            class="absolute w-full opacity-0"
            label="Pilih File"
            severity="secondary"
            type="file"
          />
        </template>
        <template v-else>
          <div class="flex items-center">
            <p>{{ fileInput?.name }}</p>
            <Icon
              @click="
                () => {
                  fileInput = undefined;
                }
              "
              icon="close"
              severity="danger"
            />
          </div>
        </template>
      </div>
    </template>
  </div>
</template>
