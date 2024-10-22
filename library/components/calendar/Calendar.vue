<script setup lang="ts">
import {
  onMounted,
  reactive,
  ref,
  watch,
  nextTick,
  computed,
  shallowRef,
} from 'vue';
import { useField } from 'vee-validate';
import { CalendarProps, CalendarEmits } from './Calendar.vue.d';
import { FieldValidation } from '../form/Form.vue.d';

import Calendar, { CalendarState } from 'primevue/calendar';
import CalendarPresets from 'lib/preset/calendar';
import FieldWrapper from '../fieldwrapper/FieldWrapper.vue';
import Icon from '../icon/Icon.vue';
import InputGroup from '../inputgroup/InputGroup.vue';
import ValidatorMessage from '../validatormessage/ValidatorMessage.vue';
import Button from '../button/Button.vue';

const props = withDefaults(defineProps<CalendarProps>(), {
  view: 'date',
  mode: 'single',
  showYear: true,
  showOptionalText: true,
});

const emit = defineEmits<CalendarEmits>();

onMounted(() => {
  setValidator();
  if (props.dateValue && props.useValidator) {
    date.value = parseDateFromProps();
    field.value = props.dateValue;
  }
});

const date = ref<Date | Date[]>();
const changesSaved = shallowRef<boolean>(true);
const previousDate = ref<Date | Date[]>();
const field = reactive<FieldValidation<typeof props.modelValue>>({
  value: undefined,
});

const calendar = ref<CalendarState>();

const invalidInput = computed(() => props.invalid || !!field.errorMessage);
const dateFormat = 'dd/mm/yy';

const getGMTTime = (dateString: Date | string): number => {
  return new Date(new Date(dateString).toUTCString()).getTime();
};

const getLocalTime = (timeStamp?: number): Date | undefined => {
  if (timeStamp) {
    /*
     * There's a trouble while dateformat is on 'en-gb', which have different positions for day and month
     * so this line was commented
     *
     * return new Date(formatDate(new Date(timeStamp), props.showTime));
     */
    return new Date(timeStamp);
  }
};

/**
 * This function will parse the date number/timestamp into date string that can be displayed on date input.
 */
const parseDateFromProps = (): Date | Date[] | undefined => {
  if (!Array.isArray(props.dateValue)) return getLocalTime(props.dateValue);

  return props.dateValue.map(
    (timeStamp) => getLocalTime(timeStamp) ?? new Date(),
  );
};

const parseDate = (dateToParse: Date | Date[]): number | number[] => {
  if (!Array.isArray(dateToParse)) return getGMTTime(dateToParse);

  return [
    getGMTTime(dateToParse[0]),
    getGMTTime(dateToParse[1] ?? dateToParse[0]),
  ];
};

const setClass = async (): Promise<void> => {
  await nextTick();

  const highlights = document.querySelectorAll(
    '.datepicker-panel table [data-p-highlight="true"]',
  );

  /**
   * The special class for the first and last seleted days.
   */
  const firstAndLast = '!bg-primary-1000 hover:!bg-primary-1000/90';

  const first = 'rounded-tl-full rounded-bl-full';
  const last = 'rounded-tr-full rounded-br-full';

  highlights[0]?.classList.add(...firstAndLast.split(' '), ...first.split(' '));
  highlights[highlights.length - 1]?.classList.add(
    ...firstAndLast.split(' '),
    ...last.split(' '),
  );
};

const onShowOverlay = (): void => {
  previousDate.value = date.value;
  setTimeout(formatDateText, 0);
  setClass();
};

const setValidator = (): void => {
  if (props.useValidator) {
    Object.assign(
      field,
      useField(props.fieldName ?? 'date', (value: string) => {
        return setValidatorMessage(value);
      }),
    );
  }
};

const onUpdateModelValue = (ev?: Date | Date[]): void => {
  date.value = ev;
  changesSaved.value = false;

  if (!props.showButtons && !props.showTime) applyChanges();
  setClass();
};

