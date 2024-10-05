export default {
  table: {
    class: [
      // Spacing & Position
      'mx-auto my-0',

      // Table Style
      'border-spacing-0 border-separate',
    ],
  },
  cell: {
    class: [
      // Alignment
      'text-center align-top',

      // Spacing
      'py-0 px-3',
    ],
  },
  node: ({ context }) => ({
    class: [
      'relative inline-block',

      // Font
      'text-sm leading-none',

      // Spacing
      'px-5 py-3',

      // Shape
      'border',
      'rounded',

      // Color
      'border-surface-200',
      {
        'text-surface-600/80': !context?.selected,
        'bg-surface-0': !context?.selected,
        'text-surface-700': context?.selected,
        'bg-surface-50': context?.selected,
      },

      // States
      {
        'hover:bg-surface-100/40':
          context?.selectable,
      },

      { 'cursor-pointer': context?.selectable },
    ],
  }),
  linecell: {
    class: [
      // Alignment
      'text-center align-top',

      // Spacing
      'py-0 px-3',
    ],
  },
  linedown: {
    class: [
      // Spacing
      'mx-auto my-0',

      // Size
      'w-px h-[20px]',

      // Color
      'bg-surface-200',
    ],
  },
  lineleft: ({ context }) => ({
    class: [
      // Alignment
      'text-center align-top',

      // Spacing
      'py-0 px-3',

      // Shape
      'rounded-none border-r',
      { 'border-t': context.lineTop },

      // Color
      'border-surface-200',
    ],
  }),
  lineright: ({ context }) => ({
    class: [
      // Alignment
      'text-center align-top',

      // Spacing
      'py-0 px-3',

      // Shape
      'rounded-none',

      // Color
      {
        'border-t border-surface-200': context.lineTop,
      },
    ],
  }),
  nodecell: {
    class: 'text-center align-top py-0 px-3',
  },
  nodetoggler: {
    class: [
      // Position
      'absolute bottom-[-0.75rem] left-2/4 -ml-3',
      'z-20',

      // Flexbox
      'flex items-center justify-center',

      // Size
      'w-6 h-6',

      // Shape
      'rounded-full',

      // Color
      'bg-inherit text-inherit',

      // Focus
      'focus:outline-none focus:outline-offset-0 focus:ring-2 focus:ring-primary-500',

      // Misc
      'cursor-pointer no-underline select-none',
    ],
  },
  nodetogglericon: {
    class: [
      // Position
      'relative inline-block',

      // Size
      'w-4 h-4',
    ],
  },
};
