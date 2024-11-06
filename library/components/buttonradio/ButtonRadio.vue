<script lang="ts" setup>
import { computed, inject } from 'vue';
import { isEqual } from 'lodash';
import {
  ButtonRadioEmits,
  ButtonRadioProps,
} from 'lib/components/buttonradio/ButtonRadio.vue.d';

const Preset = inject<Record<string, any>>('preset', {}).buttonradio;

const props = defineProps<ButtonRadioProps>();
const emit = defineEmits<ButtonRadioEmits>();
defineOptions({ inheritAttrs: false });

const checked = computed(() => {
  return (
    props.modelValue != null &&
    (props.binary ? !!props.modelValue : isEqual(props.modelValue, props.value))
  );
});

const onChange = (event: Event): void => {
  if (!props.disabled && !props.readonly) {
    const newModelValue = props.binary ? !checked.value : props.value;

    emit('update:modelValue', newModelValue);
    emit('change', event);
  }
};

const onFocus = (event: Event): void => {
  emit('focus', event);
};

const onBlur = (event: Event): void => {
  emit('blur', event);
};
</script>

<template>
  <label v-bind="Preset.root">
    <span v-bind="Preset.wrapper({ props })">
      <input
        :id="inputId"
        v-bind="props"
        :aria-invalid="invalid || undefined"
        :checked="checked"
        :class="[Preset.input({ props }).class, inputClass]"
        :style="inputStyle"
        @blur="onBlur"
        @change="onChange"
        @focus="onFocus"
        type="radio"
      />

      <span v-bind="Preset.box({ props })">
        <span v-bind="Preset.icon" />
      </span>
    </span>

    <slot v-if="$slots.label" name="label" />
    <template v-else-if="label">{{ label }}</template>
  </label>
</template>
