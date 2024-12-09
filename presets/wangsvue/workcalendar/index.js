export default {
  next: ({ context }) => ({
    class: [
      'text-2xl text-general-900',
      { '!text-general-300 pointer-events-none': context.disableNextButton },
    ],
  }),
  prev: ({ context }) => ({
    class: [
      'text-2xl text-general-900 rotate-180',
      { '!text-general-300 pointer-events-none': context.disablePrevButton },
    ],
  }),
  daylabel: ({ context }) => ({
    class: [
      'flex items-center justify-center w-12 h-12 focus:outline-none focus-visible:outline-none cursor-pointer',
      {
        'hidden': context.day.isOtherMonth,
        'text-white !rounded-full focus:outline-none focus-visible:outline-none cursor-pointer':
          context.day.isWorkDay || context.day.isNationalHoliday,
        'bg-danger-500 hover:bg-danger-500/90': context.day.state === 'holiday',
        'bg-primary-1000 hover:bg-primary-1000/90':
          context.day.state === 'workday',
      },
    ],
  }),
};
