<script setup lang="ts">
import { computed, inject, shallowRef } from 'vue';
import { BadgeProps, BadgeEmits } from 'lib/components/badge/Badge.vue.d';
import { formatUserName } from 'lib/utils';
import { StatusSeverity, WangsitStatus } from 'lib/types/wangsStatus.type';

import Button from 'lib/components/button/Button.vue';
import getStatusSeverity from 'lib/utils/statusSeverity.util';

const props = withDefaults(defineProps<BadgeProps>(), {});
const emit = defineEmits<BadgeEmits>();

const Preset = inject<Record<string, any>>('preset', {}).badge;

const hasValue = computed(() => {
  const type = typeof props.label;
  return (
    type === 'number' ||
    (type === 'string' && props.label && props.label !== '-')
  );
});

const badgeSeverity = computed<StatusSeverity>(() => {
  return props.severity ?? getStatusSeverity(props.label as WangsitStatus);
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
    v-bind="
      Preset?.root({
        props: { severity: badgeSeverity, disabled },
      })
    "
  >
    <span
      ref="input"
      v-bind="
        Preset?.input({
          props: { badgeTooltip, editable },
        })
      "
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
      v-bind="
        Preset?.button({
          props: { badgeSeverity },
        })
      "
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
