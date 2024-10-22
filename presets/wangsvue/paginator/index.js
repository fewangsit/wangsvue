export default {
  root: {
    class: [
      // Flex & Alignment
      'flex items-center justify-start flex-wrap gap-0.5',

      'bg-white',
      'text-grayscale-900',
    ],
  },
  paginatorwrapper: {
    class: 'mt-[11px]',
  },
  pages: {
    class: 'flex gap-0.5',
  },
  firstpagebutton: ({ context }) => ({
    class: [
      'relative',

      // Font
      'text-2xl font-medium',

      // Flex & Alignment
      'inline-flex items-center justify-center',

      // Shape
      'border-t-2 border-transparent',

      // Size
      'w-6 h-6',

      // Color
      'text-general-300',

      // Transition
      'transition duration-200',

      // Misc
      'user-none overflow-hidden',
      { 'cursor-default pointer-events-none opacity-60': context.disabled },
    ],
  }),
  previouspagebutton: ({ context }) => ({
    class: [
      'relative',

      // Font
      'text-2xl font-medium',

      // Flex & Alignment
      'inline-flex items-center justify-center',

      // Shape
      'border-t-2 border-transparent',

      // Size
      'w-6 h-6',

      // Color
      'text-general-300',

      // Transition
      'transition duration-200',

      // Misc
      'user-none overflow-hidden',
      { 'cursor-default pointer-events-none opacity-60': context.disabled },
    ],
  }),
  nextpagebutton: ({ context }) => ({
    class: [
      'relative',

      // Font
      'text-2xl font-medium',

      // Flex & Alignment
      'inline-flex items-center justify-center',

      // Shape
      'border-t-2 border-transparent',

      // Size
      'w-6 h-6',

      // Color
      'text-general-300',

      // Transition
      'transition duration-200',

      // Misc
      'user-none overflow-hidden',
      { 'cursor-default pointer-events-none opacity-60': context.disabled },
    ],
  }),
  lastpagebutton: ({ context }) => ({
    class: [
      'relative',

      // Font
      'text-2xl font-medium',

      // Flex & Alignment
      'inline-flex items-center justify-center',

      // Shape
      'border-t-2 border-transparent',

      // Size
      'w-6 h-6',

      // Color
      'text-general-300',

      // Transition
      'transition duration-200',

      // Misc
      'user-none overflow-hidden',
      { 'cursor-default pointer-events-none opacity-60': context.disabled },
    ],
  }),
  pagebutton: ({ context }) => ({
    class: [
      'relative',

      // Font
      'text-xs font-normal',

      // Shape
      'rounded-full',

      // Size
      'w-6 h-6',

      // Color
      {
        'text-general-300 border-none hover:bg-grayscale-50': !context.active,
        'text-white bg-grayscale-900': context.active,
      },

      // State
      {
        'hover:border-surface-300':
          !context.disabled && !context.active,
        'focus-visible:outline-none focus-visible:outline-offset-0 focus-visible:ring-2 focus-visible:ring-primary-500':
          !context.disabled,
      },

      // Transition
      'transition duration-200',

      // Misc
      'user-none overflow-hidden',
      { 'cursor-default pointer-events-none opacity-60': context.disabled },
    ],
  }),
  rowperpagedropdown: {
    root: ({ props, state }) => ({
      class: [
        // Display and Position
        'inline-flex items-center justify-center',
        'relative',

        // Size
        'w-max',
        'px-3 py-1',

        // Shape
        'rounded-[50px]',

        // Color and Background
        'bg-transparent',
        'border-[0.5px] border-primary-100',

        // Transitions
        'transition-all',
        'duration-200',

        // States
        {
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600':
            !state.focused,
        },

        // Misc
        'cursor-pointer',
        'select-none',
        {
          'opacity-60': props.disabled,
          'pointer-events-none': props.disabled,
          'cursor-default': props.disabled,
        },
      ],
    }),
    input: {
      class: [
        //Font
        'text-xs',

        // Display
        // 'block',
        // 'flex-auto',
        'flex items-center',

        // Color and Background
        'bg-transparent',
        'text-general-800',

        // Sizing and Spacing
        'w-max',
        // 'py-1.5 px-3 pr-0',

        //Shape
        'rounded-none',

        // Transitions
        'transition',
        'duration-200',

        // States
        'focus-visible:outline-none focus-visible:shadow-none',

        // Misc
        // 'relative',
        'cursor-pointer',
        'overflow-hidden overflow-ellipsis',
        'whitespace-nowrap',
        'appearance-none',
      ],
    },
    trigger: {
      class: [
        //Font
        'text-xs',

        // Flexbox
        'flex items-center justify-center',
        'shrink-0',

        // Size
        'w-2',
        'h-2',
        'ml-0.5',

        // Shape
        'rounded-tr-md',
        'rounded-br-md',
      ],
    },
    dropdownicon: {
      class: 'w-2 h-2',
    },
    panel: {
      class: [
        // Position
        'absolute top-0 left-0',
        'mt-1',

        // Shape
        'border-0',
        'rounded-md',
        // 'shadow-md',

        // Color
        'bg-white',
        'text-general-800',
        'ring-1 ring-inset ring-primary-100',
      ],
    },
    wrapper: {
      class: [
        // Sizing
        'max-h-[15rem]',

        // Misc
        'overflow-auto',
      ],
    },
    list: {
      class: 'py-0.5 list-none m-0',
    },
    item: ({ context }) => ({
      class: [
        // Font
        'text-xs',
        'leading-none',
        { 'font-normal': !context.selected, 'font-bold': context.selected },

        // Position
        'relative',

        // Shape
        'border-0',
        'rounded-none',

        // Spacing
        'm-0',
        'py-2 px-4',

        // Color
        // {
        //   'text-surface-700/80':
        //     !context.focused && !context.selected,
        // },
        // {
        //   'bg-white text-general-800':
        //     context.focused && context.selected,
        // },
        // {
        //   'bg-transparent text-general-800':
        //     !context.focused && context.selected,
        // },

        //States
        'hover:bg-primary-50',

        // Misc
        'cursor-pointer',
        'overflow-hidden',
        'whitespace-nowrap',
      ],
    }),
  },
  jumptopageinput: {
    root: {
      class: 'inline-flex mx-2',
    },
    input: {
      root: {
        class: [
          'relative',

          //Font
          'leading-6',
          'text-xs',
          'text-center',

          // Display
          'block',
          'flex-auto',

          // Color and Background
          'bg-transparent',
          'border-primary-100 border-[0.5px]',
          'text-general-800',

          // Sizing and Spacing
          'max-w-[3rem] w-fit',
          'px-3 py-1',

          //Shape
          'rounded-[50px] h-6',

          // Transitions
          'transition',
          'duration-200',

          // States
          'hover:ring-general-200',
          'focus-visible:outline-none focus-visible:shadow-none',
          // 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-body',

          // Misc
          'cursor-pointer',
          'overflow-hidden overflow-ellipsis',
          'whitespace-nowrap',
          'appearance-none',
        ],
      },
    },
  },
  jumptopagedropdown: {
    root: ({ props, state }) => ({
      class: [
        // Display and Position
        'inline-flex',
        'relative',

        // Shape
        'h-8',
        'rounded-md',

        // Spacing
        'mx-2',

        // Color and Background
        'bg-transparent',

        // Transitions
        'transition-all',
        'duration-200',

        // States
        {
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600':
            !state.focused,
        },

        // Misc
        'cursor-pointer',
        'select-none',
        {
          'opacity-60': props.disabled,
          'pointer-events-none': props.disabled,
          'cursor-default': props.disabled,
        },
      ],
    }),
    input: {
      class: [
        //Font
        'font-sans',
        'leading-6',
        'text-xs',

        // Display
        'block',
        'flex-auto',
        'flex items-center',

        // Color and Background
        'bg-transparent',
        'border-0',
        'text-surface-800/80',

        // Sizing and Spacing
        'w-[1%]',
        'py-1.5 px-3 pr-0',

        //Shape
        'rounded-none',

        // Transitions
        'transition',
        'duration-200',

        // States
        'focus-visible:outline-none focus-visible:shadow-none',

        // Misc
        'relative',
        'cursor-pointer',
        'overflow-hidden overflow-ellipsis',
        'whitespace-nowrap',
        'appearance-none',
      ],
    },
    trigger: {
      class: [
        //Font
        'text-xs',

        // Flexbox
        'flex items-center justify-center',
        'shrink-0',

        // Color and Background
        'bg-transparent',
        'text-surface-500',

        // Size
        'w-12',
        'h-8',

        // Shape
        'rounded-tr-md',
        'rounded-br-md',
      ],
    },
    panel: {
      class: [
        // Position
        'absolute top-0 left-0',
        'mt-1',

        // Shape
        'border-0',
        'rounded-md',
        'shadow-md',

        // Color
        'bg-surface-0',
        'text-surface-800/80',
        'ring-1 ring-inset ring-surface-300',
      ],
    },
    wrapper: {
      class: [
        // Sizing
        'max-h-[15rem]',

        // Misc
        'overflow-auto',
      ],
    },
    list: {
      class: 'py-1 list-none m-0',
    },
    item: ({ context }) => ({
      class: [
        // Font
        'text-xs',
        'leading-none',
        { 'font-normal': !context.selected, 'font-bold': context.selected },

        // Position
        'relative',

        // Shape
        'border-0',
        'rounded-none',

        // Spacing
        'm-0',
        'py-2 px-4',

        // Color
        {
          'text-surface-700/80':
            !context.focused && !context.selected,
        },
        {
          'bg-primary-500 text-white':
            context.focused && context.selected,
        },
        {
          'bg-transparent text-surface-700/80':
            !context.focused && context.selected,
        },

        //States
        'hover:bg-primary-500 hover:text-white',

        // Misc
        'cursor-pointer',
        'overflow-hidden',
        'whitespace-nowrap',
      ],
    }),
  },
  current: {
    class: ['text-xs font-normal leading-6 px-3'],
  },
};
