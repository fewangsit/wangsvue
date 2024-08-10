export default {
  inputgroup: {
    class: ['grid grid-cols-[1fr,max-content] !items-center gap-1 px-3 py-1'],
  },

  inputtext: {
    class: ['!p-0'],
  },

  inputtrigger: {
    class: ['w-4 h-4 shrink-0 !text-general-500'],
  },

  panel: {
    class: ['border-none !mt-0 !shadow-panel'],
  },

  panelcontent: {
    class: ['grid grid-cols-7 grid-rows-[repeat(5,max-content)] p-6'],
  },

  date: {
    class: [
      'text-body-medium text-general-800',
      'bg-white hover:bg-primary-100',
      'rounded-[20px]',
      // In range selection
      '[&[data-in-range="true"]]:bg-primary-200',
      '[&[data-in-range="true"]]:text-general-800',
      '[&[data-in-range="true"]]:rounded-[0]',

      // Selected State
      '[&[aria-selected="true"]]:bg-primary-500',
      '[&[aria-selected="true"]]:text-white',

      'text-center p-2 cursor-pointer',
    ],
  },
};