const applyChanges = (): void => {
  // eslint-disable-next-line eqeqeq
  const parsedDate = date.value != null ? parseDate(date.value) : undefined;
  emit('update:modelValue', parsedDate);
  field.value = parsedDate;
  changesSaved.value = true;
  if (props.showButtons || props.showTime) closePanel();
};

const onHideOverlay = (): void => {
  if (!changesSaved.value) {
    // Revert changes when the overlay is closed not by apply button
    revertChanges();
  }
};

const revertChanges = (): void => {
  date.value = previousDate.value;
  closePanel();
};

const closePanel = (): void => {
  if (calendar.value) calendar.value.overlayVisible = false;
};

const formatDateText = (): void => {
  nextTick(() => {
    const calendarElement = calendar.value?.[
      '$el' as keyof CalendarState
    ] as unknown as HTMLElement;

    if (calendarElement && date.value) {
      const inputElement = calendarElement.querySelector('input');

      if (inputElement)
        inputElement.value = inputElement.value
          .replaceAll('am', 'AM')
          .replaceAll('pm', 'PM');
    }
  });
};

const setValidatorMessage = async (
  value: string,
): Promise<boolean | string> => {
  await nextTick();

  if (!value && props.mandatory) {
    return props.customValidation?.empty ?? 'Tanggal tidak boleh kosong';
  } else if (props.validatorMessage && props.invalid) {
    return props.validatorMessage;
  }

  return true;
};

const toggleDatePickerPanel = (): void => {
  const currentState = calendar.value?.overlayVisible;
  if (calendar.value) calendar.value.overlayVisible = !currentState;
};

watch(
  () => props.dateValue,
  () => {
    date.value = parseDateFromProps();
    field.value = props.dateValue;
  },
  { once: true },
);

watch(date, formatDateText);
</script>

<template>
  <FieldWrapper v-bind="$props">
    <InputGroup :disabled="disabled" :invalid="invalidInput">
      <Calendar
        ref="calendar"
        :date-format="dateFormat"
        :disabled="disabled"
        :hide-on-date-time-select="false"
        :hide-on-range-selection="!showButtons && !showTime"
        :invalid="invalidInput"
        :manual-input="false"
        :max-date="maxDate"
        :min-date="minDate"
        :model-value="date as any"
        :placeholder="placeholder ?? 'Pilih tanggal'"
        :pt="{
          yearpicker: [
            ...CalendarPresets.yearpicker.class,
            {
              '[&_[data-year-in-future=true]]:text-general-200 [&_[data-year-in-future=true]]:pointer-events-none':
                maxYear === 'current',
            },
          ],
          monthPicker: [
            ...CalendarPresets.yearpicker.class,
            {
              '[&_[data-month-in-future=true]]:text-general-200 [&_[data-month-in-future=true]]:pointer-events-none':
                maxMonth === 'current',
            },
          ],
        }"
        :selection-mode="mode"
        :show-time="props.showTime"
        :view="view"
        @hide="onHideOverlay"
        @show="onShowOverlay"
        @update:model-value="
          onUpdateModelValue($event as unknown as Date | Date[])
        "
        icon-display="input"
        show-icon
        show-other-months
      >
        <template #inputicon>
          <Icon
            :class="CalendarPresets.inputicon.class"
            @click="toggleDatePickerPanel"
            class="w-4 h-4 shrink-0"
            data-pc-section="inputicon"
            icon="calendar"
          />
        </template>

        <template #footer>
          <div
            v-if="showButtons || showTime"
            v-show="calendar?.currentView === 'date'"
            class="w-full flex items-center justify-end gap-1"
            data-ts-section="calendarfooter"
          >
            <Button
              @click="revertChanges"
              label="Cancel"
              severity="dark"
              text
            />
            <Button :disabled="!date" @click="applyChanges" label="Apply" />
          </div>
        </template>

        <template #incrementicon>
          <Icon icon="arrow-up-s" />
        </template>

        <template #decrementicon>
          <Icon icon="arrow-down" />
        </template>
      </Calendar>
    </InputGroup>
    <ValidatorMessage
      v-show="field.errorMessage"
      :message="field.errorMessage"
    />
  </FieldWrapper>
</template>
