export default {
  buttontrigger: {
    root: ({ context }) => ({
      'class': [
        { 'w-max': !context.showSearchInput },
        'focus-within:ring-2 focus-within:ring-primary-400 focus-within:outline-none rounded-sm',
      ],
      'data-wv-section': 'buttontrigger',
    }),
    icon: {
      class: 'w-6 h-6 text-grayscale-900 shrink-0',
    },
  },

  collapsebutton: {
    root: ({ context }) => ({
      'class': [
        { 'w-max': !context.showSearchInput },
        'focus-within:ring-2 focus-within:ring-primary-400 focus-within:outline-none rounded-sm',
      ],
      'data-wv-section': 'collapsebutton',
    }),
    icon: {
      class: 'w-6 h-6 text-grayscale-900 shrink-0',
    },
  },

  resetbutton: {
    root: ({ query }) => ({
      'class': [
        { invisible: !query },
        'focus-within:ring-2 focus-within:ring-primary-400 focus-within:outline-none rounded-sm',
      ],
      'data-wv-section': 'resetbutton',
    }),
    icon: { class: ['text-2xl shrink-0'] },
  },

  hiddensubmit: { class: 'hidden' },

  form: ({ context }) => ({
    'class': [
      { show: context.showSearchInput },
      'grid grid-cols-[max-content,auto,max-content] items-center gap-0.5 max-w-[224px] h-6',
      'border-b border-primary-100',
    ],
    'data-wv-section': 'form',
  }),

  inputtext: {
    class: '!h-max',
  },
};
