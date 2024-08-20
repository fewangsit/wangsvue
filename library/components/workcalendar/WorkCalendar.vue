<script setup lang="ts">
import { ref, computed, shallowRef, onMounted } from 'vue';
import { WorkCalendarProps } from './WorkCalendar.vue.d';
import { isEmptyObject } from 'lib/utils';
import { useField } from 'vee-validate';
import Icon from '../icon/Icon.vue';
import CalendarServices, { Holiday } from 'lib/services/calendar.service';
import Skeleton from 'primevue/skeleton';

const months = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

const dayNames = [
  'Minggu',
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  'Jumat',
  'Sabtu',
];

interface WCDate {
  date: number;
  /**
   * Formatted "yyyy-mm-dd" (ISO 8601 format)
   */
  dateString: string;
  isOtherMonth: boolean;
  isToday: boolean;
  isWorkDay: boolean;
  isDefaultWorkDay: boolean;
  isNationalHoliday: boolean;
  state: 'workday' | 'holiday' | 'weekend';
  eventName?: string;
}

const props = withDefaults(defineProps<WorkCalendarProps>(), {
  defaultWorkDays: () => [1, 2, 3, 4, 5],
  state: 'view',
});

onMounted(async () => {
  await initWorkDays();
});

const currentDate = ref(new Date());
const currentMonth = ref(currentDate.value.getMonth());
const currentYear = ref(currentDate.value.getFullYear());

const workDaysInMonth = ref<string[]>([]);
const calendarWeeks = ref<WCDate[][]>([]);

const holidays = ref<Holiday[]>([]);
const isLoading = shallowRef(false);

const workDaysField = useField<WorkCalendarProps['workDays']>(
  'workDays',
  undefined,
  {
    initialValue: {
      [currentYear.value - 1]: [''],
      [currentYear.value]: [''],
      [currentYear.value + 1]: [''],
    },
  },
);

const disablePrevButton = computed(() => {
  const today = new Date();

  return (
    currentMonth.value === 0 && currentYear.value === today.getFullYear() - 1
  );
});

const disableNextButton = computed(() => {
  const today = new Date();

  return (
    currentMonth.value === 11 && currentYear.value === today.getFullYear() + 1
  );
});

const datesInMonth = computed(() => {
  return calendarWeeks.value.flatMap((week) => week);
});

const getNationalHolidays = async (): Promise<void> => {
  try {
    isLoading.value = true;
    const response = await CalendarServices.getHolidays(currentYear.value);

    holidays.value = response;
  } catch (error) {
    console.error('Error fetching holidays:', error);
  } finally {
    isLoading.value = false;
  }
};

const getWorkDaysInYear = (year: number): string[] => {
  const workDays: string[] = props.workDays?.[year] ?? [];

  if (isEmptyObject(props.workDays)) {
    for (let month = 0; month < 12; month++) {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const dateObj = new Date(year, month, day);
        const dayOfWeek = dateObj.getDay();

        if (
          props.defaultWorkDays.includes(dayOfWeek) &&
          !holidays.value.some((holiday) => {
            const holidayDate = new Date(holiday.date);
            return (
              holidayDate.getFullYear() === year &&
              holidayDate.getMonth() === month &&
              holidayDate.getDate() === day
            );
          })
        ) {
          // Format the date as "yyyy-mm-dd" (ISO 8601 format)
          const formattedDate = formatWorkDateString(year, month, day);
          workDays.push(formattedDate);
        }
      }
    }
  }

  return workDays;
};

