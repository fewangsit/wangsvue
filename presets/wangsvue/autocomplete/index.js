export default {
  root: ({ props }) => ({
    class: [
      'relative',

      // Flex
      'inline-flex',

      // Size
      { 'w-full': props.multiple },

      // Color
      'text-surface-900',

      //States
      {
        'opacity-60 select-none pointer-events-none cursor-default':
          props.disabled,
      },
    ],
  }),
  container: ({ props, state }) => ({
    class: [
      // Font
      'font-sans sm:text-sm leading-none',

      // Flex
      'flex items-center flex-wrap',
      'gap-1',

      // Spacing
      'm-0 list-none',
      'px-3 py-1',
      { 'px-3 py-1.5': !props.multiple, 'px-3 py-1': props.multiple },
      // Size
      'w-full',

      // Shape
      'appearance-none rounded-md',

      // Color
      'text-surface-900',
      'bg-surface-0',
      'placeholder:text-surface-400',
      'shadow-sm',

      // States
      'focus:outline-none focus:outline-offset-0',
      {
        'ring-1 ring-inset ring-surface-300':
          !state.focused,
        'ring-2 ring-primary-500': state.focused,
      },

      // Transition
      'transition duration-200 ease-in-out',

      // Misc
      'cursor-text overflow-hidden',
    ],
  }),
  inputtoken: ({ props }) => ({
    class: [
      { 'py-1.5 px-0': !props.multiple, 'p-0.5': props.multiple },
      ,
      'inline-flex flex-auto',
    ],
  }),
  input: ({ props }) => ({
    class: [
      // Font
      'font-sans sm:text-sm leading-none',

      // Shape
      'appearance-none rounded-md',
      { 'rounded-tr-none rounded-br-none': props.dropdown },
      { 'outline-none shadow-none rounded-none': props.multiple },

      // Size
      { 'w-full': props.multiple },

      // Spacing
      'm-0',
      { 'py-1.5 px-3': !props.multiple, 'p-0': props.multiple },

      // Colors
      'text-surface-700/80',
      {
        'bg-surface-0': !props.multiple,
        'border border-surface-300': !props.multiple,
        'border-0 bg-transparent': props.multiple,
      },

      // States
      {
        'focus:outline-none focus:outline-offset-0 focus:ring-inset focus:ring-2 focus:ring-primary-500':
          !props.multiple,
      },

      // Transition
      'transition-colors duration-200',
    ],
  }),
  token: {
    class: [
      // Flexbox
      'inline-flex items-center',

      // Spacing
      'py-0.5 px-3',

      // Shape
      'rounded-[1.14rem]',

      // Colors
      'text-surface-700/70',
      'bg-surface-200',
    ],
  },
  label: {
    class: 'leading-5',
  },
  removeTokenIcon: {
    class: [
      // Shape
      'rounded-md leading-6',

      // Spacing
      'ml-2',

      // Size
      'w-4 h-4',

      // Transition
      'transition duration-200 ease-in-out',

      // Misc
      'cursor-pointer',
    ],
  },
  dropdownbutton: {
    root: {
      class: [
        'relative text-sm leading-none',

        // Alignments
        'items-center inline-flex text-center align-bottom',

        // Shape
        'rounded-r-md',

        // Size
        'px-2.5 py-1.5',
        '-ml-[1px]',

        // Colors
        'text-surface-600',
        'bg-surface-100',
        'ring-1 ring-inset ring-surface-300',

        // States
        'hover:bg-surface-200',
        'focus:outline-none focus:outline-offset-0 focus:ring-1',
        'focus:ring-primary-500',
      ],
    },
  },
  loadingicon: {
    class: [
      'text-sm leading-none text-surface-500',
      'absolute top-[50%] right-[0.5rem] -mt-2 animate-spin',
    ],
  },
  panel: {
    class: [
      // Position
      'absolute top-0 left-0',
      'mt-2',

      // Shape
      'border-0',
      'rounded-md',
      'shadow-md',
      'max-h-[15rem]',
      'overflow-auto',

      // Color
      'bg-surface-0',
      'text-surface-800/80',
      'ring-1 ring-inset ring-surface-300',
    ],
  },
  list: {
    class: 'py-1 list-none m-0',
  },
  item: ({ context }) => ({
    class: [
      // Font
      'sm:text-sm',
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
        'bg-surface-200 text-surface-700/80':
          context.focused && !context.selected,
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
  itemgroup: {
    class: [
      //Font
      'font-bold',
      'sm:text-sm',

      // Spacing
      'm-0',
      'py-2 px-4',

      // Color
      'text-surface-800/80',
      'bg-surface-0',

      // Misc
      'cursor-auto',
    ],
  },
  emptymessage: {
    class: [
      // Font
      'leading-none',
      'sm:text-sm',

      // Spacing
      'py-2 px-4',

      // Color
      'text-surface-800/80',
      'bg-transparent',
    ],
  },
  transition: {
    enterFromClass: 'opacity-0 scale-y-[0.8]',
    enterActiveClass:
      'transition-[transform,opacity] duration-[120ms] ease-[cubic-bezier(0,0,0.2,1)]',
    leaveActiveClass: 'transition-opacity duration-100 ease-linear',
    leaveToClass: 'opacity-0',
  },
};
