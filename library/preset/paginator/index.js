export default {
  root: {
    class: [
      // Flex & Alignment
      'flex items-center justify-start flex-wrap',

      // Spacing
      // 'px-4',

      // Shape
      // 'border-t',

      // Color
      'bg-white dark:bg-grayscale-900',
      'text-placeholder dark:text-grayscale-500',
      // 'border-surface-200 dark:border-surface-700',
    ],
  },
  paginatorwrapper: {
    class: 'mt-[11px]',
  },
  firstpagebutton: ({ context }) => ({
    class: [
      'relative',

      // Font
      'text-[11px] font-medium',

      // Flex & Alignment
      'inline-flex items-center justify-center',

      // Shape
      'border-t-2 border-transparent',

      // Size
      'w-6 h-6',

      // Color
      'text-placeholder dark:text-grayscale-500',

      // State
      // {
      //   'hover:border-surface-300 dark:hover:border-surface-200/30':
      //     !context.disabled,
      //   'focus-visible:outline-none focus-visible:outline-offset-0 focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400':
      //     !context.disabled,
      // },

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
      'text-[11px] font-medium',

      // Flex & Alignment
      'inline-flex items-center justify-center',

      // Shape
      'border-t-2 border-transparent',

      // Size
      'w-6 h-6',

      // Color
      'text-placeholder dark:text-grayscale-500',

      // State
      // {
      //   'hover:border-surface-300 dark:hover:border-surface-200/30':
      //     !context.disabled,
      //   'focus-visible:outline-none focus-visible:outline-offset-0 focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400':
      //     !context.disabled,
      // },

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
      'text-[11px] font-medium',

      // Flex & Alignment
      'inline-flex items-center justify-center',

      // Shape
      'border-t-2 border-transparent',

      // Size
      'w-6 h-6',

      // Color
      'text-placeholder dark:text-grayscale-500',

      // State
      // {
      //   'hover:border-surface-300 dark:hover:border-surface-200/30':
      //     !context.disabled,
      //   'focus-visible:outline-none focus-visible:outline-offset-0 focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400':
      //     !context.disabled,
      // },

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
      'text-[11px] font-medium',

      // Flex & Alignment
      'inline-flex items-center justify-center',

      // Shape
      'border-t-2 border-transparent',

      // Size
      'w-6 h-6',

      // Color
      'text-placeholder dark:text-grayscale-500',

      // State
      // {
      //   'hover:border-surface-300 dark:hover:border-surface-200/30':
      //     !context.disabled,
      //   'focus-visible:outline-none focus-visible:outline-offset-0 focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400':
      //     !context.disabled,
      // },

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
      'text-[11px] font-medium',

      // Flex & Alignment
      'inline-flex items-center justify-center',

      // Shape
      'rounded-full',

      // Size
      'w-6 h-6',

      // Color
      {
        'text-placeholder dark:text-grayscale-700 border-transparent':
          !context.active,
        'border-primary dark:border-primary text-white dark:text-primary-800 bg-primary':
          context.active,
      },

      // State
      {
        'hover:border-surface-300 dark:hover:border-surface-200/30':
          !context.disabled && !context.active,
        'focus-visible:outline-none focus-visible:outline-offset-0 focus-visible:ring-2 focus-visible:ring-primary-500 dark:focus-visible:ring-primary-400':
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
        'w-12 h-[26.2px]',

        // Shape
        'rounded-lg',

        // Spacing
        'mx-2',

        // Color and Background
        'bg-transparent',
        'border-[0.5px] border-general-200',

        // Transitions
        'transition-all',
        'duration-200',

        // States
        {
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 dark:focus-visible:ring-primary-500':
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
        'text-general-800 dark:text-general-50',

        // Sizing and Spacing
        // 'w-[1%]',
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

        // Color and Background
        'bg-transparent',
        'text-header-weak dark:text-general-50',

        // Size
        'w-4',
        'h-4',

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
        'bg-white dark:bg-white',
        'text-general-800 dark:text-general-800',
        'ring-1 ring-inset ring-line dark:ring-line',
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
        'text-[11px]',
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
        //   'text-surface-700 dark:text-white/80':
        //     !context.focused && !context.selected,
        // },
        // {
        //   'bg-white dark:bg-white text-general-800 dark:text-general-800':
        //     context.focused && context.selected,
        // },
        // {
        //   'bg-transparent text-general-800 dark:text-general-800':
        //     !context.focused && context.selected,
        // },

        //States
        'hover:bg-primary-50 dark:hover:bg-primary-50',

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
          'font-sans',
          'leading-6',
          'text-xs',

          // Display
          'block',
          'flex-auto',

          // Color and Background
          'bg-transparent',
          'border-general-200 border-[0.5px]',
          'text-general-800 dark:text-general-50',
          // 'ring-1 ring-inset ring-body dark:ring-body',

          // Sizing and Spacing
          'max-w-[3rem] w-fit',
          'px-2 py-2',

          //Shape
          'rounded-lg h-[26.2px]',

          // Transitions
          'transition',
          'duration-200',

          // States
          'hover:ring-general-200 dark:hover:ring-general-200',
          'focus-visible:outline-none focus-visible:shadow-none',
          // 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-body dark:focus-visible:ring-primary-500',

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
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 dark:focus-visible:ring-primary-500':
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
        'text-surface-800 dark:text-white/80',

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
        'bg-surface-0 dark:bg-surface-800',
        'text-surface-800 dark:text-white/80',
        'ring-1 ring-inset ring-surface-300 dark:ring-surface-700',
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
          'text-surface-700 dark:text-white/80':
            !context.focused && !context.selected,
        },
        {
          'bg-primary-500 dark:bg-primary-400 text-white dark:text-surface-700':
            context.focused && context.selected,
        },
        {
          'bg-transparent text-surface-700 dark:text-white/80':
            !context.focused && context.selected,
        },

        //States
        'hover:bg-primary-500 dark:hover:bg-primary-400 hover:text-white dark:hover:text-surface-700',

        // Misc
        'cursor-pointer',
        'overflow-hidden',
        'whitespace-nowrap',
      ],
    }),
  },
  current: {
    class: [
      'text-[11px] text-general-800 dark:text-general-100',
    ],
  },
};
