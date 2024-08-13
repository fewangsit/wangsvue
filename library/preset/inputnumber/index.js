export default {
  root: ({ props, parent }) => ({
    class: [
      // Layout
      'flex items-center self-stretch shrink-0 grow',

      //Size
      'h-full',

      // Spacing
      'py-1 px-3',

      // Border
      'rounded',

      // Text Color
      'text',

      'appearance-none',
    ],
  }),
  input: {
    root: ({ parent }) => ({
      class: [
        'border-0 h-full w-full outline-none',
        'bg-inherit',
        'placeholder:text-general-200',
      ],
    }),
  },

  buttongroup: {
    class: ['flex'],
  },

  incrementbutton: {
    root: ({ parent }) => ({
      class: [],
    }),
    label: {
      class: 'h-0 w-0',
    },
  },
  decrementbutton: {
    root: ({ parent }) => ({
      class: [],
    }),
    label: {
      class: 'h-0 w-0',
    },
  },
};