const getCalendarWeeks = (): WCDate[][] => {
  const firstDayOfMonth = new Date(currentYear.value, currentMonth.value, 1);
  const lastDayOfMonth = new Date(currentYear.value, currentMonth.value + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const lastDayOfWeek = lastDayOfMonth.getDay();

  const weeks: WCDate[][] = [];
  let currentDay = 1 - firstDayOfWeek;

  while (currentDay <= daysInMonth) {
    const week: WCDate[] = [];

    for (let i = 0; i < 7; i++) {
      const todaysEvent = holidays.value.find((holiday) => {
        const holidayDate = new Date(holiday.date);
        return (
          holidayDate.getFullYear() === currentYear.value &&
          holidayDate.getMonth() === currentMonth.value &&
          holidayDate.getDate() === currentDay
        );
      });

      const dateString = formatWorkDateString(
        currentYear.value,
        currentMonth.value,
        currentDay,
      );
      const isWorkDay = workDaysInMonth.value.includes(dateString);
      const isNationalHoliday = todaysEvent != undefined;

      week.push({
        date: currentDay,
        dateString,
        isOtherMonth: currentDay < 1 || currentDay > daysInMonth,
        isToday:
          currentDay === currentDate.value.getDate() &&
          currentMonth.value === new Date().getMonth() &&
          currentYear.value === new Date().getFullYear(),
        isWorkDay,
        isDefaultWorkDay: props.defaultWorkDays.includes(i),
        eventName: todaysEvent?.eventName,
        isNationalHoliday,
        state: ((): WCDate['state'] => {
          switch (true) {
            case isNationalHoliday && !isWorkDay:
              return 'holiday';
            case isWorkDay:
              return 'workday';
            default:
              return 'weekend';
          }
        })(),
      });

      currentDay++;
    }

    weeks.push(week);
  }

  // Fill the last week with next month's days if needed
  if (lastDayOfWeek !== 6) {
    const lastWeek = weeks[weeks.length - 1];
    let nextMonthDay = 1;
    for (let i = lastDayOfWeek + 1; i < 7; i++) {
      lastWeek[i].date = nextMonthDay++;
      lastWeek[i].isOtherMonth = true;
    }
  }

  return weeks;
};

const getWorkDaysInMonth = (): string[] => {
  const workDays =
    workDaysField.value.value?.[currentYear.value].filter((day) => {
      const dateObj = new Date(day);
      return dateObj.getMonth() === currentMonth.value;
    }) ?? [];

  // Sort the work days using the Date object for comparison
  workDays.sort((a, b) => {
    return +new Date(a) - +new Date(b);
  });

  return workDays;
};

const toggleWorkDayState = (day: WCDate): void => {
  if (props.state === 'edit') {
    switch (day.state) {
      case 'workday':
        removeWorkDay(day.dateString);
        break;
      case 'holiday':
      case 'weekend':
        addWorkDay(day);
        break;
    }
  }
};

const removeWorkDay = (day: string): void => {
  if (workDaysField.value.value) {
    workDaysField.value.value[currentYear.value] = workDaysField.value.value?.[
      currentYear.value
    ].filter((d) => d !== day);
  }

  updateCalendar();
};

const addWorkDay = (day: WCDate): void => {
  const dateString = formatWorkDateString(
    currentYear.value,
    currentMonth.value,
    day.date,
  );

  if (!workDaysField.value.value?.[currentYear.value].includes(dateString)) {
    workDaysField.value.value?.[currentYear.value].push(dateString);
  }

  updateCalendar();
};

const formatWorkDateString = (
  year: number,
  month: number,
  day: number,
): string => {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

const prevMonth = (): void => {
  if (currentMonth.value === 0) {
    currentYear.value--;
    currentMonth.value = 11;
  } else {
    currentMonth.value--;
  }

  updateDate();
};

const nextMonth = (): void => {
  if (currentMonth.value === 11) {
    currentYear.value++;
    currentMonth.value = 0;
  } else {
    currentMonth.value++;
  }

  updateDate();
};

const updateDate = (): void => {
  currentDate.value = new Date(
    currentYear.value,
    currentMonth.value,
    new Date().getDate(),
  );

  currentYear.value = currentDate.value.getFullYear(); // Ensure year is updated if needed
  currentMonth.value = currentDate.value.getMonth(); // Ensure month is updated if needed

  updateCalendar();
};

const updateCalendar = (): void => {
  workDaysInMonth.value = getWorkDaysInMonth();
  calendarWeeks.value = getCalendarWeeks();
};

const initWorkDays = async (): Promise<void> => {
  await getNationalHolidays();
  workDaysField.value.value = {
    [currentYear.value - 1]: getWorkDaysInYear(currentYear.value - 1),
    [currentYear.value]: getWorkDaysInYear(currentYear.value),
    [currentYear.value + 1]: getWorkDaysInYear(currentYear.value + 1),
  };

  updateCalendar();
};
</script>

<template>
  <div class="flex gap-3">
    <div
      class="w-[428px] text-grayscale-900 flex flex-col gap-1 p-6"
      data-pc-section="container"
    >
      <div
        class="h-6 w-full justify-between items-start gap-1 inline-flex"
        data-section-name="navigation"
      >
        <Icon
          :class="[
            'text-2xl text-general-900 rotate-180',
            { '!text-general-300 pointer-events-none': disablePrevButton },
          ]"
          @click="prevMonth"
          icon="arrow-right"
        />

        <div class="flex gap-1">
          <span>{{ months[currentMonth].slice(0, 3) }}</span>
          <span>{{ currentYear }}</span>
        </div>

        <Icon
          :class="[
            'text-2xl text-general-900',
            { '!text-general-300 pointer-events-none': disableNextButton },
          ]"
          @click="nextMonth"
          icon="arrow-right"
        />
      </div>
      <div class="flex flex-col gap-1" data-pc-section="date">
        <div data-pc-section="tableheader">
          <div class="grid grid-cols-7 gap-2" data-section-name="weekdays">
            <span
              :key="day"
              v-for="day in dayNames"
              abbr="day"
              class="px-2 py-[5.4px] text-center"
              data-section-name="weekday"
            >
              {{ day.slice(0, 3) }}
            </span>
          </div>
        </div>
        <div
          class="grid grid-cols-7 gap-y-1 gap-x-2"
          data-pc-section="tablebody"
        >
          <span
            :key="dayIndex"
            v-for="(day, dayIndex) in datesInMonth"
            :aria-label="day.date.toString()"
            :data-wv-national-holiday="day.isNationalHoliday"
            :data-wv-other-month="day.isOtherMonth"
            :data-wv-today="day.isToday"
            :data-wv-workday="day.isWorkDay"
            @click="toggleWorkDayState(day)"
            class="p-0"
            data-wv-section="day"
          >
            <Skeleton
              v-if="isLoading && !day.isOtherMonth"
              class="!w-12 !h-12"
              shape="circle"
            />
            <span
              v-else-if="!isLoading"
              v-tooltip.top="{
                value: day.eventName,
                pt: {
                  root: {
                    style: 'max-width: 200px',
                  },
                  text: {
                    style: 'text-align: center;',
                  },
                },
              }"
              :aria-disabled="day.isOtherMonth"
              :class="{
                'flex items-center justify-center w-12 h-12 focus:outline-none focus-visible:outline-none cursor-pointer': true,
                'hidden': day.isOtherMonth,
                'text-white !rounded-full focus:outline-none focus-visible:outline-none cursor-pointer':
                  day.isWorkDay || day.isNationalHoliday,
                'bg-danger-500 hover:bg-danger-500/90': day.state === 'holiday',
                'bg-primary-1000 hover:bg-primary-1000/90':
                  day.state === 'workday',
              }"
              :data-p-disabled="day.isOtherMonth"
              aria-selected="false"
              data-p-highlight="false"
              data-pc-group-section="tablebodycelllabel"
              data-pc-section="daylabel"
              draggable="false"
            >
              <template v-if="!day.isOtherMonth">{{ day.date }}</template>
            </span>
          </span>
        </div>
      </div>
    </div>

    <div
      class="w-[300px] h-[366.52px] p-6 bg-white rounded-lg flex-col justify-start items-start gap-3 inline-flex"
    >
      <div class="self-stretch justify-between items-start inline-flex">
        <div class="text-xs font-semibold leading-none">
          Jumlah Hari Kerja {{ currentYear }}
        </div>
        <div class="text-xs font-semibold leading-none">
          <Skeleton v-if="isLoading" class="!w-12" />
          <template v-else>
            {{ workDaysField.value.value?.[currentYear]?.length }}
            Hari
          </template>
        </div>
      </div>
      <div class="self-stretch justify-between items-start inline-flex">
        <div class="text-xs font-semibold leading-none">
          {{ months[currentMonth] }} {{ currentYear }}
        </div>
        <div class="text-xs font-semibold leading-none">
          <Skeleton v-if="isLoading" class="!w-12" />
          <template v-else>{{ workDaysInMonth.length }} Hari</template>
        </div>
      </div>
      <ul
        class="self-stretch h-64 flex-col justify-start items-start gap-2 flex overflow-auto"
        style="scrollbar-width: none"
      >
        <template v-if="isLoading">
          <Skeleton
            :key="index"
            v-for="(_, index) in Array.from({ length: 11 })"
            :style="`width: ${Math.floor(Math.random() * 90) + 100}px`"
          />
        </template>
        <li
          :key="day"
          v-else
          v-for="day in workDaysInMonth"
          class="inline-flex w-full justify-between"
        >
          {{ day.split('-')[2] }} {{ months[currentMonth] }} {{ currentYear }}
          <Icon
            v-if="state === 'edit'"
            @click="removeWorkDay(day)"
            class="text-base cursor-pointer hover:scale-110 hover:p-1"
            icon="close"
            severity="danger"
          />
        </li>
      </ul>
    </div>
  </div>
</template>
