export default {
  root: {
    class: [
      'relative',

      // Space

      // Shape
      'rounded-md',
      'min-h-8',

      // Color
    ],
  },
  wrapper: {
    class: ['overflow-auto'],
  },
  container: {
    class: [
      // Spacing
      'm-0 p-0',

      // Misc
      'list-none overflow-auto',
    ],
  },
  node: {
    class: [
      'p-[2px]',
      'rounded-md',
      'focus:outline-none focus:outline-offset-0',
    ],
  },
  content: ({ context, props }) => ({
    class: [
      // Flex and Alignment
      'flex items-center',

      // Shape
      'rounded-md',

      // Spacing
      'p-1',

      // Colors
      'text-surface-700',
      {
        'bg-primary-50 !text-primary-500 [&_*]:text-primary-500':
          context.selected,
      },

      // States
      {
        'hover:bg-primary-50':
          props.selectionMode == 'single' || props.selectionMode == 'multiple',
      },

      // Transition
      'transition-shadow duration-200',

      {
        'cursor-pointer select-none':
          props.selectionMode == 'single' || props.selectionMode == 'multiple',
      },

      // Miscelanous
      'cursor-pointer',
    ],
  }),
  toggler: ({ context }) => ({
    class: [
      // Flex and Alignment
      'inline-flex items-center justify-center',

      'shrink-0',

      // Shape
      'border-0 rounded-full',

      // Size and Spacing
      'w-4 h-4',

      // Spacing
      'mr-0.5',

      // Colors
      'text-general-800',
      'bg-transparent',
      {
        invisible: context.leaf,
      },

      // States
      'hover:bg-surface-100',

      // Transition
      'transition duration-200',

      // Misc
      'cursor-pointer select-none',
    ],
  }),
  togglericon: {
    class: [
      // Size
      'w-4 h-4',

      // Color
    ],
  },
  nodeCheckbox: {
    root: {
      class: [
        'relative',

        // Alignment
        'inline-flex',
        'align-bottom',

        // Size
        'w-4',
        'h-4',

        // Spacing
        'mr-2',

        // Misc
        'cursor-default',
        'select-none',
      ],
    },
    box: ({ props, context }) => ({
      class: [
        // Alignment
        'flex',
        'items-center',
        'justify-center',

        // Size
        'w-4',
        'h-4',

        // Shape
        'rounded',
        'border',

        // Colors
        'text-surface-600',
        {
          'border-surface-300 bg-surface-0':
            !context.checked,
          'border-primary-500 bg-primary-500':
            context.checked,
        },

        {
          'ring-2 ring-primary-500':
            !props.disabled && context.focused,
          'cursor-default opacity-60': props.disabled,
        },

        // States
        {
          'peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500':
            !props.disabled,
          'cursor-default opacity-60': props.disabled,
        },

        // Transitions
        'transition-colors',
        'duration-200',
      ],
    }),
    input: {
      class: [
        'peer',

        // Size
        'w-full ',
        'h-full',

        // Position
        'absolute',
        'top-0 left-0',
        'z-10',

        // Spacing
        'p-0',
        'm-0',

        // Shape
        'rounded',
        'border',

        // Shape
        'opacity-0',
        'rounded-md',
        'outline-none',
        'border-2 border-surface-300',

        // Misc
        'appareance-none',
      ],
    },
    icon: {
      class: [
        // Font
        'text-normal',

        // Size
        'w-3',
        'h-3',

        // Colors
        'text-white',

        // Transitions
        'transition-all',
        'duration-200',
      ],
    },
  },
  nodeicon: {
    class: [
      // Space
      'hidden',
    ],
  },
  subgroup: {
    class: ['!m-0 list-none p-0 !pl-1'],
  },
  filtercontainer: {
    class: [
      'relative block',

      // Space
      'mb-2',

      // Size
      'w-full',
    ],
  },
  input: {
    class: [
      'relative',

      // Font
      'font-sans leading-6',
      'sm:text-sm',

      // Spacing
      'm-0',
      'py-1.5 px-3 pr-10',

      // Size
      'w-full',

      // Shape
      'rounded-md',

      // Colors
      'text-surface-900',
      'placeholder:text-surface-400',
      'bg-surface-0',
      'ring-1 ring-inset ring-surface-300',

      // States
      'hover:border-primary-500',
      'focus:outline-none focus:outline-offset-0 focus:ring-2 focus:ring-inset focus:ring-primary-500',

      // Transition & Misc
      'appearance-none',
      'transition-colors duration-200',
    ],
  },
  loadingicon: {
    class: [
      'text-general-400',
      'absolute text-lg top-[50%] right-[50%] -mt-2 -mr-2 animate-spin',
    ],
  },
  searchicon: {
    class: [
      // Position
      'absolute top-1/2 -mt-2 right-3',

      // Color
      'text-surface-600',
    ],
  },
  label: ({ props }) => ({
    class: [
      'inline-flex justify-between items-center gap-2',
      'w-full',
      'text-xs font-medium text-general-800',
    ],
  }),
};
