export default {
  root: {
    class: [
      // Sizing and Shape
      'min-w-[12rem]',
      'rounded-md',
      // Spacing

      // Colors
      'bg-surface-0',
      'text-surface-700/80',
      'ring-1 ring-surface-200',
    ],
  },
  wrapper: {
    class: [
      // Overflow
      'overflow-auto',
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
        'bg-surface-100 text-primary-500':
          !context.focused && context.selected,
      },

      //States
      'hover:bg-primary-500 hover:text-white',
      'focus-visible:outline-none focus-visible:outline-offset-0 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500',

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
  header: {
    class: [
      // Spacing
      'p-0',
      'm-0',

      //Shape
      'rounded-tl-md',
      'rounded-tr-md',
      'border-b border-surface-200',

      // Color
      'text-surface-700/80',
      'bg-surface-100',
    ],
  },
  filtercontainer: {
    class: 'relative',
  },
  filterinput: {
    class: [
      // Font
      'font-sans',
      'leading-none',
      'sm:text-sm',

      // Sizing
      'py-1.5 px-3',
      'pr-7',
      '-mr-7',
      'w-full',

      //Color
      'text-surface-700/80',
      'bg-surface-0',
      'placeholder:text-surface-400',

      // Shape
      'border-0',
      'rounded-tl-md',
      'rounded-tr-md',
      'appearance-none',

      // States
      'focus:ring-2 focus:ring-inset focus:outline-none focus:outline-offset-0',
      'focus:ring-primary-600',

      // Misc
      'appearance-none',
    ],
  },
  filtericon: {
    class: ['absolute', 'top-1/2 right-3', '-mt-2'],
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
};
