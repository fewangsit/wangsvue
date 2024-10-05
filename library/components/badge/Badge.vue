<script setup lang="ts">
import { computed, shallowRef } from 'vue';
import { BadgeProps, BadgeEmits } from 'lib/components/badge/Badge.vue.d';
import { formatUserName } from 'lib/utils';

import Button from 'lib/components/button/Button.vue';
import getStatusSeverity from 'lib/utils/statusSeverity.util';
import { WangsitStatus } from 'lib/types/wangsStatus.type';

const props = withDefaults(defineProps<BadgeProps>(), {});
const emit = defineEmits<BadgeEmits>();

const hasValue = computed(() => {
  const type = typeof props.label;
  return (
    type === 'number' ||
    (type === 'string' && props.label && props.label !== '-')
  );
});

const badgeSeverity = computed(() => {
  return props.severity ?? getStatusSeverity(props.label as WangsitStatus);
});

const severityClasses = computed<string[]>(() => {
  if (!props.disabled) {
    switch (badgeSeverity.value) {
      case 'success':
        return ['text-success-800 bg-success-100', ''];
      case 'danger':
        return ['text-danger-700 bg-danger-200'];
      case 'warning':
        return ['text-warning-600 bg-warning-100'];
      case 'dark':
        return ['text-grayscale-900 bg-grayscale-500'];
      default:
        return ['text-primary-800 bg-primary-200'];
    }
  } else {
    return ['text-general-400', 'bg-general-100'];
  }
});

const formattedText = computed(() => {
  if (!hasValue.value) return '-';

  switch (props.format) {
    case 'nowrap':
      return props.label;
    case 'username':
      return formatUserName(props.label);
    default:
      if (props.label.length > 12) {
        const firstWord = props.label.slice(0, 5);
        const lastWord = props.label.slice(-5);
        return `${firstWord}..${lastWord}`;
      }
      return props.label;
  }
});

/**
 * Show tooltip the full label text when:
 * - The format is not nowrap and the length is more than 12 chars
 * - The format is user name and the length is more than 8 characters
 */
const badgeTooltip = computed(() => {
  return (props.format !== 'nowrap' && props.label.length > 12) ||
    (props.format === 'username' && props.label.length > 8)
    ? props.label
    : undefined;
});

const ptDisabledBtn = shallowRef({
  root: { style: 'color: #6C688D !important' },
});

/**
 * Function to handle keyboard events for editing text.
 * @param ev - The keyboard event.
 */
const onEditText = (ev: KeyboardEvent): void => {
  const src = ev.target as HTMLSpanElement;
  // If Enter or Tab key is pressed, prevent default action and blur the element.
  if (ev.code === 'Enter' || ev.code === 'Tab') {
    ev.preventDefault();
    src.blur();
  }
};

/**
 * Function to update the label text and emit events.
 * @param text - The new text content for the label.
 * @param badgeEl - The HTML element representing the label.
 */
const updateLabel = (inputElement: HTMLElement, badgeEl: HTMLElement): void => {
  // If the new text content is different from the current label text.
  const text = inputElement.textContent;

  if (text !== props.label) {
    // Trim the text to removes extra spaces.
    const trimmed = text?.trim() ?? null;

    inputElement.textContent = trimmed;
    emit('update:label', trimmed);

    if (badgeEl && !text) {
      // Remove the badge element from the DOM if the text is empty.
      badgeEl.remove();

      emit('remove');
    }
  }
};
</script>

<template>
  <span
    ref="badge"
    v-if="hasValue"
    v-tooltip.top="{ value: badgeTooltip, autoHide: false }"
    :class="severityClasses"
    class="inline-flex items-center rounded-[50px] py-1 px-2"
  >
    <span
      ref="input"
      :class="[
        'text-nowrap whitespace-nowrap font-normal text-xs leading-4 tracking-[0.2488px]',
        { 'cursor-default': !!badgeTooltip },
        { 'caret-surface-700	': editable },
      ]"
      :contenteditable="editable"
      @blur="
        updateLabel(
          $refs['input'] as HTMLSpanElement,
          $refs['badge'] as HTMLSpanElement,
        )
      "
      @keydown="onEditText"
      spellcheck="false"
    >
      {{ formattedText }}
    </span>
    <Button
      v-if="props.removable"
      :class="[
        'remove-btn',
        {
          '!text-primary-800': !badgeSeverity || badgeSeverity === 'primary',
          '!text-success-800': badgeSeverity === 'success',
          '!text-danger-700': badgeSeverity === 'danger',
          '!text-warning-600': badgeSeverity === 'warning',
          '!text-grayscale-900': badgeSeverity === 'dark',
        },
      ]"
      :disabled="props.disabled"
      :pt="props.disabled ? ptDisabledBtn : undefined"
      :severity="badgeSeverity"
      @click="emit('remove')"
      icon="close"
      rounded
      text
    />
  </span>
  <span v-else aria-label="invalid-label">-</span>
</template>

<style scoped>
.remove-btn {
  height: 10.13px !important;
  width: 10.13px !important;
  min-width: 10.13px !important;
  padding: 0 !important;
  margin-left: 4px;
}
:deep(.remove-btn i) {
  font-size: 10.13px;
}
</style>
