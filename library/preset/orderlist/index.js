export default {
  root: {
    class: [
      // Flexbox
      'flex',
    ],
  },
  controls: {
    class: [
      // Flexbox & Alignment
      'flex flex-col justify-center gap-2',

      // Spacing
      'p-3',
    ],
  },
  moveupbutton: {
    root: ({ context }) => ({
      class: [
        // Flexbox & Alignment
        'relative inline-flex items-center justify-center',

        // Shape
        'rounded-md',

        // Color
        'text-white',
        'bg-primary-500',
        'border border-primary-500',

        // Spacing & Size
        'text-sm',
        'w-8',
        'm-0',
        'px-2.5 py-1.5 min-w-[2rem]',
        'shadow-sm',

        // Transitions
        'transition duration-200 ease-in-out',

        // State
        'hover:bg-primary-600 hover:border-primary-600',
        'focus:outline-none focus:outline-offset-0 focus:ring-2',
        'focus:ring-primary-500',
        { 'cursor-default pointer-events-none opacity-60': context.disabled },

        // Interactivity
        'cursor-pointer user-select-none',
      ],
    }),
    label: {
      class: [
        // Flexbox
        'flex-initial',

        // Size
        'w-0',
      ],
    },
  },
  movedownbutton: {
    root: ({ context }) => ({
      class: [
        // Flexbox & Alignment
        'relative inline-flex items-center justify-center',

        // Shape
        'rounded-md',

        // Color
        'text-white',
        'bg-primary-500',
        'border border-primary-500',

        // Spacing & Size
        'text-sm',
        'w-8',
        'm-0',
        'px-2.5 py-1.5 min-w-[2rem]',
        'shadow-sm',

        // Transitions
        'transition duration-200 ease-in-out',

        // State
        'hover:bg-primary-600 hover:border-primary-600',
        'focus:outline-none focus:outline-offset-0 focus:ring-2',
        'focus:ring-primary-500',
        { 'cursor-default pointer-events-none opacity-60': context.disabled },

        // Interactivity
        'cursor-pointer user-select-none',
      ],
    }),
    label: {
      class: [
        // Flexbox
        'flex-initial',

        // Size
        'w-0',
      ],
    },
  },
  movetopbutton: {
    root: ({ context }) => ({
      class: [
        // Flexbox & Alignment
        'relative inline-flex items-center justify-center',

        // Shape
        'rounded-md',

        // Color
        'text-white',
        'bg-primary-500',
        'border border-primary-500',

        // Spacing & Size
        'text-sm',
        'w-8',
        'm-0',
        'px-2.5 py-1.5 min-w-[2rem]',
        'shadow-sm',

        // Transitions
        'transition duration-200 ease-in-out',

        // State
        'hover:bg-primary-600 hover:border-primary-600',
        'focus:outline-none focus:outline-offset-0 focus:ring-2',
        'focus:ring-primary-500',
        { 'cursor-default pointer-events-none opacity-60': context.disabled },

        // Interactivity
        'cursor-pointer user-select-none',
      ],
    }),
    label: {
      class: [
        // Flexbox
        'flex-initial',

        // Size
        'w-0',
      ],
    },
  },
  movebottombutton: {
    root: ({ context }) => ({
      class: [
        // Flexbox & Alignment
        'relative inline-flex items-center justify-center',

        // Shape
        'rounded-md',

        // Color
        'text-white',
        'bg-primary-500',
        'border border-primary-500',

        // Spacing & Size
        'text-sm',
        'w-8',
        'm-0',
        'px-2.5 py-1.5 min-w-[2rem]',
        'shadow-sm',

        // Transitions
        'transition duration-200 ease-in-out',

        // State
        'hover:bg-primary-600 hover:border-primary-600',
        'focus:outline-none focus:outline-offset-0 focus:ring-2',
        'focus:ring-primary-500',
        { 'cursor-default pointer-events-none opacity-60': context.disabled },

        // Interactivity
        'cursor-pointer user-select-none',
      ],
    }),
    label: {
      class: [
        // Flexbox
        'flex-initial',

        // Size
        'w-0',
      ],
    },
  },
  container: {
    class: ['flex-auto'],
  },
  header: {
    class: [
      'font-semibold',

      // Shape
      'border-b rounded-t-md',

      // Spacing
      'py-3.5 px-3',

      // Color
      'text-surface-800/80',
      'bg-surface-0',
      'border-surface-200 border-b',
    ],
  },
  list: {
    class: [
      // Spacing
      'list-none m-0 p-0',

      // Size
      'min-h-[12rem] max-h-[24rem]',

      // Shape
      'rounded-b-md border-0',

      // Color
      'text-surface-600/80',
      'bg-surface-0',
      'border border-surface-200',

      // Spacing
      'py-3 px-0',

      // Focus & Outline
      'outline-none',

      // Misc
      'overflow-auto',
    ],
  },
  item: ({ context }) => ({
    class: [
      // Position
      'relative',

      // Spacing
      'py-3.5 px-3 m-0',

      // Shape
      'border-b last:border-b-0',

      // Transition
      'transition duration-200',

      // Color
      'text-surface-700/80',
      'border-surface-200',
      {
        'bg-surface-100':
          context.active && !context.focused,
      },
      {
        'bg-surface-200':
          context.active && context.focused,
      },
      {
        'bg-surface-50/70':
          !context.active && context.focused,
      },

      // State
      'hover:bg-surface-100',

      // Misc
      'cursor-pointer overflow-hidden',
    ],
  }),
};
